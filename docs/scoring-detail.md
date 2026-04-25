# 🐱 にゃんこレスキュー スコア計算仕様書

**バージョン:** 2.1
**最終更新:** 2026/04/19

---

## 1. 概要

本書はスコアの加算タイミング・計算フロー・ボーナス判定条件・ベストスコア管理を定義する。

---

## 2. スコア定数

```javascript
const SCORING = {
  catRescue: 200,       // 猫1匹保護
  cellOpen: 5,          // マス1つ開封
  numberCellManual: 10, // 数字マスを手動で開封
  clear: 500,           // ステージクリア基本ボーナス
  livePerHeart: 200,    // 残ライフ1つにつき
  perfect: 1000,        // パーフェクトクリア（ライフ3維持）
  speedFast: 1000,      // 高速クリア（30秒未満）
  speedNormal: 500,     // 中速クリア（60秒未満）
  flagMaster: 500,      // 全犬マスにフラグ
  noHit: 500,           // 無傷クリア（犬を1度も踏まない）
  noSkill: 300,         // スキル未使用クリア
};
```

---

## 3. ステージ倍率

| ステージ | 倍率 | 定数名 |
|---------|------|--------|
| にわ | ×1.0 | `STAGES[0].mult` |
| こうえん | ×1.2 | `STAGES[1].mult` |
| しょうてんがい | ×1.5 | `STAGES[2].mult` |
| はいきょ | ×2.0 | `STAGES[3].mult` |

最終スコア = `Math.round(ボーナス合計 × ステージ倍率)`

---

## 4. リアルタイム加算（ゲーム中）

以下のスコアは `handleClick` 内でその場で `setScore(s => s + N)` により加算される。

| トリガー | 加算値 | 加算先state |
|---------|--------|-----------|
| 猫を保護 | +200 (`SCORING.catRescue`) | `score` |
| マスを手動開封 | +5 (`SCORING.cellOpen`) | `score` |
| 数字マスを手動開封 | +10 (`SCORING.numberCellManual`) | `score` |

**注意:** フラッドフィルで連鎖的に開いたマスは `cellOpen` として加算されるが、`numberCellManual` は手動で直接開いたマスのみカウントする。

---

## 5. クリア時のスコア計算: finalizeStageScore

### 5-1. 呼び出しタイミング

最後の猫を保護した直後に `finalizeStageScore(finalBoard)` が呼ばれる。

### 5-2. クリアタイム計算

```javascript
let totalForeseeMs = foreseeTimeOffset;

// 予知スキルが発動中のままクリアした場合
if (foreseeMode > 0 && foreseeStartTime > 0) {
  totalForeseeMs += (Date.now() - foreseeStartTime);
}

// じゅうじサーチ選択中のままクリアした場合
if (crossSelecting && crossStartTime > 0) {
  totalForeseeMs += (Date.now() - crossStartTime);
}

const elapsed = (Date.now() - stageStartTime - totalForeseeMs) / 1000;
```

**クリアタイムから除外される時間:**
- 予知（foresee）スキルの選択時間
- じゅうじサーチ（cross）スキルの選択時間
- これらの時間は `foreseeTimeOffset` に累積される

### 5-3. スコアブレイクダウンの構築

以下の順序で `items[]` 配列にスコア項目を追加する。

#### 基本スコア（必ず含まれる）

| No. | ラベル | 計算式 |
|-----|--------|--------|
| 1 | 🐱 ねこを保護 ×N | `(catRescueCount + 1) × 200` |
| 2 | 🔓 マス開封 ×N | `cellsOpened × 5`（0なら非表示）|
| 3 | 🔢 数字マス開封 ×N | `manualNumberCells × 10`（0なら非表示）|
| 4 | ✨ クリアボーナス | `500`（固定）|
| 5 | ❤️ ライフボーナス ×N | `lives × 200` |

**注意:** `catRescueCount + 1` なのは、最後の猫の保護がまだカウンターに反映される前に `finalizeStageScore` が呼ばれるため。

#### 条件付きボーナス（条件を満たした場合のみ）

| No. | ラベル | 条件 | 値 | highlight |
|-----|--------|------|-----|----------|
| 6 | ★ パーフェクト | `lives === 3` | 1000 | ✅ |
| 7 | ⚡ 超速クリア (N秒) | `elapsed < 30` | 1000 | ✅ |
| 8 | ⚡ スピードクリア (N秒) | `30 <= elapsed < 60` | 500 | ✅ |
| 9 | 🚩 フラグマスター | 全犬マスにフラグが立っている | 500 | ✅ |
| 10 | 🛡 無傷クリア | `hitDogThisStage === false` | 500 | ✅ |
| 11 | 🧘 ノースキル | `skillUsedThisStage === false` | 300 | ✅ |

- ボーナス7と8は排他的（両方同時に付与されることはない）
- パーフェクトと無傷クリアは両方同時に成立しうる（パーフェクト ⊂ 無傷）
- `highlight: true` のボーナスはクリア画面で金色テキストで表示

### 5-4. 最終スコア計算

```javascript
const subtotal = items.reduce((sum, it) => sum + it.value, 0);
const total = Math.round(subtotal * stageObj.mult);
```

### 5-5. スコア計算例

#### 例1: にわ（倍率1.0）パーフェクト・高速クリア

```
猫保護 ×4:     200 × 4 = 800
マス開封 ×30:   5 × 30 = 150
数字マス ×8:   10 × 8  = 80
クリアボーナス:        = 500
ライフ ×3:    200 × 3 = 600
パーフェクト:          = 1000
超速クリア (22.5秒):   = 1000
無傷クリア:            = 500
ノースキル:            = 300
────────────────────────
小計                   = 4930
× 1.0                 = 4930点
```

#### 例2: はいきょ（倍率2.0）犬を1回踏む

```
猫保護 ×7:     200 × 7 = 1400
マス開封 ×50:   5 × 50 = 250
数字マス ×15:  10 × 15 = 150
クリアボーナス:        = 500
ライフ ×2:    200 × 2 = 400
スピードクリア (48秒): = 500
────────────────────────
小計                   = 3200
× 2.0                 = 6400点
```

---

## 6. ベストスコア管理

### 6-1. 記録方式

```javascript
const [stageBest, setStageBest] = useState({});
// キー: ステージ名（"にわ", "こうえん", ...）
// 値: そのステージのベストスコア（total）
```

### 6-2. 更新判定

```javascript
const prevBest = stageBest[stageObj.name] || 0;
const newBest = total > prevBest;
if (newBest) {
  setStageBest(prev => ({ ...prev, [stageObj.name]: total }));
}
setIsNewBest(newBest);
```

### 6-3. NEW BEST演出

`isNewBest === true` のとき、クリア画面で以下の演出が追加される。
- 金色グラデーション背景（`newBestGlow` 脈動アニメーション）
- 「🏆 NEW BEST! 🏆」バッジ（`newBestPulse` アニメーション）
- 前回ベストとの差分表示（`+N点`）

### 6-4. 永続化

現在はセッション内のstateとして保持。リロードでリセットされる。
将来的にはlocalStorageで永続化予定。

---

## 7. ステージ中のカウンター管理

### 7-1. カウンター一覧

| state | 初期値 | 加算タイミング | 用途 |
|-------|--------|-------------|------|
| `catRescueCount` | 0 | 猫保護時 +1 | クリアスコア計算 |
| `cellsOpened` | 0 | マス開封時 +1 | クリアスコア計算 |
| `manualNumberCells` | 0 | 数字マスを手動開封時 +1 | クリアスコア計算 |
| `stageStartTime` | `Date.now()` | ステージ開始時 | クリアタイム算出 |
| `skillUsedThisStage` | false | スキル発動時 true | ノースキルボーナス判定 |
| `hitDogThisStage` | false | 犬マス開封時 true | 無傷ボーナス判定 |

### 7-2. リセットタイミング

全カウンターは `initStage(idx)` 呼び出し時にリセットされる。

---

## 8. 累計スコアとの関係

### 8-1. 二重加算の防止

ゲーム中にリアルタイム加算されるスコア（猫保護・マス開封）は、`finalizeStageScore` の段階で既に `score` state に含まれている。そのため、`finalizeStageScore` ではクリアボーナスやライフボーナス等の「クリア時にしか発生しない加算分」のみを `score` に追加する。

```javascript
const baseAlreadyAdded = (catRescueCount + 1) * SCORING.catRescue
    + cellsOpened * SCORING.cellOpen
    + manualNumberCells * SCORING.numberCellManual;
const bonusOnly = total - baseAlreadyAdded;
setScore(s => s + Math.max(0, bonusOnly));
```

### 8-2. 累計スコアの用途

- ステータスバーに表示（⭐ N）
- ステージ間で累積
- 現在ランキング等の用途はなし

---

*本仕様書は現プログラム実装を正として記述。*
