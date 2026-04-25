import { DOG_BARK_URL } from "../../constants/dogBark";

type DogAttackProps = { active: boolean };

export function DogAttack({ active }: DogAttackProps) {
  if (!active) return null;
  return (
    <div
      className="fixed inset-0 z-[300] pointer-events-none"
      style={{ animation: "redFlash 1.1s ease-out forwards" }}
    >
      {/* Radial impact lines */}
      <div
        className="absolute top-1/2 left-1/2 w-[320px] h-[320px]"
        style={{
          background: "radial-gradient(circle, transparent 30%, rgba(255,255,200,0.4) 31%, transparent 32%, transparent 38%, rgba(255,255,200,0.3) 39%, transparent 40%)",
          transform: "translate(-50%,-50%)",
          animation: "radiateLines 0.6s ease-out forwards",
        }}
      />
      {/* Dog image */}
      <img
        src={DOG_BARK_URL}
        alt="dog attack"
        className="absolute top-1/2 left-1/2 h-auto"
        style={{
          width: "min(80vw, 360px)",
          transform: "translate(-50%,-50%)",
          animation: "dogZoom 1.1s cubic-bezier(0.2, 0.8, 0.3, 1) forwards",
          filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
}
