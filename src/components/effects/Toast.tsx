export type GameStateValue = "playing" | "won" | "lost";

type ToastProps = {
  message: string;
  gameState: GameStateValue;
};

export function Toast({ message, gameState }: ToastProps) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)",
      background: gameState === "lost" ? "#ffcdd2" : gameState === "won" ? "#c8e6c9" : "#fff9c4",
      borderRadius: 24, padding: "10px 20px",
      fontWeight: 700, fontSize: 14, color: "#333",
      boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
      zIndex: 150, pointerEvents: "none",
      border: "2px solid rgba(255,255,255,0.8)",
      animation: gameState === "lost" ? "shake 0.4s" : "toastIn 0.3s ease-out",
      maxWidth: "90%", textAlign: "center", whiteSpace: "nowrap",
    }}>
      {message}
    </div>
  );
}
