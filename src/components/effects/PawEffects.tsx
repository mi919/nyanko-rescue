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
          <div
            key={effect.id}
            className="fixed pointer-events-none z-[250] opacity-0"
            style={{
              left: effect.x, top: effect.y,
              width: size, height: size,
              animation: `catPunch ${dur}ms ease-out ${effect.delay}ms forwards`,
            }}
          >
            {/* Main pad */}
            <div
              className="absolute left-1/2 top-[62%] w-[58%] h-[46%] rounded-full"
              style={{
                background: color,
                transform: "translate(-50%,-50%)",
                boxShadow: glow,
              }}
            />
            {/* 4 toe pads */}
            {[[20,18],[42,4],[58,4],[80,18]].map(([lx,ly],i) => (
              <div
                key={i}
                className="absolute w-[22%] h-[26%] rounded-full"
                style={{
                  left: `${lx}%`, top: `${ly}%`,
                  background: color,
                  transform: "translate(-50%,-50%)",
                  boxShadow: glow,
                }}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
