import { supabase } from "@/integrations/supabase/client";
import type { LevelProgress, ProgressMap } from "@/hooks/useProgress";

export const progressService = {
  async listForUser(userId: string): Promise<ProgressMap> {
    const { data, error } = await supabase
      .from("level_progress")
      .select("level_id,completed,stars,attempts,solution_revealed")
      .eq("user_id", userId);
    if (error) throw error;
    const map: ProgressMap = {};
    for (const row of data ?? []) {
      map[row.level_id] = {
        completed: row.completed,
        stars: (row.stars ?? 0) as 0 | 1 | 2 | 3,
        attempts: row.attempts ?? 0,
        solutionRevealed: row.solution_revealed ?? false,
      };
    }
    return map;
  },

  async upsert(userId: string, levelId: string, patch: Partial<LevelProgress>) {
    const payload = {
      user_id: userId,
      level_id: levelId,
      completed: patch.completed ?? false,
      stars: patch.stars ?? 0,
      attempts: patch.attempts ?? 0,
      solution_revealed: patch.solutionRevealed ?? false,
      completed_at: patch.completed ? new Date().toISOString() : null,
    };
    const { error } = await supabase
      .from("level_progress")
      .upsert(payload, { onConflict: "user_id,level_id" });
    if (error) throw error;
  },

  /** Merge a local ProgressMap (from localStorage) into the cloud, taking the best of both. */
  async mergeLocal(userId: string, local: ProgressMap) {
    const cloud = await this.listForUser(userId);
    const ids = new Set([...Object.keys(local), ...Object.keys(cloud)]);
    const rows = [...ids].map((level_id) => {
      const l = local[level_id];
      const c = cloud[level_id];
      const completed = !!(l?.completed || c?.completed);
      const stars = Math.max(l?.stars ?? 0, c?.stars ?? 0) as 0 | 1 | 2 | 3;
      const attempts = Math.max(l?.attempts ?? 0, c?.attempts ?? 0);
      const solution_revealed = !!(l?.solutionRevealed || c?.solutionRevealed);
      return {
        user_id: userId,
        level_id,
        completed,
        stars,
        attempts,
        solution_revealed,
        completed_at: completed ? new Date().toISOString() : null,
      };
    });
    if (rows.length === 0) return;
    const { error } = await supabase
      .from("level_progress")
      .upsert(rows, { onConflict: "user_id,level_id" });
    if (error) throw error;
  },
};
