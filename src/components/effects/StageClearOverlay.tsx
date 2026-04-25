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
    <div className="fixed inset-0 z-[240] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            "--drift": `${p.drift}px`,
            "--spin": `${p.spin}deg`,
            animation: `confettiRain ${p.duration}s ease-in ${p.delay}s forwards`,
          } as CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
