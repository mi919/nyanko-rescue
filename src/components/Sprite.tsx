import type { CSSProperties } from "react";
import { SPRITE_URL, SPRITE_POS, SPRITE_SIZE, type SpriteName } from "../constants/sprite";

type SpriteProps = {
  name: SpriteName;
  size?: number;
  style?: CSSProperties;
};

// Sprite component: uses CSS background-position for efficient rendering
export function Sprite({ name, size = 32, style = {} }: SpriteProps) {
  const pos = SPRITE_POS[name];
  if (!pos) return null;
  const scale = size / SPRITE_SIZE;
  return (
    <div
      className="bg-no-repeat"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundPosition: `-${pos.x * scale}px -${pos.y * scale}px`,
        backgroundSize: `${256 * scale}px ${192 * scale}px`,
        imageRendering: "auto",
        ...style,
      }}
    />
  );
}
