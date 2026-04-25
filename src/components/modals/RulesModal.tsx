type RulesModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RulesModal({ open, onClose }: RulesModalProps) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: 24,
        maxWidth: 340, width: "90%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
      }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#37474f", textAlign: "center" }}>
          🎮 あそびかた
        </h3>
        <div style={{ fontSize: 13, lineHeight: 1.8, color: "#555" }}>
          <p style={{ margin: "0 0 8px" }}>マス目をタップして<b>かくれた猫</b>を見つけよう！</p>
          <p style={{ margin: "0 0 8px" }}>マスの数字は周囲8マスにいる動物の数：</p>
          <ul style={{ margin: "0 0 8px", paddingLeft: 20 }}>
            <li><span style={{ color: "#e53935", fontWeight: 700 }}>赤</span>＝野良犬の数</li>
            <li><span style={{ color: "#43a047", fontWeight: 700 }}>緑</span>＝猫の数</li>
          </ul>
          <p style={{ margin: "0 0 8px" }}>犬マスを開くとライフが1減ります（最大3）。</p>
          <p style={{ margin: 0 }}>全ての猫を保護したらクリア！</p>
        </div>
        <button onClick={onClose} style={{
          marginTop: 14, padding: "10px 24px", background: "#78909c",
          color: "#fff", border: "none", borderRadius: 16, cursor: "pointer",
          fontWeight: 700, width: "100%", fontSize: 14,
        }}>とじる</button>
      </div>
    </div>
  );
}
