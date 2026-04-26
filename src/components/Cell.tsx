import { useRef, type MouseEvent } from "react";
import { Sprite } from "./Sprite";
import { cellSize } from "../constants/theme";
import type { Cell as CellData } from "../types/board";

type CellProps = {
  cell: CellData;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onRightClick: () => void;
  gameOver: boolean;
  peeking: boolean;
  marked: boolean;
  foreseeing: boolean;
  foreseePreview: boolean;
  crossTarget: boolean;
};

// Static layout shared across every cell variant.
const cellBase = "flex items-center justify-center rounded-md border-2";
const cellInteractive = "cursor-pointer select-none transition-transform";

export function Cell({ cell, onClick, onRightClick, gameOver, peeking, marked, foreseeing, foreseePreview, crossTarget }: CellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handleContext = (e: MouseEvent<HTMLDivElement>) => { e.preventDefault(); onRightClick(); };

  if (!cell.revealed && !gameOver) {
    const showPeek = peeking && cell.type === "dog";
    const showMark = marked && cell.type === "cat" && !cell.revealed;
    const showForesee = foreseeing && !cell.flagged;
    const showCross = crossTarget && !cell.flagged;
    const isPreview = foreseePreview;
    const previewIcon = isPreview
      ? (cell.type === "dog" ? "🐕" : cell.type === "cat" ? "🐱" : `${cell.dogCount}/${cell.catCount}`)
      : null;
    return (
      <div
        ref={ref}
        onClick={onClick}
        onContextMenu={handleContext}
        className={`${cellBase} ${cellInteractive} border-transparent`}
        style={{
          width: cellSize, height: cellSize,
          background: isPreview
            ? "linear-gradient(145deg, #b39ddb, #7e57c2)"
            : showPeek
              ? "linear-gradient(145deg, #ef5350, #c62828)"
              : showMark
                ? "linear-gradient(145deg, #81c784, #43a047)"
                : showForesee
                  ? "linear-gradient(145deg, #ce93d8, #ab47bc)"
                  : showCross
                    ? "linear-gradient(145deg, #ffb74d, #fb8c00)"
                    : cell.flagged ? "#fff9c4" : "linear-gradient(145deg, #b0bec5, #90a4ae)",
          borderColor: isPreview ? "#4527a0"
            : showPeek ? "#b71c1c"
            : showMark ? "#2e7d32"
            : showForesee ? "#6a1b9a"
            : showCross ? "#e65100"
            : "#78909c",
          fontSize: isPreview && cell.type === "empty" ? 10 : 18,
          fontWeight: isPreview ? 800 : "normal",
          color: isPreview ? "#fff" : undefined,
          boxShadow: isPreview
            ? "inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 16px rgba(126,87,194,1)"
            : showPeek
              ? "inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 12px rgba(229,57,53,0.7)"
              : showMark
                ? "inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 12px rgba(67,160,71,0.8)"
                : showForesee
                  ? "inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 10px rgba(171,71,188,0.6)"
                  : showCross
                    ? "inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 10px rgba(251,140,0,0.7)"
                    : "inset 1px 1px 2px rgba(255,255,255,0.4), 2px 2px 4px rgba(0,0,0,0.15)",
          animation: isPreview
            ? "markPulse 0.8s ease-in-out infinite"
            : showPeek
              ? "peekPulse 1s ease-in-out infinite"
              : showMark ? "markPulse 1s ease-in-out infinite"
              : showForesee ? "peekPulse 1.2s ease-in-out infinite"
              : showCross ? "crossPulse 1s ease-in-out infinite"
              : "none",
        }}
        onMouseDown={() => ref.current && (ref.current.style.transform = "scale(0.92)")}
        onMouseUp={() => ref.current && (ref.current.style.transform = "scale(1)")}
        onMouseLeave={() => ref.current && (ref.current.style.transform = "scale(1)")}
      >
        {isPreview ? previewIcon
          : showPeek ? "🐕"
          : showMark ? "🎯"
          : showForesee ? "🔮"
          : showCross ? "✨"
          : (cell.flagged ? "🚩" : "")}
      </div>
    );
  }

  if (cell.type === "dog") {
    return (
      <div
        className={`${cellBase} bg-[#ffcdd2] border-[#e57373]`}
        style={{ width: cellSize, height: cellSize }}
      >
        <Sprite name="dog" size={32} />
      </div>
    );
  }

  if (cell.type === "cat") {
    return (
      <div
        className={`${cellBase} bg-[#c8e6c9] border-[#81c784]`}
        style={{
          width: cellSize, height: cellSize,
          animation: cell.revealed ? "pop 0.3s ease-out" : undefined,
        }}
      >
        <Sprite name={cell.catType?.key || "mike"} size={32} />
      </div>
    );
  }

  const hasDog = cell.dogCount > 0;
  const hasCat = cell.catCount > 0;
  return (
    <div
      className={`${cellBase} bg-[#eceff1] border-[#cfd8dc] gap-0.5 text-[13px] font-extrabold`}
      style={{ width: cellSize, height: cellSize }}
    >
      {hasDog && <span className="text-[#e53935]">{cell.dogCount}</span>}
      {hasDog && hasCat && <span className="text-[#aaa]">/</span>}
      {hasCat && <span className="text-[#43a047]">{cell.catCount}</span>}
    </div>
  );
}
