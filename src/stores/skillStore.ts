import { create } from "zustand";
import type { SkillFlashData } from "../components/effects/SkillFlash";

type ForeseePreview = { idx: number; type: string; label: string } | null;

type SkillState = {
  skillGauge: number;
  peekingDogs: boolean;
  luckyShield: boolean;
  markedCatIdx: number;
  barrierActive: boolean;
  barrierRemaining: number;
  foreseeMode: number;
  foreseePreview: ForeseePreview;
  foreseeStartTime: number;
  foreseeTimeOffset: number;
  crossSelecting: boolean;
  crossStartTime: number;
  skillFlash: SkillFlashData | null;
  skillUsedThisStage: boolean;

  setSkillGauge: (v: number | ((prev: number) => number)) => void;
  setPeekingDogs: (v: boolean) => void;
  setLuckyShield: (v: boolean) => void;
  setMarkedCatIdx: (v: number | ((prev: number) => number)) => void;
  setBarrierActive: (v: boolean) => void;
  setBarrierRemaining: (v: number | ((prev: number) => number)) => void;
  setForeseeMode: (v: number | ((prev: number) => number)) => void;
  setForeseePreview: (v: ForeseePreview) => void;
  setForeseeStartTime: (v: number) => void;
  setForeseeTimeOffset: (v: number | ((prev: number) => number)) => void;
  setCrossSelecting: (v: boolean | ((prev: boolean) => boolean)) => void;
  setCrossStartTime: (v: number) => void;
  setSkillFlash: (v: SkillFlashData | null) => void;
  setSkillUsedThisStage: (v: boolean) => void;
};

const updater = <T>(prev: T, v: T | ((p: T) => T)): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

export const useSkillStore = create<SkillState>((set) => ({
  skillGauge: 0,
  peekingDogs: false,
  luckyShield: false,
  markedCatIdx: -1,
  barrierActive: false,
  barrierRemaining: 0,
  foreseeMode: 0,
  foreseePreview: null,
  foreseeStartTime: 0,
  foreseeTimeOffset: 0,
  crossSelecting: false,
  crossStartTime: 0,
  skillFlash: null,
  skillUsedThisStage: false,

  setSkillGauge: (v) => set((s) => ({ skillGauge: updater(s.skillGauge, v) })),
  setPeekingDogs: (v) => set({ peekingDogs: v }),
  setLuckyShield: (v) => set({ luckyShield: v }),
  setMarkedCatIdx: (v) => set((s) => ({ markedCatIdx: updater(s.markedCatIdx, v) })),
  setBarrierActive: (v) => set({ barrierActive: v }),
  setBarrierRemaining: (v) => set((s) => ({ barrierRemaining: updater(s.barrierRemaining, v) })),
  setForeseeMode: (v) => set((s) => ({ foreseeMode: updater(s.foreseeMode, v) })),
  setForeseePreview: (v) => set({ foreseePreview: v }),
  setForeseeStartTime: (v) => set({ foreseeStartTime: v }),
  setForeseeTimeOffset: (v) => set((s) => ({ foreseeTimeOffset: updater(s.foreseeTimeOffset, v) })),
  setCrossSelecting: (v) => set((s) => ({ crossSelecting: updater(s.crossSelecting, v) })),
  setCrossStartTime: (v) => set({ crossStartTime: v }),
  setSkillFlash: (v) => set({ skillFlash: v }),
  setSkillUsedThisStage: (v) => set({ skillUsedThisStage: v }),
}));
