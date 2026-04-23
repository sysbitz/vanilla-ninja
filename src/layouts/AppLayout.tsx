import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CurriculumSidebar } from "@/components/CurriculumSidebar";
import { Outlet } from "react-router-dom";
import { Github } from "lucide-react";

export default function AppLayout() {
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
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
              target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              MDN docs <Github className="h-3 w-3" />
            </a>
          </header>
          <main className="flex-1 min-h-0 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
