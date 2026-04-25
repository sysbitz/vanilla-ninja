import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CurriculumSidebar } from "@/components/CurriculumSidebar";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Github, LogOut, User } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();

  const signOut = async () => {
    await authService.signOut();
    nav("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CurriculumSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b border-border/60 px-3 glass">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-mono text-muted-foreground hidden sm:inline">~ /jsquest</span>
            </div>
            <div className="flex items-center gap-3">
              {!loading && (user ? (
                <>
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {profile?.display_name || user.email}
                    <span className="text-primary font-mono">· Lv {profile?.level ?? 1} · {profile?.xp ?? 0} XP</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={signOut} className="h-7 text-xs">
                    <LogOut className="h-3 w-3 mr-1" /> Sign out
                  </Button>
                </>
              ) : (
                <Link to="/login" className="text-xs text-primary hover:underline">Log in</Link>
              ))}
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              >
                MDN <Github className="h-3 w-3" />
              </a>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
