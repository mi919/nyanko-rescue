import { Sprite } from "../components/Sprite";
import { CAT_TYPES } from "../constants/cats";
import type { CatType } from "../types/cat";

type EndingScreenProps = {
  score: number;
  collection: readonly CatType[];
  onTitle: () => void;
};

export function EndingScreen({ score, collection, onTitle }: EndingScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-jp p-5"
      style={{ background: "linear-gradient(170deg, #e8f5e9 0%, #fff8e1 50%, #fce4ec 100%)" }}
    >
      <div className="text-[56px] mb-2">🎊</div>
      <h1 className="text-[26px] font-black text-[#e65100] mb-2">全ステージクリア！</h1>
      <p className="text-xl font-bold text-[#43a047] mb-3">スコア: {score}</p>
      <p className="text-[#666] mb-2">コレクション: {collection.length} / {CAT_TYPES.length} 種</p>
      <div className="flex gap-2 flex-wrap justify-center mb-5 max-w-[360px]">
        {collection.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-xl px-2.5 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-center text-[11px]"
          >
            <Sprite name={c.key} size={48} style={{ margin: "0 auto" }} />
            <div className="font-bold mt-0.5">{c.name}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onTitle}
        className="px-9 py-3 text-base font-bold text-white border-0 rounded-full cursor-pointer"
        style={{ background: "linear-gradient(135deg, #ff8a65, #ff5252)" }}
      >
        タイトルへ
      </button>
    </div>
  );
}
