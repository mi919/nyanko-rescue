import { useGameStore } from "../../stores/gameStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const pawhitSkill: SkillHandler = ({ triggerPawEffects }) => {
  const { board, setBoard } = useGameStore.getState();
  const { setMessage } = useUiStore.getState();
  // Reveal up to 3 random safe (empty) cells that aren't yet revealed
  const candidates: number[] = [];
  board.forEach((c, i) => {
    if (!c.revealed && !c.flagged && c.type === "empty") candidates.push(i);
  });
  // Shuffle and take 3
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const picks = candidates.slice(0, 3);
  const newBoard = board.map((c) => ({ ...c }));
  picks.forEach((i) => { newBoard[i].revealed = true; });
  setBoard(newBoard);
  triggerPawEffects(picks, { stagger: 150 });
  setMessage(`🐾 ねこパンチ！${picks.length}マスを開いた`);
  setTimeout(() => setMessage(""), 2000);
};
