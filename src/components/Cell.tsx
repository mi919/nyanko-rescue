import { useRef, useState, type MouseEvent } from "react";
import { Sprite } from "./Sprite";
import { cellSize, palette } from "../constants/theme";
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

const cellBase = "relative flex items-center justify-center rounded-md overflow-hidden";
const cellInteractive = "cursor-pointer select-none";

const NEU_REST_SHADOW =
  "6px 6px 12px rgba(176,190,197,0.45), -4px -4px 10px rgba(255,255,255,0.85), inset 1px 1px 2px rgba(255,255,255,0.6)";
const NEU_PRESSED_SHADOW =
  "inset 4px 4px 8px rgba(120,144,156,0.35), inset -2px -2px 6px rgba(255,255,255,0.6)";

export function Cell({ cell, onClick, onRightClick, gameOver, peeking, marked, foreseeing, foreseePreview, crossTarget }: CellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleContext = (e: MouseEvent<HTMLDivElement>) => { e.preventDefault(); onRightClick(); };

  const spawnRipple = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 500);
  };

  if (!cell.revealed && !gameOver) {
    const showPeek = peeking && cell.type === "dog";
    const showMark = marked && cell.type === "cat" && !cell.revealed;
    const showForesee = foreseeing && !cell.flagged;
    const showCross = crossTarget && !cell.flagged;
    const isPreview = foreseePreview;
    const previewIcon = isPreview
      ? (cell.type === "dog" ? "🐕" : cell.type === "cat" ? "🐱" : `${cell.dogCount}/${cell.catCount}`)
      : null;

    let background: string;
    let shadow: string;
    let borderColor = "transparent";
    let animation = "none";

    if (isPreview) {
      background = "linear-gradient(145deg, #d1c4e9, #b39ddb)";
      shadow = "inset 1px 1px 2px rgba(255,255,255,0.5), 0 0 16px rgba(149,117,205,0.7)";
      borderColor = "#9575cd";
      animation = "markPulse 0.8s ease-in-out infinite";
    } else if (showPeek) {
      background = "linear-gradient(145deg, #ffcdd2, #ef9a9a)";
      shadow = "inset 1px 1px 2px rgba(255,255,255,0.5), 0 0 12px rgba(239,154,154,0.85)";
      borderColor = "#e57373";
      animation = "peekPulse 1s ease-in-out infinite";
    } else if (showMark) {
      background = "linear-gradient(145deg, #c8e6c9, #a5d6a7)";
      shadow = "inset 1px 1px 2px rgba(255,255,255,0.5), 0 0 12px rgba(165,214,167,0.95)";
      borderColor = "#81c784";
      animation = "markPulse 1s ease-in-out infinite";
    } else if (showForesee) {
      background = "linear-gradient(145deg, #e1bee7, #ce93d8)";
      shadow = "inset 1px 1px 2px rgba(255,255,255,0.5), 0 0 10px rgba(206,147,216,0.7)";
      borderColor = "#ba68c8";
      animation = "peekPulse 1.2s ease-in-out infinite";
    } else if (showCross) {
      background = "linear-gradient(145deg, #ffe0b2, #ffcc80)";
      shadow = "inset 1px 1px 2px rgba(255,255,255,0.5), 0 0 10px rgba(255,204,128,0.85)";
      borderColor = "#ffb74d";
      animation = "crossPulse 1s ease-in-out infinite";
    } else if (cell.flagged) {
      background = "linear-gradient(145deg, #fff9c4, #fff59d)";
      shadow = "inset 2px 2px 4px rgba(255,255,255,0.6), 2px 2px 6px rgba(255,213,79,0.45)";
      borderColor = "transparent";
    } else {
      background = `linear-gradient(145deg, ${palette.cellBaseHi}, ${palette.cellBaseLo})`;
      shadow = pressed ? NEU_PRESSED_SHADOW : NEU_REST_SHADOW;
    }

    return (
      <div
        ref={ref}
        onClick={(e) => { spawnRipple(e); onClick(e); }}
        onContextMenu={handleContext}
        className={`${cellBase} ${cellInteractive} border`}
        style={{
          width: cellSize, height: cellSize,
          background,
          borderColor,
          fontSize: isPreview && cell.type === "empty" ? 10 : 18,
          fontWeight: isPreview ? 800 : "normal",
          color: isPreview ? "#fff" : undefined,
          boxShadow: shadow,
          animation,
          transform: pressed ? "scale(0.94)" : "scale(1)",
          transition: "transform 0.12s ease, box-shadow 0.18s ease",
          willChange: "transform",
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
      >
        {ripples.map(r => (
          <span
            key={r.id}
            style={{
              position: "absolute",
              left: r.x, top: r.y,
              width: cellSize * 1.4, height: cellSize * 1.4,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)",
              transform: "translate(-50%,-50%) scale(0)",
              animation: "cellRipple 0.5s ease-out forwards",
              pointerEvents: "none",
            }}
          />
        ))}
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
        className={`${cellBase} border`}
        style={{
          width: cellSize, height: cellSize,
          background: "linear-gradient(145deg, rgba(255,227,227,0.78), rgba(251,207,207,0.82))",
          borderColor: palette.dogBorder,
          boxShadow: "inset 3px 3px 6px rgba(120,144,156,0.22), inset -2px -2px 4px rgba(255,255,255,0.65), 0 0 8px rgba(244,138,138,0.25)",
        }}
      >
        <Sprite name="dog" size={32} />
      </div>
    );
  }

  if (cell.type === "cat") {
    return (
      <div
        className={`${cellBase} border`}
        style={{
          width: cellSize, height: cellSize,
          background: "linear-gradient(145deg, rgba(232,245,233,0.78), rgba(214,234,216,0.82))",
          borderColor: palette.catBorder,
          boxShadow: "inset 3px 3px 6px rgba(120,144,156,0.22), inset -2px -2px 4px rgba(255,255,255,0.65), 0 0 8px rgba(165,214,167,0.3)",
          animation: cell.revealed ? "pop 0.3s ease-out" : undefined,
        }}
      >
        <Sprite name={cell.catType?.key || "mike"} size={32} />
      </div>
    );
  }

  const hasDog = cell.dogCount > 0;
  const hasCat = cell.catCount > 0;
  const isEmpty = !hasDog && !hasCat;
  return (
    <div
      className={`${cellBase} border gap-0.5 text-[13px]`}
      style={{
        width: cellSize, height: cellSize,
        background: isEmpty
          ? "rgba(255,255,255,0.42)"
          : "linear-gradient(145deg, rgba(255,253,248,0.72), rgba(248,244,234,0.78))",
        borderColor: isEmpty ? "rgba(255,255,255,0.55)" : "rgba(228,221,205,0.7)",
        boxShadow: isEmpty
          ? "inset 3px 3px 7px rgba(120,144,156,0.32), inset -2px -2px 4px rgba(255,255,255,0.55)"
          : "inset 3px 3px 6px rgba(176,158,118,0.28), inset -2px -2px 4px rgba(255,255,255,0.7)",
        fontWeight: 900,
        textShadow: "0 1px 0 rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.5)",
      }}
    >
      {hasDog && <span style={{ color: palette.dogText }}>{cell.dogCount}</span>}
      {hasDog && hasCat && <span style={{ color: "#b0bec5" }}>/</span>}
      {hasCat && <span style={{ color: palette.catText }}>{cell.catCount}</span>}
    </div>
  );
}
