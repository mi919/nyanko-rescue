type RulesModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RulesModal({ open, onClose }: RulesModalProps) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] p-6 max-w-[340px] w-[90%] shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      >
        <h3 className="m-0 mb-3 text-[18px] font-extrabold text-[#37474f] text-center">
          🎮 あそびかた
        </h3>
        <div className="text-[13px] leading-[1.8] text-[#555]">
          <p className="m-0 mb-2">マス目をタップして<b>かくれた猫</b>を見つけよう！</p>
          <p className="m-0 mb-2">マスの数字は周囲8マスにいる動物の数：</p>
          <ul className="m-0 mb-2 pl-5 list-disc">
            <li><span className="text-[#e53935] font-bold">赤</span>＝野良犬の数</li>
            <li><span className="text-[#43a047] font-bold">緑</span>＝猫の数</li>
          </ul>
          <p className="m-0 mb-2">犬マスを開くとライフが1減ります（最大3）。</p>
          <p className="m-0">全ての猫を保護したらクリア！</p>
        </div>
        <button
          onClick={onClose}
          className="mt-3.5 px-6 py-2.5 bg-[#78909c] text-white border-0 rounded-2xl cursor-pointer font-bold w-full text-[14px]"
        >
          とじる
        </button>
      </div>
    </div>
  );
}
