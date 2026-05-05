import { useCallback } from "react";
import { useGameStore } from "../stores/gameStore";
import { useSkillStore } from "../stores/skillStore";
import { useEffectStore } from "../stores/effectStore";
import { useUiStore } from "../stores/uiStore";
import { useProgressStore } from "../stores/progressStore";
import { STAGES } from "../constants/stages";
import { createBoard } from "../lib/board";

let hintTimeouts: ReturnType<typeof setTimeout>[] = [];
let introTimeouts: ReturnType<typeof setTimeout>[] = [];

export function clearHintTimeouts() {
  hintTimeouts.forEach((t) => clearTimeout(t));
  hintTimeouts = [];
}

export function clearIntroTimeouts() {
  introTimeouts.forEach((t) => clearTimeout(t));
  introTimeouts = [];
}

// Total stage opening intro duration (ms): curtain in + showing + exiting
export const STAGE_INTRO_DURATION = 2400;
const STAGE_INTRO_EXIT_AT = 2000; // start exit fade at this time
const STAGE_INTRO_SKIP_EXIT = 280; // shorter exit when user taps to skip

/**
 * Schedule the converge → flash → badge → done hint sequence.
 * Safe to call from both the post-intro auto path and the skip-intro path.
 */
export function startHintSequence(hintIdx: number) {
  clearHintTimeouts();
  const { setBoard, setHintPhase } = useGameStore.getState();
  if (hintIdx < 0) {
    setHintPhase("done");
    return;
  }
  setHintPhase("converge");
  hintTimeouts.push(
    setTimeout(() => {
      setBoard((prev) => {
        const updated = prev.map((c) => ({ ...c }));
        if (updated[hintIdx]) updated[hintIdx].revealed = true;
        return updated;
      });
      setHintPhase("flash");
    }, 500)
  );
  hintTimeouts.push(setTimeout(() => setHintPhase("badge"), 575));
  hintTimeouts.push(setTimeout(() => setHintPhase("done"), 750));
}

/**
 * Skip the in-progress stage opening intro: cancel pending timeouts,
 * play a short exit animation, then resume into the hint sequence.
 */
export function skipStageIntro() {
  const { stageIntroPhase, setStageIntroPhase } = useUiStore.getState();
  if (stageIntroPhase === "done" || stageIntroPhase === "exiting") return;
  clearIntroTimeouts();
  // Reset the speed-bonus clock to start now (after the short exit).
  useGameStore.getState().setStageStartTime(Date.now() + STAGE_INTRO_SKIP_EXIT);
  setStageIntroPhase("exiting");
  introTimeouts.push(
    setTimeout(() => {
      useUiStore.getState().setStageIntroPhase("done");
      const hintIdx = useGameStore.getState().hintIdx;
      startHintSequence(hintIdx);
    }, STAGE_INTRO_SKIP_EXIT)
  );
}


/**
 * Returns a stable initStage(idx) callback that resets all per-stage state
 * and triggers the hint reveal animation. Reads lapCount from the store
 * lazily so the callback never needs to be recreated.
 */
export function useInitStage() {
  const setBoard = useGameStore((s) => s.setBoard);
  const setLives = useGameStore((s) => s.setLives);
  const setRescued = useGameStore((s) => s.setRescued);
  const setGameState = useGameStore((s) => s.setGameState);
  const setStageIdx = useGameStore((s) => s.setStageIdx);
  const setCatRescueCount = useGameStore((s) => s.setCatRescueCount);
  const setCellsOpened = useGameStore((s) => s.setCellsOpened);
  const setManualNumberCells = useGameStore((s) => s.setManualNumberCells);
  const setStageStartTime = useGameStore((s) => s.setStageStartTime);
  const setHitDogThisStage = useGameStore((s) => s.setHitDogThisStage);
  const setScoreBreakdown = useGameStore((s) => s.setScoreBreakdown);
  const setIsNewBest = useGameStore((s) => s.setIsNewBest);
  const setAnimatedTotal = useGameStore((s) => s.setAnimatedTotal);
  const setIsPerfect = useGameStore((s) => s.setIsPerfect);
  const setHintIdx = useGameStore((s) => s.setHintIdx);
  const setHintPhase = useGameStore((s) => s.setHintPhase);

  const setSkillGauge = useSkillStore((s) => s.setSkillGauge);
  const setPeekingDogs = useSkillStore((s) => s.setPeekingDogs);
  const setLuckyShield = useSkillStore((s) => s.setLuckyShield);
  const setMarkedCatIdx = useSkillStore((s) => s.setMarkedCatIdx);
  const setBarrierActive = useSkillStore((s) => s.setBarrierActive);
  const setBarrierRemaining = useSkillStore((s) => s.setBarrierRemaining);
  const setForeseeMode = useSkillStore((s) => s.setForeseeMode);
  const setForeseePreview = useSkillStore((s) => s.setForeseePreview);
  const setForeseeStartTime = useSkillStore((s) => s.setForeseeStartTime);
  const setForeseeTimeOffset = useSkillStore((s) => s.setForeseeTimeOffset);
  const setCrossSelecting = useSkillStore((s) => s.setCrossSelecting);
  const setCrossStartTime = useSkillStore((s) => s.setCrossStartTime);
  const setSkillUsedThisStage = useSkillStore((s) => s.setSkillUsedThisStage);

  const setCrossEffect = useEffectStore((s) => s.setCrossEffect);
  const setMessage = useUiStore((s) => s.setMessage);
  const setStageIntroPhase = useUiStore((s) => s.setStageIntroPhase);

  return useCallback(
    (idx: number) => {
      const s = STAGES[idx];
      // Read lapCount lazily — avoids stale-closure issues without useRef.
      const extra = useProgressStore.getState().lapCount;
      const maxDogs = Math.floor(s.rows * s.cols * 0.3);
      const effectiveDogs = Math.min(s.dogs + extra, maxDogs);
      const { board: newBoard, hintIdx: newHintIdx } = createBoard(
        s.rows,
        s.cols,
        effectiveDogs,
        s.cats,
        idx
      );
      setBoard(newBoard);
      setLives(3);
      setRescued([]);
      setGameState("playing");
      setMessage("");
      setStageIdx(idx);
      setCatRescueCount(0);
      setCellsOpened(0);
      setManualNumberCells(0);
      // Clock starts after the opening intro finishes so the 2.4s curtain
      // doesn't eat into the speed bonus.
      setStageStartTime(Date.now() + STAGE_INTRO_DURATION);
      setSkillUsedThisStage(false);
      setHitDogThisStage(false);
      setScoreBreakdown(null);
      setIsNewBest(false);
      setAnimatedTotal(0);
      setIsPerfect(false);
      setHintIdx(newHintIdx);
      setSkillGauge(0);
      setPeekingDogs(false);
      setLuckyShield(false);
      setMarkedCatIdx(-1);
      setBarrierActive(false);
      setBarrierRemaining(0);
      setForeseeMode(0);
      setForeseePreview(null);
      setForeseeStartTime(0);
      setForeseeTimeOffset(0);
      setCrossSelecting(false);
      setCrossStartTime(0);
      setCrossEffect(null);
      clearHintTimeouts();
      clearIntroTimeouts();
      // Hint stays "done" while the intro overlay is visible; the converge
      // sequence kicks off only after the curtain has lifted.
      setHintPhase("done");

      // Stage opening intro: curtain → showing → exiting → done
      setStageIntroPhase("curtain");
      introTimeouts.push(
        setTimeout(() => setStageIntroPhase("showing"), 400)
      );
      introTimeouts.push(
        setTimeout(() => setStageIntroPhase("exiting"), STAGE_INTRO_EXIT_AT)
      );
      introTimeouts.push(
        setTimeout(() => {
          setStageIntroPhase("done");
          startHintSequence(newHintIdx);
        }, STAGE_INTRO_DURATION)
      );
    },
    // All dependencies are stable Zustand setters; safe to omit the array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}
