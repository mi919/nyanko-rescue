# 🐱 にゃんこレスキュー 盤面アルゴリズム仕様書

**バージョン:** 2.1
**最終更新:** 2026/04/19

---

## 1. 概要

本書はゲーム盤面の生成・操作に関わるアルゴリズムを定義する。対象は `createBoard`（盤面生成）、`floodFill`（連鎖オープン）、`pickWeightedCat`（猫タイプ抽選）、およびヒントマス選出ロジック。

---

## 2. 盤面データ構造

### 2-1. セルオブジェクト

各マスは以下のプロパティを持つオブジェクト。

```javascript
{
  type: "empty" | "dog" | "cat",  // マスの種類
  revealed: false,                 // 開封済みか
  flagged: false,                  // フラグが立っているか
  catType: null | CatTypeObject,   // type==="cat" のとき猫の種類情報
  dogCount: 0,                     // 周囲8マスの犬の数（0〜8）
  catCount: 0,                     // 周囲8マスの猫の数（0〜8）
}
```

### 2-2. 盤面配列

盤面は1次元配列（`board[]`）で管理される。行列変換は以下の通り。

```
インデックス → 座標: row = Math.floor(idx / cols), col = idx % cols
座標 → インデックス: idx = row * cols + col
```

### 2-3. 周囲8マスの走査

```
[-1,-1] [-1, 0] [-1,+1]
[ 0,-1] [中心 ] [ 0,+1]
[+1,-1] [+1, 0] [+1,+1]
```

盤面端のチェック: `0 <= nr < rows && 0 <= nc < cols`

---

## 3. 盤面生成: createBoard

### 3-1. 関数シグネチャ

```javascript
function createBoard(rows, cols, dogs, cats, stageIdx = 0)
// 戻り値: { board: Cell[], hintIdx: number }
```

### 3-2. アルゴリズム

**Step 1: 空盤面の初期化**

```
board = Array(rows × cols) の各要素を {
  type: "empty", revealed: false, flagged: false,
  catType: null, dogCount: 0, catCount: 0
} で初期化
```

**Step 2: マスのランダム配置（Fisher-Yates シャッフル）**

```
indices = [0, 1, 2, ..., total-1]
for i = total-1 downto 1:
    j = random(0, i)
    swap(indices[i], indices[j])
```

- `indices[0]` 〜 `indices[dogs-1]` → 犬マス（`type = "dog"`）
- `indices[dogs]` 〜 `indices[dogs+cats-1]` → 猫マス（`type = "cat"`）
- 残り → 空マス（`type = "empty"` のまま）

**Step 3: 猫タイプの割り当て**

各猫マスに `pickWeightedCat(stageIdx)` で猫タイプを設定。
同じステージ内で同種の猫が複数出現することがある（重複許可）。

**Step 4: 周囲カウンターの計算**

全マスについて周囲8マスを走査し、犬の数（`dogCount`）と猫の数（`catCount`）を集計。

```
for each cell at (r, c):
    dogCount = 0, catCount = 0
    for each neighbor (nr, nc) in 8 directions:
        if inBounds(nr, nc):
            if board[nr*cols+nc].type === "dog": dogCount++
            if board[nr*cols+nc].type === "cat": catCount++
    board[r*cols+c].dogCount = dogCount
    board[r*cols+c].catCount = catCount
```

**Step 5: ヒントマスの選出**

```
candidates = 全マスのうち以下を満たすもの:
  - type === "empty"（犬でも猫でもない）
  - dogCount === 0（周囲に犬なし）
  - catCount > 0（周囲に猫あり）

hintIdx = candidates からランダムに1つ選出
         candidates が空なら hintIdx = -1（ヒントなし）
```

ヒントマスの設計意図：プレイヤーが最初の一手で安全かつ猫に近い場所から始められるよう誘導する。

### 3-3. 周回による犬数の加算

`initStage` 内で `createBoard` を呼ぶ前に犬数を補正する。

```javascript
const extra = lapCountRef.current; // 周回数（0始まり）
const maxDogs = Math.floor(rows * cols * 0.3); // 盤面の30%が上限
const effectiveDogs = Math.min(baseDogs + extra, maxDogs);
```

| 周回 | にわの犬数 | はいきょの犬数 | はいきょ犬密度 |
|------|----------|-------------|-------------|
| 1周目 | 6 | 15 | 15.0% |
| 2周目 | 7 | 16 | 16.0% |
| 3周目 | 8 | 17 | 17.0% |
| 5周目 | 10 | 19 | 19.0% |
| 10周目 | 15 | 24 | 24.0% |
| 16周目〜 | 19 (上限) | 30 (上限) | 30.0% |

---

## 4. フラッドフィル: floodFill

### 4-1. 関数シグネチャ

```javascript
function floodFill(board, rows, cols, startIdx)
// board を直接変更（破壊的操作）
// 戻り値: board（変更後の参照）
```

### 4-2. アルゴリズム（BFS）

```
queue = [startIdx]
visited = Set()

while queue is not empty:
    idx = queue.dequeue()
    if idx in visited: continue
    visited.add(idx)

    board[idx].revealed = true
    board[idx].flagged = false  // フラグは自動解除

    // 伝播条件: 犬カウントも猫カウントも0で、空マスである
    if board[idx].dogCount === 0 AND
       board[idx].catCount === 0 AND
       board[idx].type === "empty":

        for each neighbor (nr, nc) in 8 directions:
            if inBounds(nr, nc):
                ni = nr * cols + nc
                // 犬マスには伝播しない（猫マスには伝播する）
                if ni not in visited AND board[ni].type !== "dog":
                    queue.enqueue(ni)
```

### 4-3. 伝播ルールの詳細

| 現在のマス | 条件 | 動作 |
|-----------|------|------|
| 空マス、犬0猫0 | 周囲に危険なし | 開封 + 隣接マスへ伝播 |
| 空マス、犬>0 or 猫>0 | 数字マス | 開封するが伝播しない |
| 猫マス | 猫が隣接 | 開封するが伝播しない（保護処理は別途） |
| 犬マス | 危険 | 伝播先に含めない（キューに入れない） |

### 4-4. エッジケース

- フラグが立っているマスに到達した場合: フラグを自動解除して開封する
- 開始マスが数字マス（dogCount > 0 or catCount > 0）の場合: そのマスだけ開封して終了（伝播なし）

---

## 5. 猫タイプ抽選: pickWeightedCat

### 5-1. 関数シグネチャ

```javascript
function pickWeightedCat(stageIdx)
// 戻り値: CatTypeObject（CAT_TYPESの要素）
```

### 5-2. アルゴリズム（加重ランダム選択）

```
weights = STAGE_RARITY_WEIGHTS[stageIdx]
// 例: はいきょ → [50, 30, 15, 5]

pool = CAT_TYPESの各猫について:
    weight = weights[cat.rarity - 1]
    weightが0より大きいものだけ残す

total = pool の weight 合計

r = random(0, total)
for each entry in pool:
    r -= entry.weight
    if r <= 0: return entry.cat

// フォールバック（通常到達しない）
return pool[0].cat
```

### 5-3. 具体的な計算例

**はいきょステージ（weights = [50, 30, 15, 5]）:**

| レアリティ | 猫 | weight | 数 | 合算weight |
|----------|-----|--------|---|-----------|
| ★1 | ちゃとら, はちわれ, みけ | 各50 | 3 | 150 |
| ★2 | マンチカン, スコティッシュ, くろ | 各30 | 3 | 90 |
| ★3 | ロシアン, ペルシャ | 各15 | 2 | 30 |
| ★4 | しろ, ベンガル | 各5 | 2 | 10 |

合計 = 280

- ★1の猫が出る確率: 150/280 = **53.6%**
- ★2の猫が出る確率: 90/280 = **32.1%**
- ★3の猫が出る確率: 30/280 = **10.7%**
- ★4の猫が出る確率: 10/280 = **3.6%**

各レアリティ内では等確率（例: ★1内でちゃとら/はちわれ/みけが各50/280 = 17.9%）。

**にわステージ（weights = [100, 0, 0, 0]）:**

★1の猫のみ出現。ちゃとら/はちわれ/みけの各33.3%。

---

## 6. ヒント表示のタイミング

### 6-1. ヒントのフェーズ遷移

```
ステージ開始
  ↓
"converge": パーティクルがヒントマスに収束（0〜500ms）
  ↓
"flash": マスを開封しフラッシュ表示（500〜575ms）
  ↓
"badge": 数字バッジ表示（575〜750ms）
  ↓
"done": 通常操作開始
```

合計 **750ms** で完了。

### 6-2. スキップ

プレイヤーがヒント演出中にどこかをタップすると `skipHint()` が呼ばれ、即座に `hintPhase = "done"` に遷移してヒントマスを開封する。

### 6-3. ヒントマスがない場合

`hintIdx === -1` のとき、ヒント演出をスキップして即座に `hintPhase = "done"` に設定。

---

## 7. ゲージ蓄積とフラッドフィルの関係

フラッドフィルで複数マスが連鎖的に開く場合、ゲージは以下のように加算される。

```javascript
const revealedCount = newBoard.filter(c => c.revealed).length
                    - board.filter(c => c.revealed).length;
const gain = 5 + Math.max(0, revealedCount - 1);
// 最初の1マス: +5
// 連鎖で追加開封されたマス: +1/マス
setSkillGauge(g => Math.min(100, g + gain));
```

例: 1マス開封で12マスが連鎖的に開いた場合 → +5 + 11 = +16ゲージ

---

*本仕様書は現プログラム実装を正として記述。*
