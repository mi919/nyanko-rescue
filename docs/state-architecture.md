# 🐱 にゃんこレスキュー 状態管理アーキテクチャ仕様書

**バージョン:** 2.1
**最終更新:** 2026/04/19

---

## 1. 概要

本書は全51個のReact state変数と4個のrefの役割・初期値・更新タイミング・依存関係を定義する。

---

## 2. State一覧（カテゴリ別）

### 2-1. 画面遷移・UI制御

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `screen` | `"title"` | `"title"\|"game"\|"roulette"` | 現在の画面 |
| `showRules` | `false` | boolean | ルールモーダル表示 |
| `showCollection` | `false` | boolean | 図鑑モーダル表示 |
| `flagMode` | `false` | boolean | フラグモードON/OFF |
| `logoTapCount` | `0` | number | ロゴタップ回数（デバッグ用） |
| `debugMode` | `false` | boolean | デバッグメニュー表示 |
| `message` | `""` | string | トーストメッセージ |

### 2-2. ゲーム進行

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `stageIdx` | `0` | number (0-3) | 現在のステージインデックス |
| `board` | `[]` | Cell[] | 盤面配列 |
| `lives` | `3` | number (0-3) | 残りライフ |
| `rescued` | `[]` | CatType[] | 当該ステージで保護済みの猫 |
| `collection` | `[]` | CatType[] | 1周で出会った全猫（図鑑表示用） |
| `gameState` | `"playing"` | `"playing"\|"won"\|"lost"` | ゲーム状態 |

### 2-3. スコアシステム

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `score` | `0` | number | 累計スコア |
| `catRescueCount` | `0` | number | 当該ステージの猫保護数カウンター |
| `cellsOpened` | `0` | number | 当該ステージの開封マス数 |
| `manualNumberCells` | `0` | number | 当該ステージの手動数字マス開封数 |
| `stageStartTime` | `0` | number (ms) | ステージ開始タイムスタンプ |
| `skillUsedThisStage` | `false` | boolean | スキル使用済みフラグ |
| `hitDogThisStage` | `false` | boolean | 犬踏みフラグ |
| `stageBest` | `{}` | Object | ステージ別ベストスコア |
| `scoreBreakdown` | `null` | Object\|null | クリア時のスコア内訳 |
| `isNewBest` | `false` | boolean | NEW BEST判定 |
| `animatedTotal` | `0` | number | スコアカウントアップアニメ用 |
| `isPerfect` | `false` | boolean | パーフェクトクリア判定 |

### 2-4. スキルシステム（お供・ゲージ）

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `companion` | `"chatora"` | string | 選択中のお供猫キー |
| `unlockedCats` | `INITIAL_UNLOCKED` | string[] | アンロック済み猫キー配列 |
| `skillGauge` | `0` | number (0-100) | スキルゲージ |

### 2-5. スキル効果（アクティブ効果）

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `peekingDogs` | `false` | boolean | 透視スキル発動中 |
| `skillFlash` | `null` | Object\|null | スキル発動フラッシュ演出 |
| `luckyShield` | `false` | boolean | ラッキーシールド有効 |
| `markedCatIdx` | `-1` | number | マーク対象マスのインデックス |
| `barrierActive` | `false` | boolean | バリア有効中 |
| `barrierRemaining` | `0` | number (0-3) | バリア残り秒数 |
| `foreseeMode` | `0` | number (0-3) | 予知残りタップ数 |
| `foreseePreview` | `null` | Object\|null | 予知プレビュー情報 |
| `foreseeStartTime` | `0` | number (ms) | 予知開始タイムスタンプ |
| `foreseeTimeOffset` | `0` | number (ms) | 予知/じゅうじ選択累積時間 |
| `crossSelecting` | `false` | boolean | じゅうじサーチ選択モード |
| `crossStartTime` | `0` | number (ms) | じゅうじ選択開始タイムスタンプ |
| `crossEffect` | `null` | Object\|null | じゅうじ光演出データ |

### 2-6. 演出制御

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `dogAttack` | `false` | boolean | 犬噛みつき演出中 |
| `catRescue` | `null` | Object\|null | 猫保護演出データ（x, y, catKey, id） |
| `unlockBanner` | `null` | Object\|null | アンロックバナー情報 |
| `pawEffects` | `[]` | Array | 肉球エフェクト配列 |
| `hintIdx` | `-1` | number | ヒントマスのインデックス |
| `hintPhase` | `"done"` | `"converge"\|"flash"\|"badge"\|"done"` | ヒント演出フェーズ |

### 2-7. 周回システム

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `lapCount` | `0` | number | 周回数（0始まり） |
| `lapCats` | `[]` | string[] | 1周で保護した全猫キー配列 |
| `rouletteResult` | `null` | Object\|null | 出会い画面の当選結果 |
| `roulettePhase` | `"idle"` | string | 出会い画面のフェーズ |

---

## 3. Ref一覧

| ref | 初期値 | 用途 |
|-----|--------|------|
| `boardRef` | `null` | 盤面DOM要素の参照（肉球エフェクト座標計算用） |
| `hintTimeoutsRef` | `[]` | ヒント演出のsetTimeoutハンドル配列（スキップ時にクリア） |
| `lapCountRef` | `0` | useCallback内から`lapCount`を安全に参照するためのミラー |

※ Cell コンポーネント内の `ref` は各セルのDOM参照（押下アニメーション用）。

---

## 4. initStage でリセットされるstate

`initStage(idx)` 呼び出し時に以下のstateがリセットされる。

```
board → createBoard() の結果
lives → 3
rescued → []
gameState → "playing"
message → ""
stageIdx → idx
isPerfect → false
hintIdx → createBoard() の結果
skillGauge → 0
peekingDogs → false
luckyShield → false
markedCatIdx → -1
barrierActive → false
barrierRemaining → 0
foreseeMode → 0
foreseePreview → null
foreseeStartTime → 0
foreseeTimeOffset → 0
crossSelecting → false
crossStartTime → 0
crossEffect → null
catRescueCount → 0
cellsOpened → 0
manualNumberCells → 0
stageStartTime → Date.now()
skillUsedThisStage → false
hitDogThisStage → false
hintPhase → "converge" or "done"
hintTimeoutsRef → clearHintTimeouts()
```

**リセットされないstate:**
- `score`（累計）
- `collection`（1周分の出会い記録）
- `companion`, `unlockedCats`（お供選択は維持）
- `lapCount`, `lapCats`（周回情報は維持）
- `stageBest`（ベストスコアは維持）
- `flagMode`（フラグモード状態は維持）

---

## 5. 画面遷移時のstate変化

### 5-1. タイトル → ゲーム開始

```
「はじめる」ボタン押下:
  initStage(0)
  score → 0
  collection → []
  lapCats → []
  screen → "game"
```

### 5-2. ステージクリア → 次のステージ

```
nextStage():
  lapCats → [...lapCats, ...rescued.map(c => c.key)]
  if stageIdx < 3:
    initStage(stageIdx + 1)
    screen → "game"
  else:
    screen → "roulette"
    roulettePhase → "idle"
    rouletteResult → null
```

### 5-3. ゲームオーバー → リトライ

```
リトライボタン押下:
  initStage(stageIdx)  // 同じステージをやり直し
  // lapCatsは維持（前ステージまでの猫は有効）
```

### 5-4. ゲームオーバー → タイトルへ

```
タイトルへボタン押下:
  lapCats → []    // 全リセット
  screen → "title"
```

### 5-5. 出会い画面 → タイトルへ

```
goToTitle():
  lapCount → lapCount + 1
  lapCats → []
  roulettePhase → "idle"
  rouletteResult → null
  screen → "title"
```

---

## 6. 依存関係の注意点

### 6-1. lapCountRef パターン

`initStage` は `useCallback([], [])` で定義されているため、通常のstateを参照すると古い値が使われる。`lapCount` を `useCallback` 内で安全に参照するために `lapCountRef` を使用。

```javascript
const lapCountRef = useRef(0);
lapCountRef.current = lapCount; // 毎レンダリングで同期

// useCallback 内
const effectiveDogs = Math.min(s.dogs + lapCountRef.current, maxDogs);
```

### 6-2. foreseeTimeOffset の共用

`foreseeTimeOffset` は予知（foresee）とじゅうじサーチ（cross）の両方の選択時間を累積する。名前は `foresee` だが実質「スキル選択時間オフセット」として共用されている。

### 6-3. dogAttack のロック

`dogAttack === true` の間、`handleClick` は何も処理しない。噛みつき演出中の誤タップを防止する。

```javascript
if (gameState !== "playing" || dogAttack) return;
```

---

## 7. 将来の永続化対象

以下のstateはlocalStorage等で永続化すべき候補。

| state | 優先度 | 理由 |
|-------|--------|------|
| `unlockedCats` | 高 | 周回プレイの進行記録 |
| `stageBest` | 高 | ベストスコア |
| `lapCount` | 中 | 周回数 |
| `companion` | 低 | 前回選択の記憶 |

---

*本仕様書は現プログラム実装を正として記述。*
