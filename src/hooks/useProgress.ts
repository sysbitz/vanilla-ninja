// Hooks for managing per-level progress in localStorage.
import { useCallback, useEffect, useState } from "react";
import { TOTAL_LEVELS } from "@/curriculum/data";

const KEY = "jsquest:progress:v1";

export type LevelProgress = {
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  attempts: number;
  solutionRevealed: boolean;
};

export type ProgressMap = Record<string, LevelProgress>;

function read(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => read());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress]);

  const get = useCallback(
    (id: string): LevelProgress =>
      progress[id] ?? { completed: false, stars: 0, attempts: 0, solutionRevealed: false },
    [progress]
  );

  const update = useCallback((id: string, patch: Partial<LevelProgress>) => {
    setProgress(p => ({
      ...p,
      [id]: { ...(p[id] ?? { completed: false, stars: 0, attempts: 0, solutionRevealed: false }), ...patch },
    }));
  }, []);

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const percent = Math.round((completedCount / TOTAL_LEVELS) * 100);

  return { progress, get, update, completedCount, percent };
}
