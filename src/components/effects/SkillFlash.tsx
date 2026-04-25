import type { SkillType } from "../../types/skill";

export type SkillFlashData = { type: SkillType; color: string };

type SkillFlashProps = { flash: SkillFlashData | null };

export function SkillFlash({ flash }: SkillFlashProps) {
  if (!flash) return null;
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      width: 200, height: 200, borderRadius: "50%",
      background: `radial-gradient(circle, ${flash.color}cc 0%, ${flash.color}66 40%, transparent 70%)`,
      pointerEvents: "none", zIndex: 240,
      animation: "skillFlash 0.6s ease-out forwards",
    }} />
  );
}
