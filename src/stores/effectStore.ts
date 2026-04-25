import { create } from "zustand";
import type { CatKey } from "../types/cat";
import type { CatRescueData } from "../components/effects/CatRescue";
import type { CrossEffectData } from "../components/effects/CrossEffect";
import type { PawEffect } from "../components/effects/PawEffects";
import type { UnlockBannerData } from "../components/effects/UnlockBanner";

type EffectState = {
  dogAttack: boolean;
  catRescue: CatRescueData | null;
  pawEffects: PawEffect[];
  unlockBanner: UnlockBannerData | null;
  crossEffect: CrossEffectData | null;

  setDogAttack: (v: boolean) => void;
  setCatRescue: (v: CatRescueData | null) => void;
  setPawEffects: (v: PawEffect[] | ((prev: PawEffect[]) => PawEffect[])) => void;
  setUnlockBanner: (v: UnlockBannerData | null) => void;
  setCrossEffect: (v: CrossEffectData | null) => void;
};

// Re-export CatKey here so consumers can import it from the store if convenient
export type { CatKey };

const updater = <T>(prev: T, v: T | ((p: T) => T)): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

export const useEffectStore = create<EffectState>((set) => ({
  dogAttack: false,
  catRescue: null,
  pawEffects: [],
  unlockBanner: null,
  crossEffect: null,

  setDogAttack: (v) => set({ dogAttack: v }),
  setCatRescue: (v) => set({ catRescue: v }),
  setPawEffects: (v) => set((s) => ({ pawEffects: updater(s.pawEffects, v) })),
  setUnlockBanner: (v) => set({ unlockBanner: v }),
  setCrossEffect: (v) => set({ crossEffect: v }),
}));
