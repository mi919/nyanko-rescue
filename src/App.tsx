import { useEffect } from "react";
import { useUiStore } from "./stores/uiStore";
import { useInitStage } from "./hooks/useInitStage";
import { TitleScreen } from "./screens/TitleScreen";
import { EncounterScreen } from "./screens/EncounterScreen";
import { EndingScreen } from "./screens/EndingScreen";
import { GameScreen } from "./screens/GameScreen";

export default function App() {
  const screen = useUiStore((s) => s.screen);
  const initStage = useInitStage();

  // Initialize stage 0 on first mount so the board is ready when the user
  // taps "はじめる" (preserves the original behavior).
  useEffect(() => {
    initStage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (screen === "title") return <TitleScreen />;
  if (screen === "roulette") return <EncounterScreen />;
  if (screen === "ending") return <EndingScreen />;
  return <GameScreen />;
}
