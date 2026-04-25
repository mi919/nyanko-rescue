export type GameStateValue = "playing" | "won" | "lost";

type ToastProps = {
  message: string;
  gameState: GameStateValue;
};

export function Toast({ message, gameState }: ToastProps) {
  if (!message) return null;
  const bg = gameState === "lost" ? "#ffcdd2" : gameState === "won" ? "#c8e6c9" : "#fff9c4";
  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 rounded-3xl px-5 py-2.5 font-bold text-sm text-[#333] shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-[150] pointer-events-none border-2 border-white/80 max-w-[90%] text-center whitespace-nowrap"
      style={{
        background: bg,
        animation: gameState === "lost" ? "shake 0.4s" : "toastIn 0.3s ease-out",
      }}
    >
      {message}
    </div>
  );
}
