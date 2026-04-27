import { Lock, Star, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SECTIONS, ALL_LEVELS } from "@/curriculum/data";
import { useProgress } from "@/hooks/useProgress";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function CurriculumSidebar() {
  const { levelId } = useParams();
  const { get, percent, completedCount } = useProgress();

  // Compute unlocking: a level is unlocked if previous (in flat order) is completed, or it's the first.
  const unlockMap = new Map<string, boolean>();
  ALL_LEVELS.forEach(({ level }, i) => {
    if (i === 0) unlockMap.set(level.id, true);
    else {
      const prev = ALL_LEVELS[i - 1].level;
      unlockMap.set(level.id, get(prev.id).completed);
    }
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center text-primary-foreground font-black shadow-glow-primary">忍</div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold">Vanilla Ninja</span>
            <span className="text-[10px] text-muted-foreground font-mono">Unlock your superpower</span>
          </div>
        </Link>
        <div className="px-2 pb-2">
          <Progress value={percent} className="h-1.5" />
          <div className="text-[10px] font-mono text-muted-foreground mt-1">
            {completedCount} / {ALL_LEVELS.length} cleared • {percent}%
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {SECTIONS.map((s) => (
          <SidebarGroup key={s.id}>
            <SidebarGroupLabel className="flex items-center gap-2">
              <span>{s.emoji}</span><span>{s.title}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {s.levels.map((l) => {
                  const p = get(l.id);
                  const unlocked = unlockMap.get(l.id) ?? false;
                  const active = levelId === l.id;
                  return (
                    <SidebarMenuItem key={l.id}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          to={unlocked ? `/learn/${l.id}` : "#"}
                          aria-disabled={!unlocked}
                          className={cn(
                            "flex items-center gap-2",
                            !unlocked && "opacity-50 cursor-not-allowed pointer-events-none",
                          )}
                        >
                          <span className="text-lg shrink-0">{l.emoji}</span>
                          <span className="flex-1 truncate">{l.title}</span>
                          {p.completed ? (
                            <span className="flex items-center gap-0.5 text-primary">
                              {Array.from({ length: p.stars }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </span>
                          ) : !unlocked ? (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
