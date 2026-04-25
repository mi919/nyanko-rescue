import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_UNLOCKED } from "../constants/cats";
import type { CatKey, CatType } from "../types/cat";

export type RoulettePhase = "idle" | "rustling" | "emerging" | "revealed" | "empty" | "complete";
export type RouletteResult = { catKey: CatKey; catName: string };

type ProgressState = {
  // Persisted
  unlockedCats: readonly CatKey[];
  companion: CatKey;
  stageBest: Record<string, number>;
  lapCount: number;

  // Per-lap (non-persisted)
  lapCats: readonly CatKey[];
  collection: CatType[];

  // Roulette / encounter screen
  rouletteResult: RouletteResult | null;
  roulettePhase: RoulettePhase;

  setUnlockedCats: (v: readonly CatKey[] | ((prev: readonly CatKey[]) => readonly CatKey[])) => void;
  setCompanion: (v: CatKey) => void;
  setStageBest: (v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  setLapCount: (v: number | ((prev: number) => number)) => void;
  setLapCats: (v: readonly CatKey[] | ((prev: readonly CatKey[]) => readonly CatKey[])) => void;
  setCollection: (v: CatType[] | ((prev: CatType[]) => CatType[])) => void;
  setRouletteResult: (v: RouletteResult | null) => void;
  setRoulettePhase: (v: RoulettePhase) => void;
};

const updater = <T>(prev: T, v: T | ((p: T) => T)): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      unlockedCats: INITIAL_UNLOCKED,
      companion: "chatora",
      stageBest: {},
      lapCount: 0,

      lapCats: [],
      collection: [],

      rouletteResult: null,
      roulettePhase: "idle",

      setUnlockedCats: (v) => set((s) => ({ unlockedCats: updater(s.unlockedCats, v) })),
      setCompanion: (v) => set({ companion: v }),
      setStageBest: (v) => set((s) => ({ stageBest: updater(s.stageBest, v) })),
      setLapCount: (v) => set((s) => ({ lapCount: updater(s.lapCount, v) })),
      setLapCats: (v) => set((s) => ({ lapCats: updater(s.lapCats, v) })),
      setCollection: (v) => set((s) => ({ collection: updater(s.collection, v) })),
      setRouletteResult: (v) => set({ rouletteResult: v }),
      setRoulettePhase: (v) => set({ roulettePhase: v }),
    }),
    {
      name: "nyanko_progress",
      version: 1,
      // Persist only what was persisted before
      partialize: (s) => ({
        unlockedCats: s.unlockedCats,
        companion: s.companion,
        stageBest: s.stageBest,
        lapCount: s.lapCount,
      }),
      // Migrate old keys (nyanko_unlockedCats, nyanko_companion, nyanko_stageBest, nyanko_lapCount)
      // into the unified storage on first load.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as object) };
        if (typeof window === "undefined") return merged as ProgressState;
        try {
          const legacy = (key: string) => {
            const raw = window.localStorage.getItem(key);
            return raw == null ? undefined : JSON.parse(raw);
          };
          const u = legacy("nyanko_unlockedCats");
          const c = legacy("nyanko_companion");
          const b = legacy("nyanko_stageBest");
          const l = legacy("nyanko_lapCount");
          if (u !== undefined) (merged as ProgressState).unlockedCats = u;
          if (c !== undefined) (merged as ProgressState).companion = c;
          if (b !== undefined) (merged as ProgressState).stageBest = b;
          if (l !== undefined) (merged as ProgressState).lapCount = l;
        } catch {
          /* ignore */
        }
        return merged as ProgressState;
      },
    }
  )
);
