# 🐱 にゃんこレスキュー UI仕様書

**バージョン:** 2.3
**最終更新:** 2026/05/04

---

## 1. グローバルスタイル

### 1-1. フォント

```
font-family: 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif
```

### 1-2. セルサイズ

```javascript
const cellSize = 38; // px、全ステージ共通
```

### 1-3. 共通カラー（v2.2: パステル基調に統一）

| 用途 | HEX | 備考 |
|------|-----|------|
| 文字（メイン） | #37474f | ダークグレー |
| 文字（サブ） | #78909c | スレートグレー |
| 背景（白系） | rgba(255,255,255,0.45)〜0.6 | グラス半透明（backdrop-filter併用） |
| 成功・猫（背景） | #a5d6a7 / 縁: #c8e6c9 / 背景: #e8f5e9 | パステルグリーン |
| 成功・猫（数字） | #66bb6a | 視認性のためやや高彩度 |
| 危険・犬（背景） | #f48a8a / 縁: #f4b6b6 / 背景: #ffe3e3 | パステル赤 |
| 危険・犬（数字） | #e57373 | 視認性のためやや高彩度 |
| アクセント | #ffa726 | オレンジ（フラグ・100%ゲージ等） |
| セルベース | hi: #fafbfd / lo: #d6dde6 | ネオモーフィズム凸用グラデ |

### 1-3b. グラスモーフィズムトークン (v2.3: ステージ背景画像対応で透過度を調整)

`src/constants/theme.ts` の `glass` オブジェクトに集約:

| トークン | 値 | 用途 |
|---------|-----|-----|
| `glass.bg` | `rgba(255,255,255,0.42)` | ステータスバー・スキルゲージ |
| `glass.bgStrong` | `rgba(255,255,255,0.38)` | 盤面コンテナ（背景画像をより透かす） |
| `glass.bgFlag` | `rgba(255,236,179,0.38)` | フラグモード時の盤面 |
| `glass.border` | `1px solid rgba(255,255,255,0.7)` | パネル縁 |
| `glass.borderFlag` | `1px solid rgba(255,193,7,0.65)` | フラグモード時の縁 |
| `glass.blur` | `blur(16px) saturate(140%)` | 通常パネル |
| `glass.blurStrong` | `blur(22px) saturate(160%)` | 盤面用（透過率を下げた分 blur で補強） |
| `glass.shadow` | `0 8px 32px rgba(120,144,156,0.18), inset 0 1px 0 rgba(255,255,255,0.65)` | 通常 |
| `glass.shadowFlag` | `0 8px 32px rgba(255,167,38,0.28), inset 0 1px 0 rgba(255,255,255,0.7), 0 0 0 2px rgba(255,193,7,0.5)` | フラグモード |

互換性のため `WebkitBackdropFilter` も併記する（iOS Safari 対応）。

### 1-3c. セル開封状態の差別化方針 (v2.3)

ステージ背景画像が透けるようになったため、未開封セルと開封済みセルの見分けを以下で明確化:

| 状態 | 不透明度 | 縁 | 影 | 視覚効果 |
|------|--------|----|----|---------|
| 未開封 | 不透明 | `rgba(255,255,255,0.85)` 1px | 外凸（NEU_REST_SHADOW） | 「叩ける蓋」、縁でタイル感を強化 |
| 押下中 | 不透明 | 同上 | 内凹（NEU_PRESSED_SHADOW） | 「押し込まれた」 |
| フラグ済み | 不透明 | `rgba(245,158,11,0.5)` 1px | 内ハイ＋黄淡影 | 旗が立った |
| 開封済み 空マス | `rgba(255,255,255,0.30)` | `rgba(255,255,255,0.40)` 1px | 強い内凹（4px） | 蓋が外れて背景が透ける |
| 開封済み 数字マス | `rgba(255,253,248,0.48) → rgba(248,244,234,0.55)` | `rgba(228,221,205,0.55)` 1px | 強い暖色の内凹 | クリーム色の紙が透ける、数字は強い text-shadow で抜き |
| 開封済み 猫マス | `rgba(232,245,233,0.65) → rgba(214,234,216,0.70)` | `rgba(165,214,167,0.55)` 1px | 内凹 + 緑グロー | パステル緑が背景と馴染む |
| 開封済み 犬マス | `rgba(255,227,227,0.65) → rgba(251,207,207,0.70)` | `rgba(244,138,138,0.55)` 1px | 内凹 + 赤グロー | パステル赤が背景と馴染む |

数字テキスト（v2.3 強化）:
- `font-size: 14px`（13px → 14px）
- `font-weight: 900`
- `text-shadow: 0 1px 0 rgba(255,255,255,0.9), 0 0 3px rgba(255,255,255,0.7), 0 0 6px rgba(255,255,255,0.4)`（多層白halo で背景画像を抜く）

### 1-4. レスポンシブ

- UIコンテナ最大幅: `maxWidth: 360px`
- スキルゲージ最大幅: `maxWidth: 360px`
- スタートボタン最大幅: `maxWidth: 300px`
- メインビジュアル最大幅: `maxWidth: 600px`

---

## 2. タイトル画面

### 2-1. 全体構造

```
┌─────────────────────────────────────┐
│ [背景: グラデーション]              │
│ [メインビジュアル: absolute配置]     │
│                                     │
│ [❓ルール]        [ロゴ]      [📖図鑑]│ ← z-index: 5
│                                     │
│          (flex: 1 スペーサー)         │
│                                     │
│ ┌─── 下部UIコンテナ ───────────┐     │ ← z-index: 2
│ │ [🌟 N周目]                   │     │   semi-transparent gradient
│ │ [おともの ねこ (N/10)]        │     │
│ │ [◀ 猫スプライト 名前 スキル ▶]│     │
│ │ [🔒 あとN匹…]               │     │
│ │                              │     │
│ │ [🐾 はじめる 🐾]             │     │
│ │ ライフは3つ！全ての猫を…     │     │
│ └──────────────────────────────┘     │
└─────────────────────────────────────┘
```

### 2-2. 背景

```css
background: linear-gradient(180deg, #b3e5fc 0%, #c8e6c9 60%, #dcedc8 100%)
```

### 2-3. メインビジュアル

```
<img>要素、position: absolute
top: 0, left: 50%, transform: translateX(-50%)
width: 100%, maxWidth: 600px
height: auto, maxHeight: 70vh
object-fit: contain, object-position: center top
z-index: 0
```

### 2-4. 左上ルールボタン

```
width: 48px, height: 48px, border-radius: 50%
background: rgba(255,255,255,0.85)
border: 2px solid rgba(255,255,255,0.9)
box-shadow: 0 3px 10px rgba(0,0,0,0.2)
内容: "?" + "ルール"（縦2段）
```

### 2-5. 右上図鑑ボタン

同上スタイル。保護数のバッジ（赤丸、位置: top:-2 right:-2）。

### 2-6. ロゴ

```
<img src={LOGO_URL}>
width: min(68vw, 260px)
filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25))
position: relative, z-index: 2
```

### 2-7. 下部UIコンテナ

```
position: relative, z-index: 2
maxWidth: 360px, width: 100%
background: linear-gradient(180deg, transparent 0%,
  rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.85) 100%)
borderRadius: 20, padding: 16px 8px 8px
```

### 2-8. お供選択カード

横長レイアウト: `display: flex, alignItems: center, gap: 6`

```
┌──────────────────────────────────┐
│ [◀] [猫48px | 名前・スキル・説明] [▶] │
└──────────────────────────────────┘
```

- 猫スプライト: `size={48}`、スキル色で縁取った円形背景
- 名前: fontSize 13, fontWeight 800
- スキルバッジ: 背景=スキル色、白文字、borderRadius 10
- 説明: fontSize 9, color #666
- 矢印ボタン: 28px円形、アンロック1匹なら disabled

### 2-9. はじめるボタン

```
padding: 12px 0, fontSize: 20, fontWeight: 900
background: linear-gradient(180deg, #ff8a65 0%, #ff5252 100%)
color: #fff, border: 3px solid #fff, borderRadius: 50
boxShadow: 0 6px 0 #c44, 0 8px 20px rgba(255,82,82,0.5)
maxWidth: 300px, width: 100%
animation: float 2.5s ease-in-out infinite
内容: "🐾 はじめる 🐾"
```

---

## 3. ゲーム画面

### 3-1. 全体構造

```
┌────────────────────────────────┐
│ 🌿 ステージ 1: にわ            │
│                                │
│ ❤️♥♥♥ 🐱0/4 ⭐0 [フラグ] [図鑑] │ ← ステータスバー
│ [🍀バリア] [🛡 3s] [🔮 3] [✨選択中] │ ← アクティブ効果
│                                │
│ [猫48] ❤️回復  0%  ████░ [発動] │ ← スキルゲージ
│                                │
│ ┌──盤面──────────────────┐     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ │ □□□□□□□□              │     │
│ └────────────────────────┘     │
│                                │
│ 保護した猫: [猫1][猫2]...       │
│ 💡 フラグボタンでフラグモード切替 │
└────────────────────────────────┘
```

### 3-2. ステージ名

```
textAlign: center, fontSize: 16, fontWeight: 700
内容: "${emoji} ステージ ${idx+1}: ${name}"
```

### 3-3. ステータスバー（v2.2: グラス化）

```
display: flex, gap: 12, alignItems: center, flexWrap: wrap, justifyContent: center
background: glass.bg
backdropFilter: glass.blur (Webkit併記)
border: glass.border
borderRadius: 16, padding: 8px 16px
boxShadow: glass.shadow
fontSize: 14, fontWeight: 600, color: palette.textMain
```

内容:
- `❤️ {"♥".repeat(lives)}{"♡".repeat(3-lives)}`
- `🐱 {rescued.length}/{stage.cats}`
- `⭐ {score}`
- フラグボタン（ON時オレンジグラデ）
- 図鑑ボタン

### 3-4. アクティブ効果インジケータ

ステータスバー内にstateに応じてバッジ表示:

| 条件 | バッジ | 背景色 | 文字色 |
|------|--------|--------|--------|
| luckyShield | 🍀 バリア | #c8e6c9 | #2e7d32 |
| barrierActive | 🛡 Ns | #cfd8dc | #37474f |
| foreseeMode > 0 | 🔮 N | #e1bee7 | #4a148c |
| crossSelecting | ✨ 選択中 | #ffe0b2 | #bf360c |

全て: padding 2px 8px, borderRadius 10, fontSize 11, fontWeight 800, animation: skillPulse

### 3-5. スキルゲージバー（v2.2: グラス化＋シーン演出）

```
position: relative, overflow: hidden
display: flex, gap: 10, alignItems: center
background: glass.bg
backdropFilter: glass.blur (Webkit併記)
border: glass.border
borderRadius: 16, padding: 8px 12px, maxWidth: 360px
boxShadow: glass.shadow
```

左: 猫スプライト（38px円形、`radial-gradient(circle, ${skill.color}33 0%, ${skill.color}11 100%)` 背景＋スキル色2pxボーダー＋内ハイライト）
- 100%時: `gaugeGlowPulse 1.6s ease-in-out infinite` でグロー強弱

中: スキル名 + パーセント + プログレスバー
- バー高さ: 10px、背景: `rgba(176,190,197,0.25)` ＋ 内影で凹み感
- 上部に半透明白のグロッシーハイライト（高さ45%）を重ねる
- transition: `width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)` でぷるん感

右: 発動/中止ボタン（既存のまま）

**100%到達時の追加演出 (v2.2):**
- パネル全体に `panelSheen 2.4s ease-in-out infinite` の斜め白シーン

**ゲージバーの色変化:**
- 0〜99%: `linear-gradient(90deg, #cfd8dc, ${skill.color})`
- 100%: `linear-gradient(90deg, #ffd54f, #ffa726, #ff7043)` + `gaugeShimmer`

### 3-6. 盤面（v2.2: グラス化）

```
display: grid
gridTemplateColumns: repeat(cols, 38px)
gap: 4, padding: 12
background: flagMode ? glass.bgFlag : glass.bgStrong
backdropFilter: glass.blurStrong (Webkit併記)
border: flagMode ? glass.borderFlag : glass.border
borderRadius: 18
boxShadow: flagMode ? glass.shadowFlag : glass.shadow
transition: background/box-shadow/border 0.25s ease
animation: dogAttack ? attackShake 0.6s : (hint中 ? boardFadeIn : none)
```

### 3-6b. 背景アンビエントレイヤー (v2.2 新設)

`GameScreen` のルート直下に絶対配置する非干渉レイヤー:

```
position: absolute, inset: 0, pointerEvents: none, zIndex: 0
内部に5個のブロブ <div>:
  - サイズ: 140〜260px
  - top: 10〜74%
  - background: radial-gradient(circle, hsla(hue, 70%, 80%, 0.55) 0%, transparent 70%)
  - filter: blur(8px)
  - animation: ambientDrift (28〜52s linear infinite) + ambientFloat (6〜10s ease-in-out infinite)
```

UI本体は `position: relative; zIndex: 1` のラッパーで前面に配置。

### 3-7. セル（Cell コンポーネント）

#### 未開封セル（v2.2: ネオモーフィズム＋パステル化）

| 状態 | 背景 | ボーダー | シャドウ | アニメ | アイコン |
|------|------|---------|---------|--------|---------|
| 通常 | linear-gradient(145deg, #fafbfd, #d6dde6) | transparent | 外凸＋内ハイ（NEU_REST_SHADOW） | - | - |
| 通常（押下中） | 同上 | 同上 | NEU_PRESSED_SHADOW（内凹） | scale(0.94) | - |
| フラグ済み | linear-gradient(145deg, #fff9c4, #fff59d) | transparent | 内ハイ＋#ffd54f淡影 | - | 🚩 |
| 透視中（犬） | linear-gradient(145deg, #ffcdd2, #ef9a9a) | #e57373 | 内ハイ＋#ef9a9aグロー | peekPulse | 🐕 |
| マーク中（猫） | linear-gradient(145deg, #c8e6c9, #a5d6a7) | #81c784 | 内ハイ＋#a5d6a7グロー | markPulse | 🎯 |
| 予知選択中 | linear-gradient(145deg, #e1bee7, #ce93d8) | #ba68c8 | 内ハイ＋#ce93d8グロー | peekPulse | 🔮 |
| 予知プレビュー | linear-gradient(145deg, #d1c4e9, #b39ddb) | #9575cd | 内ハイ＋強グロー | markPulse | 内容表示 |
| じゅうじ選択中 | linear-gradient(145deg, #ffe0b2, #ffcc80) | #ffb74d | 内ハイ＋#ffcc80グロー | crossPulse | ✨ |

**NEU_REST_SHADOW**: `6px 6px 12px rgba(176,190,197,0.45), -4px -4px 10px rgba(255,255,255,0.85), inset 1px 1px 2px rgba(255,255,255,0.6)`
**NEU_PRESSED_SHADOW**: `inset 4px 4px 8px rgba(120,144,156,0.35), inset -2px -2px 6px rgba(255,255,255,0.6)`

全セル共通:
- width/height: 38px
- borderRadius: 6（rounded-md）
- cursor: pointer
- タッチフィードバック: 押下中は state で scale(0.94) ＋ シャドウ凹切り替え
- タップ時: クリック位置から `cellRipple 0.5s` の白い波紋（最大1セル数個まで自動消滅）

#### 開封済みセル（v2.2: パステル化）

| 状態 | 背景 | ボーダー | シャドウ | 内容表示 |
|------|------|---------|---------|---------|
| 空マス（0/0） | linear-gradient(145deg, #fafbfd, #e6ecf2) | #dde4ec | 内凹（数字マスと共通） | なし |
| 数字マス | 同上 | #dde4ec | 内凹（凹み感） | 赤数字(#e57373)/緑数字(#66bb6a) |
| 犬マス | linear-gradient(145deg, #ffe3e3, #fbcfcf) | #f4b6b6 | 内ハイ＋#f48a8a淡影 | Sprite(dog, 32) |
| 猫マス | linear-gradient(145deg, #e8f5e9, #d6ead8) | #c8e6c9 | 内ハイ＋#a5d6a7淡影 | Sprite(cat, 32) |

数字表示: `${dogCount} / ${catCount}` 形式
- dogCount: color #e57373, fontWeight 800
- catCount: color #66bb6a, fontWeight 800
- 区切り `/`: color #b0bec5
- fontSize: 13

### 3-8. トースト

```
position: fixed, top: 12, left: 50%, transform: translateX(-50%)
borderRadius: 24, padding: 10px 20px
fontWeight: 700, fontSize: 14, color: #333
boxShadow: 0 6px 20px rgba(0,0,0,0.2)
zIndex: 150, pointerEvents: none
maxWidth: 90%, whiteSpace: nowrap
```

背景色:
- ゲームオーバー: #ffcdd2
- クリア: #c8e6c9
- その他: #fff9c4

### 3-9. フッター

```
fontSize: 11, color: #888, textAlign: center, marginTop: 8
```
- フラグON: "🚩 フラグモード：タップで旗を立てる/外す"
- フラグOFF: "💡 フラグボタンでフラグモード切替"

---

## 4. クリア画面（盤面上に重畳）

### 4-1. クリアパネル

```
position: absolute, inset: 0
background: rgba(0,0,0,0.5)
display: flex, flexDirection: column, alignItems: center, justifyContent: center
```

内容:
- ステージ名 + "クリア！" タイトル
- スコアブレイクダウン（各項目を行表示）
- highlight項目は金色テキスト
- 合計スコア（animatedTotal でカウントアップ）
- NEW BEST時: 金色グラデ背景 + 🏆バッジ
- ボタン: 「次のステージへ ▶」（最終ステージは「エンディング ▶」）

### 4-2. ゲームオーバーパネル

同様のオーバーレイ。ボタン2つ:
- 「リトライ」（赤グラデ）
- 「🏠 タイトルへ」（白）

---

## 5. 仲間との出会い画面

### 5-1. 背景

```
linear-gradient(180deg, #ffcc80 0%, #ff8a65 30%, #5c6bc0 70%, #283593 100%)
```

### 5-2. 構造

```
┌──────────────────────────┐
│ 🌟 はいきょ クリア！ 🌟   │
│      〜 N周目 〜         │
│                          │
│ ┌──今回出会った猫たち──┐  │
│ │ [猫36] [猫36] [猫36]  │  │
│ └───────────────────────┘  │
│                          │
│      (flex: 1 スペーサー)  │
│                          │
│   [光の輪（softGlow）]     │
│   [猫96px（catEmerge）]    │
│   [草むら（CSS描画9枚葉）]  │
│                          │
│ ✨ ○○ ✨                 │
│ なかまになりたそうに...    │
│ [スキルバッジ]             │
│                          │
│ [🐾 なかまにする！]        │
└──────────────────────────┘
```

### 5-3. 草むら（CSS描画）

9枚の `<div>` で葉を表現:

```javascript
Array.from({ length: 9 }, (_, i) => ({
  width: 18,
  height: 28 + (i % 3) * 8,
  background: `hsl(${110 + (i%4)*12}, 55%, ${38 + (i%3)*8}%)`,
  borderRadius: "50% 50% 0 0",
  transform: `rotate(${(i-4)*6}deg)`,
  transformOrigin: "bottom center",
}))
```

揺れアニメーション:
- 待機中: `grassSway` 2s ループ（緩やかな揺れ）
- 猫登場前: `grassIntense` 0.5s ループ（激しい揺れ）

---

## 6. モーダル

### 6-1. 共通スタイル

```
position: fixed, inset: 0
background: rgba(0,0,0,0.5)
display: flex, alignItems: center, justifyContent: center
zIndex: 200
```

内部パネル:
```
background: #fff, borderRadius: 20, padding: 20-24px
maxWidth: 340-360px, width: 90%
boxShadow: 0 8px 40px rgba(0,0,0,0.3)
```

### 6-2. 図鑑モーダル

- グリッド: 2列表示
- 保護済み: スプライト + 名前 + スキル名 + ★表示
  - 背景: #f1f8e9、ボーダー: #a5d6a7
- 未保護: ❓ + 「？？？」
  - 背景: #f5f5f5、ボーダー: #e0e0e0、opacity: 0.4

### 6-3. ルールモーダル

テキストベースの説明:
- 「マス目をタップしてかくれた猫を見つけよう！」
- 赤＝犬、緑＝猫の説明
- ライフ制の説明

---

## 7. ボタンスタイル一覧

| ボタン | 背景 | 色 | 角丸 | 特記 |
|--------|------|-----|------|------|
| はじめる | #ff8a65→#ff5252 | 白 | 50 | float animation、影付き |
| のぞいてみる | #ff8a65→#ff5252 | 白 | 40 | 影付き |
| なかまにする | #66bb6a→#43a047 | 白 | 40 | 影付き |
| 次の周回へ | rgba(255,255,255,0.2) | 白 | 24 | ボーダー白 |
| 発動 | skill.color グラデ | 白 | 16 | skillPulse、disabled時#ccc |
| 中止 | #ef5350→#c62828 | 白 | 16 | cross選択中のみ |
| フラグ | ON: #ffd54f→#ffa726 / OFF: #fff | ON: 白 / OFF: #666 | 16 | - |
| リトライ | #ef5350→#c62828 | 白 | 24 | - |
| タイトルへ | rgba(255,255,255,0.9) | #546e7a | 24 | - |
| とじる | #78909c | 白 | 16 | モーダル用 |

---

*本仕様書は現プログラム実装を正として記述。*
