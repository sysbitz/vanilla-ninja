// All authentication calls live here. Components must not import the
// supabase client directly.
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string | null;
};

export const authService = {
  async signUp(email: string, password: string, displayName: string) {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  onAuthStateChange(cb: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      cb(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
    });
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
