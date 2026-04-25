// Per-level progress hook. When the user is signed in, progress is read from
// and written to Lovable Cloud. When signed out, it falls back to localStorage
// so the marketing/demo experience still works.
import { useCallback, useEffect, useState } from "react";
import { TOTAL_LEVELS } from "@/curriculum/data";
import { useAuth } from "@/providers/AuthProvider";
import { progressService } from "@/services/progressService";

const KEY = "jsquest:progress:v1";

export type LevelProgress = {
  completed: boolean;
  stars: 0 | 1 | 2 | 3;
  attempts: number;
  solutionRevealed: boolean;
};

export type ProgressMap = Record<string, LevelProgress>;

const empty: LevelProgress = { completed: false, stars: 0, attempts: 0, solutionRevealed: false };

function readLocal(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>(() => readLocal());

  // Hydrate from cloud on login; fall back to local on logout.
  useEffect(() => {
    let alive = true;
    if (user) {
      progressService
        .listForUser(user.id)
        .then((cloud) => {
          if (!alive) return;
          // Merge cloud over current state to avoid overwriting in-flight local writes.
          setProgress((prev) => ({ ...prev, ...cloud }));
        })
        .catch((e) => console.error("load progress", e));
    } else {
      setProgress(readLocal());
    }
    return () => {
      alive = false;
    };
  }, [user]);

  // Mirror to localStorage as an offline cache + signed-out store.
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress]);

  const get = useCallback(
    (id: string): LevelProgress => progress[id] ?? empty,
    [progress]
  );

  const update = useCallback(
    (id: string, patch: Partial<LevelProgress>) => {
      setProgress((p) => {
        const next = { ...p, [id]: { ...(p[id] ?? empty), ...patch } };
        if (user) {
          // Fire and forget — UI already reflects the change optimistically.
          progressService.upsert(user.id, id, next[id]).catch((e) => console.error("save progress", e));
        }
        return next;
      });
    },
    [user]
  );

  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const percent = Math.round((completedCount / TOTAL_LEVELS) * 100);

  return { progress, get, update, completedCount, percent };
}
