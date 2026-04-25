import type { SkillType } from "../../types/skill";

export type SkillFlashData = { type: SkillType; color: string };

type SkillFlashProps = { flash: SkillFlashData | null };

export function SkillFlash({ flash }: SkillFlashProps) {
  if (!flash) return null;
  return (
    <div
      className="fixed top-1/2 left-1/2 w-[200px] h-[200px] rounded-full pointer-events-none z-[240]"
      style={{
        background: `radial-gradient(circle, ${flash.color}cc 0%, ${flash.color}66 40%, transparent 70%)`,
        animation: "skillFlash 0.6s ease-out forwards",
      }}
    />
  );
}
