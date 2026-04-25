export type PawEffect = {
  x: number;
  y: number;
  id: number;
  delay: number;
  big: boolean;
};

type PawEffectsProps = { effects: readonly PawEffect[] };

export function PawEffects({ effects }: PawEffectsProps) {
  return (
    <>
      {effects.map(effect => {
        const size = effect.big ? 60 : 44;
        const color = effect.big ? "#ff7043" : "#42a5f5";
        const glow = effect.big ? "0 0 24px rgba(255,112,67,0.9)" : "0 0 14px rgba(66,165,245,0.7)";
        const dur = effect.big ? 700 : 500;
        return (
          <div key={effect.id} style={{
            position: "fixed", left: effect.x, top: effect.y,
            width: size, height: size,
            pointerEvents: "none", zIndex: 250,
            animation: `catPunch ${dur}ms ease-out ${effect.delay}ms forwards`,
            opacity: 0,
          }}>
            {/* Main pad */}
            <div style={{
              position: "absolute", left: "50%", top: "62%",
              width: "58%", height: "46%",
              background: color, borderRadius: "50%",
              transform: "translate(-50%,-50%)",
              boxShadow: glow,
            }} />
            {/* 4 toe pads */}
            {[[20,18],[42,4],[58,4],[80,18]].map(([lx,ly],i) => (
              <div key={i} style={{
                position: "absolute", left: `${lx}%`, top: `${ly}%`,
                width: "22%", height: "26%",
                background: color, borderRadius: "50%",
                transform: "translate(-50%,-50%)",
                boxShadow: glow,
              }} />
            ))}
          </div>
        );
      })}
    </>
  );
}
