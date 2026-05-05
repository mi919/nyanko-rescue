import { ff } from "../../constants/theme";
import type { Stage } from "../../types/stage";
import type { StageIntroPhase } from "../../stores/uiStore";

type StageIntroProps = {
  phase: StageIntroPhase;
  stage: Stage;
  stageIdx: number;
  onSkip: () => void;
};

export function StageIntro({ phase, stage, stageIdx, onSkip }: StageIntroProps) {
  if (phase === "done") return null;
  const exiting = phase === "exiting";

  return (
    <div
      onClick={onSkip}
      onTouchStart={onSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 260,
        cursor: "pointer",
        overflow: "hidden",
        fontFamily: ff,
        backgroundColor: stage.bg,
        animation: exiting
          ? "stageIntroExit 0.4s ease-in forwards"
          : "stageIntroCurtain 0.4s ease-out both",
      }}
    >
      {stage.bgImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${stage.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            transformOrigin: "center center",
            animation: "stageIntroBgZoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(20,30,50,0.35) 75%, rgba(20,30,50,0.55) 100%)",
          animation: "stageIntroVignette 2.4s ease-out both",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "38%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "0 24px",
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.4em",
            opacity: 0.95,
            paddingLeft: "0.4em",
            animation: "stageIntroLabelIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both",
          }}
        >
          STAGE {stageIdx + 1}
        </div>

        <div
          style={{
            width: 56,
            height: 2,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            transformOrigin: "center",
            boxShadow: "0 0 8px rgba(255,255,255,0.6)",
            animation: "stageIntroUnderline 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
          }}
        />

        <div
          style={{
            fontSize: 64,
            lineHeight: 1,
            marginTop: 6,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))",
            animation: "stageIntroEmojiIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both",
          }}
        >
          {stage.emoji}
        </div>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            margin: "8px 0 0",
            letterSpacing: "0.04em",
            animation: "stageIntroTitleIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both",
          }}
        >
          {stage.name}
        </h1>

        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            margin: "6px 0 0",
            letterSpacing: "0.08em",
            opacity: 0.9,
            animation: "stageIntroCaptionIn 0.55s ease-out 0.85s both",
          }}
        >
          {stage.caption}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          letterSpacing: "0.12em",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          animation: "stageIntroCaptionIn 0.5s ease-out 1.4s both",
          pointerEvents: "none",
        }}
      >
        TAP TO SKIP
      </div>
    </div>
  );
}
