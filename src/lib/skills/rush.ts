import { useGameStore } from "../../stores/gameStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const rushSkill: SkillHandler = ({ stage, triggerPawEffects }) => {
  const { board, setBoard } = useGameStore.getState();
  const { setMessage } = useUiStore.getState();
  // Pick a random unrevealed cell as center, blast 5x5 area with 70% hit chance per cell
  const candidates: number[] = [];
  board.forEach((c, i) => {
    if (!c.revealed && !c.flagged) candidates.push(i);
  });
  if (candidates.length === 0) {
    setMessage("🐾 開ける場所がない…");
    setTimeout(() => setMessage(""), 2000);
    return;
  }
  const center = candidates[Math.floor(Math.random() * candidates.length)];
  const r0 = Math.floor(center / stage.cols);
  const c0 = center % stage.cols;
  const newBoard = board.map((c) => ({ ...c }));
  let hits = 0;
  const hitIndices: number[] = [];
  // 5x5 area (2-cell radius) with 70% hit chance per unrevealed tile
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const nr = r0 + dr, nc = c0 + dc;
      if (nr < 0 || nr >= stage.rows || nc < 0 || nc >= stage.cols) continue;
      const ni = nr * stage.cols + nc;
      if (newBoard[ni].revealed) continue;
      if (Math.random() >= 0.7) continue; // 70% hit rate
      hits++;
      hitIndices.push(ni);
      if (newBoard[ni].type === "dog") {
        newBoard[ni].flagged = true;
      } else if (newBoard[ni].type === "empty") {
        newBoard[ni].revealed = true;
      }
      // cats left untouched — player still needs to rescue them
    }
  }
  setBoard(newBoard);
  triggerPawEffects(hitIndices, { stagger: 40, big: true });
  setMessage(`🐾💨 ねこラッシュ！${hits}マス開いた`);
  setTimeout(() => setMessage(""), 2200);
};
