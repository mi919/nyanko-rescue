import { useGameStore } from "../../stores/gameStore";
import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const markSkill: SkillHandler = () => {
  const { board } = useGameStore.getState();
  const { setMarkedCatIdx } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  // Find all unrevealed cat cells
  const catCells: number[] = [];
  board.forEach((c, i) => {
    if (!c.revealed && c.type === "cat") catCells.push(i);
  });
  if (catCells.length === 0) {
    setMessage("🎯 もう発見できる猫はいない…");
    setTimeout(() => setMessage(""), 2000);
    return;
  }
  const picked = catCells[Math.floor(Math.random() * catCells.length)];
  setMarkedCatIdx(picked);
  setMessage("🎯 猫の位置をマーク！");
  setTimeout(() => setMessage(""), 2500);
  // Auto-clear mark after 6 seconds
  setTimeout(() => {
    setMarkedCatIdx((prev) => (prev === picked ? -1 : prev));
  }, 6000);
};
