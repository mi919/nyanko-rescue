// All CSS @keyframes used across screens / overlays / cells.
// Injected once via <KeyframeStyles /> at the App root.

export const ALL_KEYFRAMES = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pop { 0%{transform:scale(0)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
  @keyframes shimmer { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.15)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
  @keyframes toastIn { 0%{transform:translate(-50%,-20px);opacity:0} 100%{transform:translate(-50%,0);opacity:1} }

  @keyframes dogZoom {
    0%   { transform: translate(-50%,-50%) scale(0.2) rotate(-8deg); opacity: 0; }
    15%  { transform: translate(-50%,-50%) scale(1.4) rotate(3deg); opacity: 1; }
    25%  { transform: translate(-50%,-50%) scale(1.25) rotate(-2deg); opacity: 1; }
    35%  { transform: translate(-50%,-50%) scale(1.35) rotate(1deg); opacity: 1; }
    70%  { transform: translate(-50%,-50%) scale(1.2) rotate(0deg); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(0.6) rotate(0deg); opacity: 0; }
  }
  @keyframes attackShake {
    0%,100% { transform: translate(0,0); }
    10% { transform: translate(-10px, 6px); }
    20% { transform: translate(10px, -6px); }
    30% { transform: translate(-8px, -4px); }
    40% { transform: translate(8px, 4px); }
    50% { transform: translate(-6px, 2px); }
    60% { transform: translate(6px, -2px); }
    70% { transform: translate(-4px, 0); }
    80% { transform: translate(4px, 0); }
  }
  @keyframes redFlash {
    0%   { background: rgba(0,0,0,0); }
    15%  { background: rgba(220,30,30,0.55); }
    40%  { background: rgba(0,0,0,0.55); }
    80%  { background: rgba(0,0,0,0.45); }
    100% { background: rgba(0,0,0,0); }
  }
  @keyframes radiateLines {
    0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0; }
    20% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
  }

  @keyframes catPop {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(-15deg); opacity: 0; }
    40%  { transform: translate(-50%,-130%) scale(1.5) rotate(8deg); opacity: 1; }
    70%  { transform: translate(-50%,-150%) scale(1.2) rotate(-3deg); opacity: 1; }
    100% { transform: translate(-50%,-180%) scale(1.0) rotate(0deg); opacity: 0; }
  }
  @keyframes catSpin {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(0deg); opacity: 0; }
    25%  { transform: translate(-50%,-100%) scale(1.3) rotate(180deg); opacity: 1; }
    60%  { transform: translate(-50%,-130%) scale(1.2) rotate(360deg); opacity: 1; }
    100% { transform: translate(-50%,-160%) scale(0.9) rotate(540deg); opacity: 0; }
  }
  @keyframes catJump {
    0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0; }
    15%  { transform: translate(-50%,-50%) scale(1.1); opacity: 1; }
    50%  { transform: translate(-50%,-220%) scale(1.3); opacity: 1; }
    80%  { transform: translate(-50%,-180%) scale(1.1); opacity: 1; }
    100% { transform: translate(-50%,-200%) scale(1.0); opacity: 0; }
  }
  @keyframes ringExpand {
    0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes sparkleFly {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    20%  { transform: translate(-50%,-50%) scale(1.2); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.6); opacity: 0; }
  }
  @keyframes petalFloat {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(0deg); opacity: 0; }
    20%  { transform: translate(-50%,-50%) scale(1) rotate(60deg); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy) - 80px)) scale(0.8) rotate(360deg); opacity: 0; }
  }
  @keyframes confettiFall {
    0%   { transform: translate(-50%, calc(-50% + var(--start-y))) scale(0) rotate(0deg); opacity: 0; }
    15%  { transform: translate(-50%, calc(-50% + var(--start-y))) scale(1.1) rotate(45deg); opacity: 1; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(360deg); opacity: 0; }
  }
  @keyframes confettiRain {
    0%   { transform: translate(0, -20vh) rotate(0deg); opacity: 0; }
    8%   { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translate(var(--drift), 110vh) rotate(var(--spin)); opacity: 0; }
  }
  @keyframes boardFadeIn {
    0%   { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes hintParticleConverge {
    0%   { transform: translate(calc(-50% + var(--start-x)), calc(-50% + var(--start-y))) scale(0.4); opacity: 0; }
    15%  { opacity: 1; }
    85%  { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  }
  @keyframes hintFlash {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    30%  { transform: translate(-50%,-50%) scale(1.6); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
  }
  @keyframes hintBadgePop {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    40%  { transform: translate(-50%,-50%) scale(1.4); opacity: 1; }
    70%  { transform: translate(-50%,-50%) scale(1.0); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(0.8); opacity: 0; }
  }

  @keyframes gameOverDrain {
    0%   { height: 0%; }
    100% { height: 100%; }
  }
  @keyframes gameOverText {
    0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.95); filter: blur(8px); }
    100% { opacity: 1; transform: translate(-50%,-50%) scale(1.0); filter: blur(0); }
  }
  @keyframes gameOverSub {
    0%   { opacity: 0; transform: translate(-50%, 10px); }
    100% { opacity: 1; transform: translate(-50%, 0); }
  }

  @keyframes fireworkBurst {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    15%  { transform: translate(calc(-50% + var(--bx) * 0.3), calc(-50% + var(--by) * 0.3)) scale(1.3); opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translate(calc(-50% + var(--bx)), calc(-50% + var(--by))) scale(0.4); opacity: 0; }
  }
  @keyframes flashBurst {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0; }
    25%  { transform: translate(-50%,-50%) scale(1.8); opacity: 0.95; }
    100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
  }
  @keyframes perfectText {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(-15deg); opacity: 0; }
    25%  { transform: translate(-50%,-50%) scale(1.5) rotate(8deg); opacity: 1; }
    40%  { transform: translate(-50%,-50%) scale(1.1) rotate(-3deg); opacity: 1; }
    60%  { transform: translate(-50%,-50%) scale(1.2) rotate(2deg); opacity: 1; }
    85%  { transform: translate(-50%,-50%) scale(1.15) rotate(0deg); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(1.4) rotate(0deg); opacity: 0; }
  }

  @keyframes gaugeShimmer {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
  }
  @keyframes skillPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  @keyframes skillFlash {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.9; }
    50%  { transform: translate(-50%,-50%) scale(1.5); opacity: 0.6; }
    100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
  }
  @keyframes peekPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.7); }
    50% { box-shadow: 0 0 0 4px rgba(229, 57, 53, 0); }
  }
  @keyframes markPulse {
    0%, 100% { box-shadow: inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 8px rgba(67,160,71,0.5); }
    50% { box-shadow: inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 16px rgba(67,160,71,1); }
  }
  @keyframes crossPulse {
    0%, 100% { box-shadow: inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 8px rgba(251,140,0,0.5); }
    50% { box-shadow: inset 1px 1px 2px rgba(255,255,255,0.3), 0 0 18px rgba(251,140,0,1); }
  }

  @keyframes crossBeamV {
    0%   { transform: scaleY(0); opacity: 0; }
    25%  { transform: scaleY(0.6); opacity: 1; }
    60%  { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes crossBeamH {
    0%   { transform: scaleX(0); opacity: 0; }
    25%  { transform: scaleX(0.6); opacity: 1; }
    60%  { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes crossHalo {
    0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0; }
    30%  { transform: translate(-50%,-50%) scale(1); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
  }
  @keyframes crossCore {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 1; }
    30%  { transform: translate(-50%,-50%) scale(1.4); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
  }

  @keyframes unlockBannerIn {
    0%   { transform: translate(-50%, 100px); opacity: 0; }
    15%  { transform: translate(-50%, 0); opacity: 1; }
    85%  { transform: translate(-50%, 0); opacity: 1; }
    100% { transform: translate(-50%, 100px); opacity: 0; }
  }
  @keyframes wonPanelIn {
    0%   { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
    60%  { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  @keyframes newBestGlow {
    0%, 100% { box-shadow: 0 8px 32px rgba(255,193,7,0.6), 0 0 0 4px rgba(255,235,59,0.4); }
    50%      { box-shadow: 0 8px 40px rgba(255,193,7,0.9), 0 0 0 6px rgba(255,235,59,0.7); }
  }
  @keyframes newBestPulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.1); }
  }
  @keyframes catPunch {
    0%   { transform: translate(-50%,-50%) scale(0) rotate(-30deg); opacity: 0; }
    30%  { transform: translate(-50%,-50%) scale(1.4) rotate(10deg); opacity: 1; }
    60%  { transform: translate(-50%,-50%) scale(1.0) rotate(-5deg); opacity: 1; }
    100% { transform: translate(-50%,-50%) scale(1.6) rotate(0deg); opacity: 0; }
  }

  @keyframes grassSway {
    0%, 100% { transform: scaleX(1) skewX(0deg); }
    25% { transform: scaleX(1.02) skewX(2deg); }
    75% { transform: scaleX(0.98) skewX(-2deg); }
  }
  @keyframes grassIntense {
    0%, 100% { transform: skewX(0deg) scaleY(1); }
    15% { transform: skewX(5deg) scaleY(1.05); }
    30% { transform: skewX(-4deg) scaleY(0.97); }
    45% { transform: skewX(6deg) scaleY(1.06); }
    60% { transform: skewX(-5deg) scaleY(0.96); }
    80% { transform: skewX(3deg) scaleY(1.03); }
  }
  @keyframes catEmerge {
    0% { transform: translateY(100%); opacity: 0; }
    40% { transform: translateY(30%); opacity: 0.6; }
    70% { transform: translateY(5%); opacity: 1; }
    85% { transform: translateY(-5%); }
    100% { transform: translateY(0%); opacity: 1; }
  }
  @keyframes softGlow {
    0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0; }
    50% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
    100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0.4; }
  }
  @keyframes nameReveal {
    0% { opacity: 0; transform: translateY(15px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes catsFadeIn {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes completeStar {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.15) rotate(5deg); }
  }
  @keyframes questionMark {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes ambientDrift {
    0%   { transform: translate3d(-10%, 0, 0); }
    100% { transform: translate3d(110%, 0, 0); }
  }
  @keyframes ambientFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50%      { transform: translateY(-12px) scale(1.04); }
  }
  @keyframes gaugeGlowPulse {
    0%, 100% { box-shadow: 0 0 0 rgba(255,167,38,0); }
    50%      { box-shadow: 0 0 14px rgba(255,167,38,0.55); }
  }
  @keyframes gaugeReadyBurst {
    0%   { transform: scale(0.6); opacity: 0; }
    40%  { transform: scale(1.4); opacity: 0.9; }
    100% { transform: scale(2.0); opacity: 0; }
  }
  @keyframes cellRipple {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
    100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
  }
  @keyframes cellLift {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-2px); }
  }
  @keyframes breakdownRowIn {
    0%   { opacity: 0; transform: translateX(-10px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  @keyframes panelSheen {
    0%   { transform: translateX(-120%) skewX(-20deg); }
    100% { transform: translateX(220%) skewX(-20deg); }
  }
`;
