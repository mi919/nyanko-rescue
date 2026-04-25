import { create } from "zustand";

export type Screen = "title" | "game" | "roulette" | "ending";

type UiState = {
  screen: Screen;
  showRules: boolean;
  showCollection: boolean;
  flagMode: boolean;
  debugMode: boolean;
  logoTapCount: number;
  message: string;

  setScreen: (v: Screen) => void;
  setShowRules: (v: boolean | ((prev: boolean) => boolean)) => void;
  setShowCollection: (v: boolean | ((prev: boolean) => boolean)) => void;
  setFlagMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setDebugMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setLogoTapCount: (v: number | ((prev: number) => number)) => void;
  setMessage: (v: string) => void;
};

const updater = <T>(prev: T, v: T | ((p: T) => T)): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

export const useUiStore = create<UiState>((set) => ({
  screen: "title",
  showRules: false,
  showCollection: false,
  flagMode: false,
  debugMode: false,
  logoTapCount: 0,
  message: "",

  setScreen: (v) => set({ screen: v }),
  setShowRules: (v) => set((s) => ({ showRules: updater(s.showRules, v) })),
  setShowCollection: (v) => set((s) => ({ showCollection: updater(s.showCollection, v) })),
  setFlagMode: (v) => set((s) => ({ flagMode: updater(s.flagMode, v) })),
  setDebugMode: (v) => set((s) => ({ debugMode: updater(s.debugMode, v) })),
  setLogoTapCount: (v) => set((s) => ({ logoTapCount: updater(s.logoTapCount, v) })),
  setMessage: (v) => set({ message: v }),
}));
