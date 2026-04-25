import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, AuthUser } from "@/services/authService";
import { profileService, Profile } from "@/services/profileService";
import { progressService } from "@/services/progressService";

type AuthCtx = {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({ user: null, profile: null, loading: true, refreshProfile: async () => {} });

const LOCAL_KEY = "jsquest:progress:v1";
const MERGE_FLAG = "jsquest:merged-local";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    try {
      const p = await profileService.get(uid);
      setProfile(p);
    } catch (e) {
      console.error("load profile", e);
    }
  };

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = authService.onAuthStateChange((u) => {
      setUser(u);
      if (u) {
        // Defer Supabase calls to avoid deadlock inside the callback
        setTimeout(async () => {
          await loadProfile(u.id);
          // One-time migration of localStorage progress to cloud
          if (!localStorage.getItem(MERGE_FLAG)) {
            try {
              const raw = localStorage.getItem(LOCAL_KEY);
              if (raw) {
                const local = JSON.parse(raw);
                await progressService.mergeLocal(u.id, local);
              }
              localStorage.setItem(MERGE_FLAG, "1");
            } catch (e) {
              console.error("merge local progress", e);
            }
          }
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // Then fetch existing session
    authService.getSession().then((session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;
      setUser(u);
      if (u) loadProfile(u.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile: async () => user && loadProfile(user.id),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
