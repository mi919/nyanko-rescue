import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const barrierSkill: SkillHandler = () => {
  const { setBarrierActive, setBarrierRemaining } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  setBarrierActive(true);
  setBarrierRemaining(3);
  setMessage("🛡 バリア展開！3秒間無敵");
  // Countdown tick
  let remaining = 3;
  const tick = setInterval(() => {
    remaining -= 1;
    setBarrierRemaining(remaining);
    if (remaining <= 0) {
      clearInterval(tick);
      setBarrierActive(false);
      setBarrierRemaining(0);
    }
  }, 1000);
  setTimeout(() => setMessage(""), 2000);
};
