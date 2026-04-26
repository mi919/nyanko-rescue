import { useGameStore } from "../../stores/gameStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const healSkill: SkillHandler = () => {
  const { lives, setLives } = useGameStore.getState();
  const { setMessage } = useUiStore.getState();
  if (lives < 3) {
    setLives((l) => Math.min(3, l + 1));
    setMessage("❤️ ライフを1回復した！");
  } else {
    setMessage("❤️ ライフは満タンだった…");
  }
  setTimeout(() => setMessage(""), 2000);
};
