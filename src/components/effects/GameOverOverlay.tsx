type GameOverOverlayProps = { active: boolean };

export function GameOverOverlay({ active }: GameOverOverlayProps) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[260] pointer-events-none overflow-hidden">
      {/* Top-down darkening layer — drains like blood leaving the face */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          background: "rgba(0,0,0,0.78)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          animation: "gameOverDrain 0.9s cubic-bezier(0.3, 0, 0.2, 1) forwards",
        }}
      />
      {/* GAME OVER text — slow gentle fade-in */}
      <div
        className="absolute left-1/2 top-[45%] text-center"
        style={{ animation: "gameOverText 1.6s ease-out 0.8s both" }}
      >
        <div
          className="text-[56px] font-black text-white tracking-[6px] whitespace-nowrap"
          style={{
            textShadow: "0 4px 16px rgba(0,0,0,0.8), 0 0 30px rgba(229,57,53,0.6)",
            fontFamily: "'Arial Black', sans-serif",
          }}
        >
          GAME OVER
        </div>
      </div>
      <div
        className="absolute left-1/2 text-[15px] font-bold text-[#ccc] tracking-[2px] whitespace-nowrap"
        style={{
          top: "calc(45% + 50px)",
          animation: "gameOverSub 0.9s ease-out 2.2s both",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        猫たちは逃げてしまった…
      </div>
    </div>
  );
}
