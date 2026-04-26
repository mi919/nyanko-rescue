import type { SkillType } from "../../types/skill";
import type { SkillHandler } from "./types";
import { healSkill } from "./heal";
import { luckySkill } from "./lucky";
import { pawhitSkill } from "./pawhit";
import { markSkill } from "./mark";
import { lineSkill } from "./line";
import { crossSkill } from "./cross";
import { peekSkill } from "./peek";
import { foreseeSkill } from "./foresee";
import { rushSkill } from "./rush";
import { barrierSkill } from "./barrier";

export const SKILL_HANDLERS: Record<SkillType, SkillHandler> = {
  heal: healSkill,
  lucky: luckySkill,
  pawhit: pawhitSkill,
  mark: markSkill,
  line: lineSkill,
  cross: crossSkill,
  peek: peekSkill,
  foresee: foreseeSkill,
  rush: rushSkill,
  barrier: barrierSkill,
};

export type { SkillContext, SkillHandler } from "./types";
