# 🐱 にゃんこレスキュー 状態管理アーキテクチャ仕様書

**バージョン:** 3.0
**最終更新:** 2026/04/26

---

## 1. 概要

本書は **Zustand** を用いた状態管理の設計を定義する。

v2.x まで存在した 51 個の `useState` / `useLocalStorageState` 宣言は、`src/stores/` 配下の **5 つのストア** に分割・集約された（v3.0 / PR 5）。各画面コンポーネントはストアを直接参照する（prop drilling なし）。

```
src/stores/
├── uiStore.ts        # 画面遷移・UI 制御
├── gameStore.ts      # ゲーム進行・スコア・ヒント
├── skillStore.ts     # スキル効果・ゲージ
├── progressStore.ts  # 永続化データ（unlockedCats / companion / stageBest / lapCount）+ ラップ・ルーレット
└── effectStore.ts    # 演出データ（dogAttack / catRescue / pawEffects / unlockBanner / crossEffect）
```

---

## 2. ストア一覧

### 2-1. uiStore (`src/stores/uiStore.ts`)

画面遷移・モーダル開閉・トーストなど UI 制御に関わる state。

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `screen` | `"title"` | `"title"\|"game"\|"roulette"\|"ending"` | 現在の画面 |
| `showRules` | `false` | boolean | ルールモーダル表示 |
| `showCollection` | `false` | boolean | 図鑑モーダル表示 |
| `flagMode` | `false` | boolean | フラグモード ON/OFF |
| `debugMode` | `false` | boolean | デバッグメニュー表示 |
| `logoTapCount` | `0` | number | ロゴタップ回数（デバッグモード起動用） |
| `message` | `""` | string | トーストメッセージ |

### 2-2. gameStore (`src/stores/gameStore.ts`)

ゲーム本体の進行状態。

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `stageIdx` | `0` | number (0-3) | 現在のステージインデックス |
| `board` | `[]` | `Cell[]` | 盤面配列 |
| `lives` | `3` | number (0-3) | 残りライフ |
| `rescued` | `[]` | `CatType[]` | 当該ステージで保護済みの猫 |
| `gameState` | `"playing"` | `"playing"\|"won"\|"lost"` | ゲーム状態 |
| `score` | `0` | number | 累計スコア |
| `catRescueCount` | `0` | number | 当該ステージの猫保護数 |
| `cellsOpened` | `0` | number | 当該ステージの開封マス数 |
| `manualNumberCells` | `0` | number | 当該ステージの手動数字マス開封数 |
| `stageStartTime` | `0` | number (ms) | ステージ開始タイムスタンプ |
| `hitDogThisStage` | `false` | boolean | 犬踏みフラグ |
| `scoreBreakdown` | `null` | `ScoreBreakdown\|null` | クリア時のスコア内訳 |
| `isNewBest` | `false` | boolean | NEW BEST 判定 |
| `animatedTotal` | `0` | number | スコアカウントアップアニメ用 |
| `isPerfect` | `false` | boolean | パーフェクトクリア判定 |
| `hintIdx` | `-1` | number | ヒントマスのインデックス |
| `hintPhase` | `"done"` | `"converge"\|"flash"\|"badge"\|"done"` | ヒント演出フェーズ |

### 2-3. skillStore (`src/stores/skillStore.ts`)

スキルゲージとアクティブ効果。

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `skillGauge` | `0` | number (0-100) | スキルゲージ |
| `peekingDogs` | `false` | boolean | 透視スキル発動中 |
| `luckyShield` | `false` | boolean | ラッキーシールド有効 |
| `markedCatIdx` | `-1` | number | マーク対象マスのインデックス |
| `barrierActive` | `false` | boolean | バリア有効中 |
| `barrierRemaining` | `0` | number (0-3) | バリア残り秒数 |
| `foreseeMode` | `0` | number (0-3) | 予知残りタップ数 |
| `foreseePreview` | `null` | `{idx, type, label}\|null` | 予知プレビュー情報 |
| `foreseeStartTime` | `0` | number (ms) | 予知開始タイムスタンプ |
| `foreseeTimeOffset` | `0` | number (ms) | 予知 / じゅうじ選択累積時間 |
| `crossSelecting` | `false` | boolean | じゅうじサーチ選択モード |
| `crossStartTime` | `0` | number (ms) | じゅうじ選択開始タイムスタンプ |
| `skillFlash` | `null` | `{type, color}\|null` | スキル発動フラッシュ演出 |
| `skillUsedThisStage` | `false` | boolean | スキル使用済みフラグ |

### 2-4. progressStore (`src/stores/progressStore.ts`)

**永続化されるストア**（`zustand/middleware` の `persist` を使用）。

#### 永続化対象（key: `nyanko_progress`）
| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `unlockedCats` | `INITIAL_UNLOCKED` | `CatKey[]` | アンロック済み猫キー配列 |
| `companion` | `"chatora"` | `CatKey` | 選択中のお供猫キー |
| `stageBest` | `{}` | `Record<string, number>` | ステージ別ベストスコア |
| `lapCount` | `0` | number | 周回数（0始まり） |

#### 非永続化（同ストア内）
| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `lapCats` | `[]` | `CatKey[]` | 1 周で保護した全猫キー配列 |
| `collection` | `[]` | `CatType[]` | 1 周で出会った全猫（図鑑表示用） |
| `rouletteResult` | `null` | `{catKey, catName}\|null` | 出会い画面の当選結果 |
| `roulettePhase` | `"idle"` | string | 出会い画面のフェーズ |

#### マイグレーション
`merge()` 関数で v2.x の旧 localStorage キー（`nyanko_unlockedCats` / `nyanko_companion` / `nyanko_stageBest` / `nyanko_lapCount`）を自動的に新 key `nyanko_progress` に統合する。

### 2-5. effectStore (`src/stores/effectStore.ts`)

演出オーバーレイ用の一時データ。

| state | 初期値 | 型 | 用途 |
|-------|--------|-----|------|
| `dogAttack` | `false` | boolean | 犬噛みつき演出中 |
| `catRescue` | `null` | `CatRescueData\|null` | 猫保護演出データ |
| `pawEffects` | `[]` | `PawEffect[]` | 肉球エフェクト配列 |
| `unlockBanner` | `null` | `UnlockBannerData\|null` | アンロックバナー情報 |
| `crossEffect` | `null` | `CrossEffectData\|null` | じゅうじ光演出データ |

---

## 3. 参照パターン

### 3-1. コンポーネントからの参照

```ts
import { useGameStore } from "../stores/gameStore";

const board = useGameStore((s) => s.board);
const setBoard = useGameStore((s) => s.setBoard);
```

setter は参照が安定しているため subscribe コストはなし。state は値変更時のみ再レンダ。

### 3-2. React 外（スキルハンドラ等）からの参照

```ts
import { useGameStore } from "../../stores/gameStore";

const { board, setBoard } = useGameStore.getState();
```

`getState()` は subscribe しない一時的なスナップショット取得。スキルハンドラ（`src/lib/skills/`）は React コンポーネント外なのでこのパターンを採用。

---

## 4. ハンドラと初期化

### 4-1. `useInitStage` フック (`src/hooks/useInitStage.ts`)

ステージ開始時に呼ぶ全リセット処理。`TitleScreen`（はじめる）と `GameScreen`（リトライ・次のステージ）の両方が利用するため独立フックに切り出されている。

`useGameStore`, `useSkillStore`, `useEffectStore`, `useUiStore`, `useProgressStore` の setter を取り込み、安定 callback を返す。`useCallback` の依存配列は空（setter は安定参照のため）。

### 4-2. ヒント演出のタイムアウト管理

モジュールレベル変数 `hintTimeouts: NodeJS.Timeout[]` で `setTimeout` ハンドルを保持し、`clearHintTimeouts()` でまとめて解除する（v2.x の `useRef` パターンを React 外に移動）。

---

## 5. 画面遷移時の state 変化

### 5-1. タイトル → ゲーム開始 (`TitleScreen.onStart`)

```
initStage(0)
gameStore.setScore(0)
progressStore.setCollection([])
progressStore.setLapCats([])
uiStore.setScreen("game")
```

### 5-2. ステージクリア → 次のステージ (`GameScreen.nextStage`)

```
progressStore.setLapCats([...lapCats, ...rescued.map(c => c.key)])
if stageIdx < 3:
  initStage(stageIdx + 1)
else:
  uiStore.setScreen("roulette")
  progressStore.setRoulettePhase("idle")
  progressStore.setRouletteResult(null)
```

### 5-3. 出会い画面 → タイトルへ (`EncounterScreen.goToTitle`)

```
progressStore.setLapCount(prev => prev + 1)
progressStore.setLapCats([])
progressStore.setRoulettePhase("idle")
progressStore.setRouletteResult(null)
uiStore.setScreen("title")
```

---

## 6. リフレクション: なぜ Zustand を選んだか

| 候補 | 採用 / 不採用 | 理由 |
|------|-------------|------|
| **Zustand** | ✅ | 軽量（〜1KB）、TS 対応良好、SSR 不要、5 ストア slice 化が容易、persist middleware で localStorage 互換マイグレーション簡単 |
| Redux Toolkit | ❌ | 本アプリ規模に対し過剰 |
| Jotai | ❌ | atom 単位の細分化が逆に管理コスト高 |
| Context + Reducer | ❌ | 50+ state では reducer 肥大化 |

---

*本仕様書は現プログラム実装（v3.0）を正として記述。*
