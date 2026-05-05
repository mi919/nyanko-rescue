import type { CSSProperties } from "react";

type IconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  style?: CSSProperties;
};

export function HeartIcon({ size = 18, color = "#ef5350", filled = true, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`heartGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd1d1" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#c62828" />
        </linearGradient>
      </defs>
      <path
        d="M12 21s-7.5-4.6-9.5-9.4C1.1 8.1 3.4 4.5 7 4.5c2 0 3.6 1 5 2.6 1.4-1.6 3-2.6 5-2.6 3.6 0 5.9 3.6 4.5 7.1C19.5 16.4 12 21 12 21Z"
        fill={filled ? `url(#heartGrad-${color.replace("#", "")})` : "none"}
        stroke={filled ? "rgba(255,255,255,0.85)" : "rgba(120,144,156,0.45)"}
        strokeWidth={filled ? 1 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarIcon({ size = 18, color = "#ffb300", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#ef6c00" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.6 14.85 8.7l6.65.78-4.95 4.55 1.36 6.6L12 17.4l-5.91 3.23 1.36-6.6L2.5 9.48l6.65-.78L12 2.6Z"
        fill="url(#starGrad)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CatHeadIcon({ size = 18, color = "#7e57c2", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <path
        d="M4.5 6.2 7.6 9c1.3-.55 2.8-.85 4.4-.85s3.1.3 4.4.85L19.5 6.2c.5-.45 1.3-.05 1.25.6l-.55 7.45c-.35 4.2-3.85 6.95-8.2 6.95s-7.85-2.75-8.2-6.95L3.25 6.8c-.05-.65.75-1.05 1.25-.6Z"
        fill={color}
        opacity={0.92}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="13.5" r="1" fill="#fff" />
      <circle cx="15" cy="13.5" r="1" fill="#fff" />
      <path d="M11 16.5c.3.4.7.4 1 0" stroke="#fff" strokeWidth={1} strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FlagIcon({ size = 18, color = "#fff", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <path d="M6 3v18" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <path
        d="M6 4.2c3-1.8 5.5 1.4 9 0 1.5-.6 2.4-.9 3.4-.7.5.1.8.6.7 1.1l-1.1 5.1c-.1.4-.4.7-.8.8-1 .2-2 .5-3.5 1-3.4 1.2-5.7-1.6-7.7-.1V4.2Z"
        fill={color}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={0.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookIcon({ size = 18, color = "#546e7a", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <path
        d="M4 4.6c0-.5.4-.9.9-1l5.2-.6c.7-.1 1.4.1 1.9.6.5-.5 1.2-.7 1.9-.6l5.2.6c.5.1.9.5.9 1V19c0 .6-.5 1-1.1.9l-5-.6c-.7-.1-1.4.1-1.9.6-.5-.5-1.2-.7-1.9-.6l-5 .6c-.6.1-1.1-.3-1.1-.9V4.6Z"
        fill={color}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={0.8}
        strokeLinejoin="round"
      />
      <path d="M12 5v14" stroke="rgba(255,255,255,0.55)" strokeWidth={1} strokeLinecap="round" />
    </svg>
  );
}

export function BulbIcon({ size = 14, color = "#ffb300", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", overflow: "visible", ...style }}
      aria-hidden="true"
    >
      <path
        d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2V17h5v-1c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z"
        fill={color}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={0.8}
      />
      <rect x="9.5" y="18" width="5" height="2" rx="1" fill="#90a4ae" />
      <rect x="10" y="20.5" width="4" height="1.4" rx="0.7" fill="#78909c" />
    </svg>
  );
}
