export const CAT_TYPES = [
  { key: "chatora",  name: "ちゃとら",       skill: "heal",    rarity: 1 },
  { key: "hachi",    name: "はちわれ",       skill: "lucky",   rarity: 1 },
  { key: "mike",     name: "みけねこ",       skill: "pawhit",  rarity: 1 },
  { key: "munchkin", name: "マンチカン",     skill: "mark",    rarity: 2 },
  { key: "scottish", name: "スコティッシュ", skill: "line",    rarity: 2 },
  { key: "kuro",     name: "くろねこ",       skill: "cross",   rarity: 2 },
  { key: "russian",  name: "ロシアンブルー", skill: "peek",    rarity: 3 },
  { key: "persian",  name: "ペルシャ",       skill: "foresee", rarity: 3 },
  { key: "shiro",    name: "しろねこ",       skill: "rush",    rarity: 4 },
  { key: "bengal",   name: "ベンガル",       skill: "barrier", rarity: 4 },
];

// Stage-specific rarity weights: [stageIdx][rarity-1]
// Steep slope — ★4 is very rare, encourages dedicated grinding of はいきょ
export const STAGE_RARITY_WEIGHTS = [
  [100, 0,  0,  0],   // にわ: ★1のみ
  [50,  50, 0,  0],   // こうえん: ★1=50%, ★2=50%
  [50,  35, 15, 0],   // しょうてんがい: ★1=50%, ★2=35%, ★3=15%
  [50,  30, 15, 5],   // はいきょ: ★1=50%, ★2=30%, ★3=15%, ★4=5%
];

export const INITIAL_UNLOCKED = ["chatora"];
