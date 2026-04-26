import { useSkillStore } from "../../stores/skillStore";
import { useUiStore } from "../../stores/uiStore";
import type { SkillHandler } from "./types";

export const luckySkill: SkillHandler = () => {
  const { luckyShield, setLuckyShield } = useSkillStore.getState();
  const { setMessage } = useUiStore.getState();
  if (luckyShield) {
    setMessage("🍀 すでにバリアが張られている！");
  } else {
    setLuckyShield(true);
    setMessage("🍀 ラッキー！次の犬を無効化");
  }
  setTimeout(() => setMessage(""), 2000);
};
