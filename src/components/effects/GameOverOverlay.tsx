type GameOverOverlayProps = { active: boolean };

export function GameOverOverlay({ active }: GameOverOverlayProps) {
  if (!active) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 260,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Top-down darkening layer — drains like blood leaving the face */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%",
        background: "rgba(0,0,0,0.78)",
        WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
        maskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
        animation: "gameOverDrain 0.9s cubic-bezier(0.3, 0, 0.2, 1) forwards",
      }} />
      {/* GAME OVER text — slow gentle fade-in */}
      <div style={{
        position: "absolute", left: "50%", top: "45%",
        animation: "gameOverText 1.6s ease-out 0.8s both",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 56, fontWeight: 900,
          color: "#fff",
          letterSpacing: 6,
          textShadow: "0 4px 16px rgba(0,0,0,0.8), 0 0 30px rgba(229,57,53,0.6)",
          fontFamily: "'Arial Black', sans-serif",
          whiteSpace: "nowrap",
        }}>
          GAME OVER
        </div>
      </div>
      <div style={{
        position: "absolute", left: "50%", top: "calc(45% + 50px)",
        animation: "gameOverSub 0.9s ease-out 2.2s both",
        fontSize: 15, fontWeight: 700,
        color: "#ccc",
        letterSpacing: 2,
        textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        whiteSpace: "nowrap",
      }}>
        猫たちは逃げてしまった…
      </div>
    </div>
  );
}
