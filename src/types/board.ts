import type { CatType } from "./cat";

export type CellType = "empty" | "dog" | "cat";

export type Cell = {
  type: CellType;
  revealed: boolean;
  flagged: boolean;
  catType: CatType | null;
  dogCount: number;
  catCount: number;
};

export type CreateBoardResult = {
  board: Cell[];
  hintIdx: number;
};
