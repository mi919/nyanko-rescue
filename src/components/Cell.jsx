import { useRef } from "react";
import { Sprite } from "./Sprite.jsx";
import { cellSize } from "../constants/theme.js";

export function Cell({ cell, onClick, onRightClick, gameOver, peeking, marked, foreseeing, foreseePreview, crossTarget }) {
  const ref = useRef(null);
  const handleContext = (e) => { e.preventDefault(); onRightClick(); };

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
      <div ref={ref} onClick={onClick} onContextMenu={handleContext}
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
          border: isPreview ? "2px solid #4527a0"
            : showPeek ? "2px solid #b71c1c"
            : showMark ? "2px solid #2e7d32"
            : showForesee ? "2px solid #6a1b9a"
            : showCross ? "2px solid #e65100"
            : "2px solid #78909c",
          borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
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
          transition: "transform 0.1s", userSelect: "none",
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
      <div style={{
        width: cellSize, height: cellSize, background: "#ffcdd2",
        border: "2px solid #e57373", borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Sprite name="dog" size={32} />
      </div>
    );
  }

  if (cell.type === "cat") {
    return (
      <div style={{
        width: cellSize, height: cellSize, background: "#c8e6c9",
        border: "2px solid #81c784", borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: cell.revealed ? "pop 0.3s ease-out" : undefined,
      }}>
        <Sprite name={cell.catType?.key || "mike"} size={32} />
      </div>
    );
  }

  const hasDog = cell.dogCount > 0;
  const hasCat = cell.catCount > 0;
  return (
    <div style={{
      width: cellSize, height: cellSize, background: "#eceff1",
      border: "2px solid #cfd8dc", borderRadius: 6,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 2, fontSize: 13, fontWeight: 800,
    }}>
      {hasDog && <span style={{ color: "#e53935" }}>{cell.dogCount}</span>}
      {hasDog && hasCat && <span style={{ color: "#aaa" }}>/</span>}
      {hasCat && <span style={{ color: "#43a047" }}>{cell.catCount}</span>}
    </div>
  );
}
