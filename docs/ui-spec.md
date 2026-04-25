# 🐱 にゃんこレスキュー UI仕様書

**バージョン:** 2.1
**最終更新:** 2026/04/19

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

### 1-3. 共通カラー

| 用途 | HEX | 備考 |
|------|-----|------|
| 文字（メイン） | #37474f | ダークグレー |
| 文字（サブ） | #666 / #888 | グレー系 |
| 背景（白系） | rgba(255,255,255,0.85) | 半透明カード |
| 成功・猫 | #43a047 | 緑 |
| 危険・犬 | #e53935 | 赤 |
| アクセント | #ffa726 | オレンジ |

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

### 3-3. ステータスバー

```
display: flex, gap: 12, alignItems: center, flexWrap: wrap, justifyContent: center
background: rgba(255,255,255,0.85), borderRadius: 12
padding: 6px 14px, fontSize: 14, fontWeight: 600
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

### 3-5. スキルゲージバー

```
display: flex, gap: 8, alignItems: center
background: rgba(255,255,255,0.85), borderRadius: 12
padding: 6px 10px, maxWidth: 360px
```

左: 猫スプライト（36px円形、スキル色ボーダー）
中: スキル名 + パーセント + プログレスバー（高さ8px）
右: 発動/中止ボタン

**ゲージバーの色変化:**
- 0〜99%: `linear-gradient(90deg, #b0bec5, ${skill.color})`
- 100%: `linear-gradient(90deg, #ffd54f, #ffa726, #ff7043)` + `gaugeShimmer` アニメ

**発動ボタン:**
- 通常: スキル色グラデ、`skillPulse` アニメ（100%時のみ）
- cross選択中: 赤グラデ、テキスト「中止」
- ゲージ不足: #ccc、disabled

### 3-6. 盤面

```
display: grid
gridTemplateColumns: repeat(cols, 38px)
gap: 3, padding: 8
background: flagMode ? rgba(255,224,130,0.85) : rgba(255,255,255,0.6)
borderRadius: 12
boxShadow: flagMode ? 0 0 0 3px #ffa726 + glow : 0 4px 20px rgba(0,0,0,0.08)
animation: dogAttack ? attackShake 0.6s : none
```

### 3-7. セル（Cell コンポーネント）

#### 未開封セル

| 状態 | 背景 | ボーダー | アニメ | アイコン |
|------|------|---------|--------|---------|
| 通常 | linear-gradient(145deg, #b0bec5, #90a4ae) | #78909c | - | - |
| フラグ済み | #fff9c4 | #78909c | - | 🚩 |
| 透視中（犬） | linear-gradient(145deg, #ef5350, #c62828) | #b71c1c | peekPulse | 🐕 |
| マーク中（猫） | linear-gradient(145deg, #81c784, #43a047) | #2e7d32 | markPulse | 🎯 |
| 予知選択中 | linear-gradient(145deg, #ce93d8, #ab47bc) | #6a1b9a | peekPulse | 🔮 |
| 予知プレビュー | linear-gradient(145deg, #b39ddb, #7e57c2) | #4527a0 | markPulse | 内容表示 |
| じゅうじ選択中 | linear-gradient(145deg, #ffb74d, #fb8c00) | #e65100 | crossPulse | ✨ |

全セル共通:
- width/height: 38px
- borderRadius: 6
- cursor: pointer
- タッチフィードバック: onMouseDown → scale(0.92)

#### 開封済みセル

| 状態 | 背景 | 内容表示 |
|------|------|---------|
| 空マス（0/0） | #f5f5f5 | なし |
| 数字マス | #f5f5f5 | 赤数字(犬)/緑数字(猫) |
| 犬マス | #ffcdd2 | Sprite(dog, 32) |
| 猫マス | #c8e6c9 | Sprite(cat, 32) |

数字表示: `${dogCount} / ${catCount}` 形式
- dogCount: color #e53935, fontWeight 700
- catCount: color #43a047, fontWeight 700
- fontSize: 11

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
