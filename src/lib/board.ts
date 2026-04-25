import { CAT_TYPES, STAGE_RARITY_WEIGHTS } from "../constants/cats";
import type { CatType } from "../types/cat";
import type { Cell, CreateBoardResult } from "../types/board";

export function pickWeightedCat(stageIdx: number): CatType {
  const weights = STAGE_RARITY_WEIGHTS[stageIdx] || STAGE_RARITY_WEIGHTS[0];
  const pool = CAT_TYPES.map(c => ({ cat: c, w: weights[c.rarity - 1] || 0 })).filter(x => x.w > 0);
  const total = pool.reduce((s, x) => s + x.w, 0);
  let r = Math.random() * total;
  for (const x of pool) { r -= x.w; if (r <= 0) return x.cat; }
  return pool[0].cat;
}

export function createBoard(
  rows: number,
  cols: number,
  dogs: number,
  cats: number,
  stageIdx: number = 0
): CreateBoardResult {
  const total = rows * cols;
  const board: Cell[] = Array.from({ length: total }, () => ({
    type: "empty", revealed: false, flagged: false, catType: null, dogCount: 0, catCount: 0,
  }));
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < dogs; i++) board[indices[i]].type = "dog";
  for (let i = dogs; i < dogs + cats; i++) {
    board[indices[i]].type = "cat";
    board[indices[i]].catType = pickWeightedCat(stageIdx);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let dc = 0, cc = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc2 = -1; dc2 <= 1; dc2++) {
          if (dr === 0 && dc2 === 0) continue;
          const nr = r + dr, nc = c + dc2;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const ni = nr * cols + nc;
            if (board[ni].type === "dog") dc++;
            if (board[ni].type === "cat") cc++;
          }
        }
      }
      board[r * cols + c].dogCount = dc;
      board[r * cols + c].catCount = cc;
    }
  }
  // Find a "green-number-only" tile (no dogs nearby, has cats nearby)
  // to use as a starting hint - but DO NOT reveal it here, return the index
  const greenHintCandidates: number[] = [];
  for (let i = 0; i < total; i++) {
    if (board[i].type === "empty" && board[i].dogCount === 0 && board[i].catCount > 0) {
      greenHintCandidates.push(i);
    }
  }
  const hintIdx = greenHintCandidates.length > 0
    ? greenHintCandidates[Math.floor(Math.random() * greenHintCandidates.length)]
    : -1;
  return { board, hintIdx };
}

export function floodFill(board: Cell[], rows: number, cols: number, startIdx: number): Cell[] {
  const queue: number[] = [startIdx];
  const visited = new Set<number>();
  while (queue.length > 0) {
    const idx = queue.shift()!;
    if (visited.has(idx)) continue;
    visited.add(idx);
    board[idx].revealed = true;
    board[idx].flagged = false;
    if (board[idx].dogCount === 0 && board[idx].catCount === 0 && board[idx].type === "empty") {
      const r = Math.floor(idx / cols), c = idx % cols;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const ni = nr * cols + nc;
            if (!visited.has(ni) && board[ni].type !== "dog") queue.push(ni);
          }
        }
      }
    }
  }
  return board;
}
