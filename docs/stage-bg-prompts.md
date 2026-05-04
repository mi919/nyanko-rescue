# 🎨 ステージ背景 画像生成プロンプト集

**バージョン:** 1.0
**最終更新:** 2026/05/03
**関連:** `docs/stage-bg-spec.md`

外部画像生成AI（Midjourney / DALL-E 3 / Stable Diffusion / NovelAI など）で 4 ステージの背景を生成するためのプロンプト集。

> **TL;DR**: §3 から各ステージのプロンプトをコピペして使用。気に入らない場合は §6 のイテレーションガイドを参照。

---

## 1. 共通スタイルアンカー

すべてのステージで共通する「絵柄を揃える」ためのキーワード群。プロンプト先頭に置く。

### 1-1. 英語版（推奨：海外モデルに最適）

```
soft pastel anime illustration, painterly storybook style, gentle warm lighting,
muted saturation, soft hand-drawn outlines, vertical 2:3 composition,
empty calm center area, vignette with detail at top and bottom edges,
no characters, no animals, no people, no text, no signs with letters,
cohesive children's picture book aesthetic, dreamy atmospheric depth,
high quality, 4k, detailed background illustration
```

### 1-2. 日本語版（NovelAI / 国内モデル向け）

```
パステル調アニメイラスト、絵本風、やわらかい線画、ふんわり光、
低彩度、淡い配色、縦長2:3構図、中央は静かな余白、
上下の縁にディテール、キャラクター・動物・人物は描かない、
文字・看板の文字なし、童話的、夢のような奥行き、高画質
```

### 1-3. 共通ネガティブプロンプト

```
people, person, characters, cat, dog, bird, animals, faces, eyes,
text, letters, words, signage with readable text, watermark, signature,
photorealistic, 3D render, photo, low quality, blurry artifacts,
sharp central focus, dark center, heavy shadows in middle,
violence, scary, horror, blood, weapons, ghosts, skulls,
oversaturated, neon, cyberpunk, anime cliché, manga panels
```

---

## 2. プロンプト構造テンプレート

各ステージは以下の構造で記述する:

```
[共通スタイルアンカー §1-1] +
[ステージ固有のシーン記述] +
[時間帯・光の方向] +
[配色キーワード（HEX参考付き）] +
[構図のレイヤー指定（top/center/bottom）] +
[避けるべき要素を念押し]
```

### 2-1. アスペクト比指定

| ツール | パラメータ |
|--------|-----------|
| Midjourney | `--ar 2:3 --s 250 --v 6` |
| DALL-E 3 | "vertical 1024x1792" を明記 |
| Stable Diffusion (SDXL) | `width: 832, height: 1216` |
| NovelAI | `Aspect Ratio: Portrait` |

---

## 3. ステージ別プロンプト

### 3-1. にわ (stage_niwa.png)

#### Midjourney / DALL-E 3 (英語)

```
soft pastel anime illustration, painterly storybook style, gentle warm afternoon lighting,
muted saturation, soft hand-drawn outlines, vertical 2:3 composition,
empty calm center area, vignette with detail at top and bottom edges,

a peaceful Japanese suburban home garden in early afternoon,
top 20%: bright blue sky with fluffy white and pale-blue clouds, soft sunbeams,
middle 60%: open lawn of pastel green grass with very soft out-of-focus flower beds,
faint pink and yellow blooms in the distance, mostly empty calm space,
bottom 20%: wooden engawa veranda planks on the lower edge, small terracotta plant pots,
stepping stones, tiny clovers, a low wooden fence partially visible at the corners,

color palette: sky #bbdefb #e3f2fd, grass #a5d6a7 #c8e6c9 #dcedc8,
flowers #f8bbd0 #fff59d #ffccbc, wood #d7ccc8 #bcaaa4,
shadows pale lavender #c5cae9 (never pure black),

no animals, no characters, no people, no text, no signage,
center area must be soft and empty for UI overlay, no high-contrast objects in middle,

mood: serene, hopeful, the very first stage, like a sunny afternoon nap setting,
high quality, detailed soft illustration --ar 2:3 --s 250 --v 6
```

#### NovelAI / 日本語版

```
{パステル調アニメイラスト}, {絵本風}, やわらかい線画, ふんわり光, 低彩度,
縦長2:3構図, 中央は静かな余白,

平和な日本の郊外の家の庭, 春の昼下がり,
画面上20%: 明るい青空にふわふわ白雲と淡い水色雲, やわらかな光線,
画面中央60%: パステルグリーンの芝生, 淡くぼかしたピンクと黄色の花壇 (遠景),
中央は静かで開けた空間,
画面下20%: 木の縁側の板, 小さな素焼きの植木鉢, 飛び石, シロツメクサ,
角に低い木の柵がちらり,

配色: 空 #bbdefb #e3f2fd, 芝生 #a5d6a7 #c8e6c9, 花 #f8bbd0 #fff59d,
木材 #d7ccc8, 影は薄紫 #c5cae9 (黒影は使わない),

[除外: 動物, 人物, 文字, 看板, 中央の濃い影, 黒],

雰囲気: 穏やか, 希望, 第1ステージ, 日向ぼっこ, 春の昼下がり,
masterpiece, best quality, ultra-detailed
```

---

### 3-2. こうえん (stage_kouen.png)

#### Midjourney / DALL-E 3 (英語)

```
soft pastel anime illustration, painterly storybook style, gentle golden-hour lighting,
muted saturation, soft hand-drawn outlines, vertical 2:3 composition,
empty calm center area, vignette with detail at top and bottom edges,

a wide city park in late afternoon just before sunset,
top 25%: gradient sky from soft sky-blue to gentle peach-orange,
distant fluffy clouds catching warm light, a tiny silhouette of an airplane far away,
middle 50%: blurred soft-focus lawn and a curving paved path, distant park benches
and lampposts as soft silhouettes on far edges, mostly empty calm space,
bottom 25%: a large stylized park entrance arch, big tree silhouettes
in the lower-left and lower-right corners, a quiet fountain to one side,
a single ball resting near the edge,

color palette: sky gradient #b3e5fc to #ffe0b2, grass #c5e1a5 #aed581,
tree silhouettes #689f38 (low saturation), pavement #cfd8dc #b0bec5,
benches #a1887f #d7ccc8, shadows pale violet #b39ddb (never black),

no people, no children, no animals, no text on signs, no readable lettering,
center must remain soft and uncluttered, lampposts only at far edges, no central glow,

mood: returning-home calmness, warm anticipation, second stage openness,
high quality, painterly background illustration --ar 2:3 --s 250 --v 6
```

#### NovelAI / 日本語版

```
{パステル調アニメイラスト}, {絵本風}, やわらかい線画, 黄金時間の光, 低彩度,
縦長2:3構図, 中央は静かな余白,

街中の広い公園, 夕焼け前のひととき,
画面上25%: 薄水色から淡いオレンジへのグラデーション空, 暖かい光を受けた雲,
遠くにシルエットの飛行機,
画面中央50%: ぼかし強めの芝生と曲がる舗装路, 遠景にベンチや街灯のシルエット,
中央は開けた静かな空間,
画面下25%: スタイライズされた公園入口のアーチ, 左下と右下に大きな木のシルエット,
小さな噴水, 端に転がるボール,

配色: 空 #b3e5fc → #ffe0b2 グラデ, 芝生 #c5e1a5 #aed581,
木のシルエット #689f38 (彩度低め), 舗装 #cfd8dc, ベンチ #a1887f,
影は薄紫 #b39ddb (黒は使わない),

[除外: 人物, 子供, 動物, 文字, 看板の文字, 中央のまぶしい光],

雰囲気: 帰り道, 甘い予感, 第2ステージらしい開放感,
masterpiece, best quality, ultra-detailed
```

---

### 3-3. しょうてんがい (stage_shouten.png)

#### Midjourney / DALL-E 3 (英語)

```
soft pastel anime illustration, painterly storybook style, dusk twilight lighting,
muted saturation, soft hand-drawn outlines, vertical 2:3 composition,
empty calm center area, vignette with detail at top and bottom edges,

an old Showa-era Japanese shopping street arcade at dusk
when paper lanterns are just starting to glow,
top 30%: a covered arcade ceiling with rows of hanging signs reduced to abstract
colored shapes (NO READABLE TEXT, just colorful blocks suggesting signage),
strings of small warm lanterns dotting the upper edge,
middle 40%: receding asphalt street with gentle one-point perspective,
soft warm dusk light, mostly empty calm space, no people,
bottom 30%: silhouettes of small shop entrances on left and right
(suggesting greengrocer, fishmonger, antique shop), stacked cardboard boxes,
a vintage vending machine in one corner,

color palette: sky gradient #ffccbc to #b39ddb (sunset to twilight),
sign blocks #ffab91 #ffe082 #f06292 (abstract color, no letters),
arcade structure #8d6e63 #a1887f, lanterns warm dots #ff8a65,
road #cfd8dc, shadows muted purple #7e57c2 (never black),

absolutely no readable text, no kanji, no hiragana, no logos, no brands,
no people, no crowds, no animals, lanterns only at edges not center,

mood: warm nostalgic dusk, slightly tense third stage atmosphere,
high quality, painterly --ar 2:3 --s 250 --v 6
```

#### NovelAI / 日本語版

```
{パステル調アニメイラスト}, {絵本風}, やわらかい線画, 夕暮れの光, 低彩度,
縦長2:3構図, 中央は静かな余白,

昭和レトロな商店街アーケード, 黄昏時, 提灯が灯り始める時間,
画面上30%: アーケードの屋根と看板の連なり (文字は描かず色ブロックで示す),
小さな暖色の提灯が連なる,
画面中央40%: 一点透視の遠ざかるアスファルト道路, 夕日のやわらかい光,
中央は静かで開けた空間, 人物なし,
画面下30%: 左右に小さな商店の入口のシルエット (八百屋・魚屋・古道具屋を示唆),
段ボール箱の山, レトロな自動販売機,

配色: 空 #ffccbc → #b39ddb のグラデ (夕焼け→たそがれ),
看板ブロック #ffab91 #ffe082 #f06292 (抽象的な色, 文字なし),
アーケード #8d6e63 #a1887f, 提灯 #ff8a65 (小さな点として),
道路 #cfd8dc, 影は薄紫 #7e57c2 (黒は使わない),

[除外: 読める文字, 漢字, ひらがな, ロゴ, ブランド名,
人物, 群衆, 動物, 中央の提灯密集],

雰囲気: 暖かいノスタルジア, 第3ステージのやや緊張感,
masterpiece, best quality, ultra-detailed
```

---

### 3-4. はいきょ (stage_haikyo.png)

#### Midjourney / DALL-E 3 (英語)

```
soft pastel anime illustration, painterly storybook style, gentle moonlit night,
muted saturation, soft hand-drawn outlines, vertical 2:3 composition,
empty calm center area, vignette with detail at top and bottom edges,

interior of an abandoned building at night under soft moonlight,
NEVER spooky, NEVER horror, peaceful nostalgic ruins,
top 25%: collapsed ceiling opening showing a dreamy indigo night sky
with a glowing pale yellow moon and scattered stars,
soft moonbeams streaming down,
middle 50%: faded soft floor with gentle moonlight gradient,
out-of-focus debris in the distance, mostly empty calm space,
bottom 25%: fallen wooden furniture as soft silhouettes, climbing vines and grass
sprouting from the floor, a broken window frame, a half-open door silhouette,

color palette: sky and moon #5c6bc0 #9fa8da #fff59d (moon),
walls #8d6e63 #a1887f (warm browns), floor #6d4c41 #d7ccc8 (lit areas),
plants #689f38 (low saturation), debris #78909c,
shadows deep indigo #283593 (NEVER pure black),

absolutely no horror elements, no ghosts, no skulls, no blood, no weapons,
no broken glass shards in foreground, no frightening shadows,
no people, no animals, the scene is calm and beautiful, like a moonlit memory,
center area must stay soft and readable for UI overlay,

mood: quiet moonlit beauty, nostalgic finale, the calm achievement of the last stage,
high quality, painterly background illustration --ar 2:3 --s 250 --v 6
```

#### NovelAI / 日本語版

```
{パステル調アニメイラスト}, {絵本風}, やわらかい線画, 月明かり, 低彩度,
縦長2:3構図, 中央は静かな余白,

打ち捨てられた建物の内部, 夜, やわらかな月光,
怖くない, ホラー要素なし, 穏やかでノスタルジックな廃墟,
画面上25%: 崩れた天井から見える夢のような藍色の夜空,
淡い黄色の月と星々, 月光が差し込む,
画面中央50%: ぼかしたやわらかな床, 月光のグラデーション,
遠景にぼやけたガラクタ, 中央は開けた静かな空間,
画面下25%: 倒れた木製家具のシルエット, 床から伸びる蔓草,
割れた窓枠, 半開きの扉のシルエット,

配色: 空と月 #5c6bc0 #9fa8da #fff59d (月),
壁 #8d6e63 #a1887f (暖かい茶), 床 #6d4c41 #d7ccc8 (光が当たる部分),
植物 #689f38 (彩度低), ガラクタ #78909c,
影は深い藍 #283593 (純粋な黒は使わない),

[除外: ホラー, 幽霊, 骸骨, 血, 武器, 怖い影, 鋭いガラス破片,
人物, 動物],

雰囲気: 静かな月夜の美しさ, 最終ステージにふさわしい達成感,
masterpiece, best quality, ultra-detailed
```

---

## 4. ツール別の調整ヒント

### 4-1. Midjourney v6

- パラメータ: `--ar 2:3 --s 250 --v 6 --style raw`
- `--style raw` は写実寄りになるので、絵本調なら外す
- `--chaos 5` で多様性を出してから良いものを選ぶ
- `--no people, animals, text` で除外を強化

### 4-2. DALL-E 3 (ChatGPT経由)

- 1024×1792 を明記
- 「絶対に動物を描かない」と日本語で念押しが効く
- 文字を消したい時: "absolutely no Japanese text, no kanji, no hiragana, no katakana, no readable characters"
- 1回で完璧は出にくいので、出力を見せて「中央の◯◯を消して」と追加指示

### 4-3. Stable Diffusion XL

- 推奨モデル: `dreamshaperXL` `animagineXL` `pony Diffusion XL` (絵本風)
- LoRA: `pastel_painting` `studio_ghibli` 系を 0.6〜0.8 で適用
- Sampler: DPM++ 2M Karras, 30 steps, CFG 7
- Hires fix: 2x で 1664×2432px まで上げて detail を補強

### 4-4. NovelAI

- Model: NAI Diffusion v3
- Quality tags: `{best quality}, {masterpiece}, {ultra-detailed}`
- 強調記法 `{...}` `[...]` で重み調整
- Undesired Content Preset: `Heavy`

---

## 5. 生成後のチェックリスト

`docs/stage-bg-spec.md` §10 に従って各画像をチェック:

- [ ] 解像度 1200×1800 以上、ファイルサイズ ≤ 350KB（圧縮後）
- [ ] 中央 50% 領域に細かいディテール・濃い影が**ない**
- [ ] パステル基調、彩度抑制
- [ ] 動物（猫・犬・鳥）が**写っていない**（特に中央）
- [ ] 看板に**実在する文字**が含まれていない（しょうてんがい注意）
- [ ] 暴力・怖さを煽る要素なし（はいきょ注意）
- [ ] iPhone Safari で UI（数字・スプライト）が読める
- [ ] glass パネル越しに背景の色味が美しく見える
- [ ] フォールバック単色（`STAGES[].bg`）と統一感がある

---

## 6. イテレーションガイド

### 6-1. よくある問題と対処

| 問題 | 対処キーワード追加 |
|------|------------------|
| 中央に濃い色が出る | `empty soft center, calm middle area, no central focus` |
| 動物が出てしまう | `absolutely no animals, no cats, no dogs, no birds, empty scenery` |
| 文字が描かれる（しょうてんがい） | `no kanji, no hiragana, no readable characters, abstract color shapes only` |
| 怖い雰囲気になる（はいきょ） | `peaceful, nostalgic, never scary, dreamy, beautiful moonlight, like a children's book` |
| 彩度が高すぎる | `muted colors, desaturated, soft pastel, low saturation, faded` |
| 写真っぽくなる | `painterly, hand-drawn, illustration, picture book, watercolor texture` |
| 線が硬い | `soft outlines, gentle lines, fuzzy edges, no harsh lines` |
| 細かすぎる | `simplified shapes, large soft forms, atmospheric, blurred details` |

### 6-2. 部分修正（DALL-E 3 の inpaint, Photoshop generative fill 等）

生成後にこれだけは自前で消す/調整するのが確実:

1. **中央付近の濃い影** → ペイントツールで明るく
2. **微妙に残った文字や看板の文字** → スポット修復
3. **想定外の動物** → 消去
4. **過度なコントラスト** → トーンカーブで中域を持ち上げる

---

## 7. プロンプト管理

- 採用したプロンプトは `assets/stages/<key>.prompt.txt` として保存（バージョン管理用）
- 再生成時に過去のプロンプトを参考にできる
- AIモデル・パラメータも併記する

```
src/assets/stages/
├── stage_niwa.png
├── stage_niwa.prompt.txt   ← 使ったプロンプトと生成パラメータ
├── stage_kouen.png
├── stage_kouen.prompt.txt
├── stage_shouten.png
├── stage_shouten.prompt.txt
├── stage_haikyo.png
└── stage_haikyo.prompt.txt
```

---

*プロンプトは外部AIの仕様変更で挙動が変わる可能性あり。生成結果が大きくずれる場合は §6 を参照しつつ調整する。*
