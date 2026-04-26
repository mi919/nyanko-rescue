import bgUrl from "../assets/main.png";
import logoUrl from "../assets/title.png";
import { Sprite } from "../components/Sprite";
import { RulesModal } from "../components/modals/RulesModal";
import { CollectionModal } from "../components/modals/CollectionModal";
import { CAT_TYPES } from "../constants/cats";
import { SKILLS } from "../constants/skills";
import { useGameStore } from "../stores/gameStore";
import { useProgressStore } from "../stores/progressStore";
import { useUiStore } from "../stores/uiStore";
import { useInitStage } from "../hooks/useInitStage";

export function TitleScreen() {
  const showRules = useUiStore((s) => s.showRules);
  const setShowRules = useUiStore((s) => s.setShowRules);
  const showCollection = useUiStore((s) => s.showCollection);
  const setShowCollection = useUiStore((s) => s.setShowCollection);
  const setScreen = useUiStore((s) => s.setScreen);
  const logoTapCount = useUiStore((s) => s.logoTapCount);
  const setLogoTapCount = useUiStore((s) => s.setLogoTapCount);
  const debugMode = useUiStore((s) => s.debugMode);
  const setDebugMode = useUiStore((s) => s.setDebugMode);
  const setMessage = useUiStore((s) => s.setMessage);

  const collection = useProgressStore((s) => s.collection);
  const setCollection = useProgressStore((s) => s.setCollection);
  const companion = useProgressStore((s) => s.companion);
  const setCompanion = useProgressStore((s) => s.setCompanion);
  const unlockedCats = useProgressStore((s) => s.unlockedCats);
  const setUnlockedCats = useProgressStore((s) => s.setUnlockedCats);
  const lapCount = useProgressStore((s) => s.lapCount);
  const setLapCats = useProgressStore((s) => s.setLapCats);

  const setScore = useGameStore((s) => s.setScore);
  const initStage = useInitStage();

  const cat = CAT_TYPES.find((c) => c.key === companion) || CAT_TYPES[0];
  const skill = SKILLS[cat.skill];
  const unlockedList = CAT_TYPES.filter((c) => unlockedCats.includes(c.key));
  const currentIdx = unlockedList.findIndex((c) => c.key === companion);
  const cycle = (dir: number) => {
    if (unlockedList.length <= 1) return;
    const next = (currentIdx + dir + unlockedList.length) % unlockedList.length;
    setCompanion(unlockedList[next].key);
  };

  const onStart = () => {
    initStage(0);
    setScore(0);
    setCollection([]);
    setLapCats([]);
    setScreen("game");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center font-jp pt-3 px-3 pb-4 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #b3e5fc 0%, #c8e6c9 60%, #dcedc8 100%)" }}
    >
      {/* Main visual — fills available space, full image visible */}
      <img
        src={bgUrl}
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-auto max-h-[70vh] object-contain object-top z-0 pointer-events-none"
      />

      {/* Top icons */}
      <div className="absolute top-3.5 left-3.5 z-[5]">
        <button
          onClick={() => setShowRules(!showRules)}
          className="w-12 h-12 rounded-full bg-white/85 border-2 border-white/90 shadow-[0_3px_10px_rgba(0,0,0,0.2)] cursor-pointer flex flex-col items-center justify-center text-lg font-extrabold text-[#5a8a9e] p-0"
        >
          <span className="text-lg leading-none">?</span>
          <span className="text-[8px] mt-px">ルール</span>
        </button>
      </div>
      <div className="absolute top-3.5 right-3.5 z-[5]">
        <button
          onClick={() => setShowCollection(true)}
          className="w-12 h-12 rounded-full bg-white/85 border-2 border-white/90 shadow-[0_3px_10px_rgba(0,0,0,0.2)] cursor-pointer flex flex-col items-center justify-center text-[11px] text-[#5a8a9e] p-0 relative"
        >
          <span className="text-lg leading-none">📖</span>
          <span className="text-[8px] mt-px">図鑑</span>
          {collection.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#ff5252] text-white w-3.5 h-3.5 rounded-full text-[9px] font-extrabold flex items-center justify-center">
              {collection.length}
            </span>
          )}
        </button>
      </div>

      {/* Title logo */}
      <div
        className="mt-0 mb-1 text-center relative z-[2]"
        style={{ animation: "shimmer 3s ease-in-out infinite" }}
      >
        <img
          src={logoUrl}
          alt="にゃんこレスキュー"
          onClick={() => {
            const n = logoTapCount + 1;
            setLogoTapCount(n);
            if (n >= 5) { setDebugMode(true); setLogoTapCount(0); }
          }}
          className="block mx-auto h-auto cursor-pointer"
          style={{
            width: "min(68vw, 260px)",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
          }}
        />
        {debugMode && (
          <button
            onClick={() => {
              setUnlockedCats(CAT_TYPES.map((c) => c.key));
              setCollection(CAT_TYPES.map((c) => ({ ...c })));
              setDebugMode(false);
              setMessage("🛠 全猫コンプリート！");
              setTimeout(() => setMessage(""), 2000);
            }}
            className="mt-2 px-4 py-1.5 text-[11px] font-extrabold bg-[#424242] text-[#ffeb3b] border-2 border-dashed border-[#ffeb3b] rounded-xl cursor-pointer"
          >
            🛠 DEBUG: 全猫コンプ
          </button>
        )}
      </div>

      {/* Spacer pushing UI to the bottom — preserves visual visibility */}
      <div className="flex-1 min-h-[20px]" />

      {/* Bottom UI container — overlay with subtle gradient to separate from visual */}
      <div
        className="relative z-[2] w-full max-w-[360px] flex flex-col items-center rounded-[20px] px-2 pt-4 pb-2 -mt-2"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.85) 100%)" }}
      >
        {/* Companion selector */}
        <div
          className="rounded-2xl px-2.5 py-2 border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] mb-2.5 max-w-[340px] w-full"
          style={{
            background: "rgba(255,253,245,0.95)",
            backdropFilter: "blur(4px)",
          }}
        >
          {lapCount > 0 && (
            <div className="text-[10px] font-extrabold text-[#ff8f00] text-center mb-0.5">
              🌟 {lapCount + 1}周目
            </div>
          )}
          <div className="text-[10px] font-extrabold text-[#888] text-center mb-1 tracking-wider">
            🐾 おともの ねこ ({unlockedCats.length} / {CAT_TYPES.length})
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => cycle(-1)}
              disabled={unlockedList.length <= 1}
              className={`w-7 h-7 rounded-full border-2 border-[#ccc] text-sm font-extrabold text-[#666] p-0 flex items-center justify-center flex-shrink-0 ${
                unlockedList.length > 1 ? "bg-white cursor-pointer" : "bg-[#eee] cursor-default"
              }`}
            >◀</button>
            <div
              className="flex-1 flex items-center gap-2 px-2 py-1 rounded-[10px]"
              style={{ background: `linear-gradient(135deg, ${skill.color}22 0%, transparent 100%)` }}
            >
              <Sprite name={cat.key} size={48} style={{ flexShrink: 0 }} />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[13px] font-extrabold text-[#37474f]">
                  {cat.name} <span className="text-[10px] text-[#ffa726] ml-0.5">{"★".repeat(cat.rarity)}</span>
                </div>
                <div
                  className="inline-block mt-0.5 text-white px-2 py-px rounded-[10px] text-[10px] font-extrabold"
                  style={{ background: skill.color }}
                >
                  {skill.icon} {skill.name}
                </div>
                <div className="text-[9px] text-[#666] mt-0.5 leading-[1.2]">
                  {skill.desc}
                </div>
              </div>
            </div>
            <button
              onClick={() => cycle(1)}
              disabled={unlockedList.length <= 1}
              className={`w-7 h-7 rounded-full border-2 border-[#ccc] text-sm font-extrabold text-[#666] p-0 flex items-center justify-center flex-shrink-0 ${
                unlockedList.length > 1 ? "bg-white cursor-pointer" : "bg-[#eee] cursor-default"
              }`}
            >▶</button>
          </div>
          {unlockedCats.length < CAT_TYPES.length && (
            <div className="text-center mt-1 text-[9px] text-[#aaa]">
              🔒 あと {CAT_TYPES.length - unlockedCats.length} 匹のおとも候補が…
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="py-3 px-0 text-xl font-black text-white border-[3px] border-white rounded-full cursor-pointer tracking-[4px] w-full max-w-[300px] flex items-center justify-center gap-3"
          style={{
            background: "linear-gradient(180deg, #ff8a65 0%, #ff5252 100%)",
            boxShadow: "0 6px 0 #c44, 0 8px 20px rgba(255,82,82,0.5)",
            animation: "float 2.5s ease-in-out infinite",
          }}
        >
          <span className="text-base">🐾</span>
          はじめる
          <span className="text-base">🐾</span>
        </button>

        {/* Footer note */}
        <div className="mt-2.5 text-xs font-bold text-[#5a3a1a] text-center">
          ライフは<span className="text-[#e53935] text-base">3つ</span>！全ての猫を保護してクリア！ ❤️
        </div>
      </div>

      {/* Rules modal */}
      <RulesModal open={showRules} onClose={() => setShowRules(false)} />

      {/* Collection modal (shared with game screen) */}
      <CollectionModal
        open={showCollection}
        onClose={() => setShowCollection(false)}
        collection={collection}
        backdropAlpha={0.5}
        zIndex={200}
        shadowAlpha={0.3}
      />
    </div>
  );
}
