import type { CSSProperties } from "react";
import { Sprite } from "../Sprite";
import type { CatKey } from "../../types/cat";

export type CatRescueData = {
  x: number;
  y: number;
  catKey: CatKey;
  variant?: number;
  id?: number;
};

type CatRescueProps = { data: CatRescueData | null };

const ringStyles = [
  // A: yellow warm
  "radial-gradient(circle, rgba(255,236,179,0.9) 0%, rgba(255,213,79,0.5) 40%, transparent 70%)",
  // B: pink
  "radial-gradient(circle, rgba(252,228,236,0.95) 0%, rgba(244,143,177,0.55) 40%, transparent 70%)",
  // C: cyan/green
  "radial-gradient(circle, rgba(225,245,254,0.95) 0%, rgba(129,212,250,0.55) 40%, transparent 70%)",
];

const catAnims = [
  "catPop 0.7s cubic-bezier(0.2, 1.5, 0.4, 1) forwards",
  "catSpin 0.75s ease-out forwards",
  "catJump 0.75s cubic-bezier(0.25, 0.9, 0.4, 1.1) forwards",
];

type Particle = { emoji: string; dx: number; dy: number; delay: number; anim: string; startY?: number };

const particleSets: Particle[][] = [
  // A: hearts and stars radiating
  [
    { emoji: "💕", dx: -50, dy: -40, delay: 0,    anim: "sparkleFly" },
    { emoji: "✨", dx:  50, dy: -45, delay: 0.05, anim: "sparkleFly" },
    { emoji: "💖", dx: -55, dy:  10, delay: 0.1,  anim: "sparkleFly" },
    { emoji: "🌟", dx:  55, dy:  15, delay: 0.08, anim: "sparkleFly" },
    { emoji: "✨", dx:   0, dy: -60, delay: 0.12, anim: "sparkleFly" },
    { emoji: "💕", dx: -30, dy:  50, delay: 0.15, anim: "sparkleFly" },
    { emoji: "🌟", dx:  30, dy:  55, delay: 0.18, anim: "sparkleFly" },
  ],
  // B: petals floating up
  [
    { emoji: "🌸", dx: -40, dy:   0, delay: 0,    anim: "petalFloat" },
    { emoji: "🎵", dx:  35, dy: -10, delay: 0.05, anim: "petalFloat" },
    { emoji: "🌸", dx:  55, dy:  20, delay: 0.1,  anim: "petalFloat" },
    { emoji: "🎶", dx: -55, dy:  25, delay: 0.08, anim: "petalFloat" },
    { emoji: "🌸", dx:  10, dy: -20, delay: 0.12, anim: "petalFloat" },
    { emoji: "🎵", dx: -20, dy:  15, delay: 0.15, anim: "petalFloat" },
    { emoji: "🌸", dx:  25, dy:  10, delay: 0.18, anim: "petalFloat" },
  ],
  // C: confetti falling from above
  [
    { emoji: "🎉", dx: -40, dy: 60, startY: -80, delay: 0,    anim: "confettiFall" },
    { emoji: "🎊", dx:  30, dy: 70, startY: -90, delay: 0.05, anim: "confettiFall" },
    { emoji: "✨", dx: -20, dy: 50, startY: -70, delay: 0.1,  anim: "confettiFall" },
    { emoji: "🎉", dx:  50, dy: 65, startY: -85, delay: 0.08, anim: "confettiFall" },
    { emoji: "🎊", dx: -55, dy: 55, startY: -75, delay: 0.12, anim: "confettiFall" },
    { emoji: "✨", dx:  15, dy: 75, startY: -95, delay: 0.15, anim: "confettiFall" },
    { emoji: "🎉", dx: -10, dy: 60, startY: -65, delay: 0.18, anim: "confettiFall" },
  ],
];

export function CatRescue({ data }: CatRescueProps) {
  if (!data) return null;
  const v = data.variant || 0;
  return (
    <div style={{
      position: "fixed", left: data.x, top: data.y,
      width: 0, height: 0, zIndex: 250, pointerEvents: "none",
    }}>
      {/* Light ring */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 80, height: 80, marginLeft: -40, marginTop: -40,
        borderRadius: "50%",
        background: ringStyles[v],
        animation: "ringExpand 0.6s ease-out forwards",
      }} />
      {/* Cat sprite */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        animation: catAnims[v],
      }}>
        <Sprite name={data.catKey} size={64} />
      </div>
      {/* Particles */}
      {particleSets[v].map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, top: 0,
          fontSize: 22,
          "--dx": `${p.dx}px`,
          "--dy": `${p.dy}px`,
          "--start-y": `${p.startY || 0}px`,
          animation: `${p.anim} 0.7s ease-out ${p.delay}s forwards`,
        } as CSSProperties}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
