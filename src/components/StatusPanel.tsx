import type { CSSProperties, ReactNode } from "react";
import { glass, palette } from "../constants/theme";
import { HeartIcon, StarIcon, FlagIcon, BookIcon } from "./icons/StatusIcons";

type StatusPanelProps = {
  lives: number;
  rescued: number;
  totalCats: number;
  score: number;
  collectionCount: number;
  flagMode: boolean;
  onToggleFlag: () => void;
  onOpenCollection: () => void;
  badges: ActiveBadge[];
};

export type ActiveBadge = {
  key: string;
  label: string;
  color: string;
  pulseMs?: number;
};

const dividerStyle: CSSProperties = {
  width: 1,
  alignSelf: "stretch",
  background: "linear-gradient(180deg, transparent, rgba(120,144,156,0.28) 30%, rgba(120,144,156,0.28) 70%, transparent)",
  margin: "0 2px",
};

const captionStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "0.16em",
  color: palette.textSub,
  textTransform: "uppercase",
  lineHeight: 1,
};

function CatProgressDots({ rescued, total }: { rescued: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => {
        const filled = i < rescued;
        return (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: filled
                ? "radial-gradient(circle at 35% 30%, #c8e6c9 0%, #66bb6a 60%, #2e7d32 100%)"
                : "rgba(176,190,197,0.35)",
              border: filled ? "1px solid rgba(255,255,255,0.85)" : "1px solid rgba(176,190,197,0.55)",
              boxShadow: filled
                ? "0 0 4px rgba(102,187,106,0.55), inset 0 1px 1px rgba(255,255,255,0.7)"
                : "inset 0 1px 1px rgba(255,255,255,0.35)",
              transition: "all 0.25s ease",
            }}
          />
        );
      })}
    </div>
  );
}

function HeartRow({ lives }: { lives: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <HeartIcon
          key={i}
          size={16}
          filled={i < lives}
          color={i < lives ? "#ef5350" : "#cfd8dc"}
          style={{
            filter: i < lives ? "drop-shadow(0 1px 2px rgba(239,83,80,0.45))" : "none",
            transition: "filter 0.25s ease",
          }}
        />
      ))}
    </div>
  );
}

function IconButton({
  onClick,
  active,
  activeColor,
  children,
  badge,
  ariaLabel,
}: {
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  children: ReactNode;
  badge?: number;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active
          ? `linear-gradient(140deg, ${activeColor}, ${activeColor}cc)`
          : "rgba(255,255,255,0.55)",
        border: active
          ? `1.5px solid ${activeColor}`
          : "1.5px solid rgba(255,255,255,0.85)",
        boxShadow: active
          ? `0 3px 10px ${activeColor}66, inset 0 1px 0 rgba(255,255,255,0.6)`
          : "0 2px 6px rgba(120,144,156,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
        cursor: "pointer",
        padding: 0,
        transition: "all 0.18s ease",
      }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            minWidth: 16,
            height: 16,
            padding: "0 4px",
            borderRadius: 8,
            background: "linear-gradient(140deg, #ff7043, #e64a19)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid #fff",
            boxShadow: "0 1px 3px rgba(230,74,25,0.5)",
            lineHeight: 1,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function StatusPanel({
  lives,
  rescued,
  totalCats,
  score,
  collectionCount,
  flagMode,
  onToggleFlag,
  onOpenCollection,
  badges,
}: StatusPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 360, alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: glass.bg,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: glass.border,
          borderRadius: 18,
          padding: "8px 12px",
          boxShadow: glass.shadow,
          width: "100%",
          color: palette.textMain,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start", flexShrink: 0 }}>
          <span style={captionStyle}>LIFE</span>
          <HeartRow lives={lives} />
        </div>

        <div style={dividerStyle} />

        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
          <span style={captionStyle}>CATS</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CatProgressDots rescued={rescued} total={totalCats} />
            <span style={{ fontSize: 12, fontWeight: 800, color: palette.textMain, letterSpacing: "0.02em" }}>
              {rescued}<span style={{ color: palette.textSub, fontWeight: 700 }}>/{totalCats}</span>
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start", flexShrink: 0 }}>
          <span style={captionStyle}>SCORE</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <StarIcon size={14} />
            <span style={{ fontSize: 13, fontWeight: 900, color: palette.textMain, letterSpacing: "0.02em" }}>
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <IconButton
            onClick={onToggleFlag}
            active={flagMode}
            activeColor="#ffa726"
            ariaLabel={flagMode ? "フラグモード ON" : "フラグモード OFF"}
          >
            <FlagIcon size={16} color={flagMode ? "#fff" : "#ffa726"} />
          </IconButton>
          <IconButton onClick={onOpenCollection} badge={collectionCount} ariaLabel="図鑑を開く">
            <BookIcon size={16} color="#546e7a" />
          </IconButton>
        </div>
      </div>

      {badges.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: "100%" }}>
          {badges.map(b => (
            <ActiveBadgePill key={b.key} badge={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function ActiveBadgePill({ badge }: { badge: ActiveBadge }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        border: `1px solid ${badge.color}66`,
        borderRadius: 12,
        padding: "3px 10px 3px 8px",
        boxShadow: `0 2px 8px ${badge.color}33, inset 0 1px 0 rgba(255,255,255,0.7)`,
        animation: `skillPulse ${badge.pulseMs ?? 1200}ms ease-in-out infinite`,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, #fff, ${badge.color} 70%)`,
          boxShadow: `0 0 6px ${badge.color}, 0 0 10px ${badge.color}88`,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: palette.textMain,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {badge.label}
      </span>
    </div>
  );
}

type StageBadgeProps = {
  stageIdx: number;
  name: string;
  caption?: string;
};

export function StageBadge({ stageIdx, name, caption }: StageBadgeProps) {
  const num = String(stageIdx + 1).padStart(2, "0");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 8,
        padding: "4px 10px 4px 4px",
        background: "rgba(255,255,255,0.40)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.7)",
        borderRadius: 14,
        boxShadow: "0 4px 14px rgba(120,144,156,0.16), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "linear-gradient(140deg, #fff, #e0eafc 60%, #cfd8dc 100%)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.85), 0 2px 6px rgba(120,144,156,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: palette.textMain,
          fontWeight: 900,
          fontSize: 14,
          letterSpacing: "0.02em",
        }}
      >
        {num}
      </div>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.05 }}>
        <span style={{ ...captionStyle, fontSize: 9 }}>STAGE</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 900,
            color: palette.textMain,
            letterSpacing: "0.02em",
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            marginTop: 2,
          }}
        >
          {name}
        </span>
        {caption && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: palette.textSub,
              marginTop: 2,
              letterSpacing: "0.02em",
            }}
          >
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
