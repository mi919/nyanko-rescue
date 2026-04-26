import { Sprite } from "../components/Sprite";
import { CAT_TYPES } from "../constants/cats";
import { SKILLS } from "../constants/skills";
import type { CatType } from "../types/cat";
import { useGameStore } from "../stores/gameStore";
import { useProgressStore } from "../stores/progressStore";
import { useUiStore } from "../stores/uiStore";

export function EncounterScreen() {
  const rescued = useGameStore((s) => s.rescued);
  const lapCats = useProgressStore((s) => s.lapCats);
  const unlockedCats = useProgressStore((s) => s.unlockedCats);
  const setUnlockedCats = useProgressStore((s) => s.setUnlockedCats);
  const rouletteResult = useProgressStore((s) => s.rouletteResult);
  const setRouletteResult = useProgressStore((s) => s.setRouletteResult);
  const roulettePhase = useProgressStore((s) => s.roulettePhase);
  const setRoulettePhase = useProgressStore((s) => s.setRoulettePhase);
  const lapCount = useProgressStore((s) => s.lapCount);
  const setLapCount = useProgressStore((s) => s.setLapCount);
  const setLapCats = useProgressStore((s) => s.setLapCats);
  const setScreen = useUiStore((s) => s.setScreen);

  const allCats = [...lapCats, ...rescued.map((c) => c.key)];
  const candidates = allCats.filter((key) => !unlockedCats.includes(key));
  const uniqueAll = [...new Set(allCats)]
    .map((key) => CAT_TYPES.find((c) => c.key === key))
    .filter((c): c is CatType => Boolean(c));
  const hasNewCat = candidates.length > 0;
  const allUnlocked = unlockedCats.length >= CAT_TYPES.length;

  const startEncounter = () => {
    if (!hasNewCat) { setRoulettePhase("empty"); return; }
    if (allUnlocked) { setRoulettePhase("complete"); return; }
    setRoulettePhase("rustling");
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const cat = CAT_TYPES.find((c) => c.key === pick);
    setTimeout(() => {
      setRouletteResult({ catKey: pick, catName: cat ? cat.name : pick });
      setRoulettePhase("emerging");
    }, 1800);
    setTimeout(() => {
      setRoulettePhase("revealed");
      setUnlockedCats((prev) => prev.includes(pick) ? prev : [...prev, pick]);
    }, 2800);
  };

  const goToTitle = () => {
    setLapCount((prev) => prev + 1);
    setLapCats([]);
    setRoulettePhase("idle");
    setRouletteResult(null);
    setScreen("title");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center font-jp pt-4 px-4 pb-6 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #ffcc80 0%, #ff8a65 30%, #5c6bc0 70%, #283593 100%)" }}
    >
      {/* Header */}
      <div className="text-center mt-7">
        <h2
          className="text-2xl font-black m-0"
          style={{
            textShadow: "0 3px 8px rgba(0,0,0,0.4)",
            animation: "nameReveal 0.6s ease-out",
          }}
        >
          🌟 はいきょ クリア！ 🌟
        </h2>
        {lapCount > 0 && (
          <div className="text-[13px] opacity-80 mt-1">〜 {lapCount + 1}周目 〜</div>
        )}
      </div>

      {/* Cats encountered */}
      <div className="mt-4 px-4 py-2 rounded-2xl max-w-[320px] w-full text-center bg-white/15">
        <div className="text-[11px] font-bold opacity-80 mb-1.5">今回出会った猫たち</div>
        <div className="flex gap-1.5 flex-wrap justify-center">
          {uniqueAll.map((cat, i) => (
            <div key={i} style={{ animation: `catsFadeIn 0.4s ease-out ${i * 0.15}s both` }}>
              <Sprite name={cat.key} size={36} />
            </div>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-[20px]" />

      {/* Encounter area */}
      <div className="relative w-full max-w-[300px] h-[200px] flex flex-col items-center justify-end">
        {/* Soft glow behind cat */}
        {(roulettePhase === "emerging" || roulettePhase === "revealed") && (
          <div
            className="absolute left-1/2 top-[35%] w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(255,253,200,0.9) 0%, rgba(255,236,179,0.5) 40%, transparent 70%)",
              animation: "softGlow 1s ease-out forwards",
            }}
          />
        )}

        {/* Cat emerging from grass */}
        <div className="relative z-[2] w-[100px] h-[100px] overflow-hidden -mb-2.5">
          {(roulettePhase === "emerging" || roulettePhase === "revealed") && rouletteResult && (
            <div style={{ animation: "catEmerge 1s cubic-bezier(0.2, 0.8, 0.3, 1) forwards" }}>
              <Sprite name={rouletteResult.catKey} size={96} style={{ margin: "0 auto" }} />
            </div>
          )}
          {roulettePhase === "rustling" && (
            <div
              className="flex items-center justify-center w-full h-full text-[32px]"
              style={{ animation: "questionMark 0.6s ease-in-out infinite" }}
            >❓</div>
          )}
        </div>

        {/* Grass silhouette */}
        <div
          className="relative z-[3] w-full h-10 flex justify-center"
          style={{
            animation: roulettePhase === "rustling"
              ? "grassIntense 0.5s ease-in-out infinite"
              : "grassSway 2s ease-in-out infinite",
          }}
        >
          {Array.from({ length: 9 }, (_, i) => {
            const h = 28 + (i % 3) * 8;
            const hue = 110 + (i % 4) * 12;
            return (
              <div
                key={i}
                className="rounded-t-[50%]"
                style={{
                  width: 18,
                  height: h,
                  background: `hsl(${hue}, 55%, ${38 + (i % 3) * 8}%)`,
                  transform: `rotate(${(i - 4) * 6}deg)`,
                  transformOrigin: "bottom center",
                  marginTop: `${40 - h}px`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Phase: idle — start button */}
      {roulettePhase === "idle" && (
        <div className="mt-5 text-center">
          <div
            className="text-sm font-bold mb-4"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
          >
            草むらに何かの気配が…
          </div>
          <button
            onClick={startEncounter}
            className="px-10 py-3.5 text-white border-[3px] border-white rounded-[40px] text-lg font-black cursor-pointer tracking-[2px]"
            style={{
              background: "linear-gradient(135deg, #ff8a65, #ff5252)",
              boxShadow: "0 6px 0 #c62828, 0 8px 20px rgba(255,82,82,0.5)",
            }}
          >
            🌿 のぞいてみる
          </button>
        </div>
      )}

      {/* Phase: rustling */}
      {roulettePhase === "rustling" && (
        <div
          className="mt-5 text-[15px] font-bold text-center"
          style={{
            textShadow: "0 2px 6px rgba(0,0,0,0.4)",
            animation: "nameReveal 0.4s ease-out",
          }}
        >
          …？ だれかいるみたい…
        </div>
      )}

      {/* Phase: emerging */}
      {roulettePhase === "emerging" && (
        <div
          className="mt-5 text-[15px] font-bold text-center"
          style={{
            textShadow: "0 2px 6px rgba(0,0,0,0.4)",
            animation: "nameReveal 0.5s ease-out",
          }}
        >
          あっ…！
        </div>
      )}

      {/* Phase: revealed */}
      {roulettePhase === "revealed" && rouletteResult && (() => {
        const cat = CAT_TYPES.find((c) => c.key === rouletteResult.catKey);
        const skill = cat ? SKILLS[cat.skill] : null;
        return (
          <div
            className="mt-4 text-center"
            style={{ animation: "nameReveal 0.5s ease-out" }}
          >
            <div
              className="text-[22px] font-black text-[#fff9c4] mb-1"
              style={{ textShadow: "0 2px 12px rgba(255,215,0,0.8), 0 4px 8px rgba(0,0,0,0.4)" }}
            >
              ✨ {rouletteResult.catName} ✨
            </div>
            <div className="text-sm opacity-90 mb-2">なかまになりたそうにこちらを見ている！</div>
            {skill && (
              <div
                className="inline-block text-white px-4 py-1 rounded-[14px] text-xs font-extrabold"
                style={{
                  background: skill.color,
                  boxShadow: `0 2px 8px ${skill.color}88`,
                }}
              >
                {skill.icon} {skill.name}: {skill.desc}
              </div>
            )}
            <div className="mt-5">
              <button
                onClick={goToTitle}
                className="px-10 py-3.5 text-white border-[3px] border-white rounded-[40px] text-base font-black cursor-pointer tracking-[2px]"
                style={{
                  background: "linear-gradient(135deg, #66bb6a, #43a047)",
                  boxShadow: "0 6px 0 #2e7d32, 0 8px 20px rgba(67,160,71,0.5)",
                }}
              >
                🐾 なかまにする！
              </button>
            </div>
          </div>
        );
      })()}

      {/* Phase: empty */}
      {roulettePhase === "empty" && (
        <div
          className="mt-5 text-center"
          style={{ animation: "nameReveal 0.5s ease-out" }}
        >
          <div className="text-sm font-bold mb-1">今回は新しい出会いはなかった…</div>
          <div className="text-xs opacity-70 mb-5">でも猫たちはあなたを待っている！</div>
          <button
            onClick={goToTitle}
            className="px-9 py-3 text-white rounded-3xl text-sm font-bold cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.6)",
            }}
          >
            次の周回へ ▶
          </button>
        </div>
      )}

      {/* Phase: complete */}
      {roulettePhase === "complete" && (
        <div
          className="mt-5 text-center"
          style={{ animation: "nameReveal 0.6s ease-out" }}
        >
          <div
            className="text-xl font-black text-[#ffd54f] mb-2"
            style={{ textShadow: "0 2px 10px rgba(255,215,0,0.8)" }}
          >
            🏆 全てのおともが集結！ 🏆
          </div>
          <div className="flex gap-1 flex-wrap justify-center mb-3">
            {CAT_TYPES.map((cat, i) => (
              <div
                key={i}
                style={{ animation: `completeStar 1.5s ease-in-out ${i * 0.1}s infinite` }}
              >
                <Sprite name={cat.key} size={40} />
              </div>
            ))}
          </div>
          <div className="text-[13px] opacity-90 mb-4">
            みんなの力であなたは最高のレスキュー隊長！
          </div>
          <button
            onClick={goToTitle}
            className="px-10 py-3.5 text-white border-[3px] border-white rounded-[40px] text-base font-black cursor-pointer tracking-[2px]"
            style={{
              background: "linear-gradient(135deg, #ffd54f, #ff8f00)",
              boxShadow: "0 6px 0 #e65100, 0 8px 20px rgba(255,143,0,0.5)",
            }}
          >
            さらなる冒険へ ▶
          </button>
        </div>
      )}
    </div>
  );
}
