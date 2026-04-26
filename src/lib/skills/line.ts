import { useGameStore } from "../../stores/gameStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const lineSkill: SkillHandler = ({ stage, triggerPawEffects }) => {
  const { board, setBoard } = useGameStore.getState();
  const { setMessage } = useUiStore.getState();
  // Pick a random row that has unrevealed cells, open all unrevealed cells in it
  // Dog cells convert to flagged
  const rowsWithUnrevealed: number[] = [];
  for (let r = 0; r < stage.rows; r++) {
    for (let c = 0; c < stage.cols; c++) {
      const i = r * stage.cols + c;
      if (!board[i].revealed && !board[i].flagged) {
        rowsWithUnrevealed.push(r);
        break;
      }
    }
  }
  if (rowsWithUnrevealed.length === 0) {
    setMessage("➡️ 開ける場所がない…");
    setTimeout(() => setMessage(""), 2000);
    return;
  }
  const row = rowsWithUnrevealed[Math.floor(Math.random() * rowsWithUnrevealed.length)];
  const newBoard = board.map((c) => ({ ...c }));
  const hitIndices: number[] = [];
  for (let c = 0; c < stage.cols; c++) {
    const i = row * stage.cols + c;
    if (newBoard[i].revealed || newBoard[i].flagged) continue;
    hitIndices.push(i);
    if (newBoard[i].type === "dog") {
      newBoard[i].flagged = true;
    } else if (newBoard[i].type === "empty") {
      newBoard[i].revealed = true;
    }
    // cats untouched
  }
  setBoard(newBoard);
  triggerPawEffects(hitIndices, { stagger: 50 });
  setMessage(`➡️ ${row + 1}行目をサーチ！`);
  setTimeout(() => setMessage(""), 2000);
};
