import type { CSSProperties } from "react";

export type FireworkParticle = {
  id: number;
  emoji: string;
  bx: number;
  by: number;
  size: number;
  duration: number;
};

export type FireworkBurst = {
  burstIdx: number;
  delay: number;
  particles: FireworkParticle[];
};

type PerfectFireworksProps = {
  active: boolean;
  bursts: readonly FireworkBurst[];
};

const colorTints = [
  "drop-shadow(0 0 6px #ffd54f) drop-shadow(0 0 12px #ffb300)",
  "drop-shadow(0 0 6px #f48fb1) drop-shadow(0 0 12px #ec407a)",
  "drop-shadow(0 0 6px #81d4fa) drop-shadow(0 0 12px #29b6f6)",
  "drop-shadow(0 0 6px #a5d6a7) drop-shadow(0 0 12px #66bb6a)",
];

export function PerfectFireworks({ active, bursts }: PerfectFireworksProps) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[245] pointer-events-none overflow-hidden">
      {/* Central white-gold flash */}
      <div
        className="absolute left-1/2 top-1/2 w-[200px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,236,130,0.7) 30%, rgba(255,193,7,0.3) 55%, transparent 75%)",
          animation: "flashBurst 0.6s ease-out forwards",
        }}
      />
      {/* Fireworks bursts */}
      {bursts.map(burst => (
        <div key={burst.burstIdx}>
          {burst.particles.map(p => (
            <div
              key={p.id}
              className="absolute left-1/2 top-1/2"
              style={{
                fontSize: p.size,
                filter: colorTints[burst.burstIdx],
                "--bx": `${p.bx}px`,
                "--by": `${p.by}px`,
                animation: `fireworkBurst ${p.duration}s ease-out ${burst.delay}s forwards`,
              } as CSSProperties}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      ))}
      {/* PERFECT! text */}
      <div
        className="absolute left-1/2 top-[40%] text-[56px] font-black tracking-[4px] whitespace-nowrap"
        style={{
          background: "linear-gradient(180deg, #fff59d 0%, #ffb300 50%, #ff6f00 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(2px 3px 0 #fff) drop-shadow(3px 5px 0 #c44) drop-shadow(0 0 20px rgba(255,193,7,0.8))",
          animation: "perfectText 1.6s cubic-bezier(0.2, 1.5, 0.4, 1) forwards",
        }}
      >
        PERFECT!
      </div>
    </div>
  );
}
