import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const peekSkill: SkillHandler = () => {
  const { setPeekingDogs } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  setPeekingDogs(true);
  setMessage("👁 犬の位置を透視中…");
  setTimeout(() => {
    setPeekingDogs(false);
    setMessage("");
  }, 3000);
};
