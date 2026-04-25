import { SPRITE_URL, SPRITE_POS, SPRITE_SIZE } from "../constants/sprite.js";

// Sprite component: uses CSS background-position for efficient rendering
export function Sprite({ name, size = 32, style = {} }) {
  const pos = SPRITE_POS[name];
  if (!pos) return null;
  const scale = size / SPRITE_SIZE;
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${SPRITE_URL})`,
        backgroundPosition: `-${pos.x * scale}px -${pos.y * scale}px`,
        backgroundSize: `${256 * scale}px ${192 * scale}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "auto",
        ...style,
      }}
    />
  );
}
