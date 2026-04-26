import type { Stage } from "../../types/stage";

export type TriggerPawEffects = (
  indices: number[],
  options?: { stagger?: number; big?: boolean }
) => void;

/**
 * Context passed to each skill handler. Only contains things that aren't
 * accessible via `useStore.getState()`:
 * - `stage`: current stage info (cached at activation time for stable rows/cols)
 * - `triggerPawEffects`: GameScreen-local helper that needs the boardRef DOM
 *   element to compute paw effect positions
 */
export type SkillContext = {
  stage: Stage;
  triggerPawEffects: TriggerPawEffects;
};

export type SkillHandler = (ctx: SkillContext) => void;
