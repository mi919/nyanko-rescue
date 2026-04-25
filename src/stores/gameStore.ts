import { create } from "zustand";
import type { Cell } from "../types/board";
import type { CatType } from "../types/cat";

export type GameStateValue = "playing" | "won" | "lost";
export type HintPhase = "converge" | "flash" | "badge" | "done";

export type ScoreItem = { label: string; value: number };
export type ScoreBreakdown = {
  items: ScoreItem[];
  subtotal: number;
  multiplier: number;
  total: number;
};

type GameState = {
  stageIdx: number;
  board: Cell[];
  lives: number;
  rescued: CatType[];
  gameState: GameStateValue;

  // Scoring
  score: number;
  catRescueCount: number;
  cellsOpened: number;
  manualNumberCells: number;
  stageStartTime: number;
  hitDogThisStage: boolean;
  scoreBreakdown: ScoreBreakdown | null;
  isNewBest: boolean;
  animatedTotal: number;
  isPerfect: boolean;

  // Hint
  hintIdx: number;
  hintPhase: HintPhase;

  setStageIdx: (v: number) => void;
  setBoard: (v: Cell[] | ((prev: Cell[]) => Cell[])) => void;
  setLives: (v: number | ((prev: number) => number)) => void;
  setRescued: (v: CatType[] | ((prev: CatType[]) => CatType[])) => void;
  setGameState: (v: GameStateValue) => void;

  setScore: (v: number | ((prev: number) => number)) => void;
  setCatRescueCount: (v: number | ((prev: number) => number)) => void;
  setCellsOpened: (v: number | ((prev: number) => number)) => void;
  setManualNumberCells: (v: number | ((prev: number) => number)) => void;
  setStageStartTime: (v: number) => void;
  setHitDogThisStage: (v: boolean) => void;
  setScoreBreakdown: (v: ScoreBreakdown | null) => void;
  setIsNewBest: (v: boolean) => void;
  setAnimatedTotal: (v: number | ((prev: number) => number)) => void;
  setIsPerfect: (v: boolean) => void;

  setHintIdx: (v: number) => void;
  setHintPhase: (v: HintPhase) => void;
};

const updater = <T>(prev: T, v: T | ((p: T) => T)): T =>
  typeof v === "function" ? (v as (p: T) => T)(prev) : v;

export const useGameStore = create<GameState>((set) => ({
  stageIdx: 0,
  board: [],
  lives: 3,
  rescued: [],
  gameState: "playing",

  score: 0,
  catRescueCount: 0,
  cellsOpened: 0,
  manualNumberCells: 0,
  stageStartTime: 0,
  hitDogThisStage: false,
  scoreBreakdown: null,
  isNewBest: false,
  animatedTotal: 0,
  isPerfect: false,

  hintIdx: -1,
  hintPhase: "done",

  setStageIdx: (v) => set({ stageIdx: v }),
  setBoard: (v) => set((s) => ({ board: updater(s.board, v) })),
  setLives: (v) => set((s) => ({ lives: updater(s.lives, v) })),
  setRescued: (v) => set((s) => ({ rescued: updater(s.rescued, v) })),
  setGameState: (v) => set({ gameState: v }),

  setScore: (v) => set((s) => ({ score: updater(s.score, v) })),
  setCatRescueCount: (v) => set((s) => ({ catRescueCount: updater(s.catRescueCount, v) })),
  setCellsOpened: (v) => set((s) => ({ cellsOpened: updater(s.cellsOpened, v) })),
  setManualNumberCells: (v) => set((s) => ({ manualNumberCells: updater(s.manualNumberCells, v) })),
  setStageStartTime: (v) => set({ stageStartTime: v }),
  setHitDogThisStage: (v) => set({ hitDogThisStage: v }),
  setScoreBreakdown: (v) => set({ scoreBreakdown: v }),
  setIsNewBest: (v) => set({ isNewBest: v }),
  setAnimatedTotal: (v) => set((s) => ({ animatedTotal: updater(s.animatedTotal, v) })),
  setIsPerfect: (v) => set({ isPerfect: v }),

  setHintIdx: (v) => set({ hintIdx: v }),
  setHintPhase: (v) => set({ hintPhase: v }),
}));
