import { useGameStore } from "../../stores/gameStore";
import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const crossSkill: SkillHandler = () => {
  const { board } = useGameStore.getState();
  const { setCrossSelecting, setCrossStartTime, setForeseeTimeOffset } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  // Check there's at least one selectable cell
  const hasCandidates = board.some((c) => !c.revealed && !c.flagged);
  if (!hasCandidates) {
    setMessage("✨ 開ける場所がない…");
    setTimeout(() => setMessage(""), 2000);
    return;
  }
  setCrossSelecting(true);
  const startedAt = Date.now();
  setCrossStartTime(startedAt);
  setMessage("✨ じゅうじサーチ：中心マスを選んで（縦9マス）");
  // Auto-cancel if player doesn't choose within 20 seconds
  setTimeout(() => {
    setCrossSelecting((prev) => {
      if (prev) {
        setForeseeTimeOffset((off) => off + (Date.now() - startedAt));
        setMessage("✨ サーチがキャンセルされた…");
        setTimeout(() => setMessage(""), 1500);
      }
      return false;
    });
  }, 20000);
};
