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
    <div onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: `rgba(0,0,0,${backdropAlpha})`,
        display: "flex", alignItems: "center", justifyContent: "center", zIndex,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, padding: 20,
          maxWidth: 360, width: "90%", maxHeight: "75vh", overflow: "auto",
          boxShadow: `0 8px 40px rgba(0,0,0,${shadowAlpha})`,
        }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#37474f" }}>
          🐱 ねこ図鑑 ({collection.length}/{CAT_TYPES.length})
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {CAT_TYPES.map((cat, i) => {
            const found = collection.find(c => c.key === cat.key);
            return (
              <div key={i} style={{
                background: found ? "#f1f8e9" : "#f5f5f5",
                borderRadius: 12, padding: 8, textAlign: "center",
                opacity: found ? 1 : 0.4,
                border: found ? "2px solid #a5d6a7" : "2px solid #e0e0e0",
              }}>
                {found ? (
                  <Sprite name={cat.key} size={56} style={{ margin: "0 auto" }} />
                ) : (
                  <div style={{ width: 56, height: 56, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>❓</div>
                )}
                <div style={{ fontSize: 10, color: "#ffa726", marginTop: 4, letterSpacing: 1 }}>
                  {"★".repeat(cat.rarity)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, marginTop: 1 }}>
                  {found ? cat.name : "？？？"}
                </div>
                {found && (
                  <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                    スキル: {cat.skill}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={onClose}
          style={{
            marginTop: 12, padding: "8px 24px", background: "#78909c",
            color: "#fff", border: "none", borderRadius: 16, cursor: "pointer",
            fontWeight: 700, width: "100%",
          }}>とじる</button>
      </div>
    </div>
  );
}
