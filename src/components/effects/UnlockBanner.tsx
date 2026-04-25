import { Sprite } from "../Sprite";
import type { CatKey } from "../../types/cat";

export type UnlockBannerData = { catKey: CatKey; catName: string };

type UnlockBannerProps = { banner: UnlockBannerData | null };

export function UnlockBanner({ banner }: UnlockBannerProps) {
  if (!banner) return null;
  return (
    <div
      className="fixed bottom-[60px] left-1/2 text-white px-6 py-3 rounded-[20px] border-[3px] border-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] z-[280] pointer-events-none text-sm font-extrabold flex items-center gap-2.5 max-w-[90%] whitespace-nowrap"
      style={{
        background: "linear-gradient(135deg, #ffd54f, #ff8a65)",
        animation: "unlockBannerIn 2.5s ease-out forwards",
      }}
    >
      <Sprite name={banner.catKey} size={36} />
      <div>
        <div className="text-[10px] opacity-90">✨ 新しいおとも！</div>
        <div>{banner.catName} が仲間に！</div>
      </div>
    </div>
  );
}
