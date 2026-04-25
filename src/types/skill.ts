export type SkillType =
  | "heal"
  | "lucky"
  | "pawhit"
  | "mark"
  | "line"
  | "cross"
  | "peek"
  | "foresee"
  | "rush"
  | "barrier";

export type Skill = {
  name: string;
  icon: string;
  desc: string;
  color: string;
};
