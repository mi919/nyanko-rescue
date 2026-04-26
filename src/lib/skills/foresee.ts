import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const foreseeSkill: SkillHandler = () => {
  const { setForeseeMode, setForeseeStartTime, setForeseeTimeOffset } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  setForeseeMode(3);
  const startedAt = Date.now();
  setForeseeStartTime(startedAt);
  setMessage("🔮 次の3マスを予知… マスを選んで");
  // Auto-cancel if player doesn't use within 20 seconds
  setTimeout(() => {
    setForeseeMode((prev) => {
      if (prev > 0) {
        // Accumulate the time spent in foresee mode into offset
        setForeseeTimeOffset((off) => off + (Date.now() - startedAt));
        setMessage("🔮 予知の時間切れ…");
        setTimeout(() => setMessage(""), 1500);
      }
      return 0;
    });
  }, 20000);
};
