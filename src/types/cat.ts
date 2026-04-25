import type { SkillType } from "./skill";

export type CatKey =
  | "chatora"
  | "hachi"
  | "mike"
  | "munchkin"
  | "scottish"
  | "kuro"
  | "russian"
  | "persian"
  | "shiro"
  | "bengal";

export type Rarity = 1 | 2 | 3 | 4;

export type CatType = {
  key: CatKey;
  name: string;
  skill: SkillType;
  rarity: Rarity;
};
