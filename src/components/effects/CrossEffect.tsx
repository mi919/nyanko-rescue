import type { CSSProperties, RefObject } from "react";
import { cellSize } from "../../constants/theme";

export type CrossEffectData = { centerIdx: number; key: number };

type CrossEffectProps = {
  effect: CrossEffectData | null;
  boardRef: RefObject<HTMLDivElement>;
  cols: number;
};

const sparkleStars = [
  { dx:   0, dy: -55, delay: 0.05 },
  { dx:   0, dy:  55, delay: 0.05 },
  { dx: -55, dy:   0, delay: 0.05 },
  { dx:  55, dy:   0, delay: 0.05 },
  { dx: -38, dy: -38, delay: 0.12 },
  { dx:  38, dy: -38, delay: 0.12 },
  { dx: -38, dy:  38, delay: 0.12 },
  { dx:  38, dy:  38, delay: 0.12 },
];

export function CrossEffect({ effect, boardRef, cols }: CrossEffectProps) {
  if (!effect || !boardRef.current) return null;
  const rect = boardRef.current.getBoundingClientRect();
  const padding = 8, gap = 3;
  const r0 = Math.floor(effect.centerIdx / cols);
  const c0 = effect.centerIdx % cols;
  const cx = rect.left + padding + c0 * (cellSize + gap) + cellSize / 2;
  const cy = rect.top + padding + r0 * (cellSize + gap) + cellSize / 2;
  const beamLength = (cellSize + gap) * 5;
  const beamThickness = cellSize - 4;
  return (
    <div key={effect.key} style={{
      position: "fixed", left: cx, top: cy,
      width: 0, height: 0, pointerEvents: "none", zIndex: 240,
    }}>
      {/* Soft outer glow halo */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 240, height: 240,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,220,0.7) 0%, rgba(255,236,179,0.4) 25%, rgba(255,213,79,0.15) 50%, transparent 75%)",
        transform: "translate(-50%,-50%)",
        animation: "crossHalo 0.7s ease-out forwards",
        filter: "blur(2px)",
      }} />
      {/* Vertical light beam */}
      <div style={{
        position: "absolute",
        left: -beamThickness / 2, top: -beamLength / 2,
        width: beamThickness, height: beamLength,
        background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,200,1) 50%, rgba(255,255,255,0.85) 70%, transparent 100%)",
        borderRadius: beamThickness / 2,
        animation: "crossBeamV 0.6s ease-out forwards",
        boxShadow: "0 0 30px rgba(255,236,150,0.95), 0 0 60px rgba(255,213,79,0.6)",
        filter: "blur(0.5px)",
      }} />
      {/* Horizontal light beam */}
      <div style={{
        position: "absolute",
        left: -beamLength / 2, top: -beamThickness / 2,
        width: beamLength, height: beamThickness,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,200,1) 50%, rgba(255,255,255,0.85) 70%, transparent 100%)",
        borderRadius: beamThickness / 2,
        animation: "crossBeamH 0.6s ease-out forwards",
        boxShadow: "0 0 30px rgba(255,236,150,0.95), 0 0 60px rgba(255,213,79,0.6)",
        filter: "blur(0.5px)",
      }} />
      {/* Center bright core */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 80, height: 80,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,253,200,0.9) 30%, rgba(255,213,79,0.4) 60%, transparent 80%)",
        transform: "translate(-50%,-50%)",
        animation: "crossCore 0.6s ease-out forwards",
        boxShadow: "0 0 40px rgba(255,255,200,1)",
      }} />
      {/* Sparkle stars in 8 directions */}
      {sparkleStars.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, top: 0,
          fontSize: 16, lineHeight: 1,
          "--dx": `${p.dx}px`,
          "--dy": `${p.dy}px`,
          animation: `sparkleFly 0.6s ease-out ${p.delay}s forwards`,
          filter: "drop-shadow(0 0 4px rgba(255,255,200,0.9))",
        } as CSSProperties}>✨</div>
      ))}
    </div>
  );
}
