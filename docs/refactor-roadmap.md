# 🐱 にゃんこレスキュー リファクタリング・ロードマップ

**バージョン:** 1.0
**最終更新:** 2026/04/25
**対象ブランチ:** `claude/refactor-code-quality-kwV2r`

---

## 1. 目的

`src/App.jsx`（2873行・単一ファイル）を保守性・可読性重視で再構築する。動作・仕様は一切変更しない（`refactor:` のみ）。

**達成目標:**

- App.jsx を 100行未満のルーターに縮小
- 全コードを TypeScript（`strict: true`）化
- スタイルを Tailwind CSS に統一
- 状態管理を Zustand ストアに集約
- スキル10種を独立モジュール化

---

## 2. 全体方針

| 項目 | 方針 |
|------|------|
| 動作保持 | 全フェーズで一切の挙動変更なし |
| 進行 | 11フェーズを **7つのPR** に分割し、PRごとにユーザー承認を得てからマージ |
| 順序 | 低リスク（純粋抽出）→ 高リスク（状態管理刷新）の順 |
| ライブラリ追加 | `typescript`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `zustand` |
| コミット | フェーズ単位でコミット、`refactor:` プレフィックス必須 |
| ドキュメント | 各PR内で関連 `docs/` を同時更新 |

---

## 3. ライブラリ追加

| ライブラリ | 用途 | 導入フェーズ |
|----------|------|------------|
| `typescript` | 型システム | Phase 0 |
| `@types/react`, `@types/react-dom` | React の型定義 | Phase 0 |
| `tailwindcss`, `postcss`, `autoprefixer` | スタイルシステム | Phase 5 |
| `zustand` | グローバル状態管理 | Phase 8 |

---

## 4. 最終ディレクトリ構成

```
src/
├── App.tsx                         # ルーター（< 100行）
├── main.tsx
├── index.css                       # Tailwind directives
├── assets/
│
├── types/
│   ├── board.ts                    # Cell, BoardState
│   ├── stage.ts                    # Stage
│   ├── cat.ts                      # CatType, CatKey
│   ├── skill.ts                    # Skill, SkillType, SkillContext
│   └── score.ts                    # ScoreBreakdown
│
├── constants/
│   ├── stages.ts
│   ├── cats.ts
│   ├── skills.ts
│   ├── scoring.ts
│   ├── sprite.ts
│   └── theme.ts                    # cellSize, font stack 等
│
├── hooks/
│   └── useLocalStorageState.ts
│
├── lib/
│   ├── board.ts                    # createBoard, floodFill, pickWeightedCat
│   └── skills/
│       ├── index.ts                # SKILL_HANDLERS マップ
│       ├── types.ts                # SkillContext
│       ├── heal.ts
│       ├── pawhit.ts
│       ├── peek.ts
│       ├── barrier.ts
│       ├── foresee.ts
│       ├── rush.ts
│       ├── lucky.ts
│       ├── mark.ts
│       ├── line.ts
│       └── cross.ts
│
├── stores/
│   ├── index.ts
│   ├── gameStore.ts                # board, lives, gameState, rescued, score
│   ├── skillStore.ts               # skillGauge, peeking, barrier, foresee, cross, mark, lucky, flash
│   ├── progressStore.ts            # unlockedCats, companion, stageBest, lapCount, lapCats
│   ├── uiStore.ts                  # screen, showRules, showCollection, message, flagMode
│   └── effectStore.ts              # pawEffects, dogAttack, catRescue, crossEffect, unlockBanner, hint
│
├── components/
│   ├── Sprite.tsx
│   ├── Cell.tsx
│   ├── effects/
│   │   ├── animations.css          # 51 keyframes
│   │   ├── DogAttack.tsx
│   │   ├── CatRescue.tsx
│   │   ├── CrossEffect.tsx
│   │   ├── StageClearOverlay.tsx
│   │   ├── PerfectFireworks.tsx
│   │   ├── GameOverOverlay.tsx
│   │   ├── SkillFlash.tsx
│   │   ├── UnlockBanner.tsx
│   │   ├── PawEffects.tsx
│   │   └── Toast.tsx
│   ├── modals/
│   │   ├── RulesModal.tsx
│   │   └── CollectionModal.tsx
│   └── game/
│       ├── StatusBar.tsx
│       ├── SkillGauge.tsx
│       ├── BoardView.tsx
│       ├── RescuedList.tsx
│       └── BottomControls.tsx
│
└── screens/
    ├── TitleScreen.tsx
    ├── GameScreen.tsx
    ├── EncounterScreen.tsx
    └── EndingScreen.tsx
```

---

## 5. フェーズ・PR一覧

### 全体スケジュール

| PR | フェーズ | テーマ | 概算行数影響 |
|----|---------|-------|------------|
| **PR 1** | Phase 0 + 1 + 2 | 基盤整備 + 純粋抽出 + TS化 | App.jsx: 2873 → 約2300 |
| **PR 2** | Phase 3 + 4 | 演出・モーダル分離 | App.jsx: 約2300 → 約1500 |
| **PR 3** | Phase 5 | Tailwind 導入と既存抽出分の移行 | スタイルのみ |
| **PR 4** | Phase 6 + 7 | ゲームUI部品化 + 画面分離 | App.jsx: 約1500 → 約100 |
| **PR 5** | Phase 8 | Zustand 状態管理導入 | state定義の集約 |
| **PR 6** | Phase 9 | スキルハンドラ独立化 | activateSkill: 230行 → 各10〜30行 |
| **PR 7** | Phase 10 + 11 | TypeScript 厳密化 + ドキュメント仕上げ | 全 `.tsx` strict 対応 |

---

### PR 1: 基盤整備 + 純粋抽出 + TS化

**ブランチ:** `claude/refactor-code-quality-kwV2r`（共通）
**範囲:** Phase 0 + Phase 1 + Phase 2

#### Phase 0: TypeScript 基盤
- `package.json` に `typescript`, `@types/react`, `@types/react-dom` を追加
- `tsconfig.json` 作成（`strict: false` で開始）
- `vite.config.js` → `vite.config.ts`
- `src/main.jsx` → `src/main.tsx`
- 動作確認: `npm run dev` / `npm run build`

#### Phase 1: 純粋抽出（JSXのまま）
- `hooks/useLocalStorageState.jsx` ← App.jsx 9-28
- `constants/sprite.jsx` ← SPRITE_URL/POS/SIZE（30-55）
- `constants/stages.jsx` ← STAGES（76-79）
- `constants/scoring.jsx` ← SCORING（81-91）
- `constants/skills.jsx` ← SKILLS（97-107）
- `constants/cats.jsx` ← CAT_TYPES, INITIAL_UNLOCKED（109-128）
- `constants/cats.jsx` ← STAGE_RARITY_WEIGHTS（121-126）
- `constants/theme.jsx` ← cellSize（217）, font stack `ff`（App内部）
- `lib/board.jsx` ← pickWeightedCat, createBoard, floodFill（130-215）
- `components/Sprite.jsx` ← Sprite（56-74）
- `components/Cell.jsx` ← Cell（219-333）

#### Phase 2: 抽出済みファイルの TS 化
- 上記すべての `.jsx`/`.js` を `.ts`/`.tsx` に変換
- `types/` にドメイン型を定義
  - `types/board.ts`: `Cell`, `BoardCell`, `CellType = "empty"|"dog"|"cat"`
  - `types/stage.ts`: `Stage`
  - `types/cat.ts`: `CatType`, `CatKey`
  - `types/skill.ts`: `SkillType`, `Skill`
- `App.jsx` は `.jsx` のまま（Phase 10 で対応）

**動作確認:** タイトル → ゲーム → 4ステージクリア → 出会い画面の通しプレイ。

---

### PR 2: 演出・モーダル分離

**範囲:** Phase 3 + Phase 4

#### Phase 3: キーフレーム + 演出オーバーレイ抽出
- `components/effects/keyframes.ts` に51キーフレームをテンプレート文字列で集約
- `components/effects/KeyframeStyles.tsx`（`<style>{ALL_KEYFRAMES}</style>`）
- 以下の演出を独立コンポーネント化:
  - `DogAttack.tsx`
  - `CatRescue.tsx`
  - `CrossEffect.tsx`
  - `StageClearOverlay.tsx`
  - `PerfectFireworks.tsx`
  - `GameOverOverlay.tsx`
  - `SkillFlash.tsx`
  - `UnlockBanner.tsx`
  - `PawEffects.tsx`
  - `Toast.tsx`

#### Phase 4: モーダル分離
- `components/modals/RulesModal.tsx`
- `components/modals/CollectionModal.tsx`

**動作確認:** 全演出（犬噛みつき/猫保護/十字光/紙吹雪/花火/ゲームオーバー/スキル発動/アンロック/肉球/トースト）の見た目とタイミング。

---

### PR 3: Tailwind 導入

**範囲:** Phase 5

#### Phase 5: スタイルシステム移行
- `tailwindcss`, `postcss`, `autoprefixer` をインストール
- `tailwind.config.js` 作成
  - `theme.extend` にデザイントークン（色・サイズ・ステージ別背景・スキル色）
  - キーフレームは `@layer utilities` または `globals.css` で別管理
- `src/index.css` に Tailwind directives + 51 キーフレーム
- 既存抽出済みコンポーネント（PR 1/2 までの分）のインラインスタイルを `className` ベースに移行
- 動的スタイル（`stage.bg`, `skill.color` 由来など）は CSS 変数経由 or インライン `style` で残す

**動作確認:** 全画面・全演出の見た目を完全比較（スクリーンショット推奨）。

---

### PR 4: ゲームUI部品化 + 画面分離

**範囲:** Phase 6 + Phase 7

#### Phase 6: ゲームUI部品の抽出
- `components/game/StatusBar.tsx`
- `components/game/SkillGauge.tsx`
- `components/game/BoardView.tsx`（boardRef 保持）
- `components/game/RescuedList.tsx`
- `components/game/BottomControls.tsx`

#### Phase 7: 画面分離
- `screens/TitleScreen.tsx` ← screen === "title" 配下（〜320行）
- `screens/GameScreen.tsx` ← screen === "game" 配下 + handleClick / activateSkill / initStage
- `screens/EncounterScreen.tsx` ← screen === "roulette" 配下（〜640行）
- `screens/EndingScreen.tsx` ← screen === "ending" 配下
- `App.tsx` を < 100行のルーターに縮小

**動作確認:** 4画面遷移、リトライ、デバッグモード（ロゴ5回タップ）、図鑑、ルール。

---

### PR 5: Zustand 状態管理導入

**範囲:** Phase 8

- `zustand` をインストール
- 5ストアに分割:
  - `stores/gameStore.ts` — board, lives, gameState, rescued, score関連 (約15 state)
  - `stores/skillStore.ts` — skillGauge, peeking, barrier, foresee, cross, mark, lucky, flash (約14 state)
  - `stores/progressStore.ts` — unlockedCats, companion, stageBest, lapCount, lapCats (約5 state、永続化)
  - `stores/uiStore.ts` — screen, showRules, showCollection, message, flagMode, debugMode, logoTapCount (約7 state)
  - `stores/effectStore.ts` — pawEffects, dogAttack, catRescue, crossEffect, unlockBanner, hintIdx, hintPhase (約7 state)
- `useLocalStorageState` 相当の永続化は `zustand/middleware` の `persist` を使用
- セレクタは `shallow` 比較で再レンダ最小化
- アクション関数は最小限（state slice + setter のみ、複合ロジックは Phase 9 で）

**移行戦略（サブステップ）:**
1. progressStore（永続化のみ、影響範囲小）
2. uiStore（独立性高い）
3. effectStore（純粋表示）
4. skillStore（次フェーズへの橋渡し）
5. gameStore（最も影響大、最後）

**動作確認:** localStorage の `nyanko_*` キー継続性。各画面の通しプレイ。

---

### PR 6: スキルハンドラ独立化

**範囲:** Phase 9

- `lib/skills/types.ts` で `SkillContext` 型を定義（Zustand ストアを参照）
- 10スキルそれぞれを独立ファイルに:
  - `heal.ts`, `pawhit.ts`, `peek.ts`, `barrier.ts`, `foresee.ts`,
  - `rush.ts`, `lucky.ts`, `mark.ts`, `line.ts`, `cross.ts`
- `lib/skills/index.ts` で `SKILL_HANDLERS: Record<SkillType, SkillHandler>` マップ
- `activateSkill` を約20行に縮小:
  ```ts
  const skill = SKILLS[skillType];
  setSkillFlash({ type: skillType, color: skill.color });
  SKILL_HANDLERS[skillType](skillContext);
  ```

**動作確認:** 全10スキルを発動し、効果・タイミング・メッセージが完全一致すること。

---

### PR 7: TypeScript 厳密化 + ドキュメント

**範囲:** Phase 10 + Phase 11

#### Phase 10: TypeScript 厳密化
- 残存 `.jsx` を `.tsx` 化（App / screens / game components）
- `tsconfig.json` を `strict: true` に
- `any` を排除、型エラーを順次解消
- ストア・ハンドラ・コンポーネントすべての型注釈を完備

#### Phase 11: ドキュメント更新
- `docs/state-architecture.md` を Zustand store 構成に更新
- `docs/development-setup.md` にディレクトリ構造・TypeScript・Tailwind手順を追記
- `docs/animation-spec.md` のキーフレーム配置パスを更新
- `docs/skill-logic.md` にスキルハンドラのファイルマッピング追記
- `docs/roadmap.md` に v2.3〜v2.5 の履歴を追記
- `docs/refactor-roadmap.md`（本書）を「完了」マーク付きで保存

**動作確認:** 完全リグレッションテスト。`npm run build` のTSエラー0件。

---

## 6. リスクと緩和策

| リスク | 影響 | 緩和策 |
|--------|------|-------|
| TS化で型エラー連鎖 | 大 | Phase 0 で `strict: false` 開始、Phase 10 で段階的厳密化 |
| Tailwind 移行で見た目崩れ | 中 | 動的スタイル（`stage.bg` 等）はインライン維持、PR毎にスクリーンショット比較 |
| Zustand 移行で再レンダ挙動変化 | 中 | セレクタを `shallow` 比較、5ストアに分割し1ストアずつサブステップで移行 |
| スキル分割で state 参照ずれ | 大 | Zustand 導入（Phase 8）の **後** にスキル分割（Phase 9）を実施 |
| 演出のタイミングずれ | 中 | キーフレーム値・setTimeout 値を1ms単位で完全一致させる |
| キーフレーム集約で衝突 | 小 | 全51キーフレームに名前重複がないことを事前検証済み |

---

## 7. 動作確認チェックリスト（各PR後）

すべてのPRで以下を実施:

1. `npm run dev` 起動、コンソールエラー0件
2. `npm run build` 成功（PR 1以降は型チェックも）
3. タイトル → お供選択 → ゲーム → 4ステージクリア → 出会い画面の通しプレイ
4. 全10スキルを最低1回ずつ発動
5. リトライ・タイトル戻り・図鑑・ルール・デバッグモード（ロゴ5回タップ）
6. localStorage の `nyanko_*` キーが期待通り更新
7. ゲームオーバー演出 / パーフェクト演出 / 犬噛みつき演出 の目視確認
8. PR 3 以降はスクリーンショット比較で見た目リグレッション確認

---

## 8. 対象外（今回はやらない）

- 仕様変更（ゲームルール / バランス / アニメーション時間）
- テスト追加（既存に存在しない）
- パフォーマンス最適化（`useMemo` / `React.memo` 追加）
- 効果音・BGM 追加
- 画像アセットの構造変更
- ESLint / Prettier 導入
- CI/CD 構築

---

## 9. 進捗管理（完了）

実施結果（2026/04/26）— 元計画 7 PR から、実装途中で複雑性の評価により **8 PR に分割** して完遂した。

| PR | フェーズ | テーマ | ステータス | コミット |
|----|---------|-------|-----------|---------|
| PR 1 | 0 + 1 + 2 | TS 基盤 + 純粋抽出 + TS 化 | ✅ 完了 (#6) | `433e2cd` `0f113ae` `1e822de` |
| PR 2 | 3 + 4 | 演出オーバーレイ・モーダル・キーフレーム分離 | ✅ 完了 (#7) | `0e547a8` |
| PR 3 | 5 | Tailwind CSS 導入 + 抽出済み移行 | ✅ 完了 (#8) | `eefd77e` |
| PR 4 | 7 部分 | Title/Encounter/Ending 画面を screens/ に分離 | ✅ 完了 (#9) | `6250cff` |
| PR 5 | 8 | Zustand 全 state を 5 ストアに集約 | ✅ 完了 (#10) | `0a0e065` |
| PR 6 | 7 完了 | GameScreen 抽出 + App.tsx をルーター化 | ✅ 完了 (#11) | `a86cb13` |
| PR 7 | 9 | スキルハンドラ独立化 + Cell.tsx Tailwind 化 | ✅ 完了 (#12) | `bcee5f0` |
| PR 8 | 10 + 11 | TypeScript 厳密化 + ドキュメント仕上げ | ✅ 完了 (本 PR) | (本 PR) |

### 計画からの乖離点

1. **PR 数**: 7 → 8 に増加。GameScreen 抽出を Zustand 導入後（PR 5 後）にずらしたため、PR 4 と PR 6 に分割された。
2. **Phase 7（画面分離）の分割**: 元 PR 4 が PR 4（3 画面）と PR 6（GameScreen + App ルーター化）に分かれた。
3. **Cell.tsx Tailwind 化**: PR 3 → PR 6 → PR 7 と 2 回延期。条件分岐 5 段の三項演算で書き換えリスクが高かったため、Tailwind 化は共通レイアウトのみとし、動的バリアントは inline style を維持。

### 成果

| 指標 | リファクタ前 | リファクタ後 |
|------|------------|------------|
| `App.jsx` 単一ファイル | 2873 行 | 削除（`App.tsx` 24 行 + 多数のモジュール） |
| `useState` / `useLocalStorageState` | 51 個 | 0 個（全て Zustand） |
| 言語 | JavaScript（jsx） | TypeScript（`strict: true`） |
| スタイル | 200+ インライン style | Tailwind 中心 + 動的値のみ inline |
| キーフレーム | 3 箇所に分散（合計 252 行） | `keyframes.ts` 1 箇所に集約 |
| スキルロジック | 230 行の if ラダー | 10 個の独立ファイル |
| ファイル数（src/） | 4 | 50+ |

---

*本ロードマップは v3.0 リリースで完了。今後の機能開発は `docs/roadmap.md` を参照。*
