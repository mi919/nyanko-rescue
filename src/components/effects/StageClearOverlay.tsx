import type { CSSProperties } from "react";

export type StageClearParticle = {
  id: number;
  emoji: string;
  left: number;
  drift: number;
  spin: number;
  duration: number;
  delay: number;
  size: number;
};

type StageClearOverlayProps = {
  active: boolean;
  particles: readonly StageClearParticle[];
};

export function StageClearOverlay({ active, particles }: StageClearOverlayProps) {
  if (!active) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 240,
      pointerEvents: "none", overflow: "hidden",
    }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`,
          top: 0,
          fontSize: p.size,
          "--drift": `${p.drift}px`,
          "--spin": `${p.spin}deg`,
          animation: `confettiRain ${p.duration}s ease-in ${p.delay}s forwards`,
        } as CSSProperties}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
