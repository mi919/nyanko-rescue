import { Sprite } from "../Sprite";
import { CAT_TYPES } from "../../constants/cats";
import type { CatType } from "../../types/cat";

type CollectionModalProps = {
  open: boolean;
  onClose: () => void;
  collection: readonly CatType[];
  /** Backdrop opacity (0..1). Title screen uses 0.5, game screen uses 0.4. */
  backdropAlpha?: number;
  /** Modal stacking. Title screen uses 200, game screen uses 100. */
  zIndex?: number;
  /** Card shadow alpha. Title 0.3, game 0.2. */
  shadowAlpha?: number;
};

export function CollectionModal({
  open,
  onClose,
  collection,
  backdropAlpha = 0.4,
  zIndex = 100,
  shadowAlpha = 0.2,
}: CollectionModalProps) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: `rgba(0,0,0,${backdropAlpha})`, zIndex }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] p-5 max-w-[360px] w-[90%] max-h-[75vh] overflow-auto"
        style={{ boxShadow: `0 8px 40px rgba(0,0,0,${shadowAlpha})` }}
      >
        <h3 className="m-0 mb-3 text-[18px] font-extrabold text-[#37474f]">
          🐱 ねこ図鑑 ({collection.length}/{CAT_TYPES.length})
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {CAT_TYPES.map((cat, i) => {
            const found = collection.find(c => c.key === cat.key);
            return (
              <div
                key={i}
                className={`rounded-xl p-2 text-center ${
                  found
                    ? "bg-[#f1f8e9] opacity-100 border-2 border-[#a5d6a7]"
                    : "bg-[#f5f5f5] opacity-40 border-2 border-[#e0e0e0]"
                }`}
              >
                {found ? (
                  <Sprite name={cat.key} size={56} style={{ margin: "0 auto" }} />
                ) : (
                  <div className="w-14 h-14 mx-auto flex items-center justify-center text-[32px]">❓</div>
                )}
                <div className="text-[10px] text-[#ffa726] mt-1 tracking-wider">
                  {"★".repeat(cat.rarity)}
                </div>
                <div className="font-bold text-xs mt-px">
                  {found ? cat.name : "？？？"}
                </div>
                {found && (
                  <div className="text-[10px] text-[#666] mt-0.5">
                    スキル: {cat.skill}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-3 px-6 py-2 bg-[#78909c] text-white border-0 rounded-2xl cursor-pointer font-bold w-full"
        >
          とじる
        </button>
      </div>
    </div>
  );
}
