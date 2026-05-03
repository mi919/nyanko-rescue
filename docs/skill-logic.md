# 🐱 にゃんこレスキュー スキルロジック仕様書

**バージョン:** 3.0
**最終更新:** 2026/04/26

---

## 1. 概要

本書は全10スキルの発動条件・内部ロジック・エッジケース・バランス数値を定義する。

---

## 2. スキルシステム共通仕様

### 2-1. お供選択

- タイトル画面で1匹の猫を「お供」として選択
- 選んだ猫のスキルがそのプレイ中ずっと使用可能
- 初期はちゃとら（❤️回復）のみアンロック
- アンロックは「出会い画面」（はいきょクリア後）でのみ可能

### 2-2. スキルゲージ

| 項目 | 値 |
|------|-----|
| 最大値 | 100 |
| 空白マス手動開封 | +5 |
| フラッドフィルの追加マス | +1/マス |
| 猫を保護 | +25 |
| 犬を踏む | +0 |
| フラグ設置 | +0 |

### 2-3. 発動条件

```javascript
if (skillGauge < 100 || gameState !== "playing") return;
```

- ゲージが100以上であること
- ゲームが "playing" 状態であること

### 2-4. 発動時の共通処理

```javascript
setSkillUsedThisStage(true);  // ノースキルボーナス判定用
setSkillGauge(0);             // ゲージをリセット
setSkillFlash({ type: skillType, color: skill.color }); // フラッシュ演出
setTimeout(() => setSkillFlash(null), 600);
```

ゲージは発動と同時に0にリセットされる。発動回数に制限はなく、ゲージが再び溜まれば何度でも使用可能。

### 2-5. スキル一覧

| No. | キー | 名前 | アイコン | 猫 | 発動方式 |
|-----|------|------|---------|-----|---------|
| 1 | heal | 回復 | ❤️ | ちゃとら ★1 | 即時効果 |
| 2 | lucky | ラッキー | 🍀 | はちわれ ★1 | バフ付与 |
| 3 | pawhit | ねこパンチ | 🐾 | みけねこ ★1 | 即時効果 |
| 4 | mark | マーク | 🎯 | マンチカン ★2 | 一時表示 |
| 5 | line | ラインサーチ | ➡️ | スコティッシュ ★2 | 即時効果 |
| 6 | cross | じゅうじサーチ | ✨ | くろねこ ★2 | プレイヤー選択 |
| 7 | peek | 透視 | 👁 | ロシアンブルー ★3 | 一時表示 |
| 8 | foresee | 予知 | 🔮 | ペルシャ ★3 | プレイヤー選択×3 |
| 9 | rush | ねこラッシュ | 🐾 | しろねこ ★4 | 即時効果 |
| 10 | barrier | バリア | 🛡 | ベンガル ★4 | 時限バフ |

---

## 3. 各スキル詳細

### 3-1. heal（❤️ 回復）

**効果:** ライフを1回復（最大3）

**ロジック:**
```
if lives < 3:
    lives += 1
    message = "❤️ ライフを1回復した！"
else:
    message = "❤️ ライフは満タンだった…"
```

**エッジケース:**
- ライフ満タン時に使用: ゲージは消費されるが回復しない（メッセージで通知）

---

### 3-2. lucky（🍀 ラッキー）

**効果:** 次に犬マスを踏んだとき、ダメージを1回だけ無効化

**ロジック（発動時）:**
```
if luckyShield is already active:
    message = "🍀 すでにバリアが張られている！"
else:
    luckyShield = true
    message = "🍀 ラッキー！次の犬を無効化"
```

**ロジック（犬マスクリック時、handleClick内）:**
```
if luckyShield:
    luckyShield = false
    message = "🍀 ラッキー！ダメージを無効化！"
    return  // ダメージなし、噛みつき演出もなし
```

**優先順位:** barrier > lucky > 通常ダメージ

**エッジケース:**
- バリア（barrier）が同時に有効な場合: barrierが先に判定される
- 既にluckyShield有効中に再発動: ゲージは消費されるが重複しない

**UI表示:** ステータスバーに「🍀 バリア」バッジ表示（`skillPulse` アニメーション）

---

### 3-3. pawhit（🐾 ねこパンチ）

**効果:** ランダムな安全マス3つを自動で開封

**ロジック:**
```
candidates = 全マスのうち:
    revealed === false AND
    flagged === false AND
    type === "empty"

shuffle candidates (Fisher-Yates)
picks = candidates の先頭3つ（3つ未満なら全部）

for each pick:
    board[pick].revealed = true

triggerPawEffects(picks, { stagger: 150 })
message = "🐾 ${picks.length}マスを発見！"
```

**エッジケース:**
- 安全な未開封マスが3つ未満: ある分だけ開封
- 安全な未開封マスが0: 何も起きない（メッセージで通知）

---

### 3-4. mark（🎯 マーク）

**効果:** ランダムな未開封の猫マスを1つ、6秒間ハイライト表示

**ロジック:**
```
catCells = 全マスのうち:
    revealed === false AND
    type === "cat"

if catCells is empty:
    message = "🎯 もう発見できる猫はいない…"
    return

picked = random(catCells)
markedCatIdx = picked

setTimeout(6000):
    if markedCatIdx is still picked:
        markedCatIdx = -1
```

**UI表示:** 対象マスが緑色ハイライト（`markPulse` アニメーション）＋🎯アイコン

**エッジケース:**
- 6秒以内に対象マスを開いた場合: 正常に猫保護される（マークは開封と連動して自動解除されない。次のレンダリングで `markedCatIdx === i` が `cell.revealed` により Cell コンポーネントで非表示になる）

---

### 3-5. line（➡️ ラインサーチ）

**効果:** ランダムな横1列の未開封マスを開く。犬マスはフラグに変換。

**ロジック:**
```
rowsWithUnrevealed = 未開封マスを含む行のリスト

if empty:
    message = "➡️ 開ける場所がない…"
    return

row = random(rowsWithUnrevealed)
hitIndices = []

for each col in 0..stage.cols-1:
    cell = board[row * cols + col]
    if cell.revealed or cell.flagged: continue
    hitIndices.push(index)
    if cell.type === "dog": cell.flagged = true
    elif cell.type === "empty": cell.revealed = true
    // 猫マスは触らない

triggerPawEffects(hitIndices, { stagger: 50 })
message = "➡️ ${row+1}行目をサーチ！"
```

**エッジケース:**
- 猫マスが横一列に含まれる場合: 猫マスは開封もフラグ化もしない（プレイヤーが自分で保護する）

---

### 3-6. cross（✨ じゅうじサーチ）— プレイヤー選択式

**効果:** プレイヤーが選んだ中心マスから十字方向（上下左右2マスずつ）計9マスを開く

**フロー:**
```
発動ボタン押下
  ↓ ゲージ消費、フラッシュ演出
crossSelecting = true
crossStartTime = Date.now()
message = "✨ じゅうじサーチ：中心マスを選んで（縦9マス）"
  ↓ 20秒タイムアウト開始
プレイヤーがマスをタップ（handleClick内で処理）
  ↓
中心マスから ARM=2 の十字を開封
crossSelecting = false
foreseeTimeOffset += (Date.now() - crossStartTime) // 選択時間をクリアタイムから除外
crossEffect 演出を表示（十字光線）
```

**十字の範囲（ARM = 2）:**
```
        [上2]
        [上1]
[左2][左1][中心][右1][右2]
        [下1]
        [下2]
```

中心1 + 上下各2 + 左右各2 = **最大9マス**

**ロジック（handleClick内）:**
```
if crossSelecting AND not board[idx].revealed AND not board[idx].flagged:
    center = idx
    r0, c0 = center の行列

    // 中心マスを処理
    if type === "dog": flagged = true
    elif type === "empty": revealed = true

    // 縦方向（上下2マス）
    for dr in -2..+2 (skip 0):
        if inBounds: 同様の処理

    // 横方向（左右2マス）
    for dc in -2..+2 (skip 0):
        if inBounds: 同様の処理

    crossEffect 演出をトリガー
    crossSelecting = false
```

**キャンセル:**
- 発動ボタンが「中止」に変化、押下でキャンセル
- 20秒タイムアウトで自動キャンセル
- いずれの場合も選択時間をオフセットに加算

**UI表示:**
- 選択モード中: 全未開封マスがオレンジ脈動（`crossPulse`）＋ ✨アイコン
- ステータスバーに「✨ 選択中」バッジ
- 発動ボタンが赤い「中止」に変化

**演出:**
- 十字型の光線（`crossBeamV`, `crossBeamH`）が中心から拡大
- 中心に光のハロー（`crossHalo`）と白い核（`crossCore`）
- 8方向に ✨パーティクル（`sparkleFly`）
- 肉球エフェクトなし（光演出のみ）

---

### 3-7. peek（👁 透視）

**効果:** 全犬マスを3秒間ハイライト表示

**ロジック:**
```
peekingDogs = true
message = "👁 犬の位置を透視中…"

setTimeout(3000):
    peekingDogs = false
    message = ""
```

**UI表示:** 未開封の犬マスが赤いグラデーション（`peekPulse` アニメーション）＋ 🐕アイコン

---

### 3-8. foresee（🔮 予知）— プレイヤー選択×3

**効果:** 次の3マスの中身を開かずにプレビュー表示

**フロー:**
```
発動ボタン押下
  ↓ ゲージ消費
foreseeMode = 3
foreseeStartTime = Date.now()
message = "🔮 次の3マスを予知… マスを選んで"
  ↓ 20秒タイムアウト開始
```

**ロジック（handleClick内、タップ1回ごと）:**
```
if foreseeMode > 0 AND not revealed AND not flagged:
    cell = board[idx]

    if cell.type === "dog":
        preview = { type: "dog", label: "🐕 犬マス！" }
    elif cell.type === "cat":
        preview = { type: "cat", label: "🐱 ${cell.catType.name}" }
    else:
        preview = { type: "empty", label: "空白 (犬${dogCount}/猫${catCount})" }

    foreseePreview = { idx, ...preview }
    foreseeMode -= 1

    if foreseeMode > 0:
        message = "🔮 ${label}  (あと${foreseeMode}マス)"
    else:
        // 最後のタップ — 選択時間をクリアタイムから除外
        foreseeTimeOffset += (Date.now() - foreseeStartTime)
        message = "🔮 ${label}"

    // プレビュー表示を4秒後に自動クリア
    setTimeout(4000): foreseePreview = null
```

**UI表示:**
- 予知モード中: 全未開封マスが紫色ハイライト（`peekPulse`）＋ 🔮アイコン
- プレビュー結果: 対象マスが紫色に変化し、中身を表示（犬→🐕、猫→🐱、空→数字）
- ステータスバーに「🔮 N」残りタップ数を紫バッジで表示

**タイムアウト（20秒）:**
```
setTimeout(20000):
    if foreseeMode > 0:
        foreseeTimeOffset += (Date.now() - foreseeStartTime)
        foreseeMode = 0
        message = "🔮 予知の時間切れ…"
```

---

### 3-9. rush（🐾 ねこラッシュ）

**効果:** ランダムなマスを中心に5×5範囲を一気に開く（犬マスはフラグ化）

**ロジック:**
```
candidates = 全マスのうち:
    revealed === false AND flagged === false

if empty:
    message = "🐾 開ける場所がない…"
    return

center = random(candidates)
r0, c0 = center の行列

hitIndices = []
hits = 0

for dr in -2..+2:
    for dc in -2..+2:
        if not inBounds: continue
        cell = board[nr * cols + nc]
        if cell.revealed or cell.flagged: continue
        // 70% hit chance per cell
        if random() > 0.7: continue
        hitIndices.push(index)
        hits++
        if cell.type === "dog": cell.flagged = true
        elif cell.type === "empty": cell.revealed = true
        // 猫マスは触らない

triggerPawEffects(hitIndices, { stagger: 40, big: true })
message = "🐾💨 ねこラッシュ！${hits}マス開いた"
```

**注意:** 5×5=25マスのうち約70%（17〜18マス）が影響を受ける。毎回結果が異なるランダム性。

---

### 3-10. barrier（🛡 バリア）

**効果:** 3秒間、犬マスを踏んでもダメージを受けない

**ロジック（発動時）:**
```
barrierActive = true
barrierRemaining = 3

// 毎秒カウントダウン
interval = setInterval(1000):
    barrierRemaining -= 1
    if barrierRemaining <= 0:
        clearInterval(interval)
        barrierActive = false
        barrierRemaining = 0
```

**ロジック（犬マスクリック時、handleClick内）:**
```
if barrierActive:
    message = "🛡 バリアが犬を弾いた！"
    return  // ダメージなし、噛みつき演出もなし
```

**UI表示:** ステータスバーに「🛡 Ns」カウントダウンバッジ（`skillPulse` アニメーション）

---

## 4. ダメージ無効の優先順位

犬マスを踏んだとき、以下の順序でチェックされる。

```
1. barrierActive === true → ダメージ無効、演出なし
2. luckyShield === true → ダメージ無効、演出なし、luckyShield = false
3. 通常ダメージ → 噛みつき演出 + ライフ-1
```

最初にマッチした条件で処理が終了する（return）。

---

## 5. クリアタイム除外の詳細

以下のスキルは「プレイヤーが考える時間」が発生するため、その時間をクリアタイムから除外する。

| スキル | 開始時刻の記録 | 終了タイミング | オフセット加算 |
|--------|-------------|-------------|-------------|
| foresee | `foreseeStartTime = Date.now()` | 3回タップ完了 or タイムアウト | `foreseeTimeOffset += elapsed` |
| cross | `crossStartTime = Date.now()` | タップ選択完了 or キャンセル or タイムアウト | `foreseeTimeOffset += elapsed` |

- `foreseeTimeOffset` は1ステージ中の累積（複数回のスキル使用に対応）
- `finalizeStageScore` 内で `elapsed = (Date.now() - stageStartTime - totalForeseeMs) / 1000` として計算
- `initStage` で0にリセット

---

## 6. スキルバランスの設計意図

| レア | スキル | 評価 | 設計意図 |
|------|--------|------|---------|
| ★1 | 回復 | 安定 | 初心者が安心してプレイできる定番スキル |
| ★1 | ラッキー | 防御 | 1回限りの保険、使いどころが重要 |
| ★1 | ねこパンチ | 攻撃 | 序盤の探索を加速、シンプルで使いやすい |
| ★2 | マーク | 情報 | 猫の位置が分かる＝猫を直接保護できる |
| ★2 | ラインサーチ | 攻撃 | 1列まるごと開く強力な探索 |
| ★2 | じゅうじサーチ | 攻撃 | プレイヤー選択式で戦略的に使える |
| ★3 | 透視 | 情報 | 犬の位置が分かる＝安全な場所が特定できる |
| ★3 | 予知 | 情報 | 3マスの中身を確認可能、最も情報量が多い |
| ★4 | ねこラッシュ | 攻撃 | 5×5範囲を一気に開く最強の探索スキル |
| ★4 | バリア | 防御 | 3秒間無敵、危険地帯を強行突破できる |

---

## 8. 実装ファイル配置（v3.0 / PR 7）

各スキルは独立した TypeScript モジュールとして実装され、`src/lib/skills/` 配下に配置される。`SKILL_HANDLERS` マップ経由でディスパッチされる。

| スキル | ファイル | 追加依存 |
|--------|---------|---------|
| heal | `src/lib/skills/heal.ts` | gameStore / uiStore |
| lucky | `src/lib/skills/lucky.ts` | skillStore / uiStore |
| pawhit | `src/lib/skills/pawhit.ts` | gameStore / uiStore + `triggerPawEffects` |
| mark | `src/lib/skills/mark.ts` | gameStore / skillStore / uiStore |
| line | `src/lib/skills/line.ts` | gameStore / uiStore + `triggerPawEffects` |
| cross | `src/lib/skills/cross.ts` | gameStore / skillStore / uiStore |
| peek | `src/lib/skills/peek.ts` | skillStore / uiStore |
| foresee | `src/lib/skills/foresee.ts` | skillStore / uiStore |
| rush | `src/lib/skills/rush.ts` | gameStore / uiStore + `triggerPawEffects` |
| barrier | `src/lib/skills/barrier.ts` | skillStore / uiStore |

### 8-1. SkillContext

```ts
// src/lib/skills/types.ts
export type SkillContext = {
  stage: Stage;
  triggerPawEffects: (indices: number[], options?: { stagger?: number; big?: boolean }) => void;
};

export type SkillHandler = (ctx: SkillContext) => void;
```

ストアの state / setter は `useStore.getState()` でハンドラ内から直接取得する（context には含めない）。`triggerPawEffects` は GameScreen 内の `boardRef` DOM に依存するため context 経由で渡す。

### 8-2. ディスパッチ

```ts
// src/lib/skills/index.ts
export const SKILL_HANDLERS: Record<SkillType, SkillHandler> = {
  heal: healSkill,
  lucky: luckySkill,
  // ...
};
```

```ts
// src/screens/GameScreen.tsx (activateSkill)
SKILL_HANDLERS[skillType]({ stage, triggerPawEffects });
```

---

*本仕様書は現プログラム実装（v3.0）を正として記述。*
