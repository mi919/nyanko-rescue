# 🐱 にゃんこレスキュー 画像アセット仕様書

**バージョン:** 2.2
**最終更新:** 2026/04/25

---

## 1. 概要

全画像アセットはbase64エンコードでJSXファイル内に直接埋め込まれている。外部ファイルへの分離時はVite等のバンドラーを使用して `import` に切り替える。

---

## 1-A. assets/ ディレクトリの実ファイル一覧

`assets/` ディレクトリに配置済みのファイル:

| ファイル名 | 実形式 | 実寸 | 対応定数 | 状態 |
|-----------|-------|------|---------|------|
| `main.png` | JPEG（拡張子はpng） | 1148×1064px | `BG_URL` | 配置済み |
| `title.png` | JPEG（拡張子はpng） | 1568×560px | `LOGO_URL` | 配置済み |

`src/assets/stages/` ディレクトリ（ステージ背景画像、`STAGES[].bgImage` 経由で参照）:

| ファイル名 | 形式 | 実寸 | サイズ | 状態 |
|-----------|------|------|-------|------|
| `stage_niwa.jpg` | JPEG q=82 | 948×1659px | 197 KB | 配置済み |
| `stage_kouen.jpg` | JPEG q=82 | 948×1659px | 186 KB | 配置済み |
| `stage_shouten.jpg` | JPEG q=82 | 948×1659px | 236 KB | 配置済み |
| `stage_haikyo.jpg` | JPEG q=82 | 948×1659px | 227 KB | 配置済み |

> 詳細仕様は [`stage-bg-spec.md`](./stage-bg-spec.md) を参照。

未配置のアセット（プロトタイプではbase64埋め込み）:

| 対応定数 | 状態 |
|---------|------|
| `SPRITE_URL` | 未配置（base64のみ） |
| `DOG_BARK_URL` | 未配置（base64のみ） |

> 注意: `main.png` / `title.png` は拡張子が `.png` だが実体はJPEGファイル。Viteビルド時にMIMEタイプ警告が出る可能性があるため、将来的にリネームを検討する。

---

## 2. アセット一覧

| No. | 定数名 | 用途 | 形式 | 解像度 | base64サイズ | ファイル |
|-----|--------|------|------|--------|-------------|---------|
| 1 | `SPRITE_URL` | キャラクタースプライトシート | PNG（透過） | 256×192px | ~105KB | 未配置 |
| 2 | `BG_URL` | タイトル画面メインビジュアル | JPEG | 1148×1064px | ~96KB | `assets/main.png` |
| 3 | `LOGO_URL` | タイトルロゴ | JPEG | 1568×560px | ~66KB | `assets/title.png` |
| 4 | `DOG_BARK_URL` | 犬噛みつき演出用 | PNG（透過） | 276×280px | ~84KB | 未配置 |

合計: **約352KB**（JSXの全469KBのうち75%）

---

## 3. スプライトシート（SPRITE_URL）

### 3-1. レイアウト

- 全体サイズ: **256×192 px**
- セルサイズ: **64×64 px**
- グリッド: **4列 × 3行**
- 1セルに1キャラクター

```
     col0    col1    col2    col3
    (x=0)  (x=64) (x=128) (x=192)
row0 ┌──────┬──────┬──────┬──────┐
(y=0)│ mike │ kuro │shiro │chatora│
row1 ├──────┼──────┼──────┼──────┤
(y=64)│hachi │scott │russ  │munch │
row2 ├──────┼──────┼──────┼──────┤
(y=128)│pers │beng  │ dog  │(空欄)│
     └──────┴──────┴──────┴──────┘
```

### 3-2. 座標マッピングテーブル

```javascript
const SPRITE_POS = {
  mike:     { x: 0,   y: 0   },
  kuro:     { x: 64,  y: 0   },
  shiro:    { x: 128, y: 0   },
  chatora:  { x: 192, y: 0   },
  hachi:    { x: 0,   y: 64  },
  scottish: { x: 64,  y: 64  },
  russian:  { x: 128, y: 64  },
  munchkin: { x: 192, y: 64  },
  persian:  { x: 0,   y: 128 },
  bengal:   { x: 64,  y: 128 },
  dog:      { x: 128, y: 128 },
};
```

### 3-3. Sprite コンポーネント

```javascript
function Sprite({ name, size = 64, style = {} }) {
  const pos = SPRITE_POS[name];
  if (!pos) return null;
  const scale = size / 64;
  return (
    <div style={{
      width: size, height: size,
      backgroundImage: `url(${SPRITE_URL})`,
      backgroundPosition: `-${pos.x * scale}px -${pos.y * scale}px`,
      backgroundSize: `${256 * scale}px ${192 * scale}px`,
      backgroundRepeat: "no-repeat",
      imageRendering: "auto",
      ...style,
    }} />
  );
}
```

使用箇所でのサイズ指定例:
- 盤面上の猫/犬表示: `size={32}`
- タイトル画面のお供選択: `size={48}`
- 図鑑: `size={56}`
- 出会い画面の登場: `size={96}`

---

## 4. メインビジュアル（BG_URL）

### 4-1. 仕様

| 項目 | 値 |
|------|-----|
| ファイル | `assets/main.png`（実体はJPEG） |
| 形式 | JPEG |
| 解像度 | 1148×1064px |
| 品質 | quality=75 |
| 表示方法 | `<img>` 要素、`object-fit: contain`、`max-height: 70vh` |

### 4-2. 描画内容（実物確認済み）

- 庭のシーン（芝生、白いフェンス、花壇、家の一部）
- 中央に三毛猫（大きめ、赤い首輪に肉球タグ）、左に黒猫、右上に茶トラ、右下にはちわれ
- 青空、光線、蝶々（黄・黄緑）
- 右上の猫からハート吹き出し
- 明るくウォームなアニメ調イラスト（目が大きいデフォルメ系）

### 4-3. タイトル画面での配置

```
position: absolute
top: 0, left: 50%, transform: translateX(-50%)
width: 100%, maxWidth: 600px
height: auto, maxHeight: 70vh
object-fit: contain, object-position: center top
z-index: 0 (UIの背後)
pointer-events: none
```

---

## 5. タイトルロゴ（LOGO_URL）

### 5-1. 仕様

| 項目 | 値 |
|------|-----|
| ファイル | `assets/title.png`（実体はJPEG） |
| 形式 | JPEG |
| 解像度 | 1568×560px |
| 表示サイズ | `width: min(68vw, 260px)` |
| 内容 | 「にゃんこレスキュー」のロゴタイプ |

### 5-2. デザイン詳細（実物確認済み）

- 文字: 「にゃんこレスキュー」をひらがな・カタカナで表記
- 配色（文字ごとに異なる）:
  - 「に」: オレンジ（肉球マーク入り）
  - 「ゃ」: 黄〜オレンジ
  - 「ん」: ピンク（猫耳が乗っている）
  - 「こ」: ピンク（猫のひげ付き）
  - 「レ」: 緑
  - 「ス」: 青
  - 「キ」: 黄
  - 「ュ」: ピンク
  - 「ー」: 緑（右端に肉球マーク＋ハート）
- 太い黒〜こげ茶のアウトライン＋白の内縁取り
- ブロック体でポップなゲームロゴ調フォント
- 背景: チェッカー柄（ファイル内に描かれた模様。実際の透過ではない）

---

## 6. 犬噛みつき画像（DOG_BARK_URL）

### 6-1. 仕様

| 項目 | 値 |
|------|-----|
| 形式 | PNG（透過） |
| 解像度 | 276×280px（元画像1254×1254pxからリサイズ） |
| 量子化 | 64色パレット + Floyd-Steinberg ディザリング |
| 表示サイズ | `width: min(80vw, 360px)` |

### 6-2. 描画内容

- 正面から吠えている犬のアップ
- 口を大きく開けて牙が見える
- 怒り眉、鋭い目（ただし怖すぎない）
- 左側に効果線（「ワン！」の表現）
- 透過背景（赤フラッシュと重ねるため）

### 6-3. 表示方法

```
position: absolute, top: 50%, left: 50%
transform: translate(-50%, -50%)
animation: dogZoom 1.1s cubic-bezier(0.2, 0.8, 0.3, 1) forwards
filter: drop-shadow(0 0 20px rgba(0,0,0,0.5))
```

---

## 7. キャラクターデザインガイドライン

### 7-1. 共通スタイル

| 項目 | 仕様 |
|------|------|
| テイスト | やさしい・あたたかみのあるイラスト調 |
| アウトライン | 太め（2〜3px相当）、黒 |
| 頭身 | デフォルメ強め（1.5〜2頭身） |
| 目 | 大きめ、丸い、光の点あり |
| ポーズ | おすわり（正面向き） |
| 配色 | パステル寄り、彩度やや抑えめ |

### 7-2. 各キャラクターの特徴

| キャラ | 体色 | 目の色 | 特徴 |
|--------|------|--------|------|
| mike（三毛） | 白地にオレンジ・黒 | 緑〜黄 | 定番の三毛柄、鈴付き首輪 |
| kuro（黒） | 全身黒 | 金色 | ツヤのある黒毛 |
| shiro（白） | 全身白 | ブルー | 真っ白な毛並み |
| chatora（茶トラ） | オレンジ縞 | 茶〜オレンジ | トラ柄がはっきり |
| hachi（はちわれ） | 白黒 | 茶 | 顔の中心で左右に分かれた白黒 |
| scottish（スコティッシュ） | グレー系 | 緑 | 折れ耳、丸顔 |
| russian（ロシアンブルー） | グレー | 緑 | スリムなグレーの毛 |
| munchkin（マンチカン） | クリーム＋茶 | 茶 | 短足、丸い体型 |
| persian（ペルシャ） | クリーム〜白 | ブルー | 長毛、ペチャ鼻 |
| bengal（ベンガル） | 黄〜茶にヒョウ柄 | 緑〜金 | ワイルドな柄 |
| dog（野良犬） | 黒＋ベージュ | 茶 | 小型犬、ちょっと困った顔 |

### 7-3. 犬の描き分け

- `dog`（通常）: おすわりポーズ、少し困った表情。スプライトシートに収録
- `dog_bark`（噛みつき）: 正面アップ、口を大きく開けて吠えている。別画像（DOG_BARK_URL）

---

## 8. 配色パレット

### 8-1. ゲーム全体の配色方針 (v2.2: パステル基調)

| 要素 | メインカラー | HEX | 備考 |
|------|-------------|-----|------|
| 猫関連 背景 | パステルグリーン | #a5d6a7 / #e8f5e9 | 縁取り #c8e6c9 |
| 猫関連 数字 | やや高彩度グリーン | #66bb6a | 視認性確保 |
| 犬関連 背景 | パステル赤 | #f48a8a / #ffe3e3 | 縁取り #f4b6b6 |
| 犬関連 数字 | やや高彩度レッド | #e57373 | 視認性確保 |
| UI文字（メイン） | ダークスレート | #37474f | - |
| UI文字（サブ） | スレートグレー | #78909c | - |
| UIベース（グラス） | 半透明白 | rgba(255,255,255,0.45)〜0.6 | backdrop-filter併用 |
| セルベース | クールホワイト | hi #fafbfd / lo #d6dde6 | ネオモーフィズム凸 |

### 8-2. スキルカラー

| スキル | カラー | HEX |
|--------|--------|-----|
| heal | ピンク | #ec407a |
| lucky | グリーン | #66bb6a |
| pawhit | ブルー | #42a5f5 |
| mark | パープル | #ab47bc |
| line | ティール | #26a69a |
| cross | オレンジ | #ffa726 |
| peek | バイオレット | #7e57c2 |
| foresee | インディゴ | #5c6bc0 |
| rush | ディープオレンジ | #ff7043 |
| barrier | グレー | #78909c |

### 8-3. ステージ背景色

| ステージ | 背景色 | HEX |
|---------|--------|-----|
| にわ | 薄緑 | #e8f5e9 |
| こうえん | 薄青 | #e3f2fd |
| しょうてんがい | 薄オレンジ | #fff3e0 |
| はいきょ | 薄茶 | #efebe9 |

### 8-4. 出会い画面の背景

```
linear-gradient(180deg,
  #ffcc80 0%,    // 夕暮れオレンジ
  #ff8a65 30%,   // 暖かいオレンジ
  #5c6bc0 70%,   // 藍色
  #283593 100%   // 深い紺
)
```

---

## 9. 透過処理アルゴリズム

### 9-1. 概要

元画像はRGB形式（白背景）で生成。Python flood-fill で背景のみ透過化し、キャラクター内部の白い毛は保持する。

### 9-2. パラメータ

| パラメータ | 値 | 説明 |
|----------|-----|------|
| threshold | 235 | RGB各チャネルがこの値以上なら「背景色候補」 |
| connectivity | 8-connected | 斜め方向も含めて接続判定 |
| flood fill開始点 | 4辺の全ピクセル | 画像の端から背景を検出 |

### 9-3. 処理フロー

```python
def remove_white_bg(img_rgb, threshold=235):
    1. RGB画像をnumpy配列に変換
    2. alpha チャンネル（全255）を追加
    3. 各ピクセルが「背景候補」か判定（RGB全て >= threshold）
    4. 画像の4辺からflood fill開始（BFS、8方向接続）
    5. flood fillで到達した「背景候補」のalphaを0（透明）に設定
    6. キャラ内部の白い領域には到達しない（輪郭線で遮断）
    return RGBA画像
```

### 9-4. 特殊ケースへの対応

| キャラ | 問題 | 対応 |
|--------|------|------|
| kuro（黒猫） | 背景に薄いグレー点描（236-251）が残る | threshold=235で8-connectedにより除去 |
| shiro（白猫） | 体が真っ白で背景と区別困難 | 輪郭線（黒）でflood fillが遮断されるため安全 |
| persian（ペルシャ） | 体色が(254,248,242)と非常に白い | 同上 |

### 9-5. 最適化

- スプライトシート: 64色パレット + Floyd-Steinberg ディザリング → PNG optimize
- 犬噛みつき画像: 64色パレット、280px最大
- メインビジュアル: JPEG quality=75
- ロゴ: PNG optimize

---

## 10. ファイル分離時の移行手順

### 10-1. base64 → 画像ファイル

```python
import base64
# JSXからbase64文字列を抽出
b64 = "iVBORw0KGgoAAAA..."
data = base64.b64decode(b64)
with open("sprites.png", "wb") as f:
    f.write(data)
```

### 10-2. Viteでのインポート

```javascript
// 配置済みファイル
import bgUrl from './assets/main.png';      // BG_URL（メインビジュアル）
import logoUrl from './assets/title.png';   // LOGO_URL（タイトルロゴ）

// 未配置（base64から分離後に追加）
// import spriteUrl from './assets/sprites.png';    // SPRITE_URL
// import dogBarkUrl from './assets/dog-bark.png';  // DOG_BARK_URL

// 使用
<img src={bgUrl} />
backgroundImage: `url(${spriteUrl})`
```

---

*本仕様書は現プログラム実装を正として記述。*
