import { Sprite } from "../Sprite";
import type { CatKey } from "../../types/cat";

export type UnlockBannerData = { catKey: CatKey; catName: string };

type UnlockBannerProps = { banner: UnlockBannerData | null };

export function UnlockBanner({ banner }: UnlockBannerProps) {
  if (!banner) return null;
  return (
    <div style={{
      position: "fixed", bottom: 60, left: "50%",
      background: "linear-gradient(135deg, #ffd54f, #ff8a65)",
      color: "#fff", padding: "12px 24px",
      borderRadius: 20, border: "3px solid #fff",
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
      zIndex: 280, pointerEvents: "none",
      fontSize: 14, fontWeight: 800,
      display: "flex", alignItems: "center", gap: 10,
      animation: "unlockBannerIn 2.5s ease-out forwards",
      maxWidth: "90%", whiteSpace: "nowrap",
    }}>
      <Sprite name={banner.catKey} size={36} />
      <div>
        <div style={{ fontSize: 10, opacity: 0.9 }}>✨ 新しいおとも！</div>
        <div>{banner.catName} が仲間に！</div>
      </div>
    </div>
  );
}
