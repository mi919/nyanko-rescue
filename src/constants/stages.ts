import type { Stage } from "../types/stage";
import niwaBg from "../assets/stages/stage_niwa.jpg";
import kouenBg from "../assets/stages/stage_kouen.jpg";
import shoutenBg from "../assets/stages/stage_shouten.jpg";
import haikyoBg from "../assets/stages/stage_haikyo.jpg";

export const STAGES: readonly Stage[] = [
  { name: "にわ", emoji: "🌿", rows: 8, cols: 8, dogs: 6, cats: 4, bg: "#e8f5e9", bgImage: niwaBg, mult: 1.0 },
  { name: "こうえん", emoji: "🌳", rows: 9, cols: 9, dogs: 8, cats: 5, bg: "#e3f2fd", bgImage: kouenBg, mult: 1.2 },
  { name: "しょうてんがい", emoji: "🏪", rows: 10, cols: 10, dogs: 12, cats: 6, bg: "#fff3e0", bgImage: shoutenBg, mult: 1.5 },
  { name: "はいきょ", emoji: "🏚️", rows: 10, cols: 10, dogs: 15, cats: 7, bg: "#efebe9", bgImage: haikyoBg, mult: 2.0 },
];
