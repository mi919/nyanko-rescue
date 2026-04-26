import { useCallback, useEffect, useRef, useMemo, type CSSProperties } from "react";
import { Sprite } from "../components/Sprite";
import { Cell } from "../components/Cell";
import { STAGES } from "../constants/stages";
import { SCORING } from "../constants/scoring";
import { SKILLS } from "../constants/skills";
import { CAT_TYPES } from "../constants/cats";
import { cellSize, ff } from "../constants/theme";
import { createBoard, floodFill } from "../lib/board";
import { DogAttack } from "../components/effects/DogAttack";
import { CatRescue } from "../components/effects/CatRescue";
import { CrossEffect } from "../components/effects/CrossEffect";
import { StageClearOverlay } from "../components/effects/StageClearOverlay";
import { PerfectFireworks } from "../components/effects/PerfectFireworks";
import { GameOverOverlay } from "../components/effects/GameOverOverlay";
import { SkillFlash } from "../components/effects/SkillFlash";
import { UnlockBanner } from "../components/effects/UnlockBanner";
import { PawEffects } from "../components/effects/PawEffects";
import { Toast } from "../components/effects/Toast";
import { CollectionModal } from "../components/modals/CollectionModal";
import { useInitStage } from "../hooks/useInitStage";
import { useUiStore } from "../stores/uiStore";
import { useGameStore } from "../stores/gameStore";
import { useSkillStore } from "../stores/skillStore";
import { useProgressStore } from "../stores/progressStore";
import { useEffectStore } from "../stores/effectStore";

// ═══════════════════════════════════════════════════════════════
// 🐱 にゃんこレスキュー — Cat Rescue Minesweeper (sprite version)
// ═══════════════════════════════════════════════════════════════











export function GameScreen() {
  const stageIdx = useGameStore(s => s.stageIdx);
  const setStageIdx = useGameStore(s => s.setStageIdx);
  const board = useGameStore(s => s.board);
  const setBoard = useGameStore(s => s.setBoard);
  const lives = useGameStore(s => s.lives);
  const setLives = useGameStore(s => s.setLives);
  const rescued = useGameStore(s => s.rescued);
  const setRescued = useGameStore(s => s.setRescued);
  const collection = useProgressStore(s => s.collection);
  const setCollection = useProgressStore(s => s.setCollection);
  const gameState = useGameStore(s => s.gameState);
  const setGameState = useGameStore(s => s.setGameState);
  const message = useUiStore(s => s.message);
  const setMessage = useUiStore(s => s.setMessage);
  const showCollection = useUiStore(s => s.showCollection);
  const setShowCollection = useUiStore(s => s.setShowCollection);
  const score = useGameStore(s => s.score);
  const setScore = useGameStore(s => s.setScore);
  // Per-stage scoring tracking
  const catRescueCount = useGameStore(s => s.catRescueCount);
  const setCatRescueCount = useGameStore(s => s.setCatRescueCount);
  const cellsOpened = useGameStore(s => s.cellsOpened);
  const setCellsOpened = useGameStore(s => s.setCellsOpened);
  const manualNumberCells = useGameStore(s => s.manualNumberCells);
  const setManualNumberCells = useGameStore(s => s.setManualNumberCells);
  const stageStartTime = useGameStore(s => s.stageStartTime);
  const setStageStartTime = useGameStore(s => s.setStageStartTime);
  const skillUsedThisStage = useSkillStore(s => s.skillUsedThisStage);
  const setSkillUsedThisStage = useSkillStore(s => s.setSkillUsedThisStage);
  const hitDogThisStage = useGameStore(s => s.hitDogThisStage);
  const setHitDogThisStage = useGameStore(s => s.setHitDogThisStage);
  const stageBest = useProgressStore(s => s.stageBest);
  const setStageBest = useProgressStore(s => s.setStageBest);
  const scoreBreakdown = useGameStore(s => s.scoreBreakdown);
  const setScoreBreakdown = useGameStore(s => s.setScoreBreakdown);
  const isNewBest = useGameStore(s => s.isNewBest);
  const setIsNewBest = useGameStore(s => s.setIsNewBest);
  const animatedTotal = useGameStore(s => s.animatedTotal);
  const setAnimatedTotal = useGameStore(s => s.setAnimatedTotal);
  const logoTapCount = useUiStore(s => s.logoTapCount);
  const setLogoTapCount = useUiStore(s => s.setLogoTapCount);
  const debugMode = useUiStore(s => s.debugMode);
  const setDebugMode = useUiStore(s => s.setDebugMode);
  const pawEffects = useEffectStore(s => s.pawEffects);
  const setPawEffects = useEffectStore(s => s.setPawEffects);
  const boardRef = useRef<HTMLDivElement>(null);

  const triggerPawEffects = (indices: number[], options: { stagger?: number; big?: boolean } = {}) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const padding = 8; // matches board padding
    const gap = 3;
    const effects = indices.map((idx, i) => {
      const r = Math.floor(idx / stage.cols);
      const c = idx % stage.cols;
      const x = rect.left + padding + c * (cellSize + gap) + cellSize / 2;
      const y = rect.top + padding + r * (cellSize + gap) + cellSize / 2;
      return {
        x, y,
        id: Date.now() + Math.random() + i,
        delay: i * (options.stagger || 100),
        big: options.big || false,
      };
    });
    setPawEffects(prev => [...prev, ...effects]);
    const totalDuration = effects.length * (options.stagger || 100) + 500;
    setTimeout(() => {
      const ids = new Set(effects.map(e => e.id));
      setPawEffects(prev => prev.filter(e => !ids.has(e.id)));
    }, totalDuration);
  };
  const screen = useUiStore(s => s.screen);
  const setScreen = useUiStore(s => s.setScreen);
  const showRules = useUiStore(s => s.showRules);
  const setShowRules = useUiStore(s => s.setShowRules);
  const flagMode = useUiStore(s => s.flagMode);
  const setFlagMode = useUiStore(s => s.setFlagMode);
  const dogAttack = useEffectStore(s => s.dogAttack);
  const setDogAttack = useEffectStore(s => s.setDogAttack);
  const catRescue = useEffectStore(s => s.catRescue);
  const setCatRescue = useEffectStore(s => s.setCatRescue);
  // Skill system state
  const unlockedCats = useProgressStore(s => s.unlockedCats);
  const setUnlockedCats = useProgressStore(s => s.setUnlockedCats);
  const companion = useProgressStore(s => s.companion);
  const setCompanion = useProgressStore(s => s.setCompanion);
  const skillGauge = useSkillStore(s => s.skillGauge);
  const setSkillGauge = useSkillStore(s => s.setSkillGauge);
  const unlockBanner = useEffectStore(s => s.unlockBanner);
  const setUnlockBanner = useEffectStore(s => s.setUnlockBanner);
  // Lap (周回) system
  const lapCount = useProgressStore(s => s.lapCount);
  const setLapCount = useProgressStore(s => s.setLapCount);
  const lapCats = useProgressStore(s => s.lapCats);
  const setLapCats = useProgressStore(s => s.setLapCats);
  const rouletteResult = useProgressStore(s => s.rouletteResult);
  const setRouletteResult = useProgressStore(s => s.setRouletteResult);
  const roulettePhase = useProgressStore(s => s.roulettePhase);
  const setRoulettePhase = useProgressStore(s => s.setRoulettePhase);
  const peekingDogs = useSkillStore(s => s.peekingDogs);
  const setPeekingDogs = useSkillStore(s => s.setPeekingDogs);
  const skillFlash = useSkillStore(s => s.skillFlash);
  const setSkillFlash = useSkillStore(s => s.setSkillFlash);
  const luckyShield = useSkillStore(s => s.luckyShield);
  const setLuckyShield = useSkillStore(s => s.setLuckyShield);
  const markedCatIdx = useSkillStore(s => s.markedCatIdx);
  const setMarkedCatIdx = useSkillStore(s => s.setMarkedCatIdx);
  const barrierActive = useSkillStore(s => s.barrierActive);
  const setBarrierActive = useSkillStore(s => s.setBarrierActive);
  const barrierRemaining = useSkillStore(s => s.barrierRemaining);
  const setBarrierRemaining = useSkillStore(s => s.setBarrierRemaining);
  const foreseeMode = useSkillStore(s => s.foreseeMode);
  const setForeseeMode = useSkillStore(s => s.setForeseeMode);
  const foreseePreview = useSkillStore(s => s.foreseePreview);
  const setForeseePreview = useSkillStore(s => s.setForeseePreview);
  const foreseeStartTime = useSkillStore(s => s.foreseeStartTime);
  const setForeseeStartTime = useSkillStore(s => s.setForeseeStartTime);
  const foreseeTimeOffset = useSkillStore(s => s.foreseeTimeOffset);
  const setForeseeTimeOffset = useSkillStore(s => s.setForeseeTimeOffset);
  const crossSelecting = useSkillStore(s => s.crossSelecting);
  const setCrossSelecting = useSkillStore(s => s.setCrossSelecting);
  const crossStartTime = useSkillStore(s => s.crossStartTime);
  const setCrossStartTime = useSkillStore(s => s.setCrossStartTime);
  const crossEffect = useEffectStore(s => s.crossEffect);
  const setCrossEffect = useEffectStore(s => s.setCrossEffect);
  const isPerfect = useGameStore(s => s.isPerfect);
  const setIsPerfect = useGameStore(s => s.setIsPerfect);
  const hintIdx = useGameStore(s => s.hintIdx);
  const setHintIdx = useGameStore(s => s.setHintIdx);
  const hintPhase = useGameStore(s => s.hintPhase);
  const setHintPhase = useGameStore(s => s.setHintPhase);

  // Stage clear particles - regenerate per stage attempt
  const isWon = gameState === "won";
  const stageClearParticles = useMemo(() => {
    const emojis = ["🎉", "🎊", "✨", "🌟", "💖", "🌸", "💕", "⭐"];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      drift: (Math.random() - 0.5) * 200,
      spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720),
      duration: 1.6 + Math.random() * 0.8,
      delay: Math.random() * 0.4,
      size: 22 + Math.random() * 14,
    }));
  }, [stageIdx, isWon]);

  // Perfect clear fireworks: 4 bursts × 24 particles, time-staggered
  const fireworkBursts = useMemo(() => {
    const colors = [
      { name: "gold", emojis: ["✨", "🌟", "⭐"] },
      { name: "pink", emojis: ["💖", "💕", "✨"] },
      { name: "cyan", emojis: ["💫", "✨", "⭐"] },
      { name: "green", emojis: ["🌟", "✨", "💫"] },
    ];
    return colors.map((c, burstIdx) => {
      const particles = Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.2;
        const distance = 140 + Math.random() * 80;
        return {
          id: i,
          emoji: c.emojis[i % c.emojis.length],
          bx: Math.cos(angle) * distance,
          by: Math.sin(angle) * distance,
          size: 18 + Math.random() * 12,
          duration: 1.0 + Math.random() * 0.4,
        };
      });
      return { burstIdx, delay: burstIdx * 0.25, particles };
    });
  }, [stageIdx, isPerfect]);

  const stage = STAGES[stageIdx];

  const hintTimeoutsRef = useRef([]);
  const clearHintTimeouts = () => {
    hintTimeoutsRef.current.forEach(t => clearTimeout(t));
    hintTimeoutsRef.current = [];
  };

  const initStage = useInitStage();

  // Skip hint animation when user taps anywhere during the hint
  const skipHint = useCallback(() => {
    if (hintPhase === "done") return;
    clearHintTimeouts();
    if (hintIdx >= 0) {
      setBoard(prev => {
        const updated = prev.map(c => ({ ...c }));
        if (updated[hintIdx]) updated[hintIdx].revealed = true;
        return updated;
      });
    }
    setHintPhase("done");
  }, [hintPhase, hintIdx]);


  const finalizeStageScore = (finalBoard) => {
    // Subtract time spent in foresee/cross selection mode (selection time should not count toward clear time)
    let totalForeseeMs = foreseeTimeOffset;
    if (foreseeMode > 0 && foreseeStartTime > 0) {
      // Foresee was still active at clear time — add the in-progress duration too
      totalForeseeMs += (Date.now() - foreseeStartTime);
    }
    if (crossSelecting && crossStartTime > 0) {
      totalForeseeMs += (Date.now() - crossStartTime);
    }
    const elapsed = (Date.now() - stageStartTime - totalForeseeMs) / 1000;
    const stageObj = STAGES[stageIdx];
    const items = [];

    // Base scores
    const catScore = (catRescueCount + 1) * SCORING.catRescue; // +1 because last cat just got rescued
    items.push({ label: `🐱 ねこを保護 ×${catRescueCount + 1}`, value: catScore });

    const cellScore = cellsOpened * SCORING.cellOpen;
    if (cellScore > 0) {
      items.push({ label: `🔓 マス開封 ×${cellsOpened}`, value: cellScore });
    }

    const numberCellScore = manualNumberCells * SCORING.numberCellManual;
    if (numberCellScore > 0) {
      items.push({ label: `🔢 数字マス開封 ×${manualNumberCells}`, value: numberCellScore });
    }

    // Clear bonus
    items.push({ label: "✨ クリアボーナス", value: SCORING.clear });

    // Life bonus
    const lifeBonus = lives * SCORING.livePerHeart;
    items.push({ label: `❤️ ライフボーナス ×${lives}`, value: lifeBonus });

    // Conditional bonuses
    if (lives === 3) {
      items.push({ label: "★ パーフェクト", value: SCORING.perfect, highlight: true });
    }
    if (elapsed < 30) {
      items.push({ label: `⚡ 超速クリア (${elapsed.toFixed(1)}秒)`, value: SCORING.speedFast, highlight: true });
    } else if (elapsed < 60) {
      items.push({ label: `⚡ スピードクリア (${elapsed.toFixed(1)}秒)`, value: SCORING.speedNormal, highlight: true });
    }
    // Flag master: every dog cell is flagged
    const allDogsFlagged = finalBoard.every(c => c.type !== "dog" || c.flagged);
    if (allDogsFlagged) {
      items.push({ label: "🚩 フラグマスター", value: SCORING.flagMaster, highlight: true });
    }
    if (!hitDogThisStage) {
      items.push({ label: "🛡 無傷クリア", value: SCORING.noHit, highlight: true });
    }
    if (!skillUsedThisStage) {
      items.push({ label: "🧘 ノースキル", value: SCORING.noSkill, highlight: true });
    }

    const subtotal = items.reduce((sum, it) => sum + it.value, 0);
    const total = Math.round(subtotal * stageObj.mult);

    // Best update check
    const prevBest = stageBest[stageObj.name] || 0;
    const newBest = total > prevBest;
    if (newBest) {
      setStageBest(prev => ({ ...prev, [stageObj.name]: total }));
    }
    setIsNewBest(newBest);
    setScoreBreakdown({
      items,
      subtotal,
      mult: stageObj.mult,
      total,
      prevBest,
      stageName: stageObj.name,
      elapsed,
    });
    // Add this stage's bonus points to cumulative score (base points were already added in handleClick)
    const baseAlreadyAdded = (catRescueCount + 1) * SCORING.catRescue + cellScore + numberCellScore;
    const bonusOnly = total - baseAlreadyAdded;
    setScore(s => s + bonusOnly);

    // Animate the displayed total counter from 0 → total
    setAnimatedTotal(0);
    const startTime = Date.now();
    const duration = 1200;
    const tick = () => {
      const elapsedAnim = Date.now() - startTime;
      const progress = Math.min(1, elapsedAnim / duration);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedTotal(Math.floor(total * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setAnimatedTotal(total);
    };
    requestAnimationFrame(tick);
  };

  const activateSkill = () => {
    if (skillGauge < 100 || gameState !== "playing") return;
    setSkillUsedThisStage(true);
    const cat = CAT_TYPES.find(c => c.key === companion);
    if (!cat) return;
    const skillType = cat.skill;
    const skill = SKILLS[skillType];
    setSkillGauge(0);
    setSkillFlash({ type: skillType, color: skill.color });
    setTimeout(() => setSkillFlash(null), 600);

    if (skillType === "heal") {
      if (lives < 3) {
        setLives(l => Math.min(3, l + 1));
        setMessage("❤️ ライフを1回復した！");
      } else {
        setMessage("❤️ ライフは満タンだった…");
      }
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (skillType === "pawhit") {
      // Reveal up to 3 random safe (empty) cells that aren't yet revealed
      const candidates = [];
      board.forEach((c, i) => {
        if (!c.revealed && !c.flagged && c.type === "empty") candidates.push(i);
      });
      // Shuffle and take 3
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      const picks = candidates.slice(0, 3);
      const newBoard = board.map(c => ({ ...c }));
      picks.forEach(i => { newBoard[i].revealed = true; });
      setBoard(newBoard);
      triggerPawEffects(picks, { stagger: 150 });
      setMessage(`🐾 ねこパンチ！${picks.length}マスを開いた`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (skillType === "peek") {
      setPeekingDogs(true);
      setMessage("👁 犬の位置を透視中…");
      setTimeout(() => {
        setPeekingDogs(false);
        setMessage("");
      }, 3000);
      return;
    }

    if (skillType === "barrier") {
      setBarrierActive(true);
      setBarrierRemaining(3);
      setMessage("🛡 バリア展開！3秒間無敵");
      // Countdown tick
      let remaining = 3;
      const tick = setInterval(() => {
        remaining -= 1;
        setBarrierRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(tick);
          setBarrierActive(false);
          setBarrierRemaining(0);
        }
      }, 1000);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (skillType === "foresee") {
      setForeseeMode(3);
      const startedAt = Date.now();
      setForeseeStartTime(startedAt);
      setMessage("🔮 次の3マスを予知… マスを選んで");
      // Auto-cancel if player doesn't use within 20 seconds
      setTimeout(() => {
        setForeseeMode(prev => {
          if (prev > 0) {
            // Accumulate the time spent in foresee mode into offset
            setForeseeTimeOffset(off => off + (Date.now() - startedAt));
            setMessage("🔮 予知の時間切れ…");
            setTimeout(() => setMessage(""), 1500);
          }
          return 0;
        });
      }, 20000);
      return;
    }

    if (skillType === "rush") {
      // Pick a random unrevealed cell as center, blast 5x5 area with 70% hit chance per cell
      const candidates = [];
      board.forEach((c, i) => {
        if (!c.revealed && !c.flagged) candidates.push(i);
      });
      if (candidates.length === 0) {
        setMessage("🐾 開ける場所がない…");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      const center = candidates[Math.floor(Math.random() * candidates.length)];
      const r0 = Math.floor(center / stage.cols);
      const c0 = center % stage.cols;
      const newBoard = board.map(c => ({ ...c }));
      let hits = 0;
      const hitIndices = [];
      // 5x5 area (2-cell radius) with 70% hit chance per unrevealed tile
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = r0 + dr, nc = c0 + dc;
          if (nr < 0 || nr >= stage.rows || nc < 0 || nc >= stage.cols) continue;
          const ni = nr * stage.cols + nc;
          if (newBoard[ni].revealed) continue;
          if (Math.random() >= 0.7) continue; // 70% hit rate
          hits++;
          hitIndices.push(ni);
          if (newBoard[ni].type === "dog") {
            newBoard[ni].flagged = true;
          } else if (newBoard[ni].type === "empty") {
            newBoard[ni].revealed = true;
          }
          // cats left untouched — player still needs to rescue them
        }
      }
      setBoard(newBoard);
      triggerPawEffects(hitIndices, { stagger: 40, big: true });
      setMessage(`🐾💨 ねこラッシュ！${hits}マス開いた`);
      setTimeout(() => setMessage(""), 2200);
      return;
    }
    if (skillType === "lucky") {
      if (luckyShield) {
        setMessage("🍀 すでにバリアが張られている！");
      } else {
        setLuckyShield(true);
        setMessage("🍀 ラッキー！次の犬を無効化");
      }
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (skillType === "mark") {
      // Find all unrevealed cat cells
      const catCells = [];
      board.forEach((c, i) => {
        if (!c.revealed && c.type === "cat") catCells.push(i);
      });
      if (catCells.length === 0) {
        setMessage("🎯 もう発見できる猫はいない…");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      const picked = catCells[Math.floor(Math.random() * catCells.length)];
      setMarkedCatIdx(picked);
      setMessage("🎯 猫の位置をマーク！");
      setTimeout(() => setMessage(""), 2500);
      // Auto-clear mark after 6 seconds
      setTimeout(() => {
        setMarkedCatIdx(prev => (prev === picked ? -1 : prev));
      }, 6000);
      return;
    }

    if (skillType === "line") {
      // Pick a random row that has unrevealed cells, open all unrevealed cells in it
      // Dog cells convert to flagged
      const rowsWithUnrevealed = [];
      for (let r = 0; r < stage.rows; r++) {
        for (let c = 0; c < stage.cols; c++) {
          const i = r * stage.cols + c;
          if (!board[i].revealed && !board[i].flagged) {
            rowsWithUnrevealed.push(r);
            break;
          }
        }
      }
      if (rowsWithUnrevealed.length === 0) {
        setMessage("➡️ 開ける場所がない…");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      const row = rowsWithUnrevealed[Math.floor(Math.random() * rowsWithUnrevealed.length)];
      const newBoard = board.map(c => ({ ...c }));
      const hitIndices = [];
      for (let c = 0; c < stage.cols; c++) {
        const i = row * stage.cols + c;
        if (newBoard[i].revealed || newBoard[i].flagged) continue;
        hitIndices.push(i);
        if (newBoard[i].type === "dog") {
          newBoard[i].flagged = true;
        } else if (newBoard[i].type === "empty") {
          newBoard[i].revealed = true;
        }
        // cats untouched
      }
      setBoard(newBoard);
      triggerPawEffects(hitIndices, { stagger: 50 });
      setMessage(`➡️ ${row + 1}行目をサーチ！`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (skillType === "cross") {
      // Check there's at least one selectable cell
      const hasCandidates = board.some(c => !c.revealed && !c.flagged);
      if (!hasCandidates) {
        setMessage("✨ 開ける場所がない…");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      setCrossSelecting(true);
      const startedAt = Date.now();
      setCrossStartTime(startedAt);
      setMessage("✨ じゅうじサーチ：中心マスを選んで（縦9マス）");
      // Auto-cancel if player doesn't choose within 20 seconds
      setTimeout(() => {
        setCrossSelecting(prev => {
          if (prev) {
            setForeseeTimeOffset(off => off + (Date.now() - startedAt));
            setMessage("✨ サーチがキャンセルされた…");
            setTimeout(() => setMessage(""), 1500);
          }
          return false;
        });
      }, 20000);
      return;
    }
  };

  const handleClick = (idx, e) => {
    if (gameState !== "playing" || dogAttack) return;
    // Skip hint animation if still playing
    if (hintPhase !== "done") {
      skipHint();
      return;
    }
    // Foresee mode: show preview of this cell instead of opening it
    if (foreseeMode > 0 && !board[idx].revealed && !board[idx].flagged) {
      const cell = board[idx];
      let preview;
      if (cell.type === "dog") preview = { idx, type: "dog", label: "🐕 犬マス！" };
      else if (cell.type === "cat") preview = { idx, type: "cat", label: `🐱 ${cell.catType.name}` };
      else preview = { idx, type: "empty", label: `空白 (犬${cell.dogCount}/猫${cell.catCount})` };
      setForeseePreview(preview);
      const newCount = foreseeMode - 1;
      setForeseeMode(newCount);
      if (newCount > 0) {
        setMessage(`🔮 ${preview.label}  (あと${newCount}マス)`);
      } else {
        // Last tap consumed — accumulate elapsed foresee time into offset
        setForeseeTimeOffset(off => off + (Date.now() - foreseeStartTime));
        setMessage(`🔮 ${preview.label}`);
      }
      setTimeout(() => setMessage(""), 3000);
      setTimeout(() => setForeseePreview(null), 4000);
      return;
    }
    // Cross selection mode: tapping picks the center for cross-shape (center + 4 up + 4 down + 4 left + 4 right... wait, that's 17)
    // Per user spec: total 9 cells = center + 2 vertical + 2 horizontal? No — re-reading: 中心＋上下4マス＋左右4マス合計9マス
    // Interpretation: center(1) + up(2) + down(2) + left(2) + right(2) = 9 cells
    if (crossSelecting && !board[idx].revealed && !board[idx].flagged) {
      const r0 = Math.floor(idx / stage.cols);
      const c0 = idx % stage.cols;
      const newBoard = board.map(c => ({ ...c }));
      const hitIndices = [];
      const ARM = 2; // 2 cells in each of 4 directions + center = 9 cells
      // Center
      if (!newBoard[idx].revealed && !newBoard[idx].flagged) {
        hitIndices.push(idx);
        if (newBoard[idx].type === "dog") newBoard[idx].flagged = true;
        else if (newBoard[idx].type === "empty") newBoard[idx].revealed = true;
      }
      // Vertical arm
      for (let dr = -ARM; dr <= ARM; dr++) {
        if (dr === 0) continue;
        const nr = r0 + dr;
        if (nr < 0 || nr >= stage.rows) continue;
        const i = nr * stage.cols + c0;
        if (newBoard[i].revealed || newBoard[i].flagged) continue;
        hitIndices.push(i);
        if (newBoard[i].type === "dog") newBoard[i].flagged = true;
        else if (newBoard[i].type === "empty") newBoard[i].revealed = true;
      }
      // Horizontal arm
      for (let dc = -ARM; dc <= ARM; dc++) {
        if (dc === 0) continue;
        const nc = c0 + dc;
        if (nc < 0 || nc >= stage.cols) continue;
        const i = r0 * stage.cols + nc;
        if (newBoard[i].revealed || newBoard[i].flagged) continue;
        hitIndices.push(i);
        if (newBoard[i].type === "dog") newBoard[i].flagged = true;
        else if (newBoard[i].type === "empty") newBoard[i].revealed = true;
      }
      setBoard(newBoard);
      // Trigger center beam effect (light-only, no paw effects)
      setCrossEffect({ centerIdx: idx, key: Date.now() });
      setTimeout(() => setCrossEffect(null), 700);
      // Accumulate selection time into offset
      setForeseeTimeOffset(off => off + (Date.now() - crossStartTime));
      setCrossSelecting(false);
      setMessage(`✨ じゅうじサーチ！${hitIndices.length}マス`);
      setTimeout(() => setMessage(""), 2000);
      return;
    }
    // Flag mode: tap toggles flag instead of revealing
    if (flagMode) {
      if (board[idx].revealed) return;
      const newBoard = board.map(c => ({ ...c }));
      newBoard[idx].flagged = !newBoard[idx].flagged;
      setBoard(newBoard);
      return;
    }
    if (board[idx].revealed || board[idx].flagged) return;
    const newBoard = board.map(c => ({ ...c }));
    const cell = newBoard[idx];

    if (cell.type === "dog") {
      cell.revealed = true;
      setBoard(newBoard);
      // Barrier: full immunity for 3s
      if (barrierActive) {
        setMessage("🛡 バリアが犬を弾いた！");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      // Lucky shield: nullify one hit
      if (luckyShield) {
        setLuckyShield(false);
        setMessage("🍀 ラッキー！ダメージを無効化！");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      setHitDogThisStage(true);
      // Trigger dog attack animation
      setDogAttack(true);
      setTimeout(() => {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          const finalBoard = newBoard.map(c => ({ ...c, revealed: true }));
          setBoard(finalBoard);
          setGameState("lost");
          setMessage("");
        } else {
          setMessage(`野良犬だ！ ライフ残り ${newLives}`);
          setTimeout(() => setMessage(""), 2000);
        }
      }, 800);
      setTimeout(() => setDogAttack(false), 1100);
      return;
    }

    if (cell.type === "cat") {
      cell.revealed = true;
      const cat = cell.catType;
      const newRescued = [...rescued, cat];
      setRescued(newRescued);
      setCatRescueCount(c => c + 1);
      setScore(s => s + SCORING.catRescue);
      setSkillGauge(g => Math.min(100, g + 25));
      setMessage(`${cat.name}を保護した！`);
      setTimeout(() => setMessage(""), 2500);
      // Trigger rescue effect at cell position
      if (e && e.currentTarget) {
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const effectId = Date.now() + Math.random();
        const variant = Math.floor(Math.random() * 3);
        setCatRescue({ x: cx, y: cy, catKey: cat.key, id: effectId, variant });
        setTimeout(() => {
          setCatRescue(prev => (prev && prev.id === effectId) ? null : prev);
        }, 750);
      }
      if (newRescued.length >= stage.cats) {
        newBoard.forEach(c => { c.revealed = true; });
        setGameState("won");
        const perfect = lives === 3;
        if (perfect) setIsPerfect(true);
        // Compute breakdown after a moment, when state has updated
        setTimeout(() => {
          finalizeStageScore(newBoard);
        }, 50);
        setCollection(prev => {
          const updated = [...prev];
          newRescued.forEach(c => { if (!updated.find(x => x.key === c.key)) updated.push(c); });
          return updated;
        });
      }
      setBoard(newBoard);
      return;
    }

    // Empty cell click — do flood fill and count opened cells
    const wasNumberCell = cell.dogCount > 0 || cell.catCount > 0;
    floodFill(newBoard, stage.rows, stage.cols, idx);
    setBoard(newBoard);
    const revealedDelta = newBoard.filter(c => c.revealed).length - board.filter(c => c.revealed).length;
    setCellsOpened(c => c + revealedDelta);
    if (wasNumberCell) setManualNumberCells(c => c + 1);
    // Base score from cell opening
    const baseGain = revealedDelta * SCORING.cellOpen + (wasNumberCell ? SCORING.numberCellManual : 0);
    setScore(s => s + baseGain);
    // Gauge: +5 for first cell, +1 for each chain-revealed cell
    const gain = 5 + Math.max(0, revealedDelta - 1);
    setSkillGauge(g => Math.min(100, g + gain));
  };

  const handleRightClick = (idx) => {
    if (gameState !== "playing" || board[idx].revealed) return;
    const newBoard = board.map(c => ({ ...c }));
    newBoard[idx].flagged = !newBoard[idx].flagged;
    setBoard(newBoard);
  };

  const nextStage = () => {
    // Add this stage's rescued cats to lap record
    setLapCats(prev => [...prev, ...rescued.map(c => c.key)]);
    if (stageIdx < STAGES.length - 1) {
      initStage(stageIdx + 1);
      setScreen("game");
    } else {
      // Final stage cleared — go to roulette
      setScreen("roulette");
      setRoulettePhase("idle");
      setRouletteResult(null);
    }
  };

  // Get effective dog count for current stage considering lap difficulty

  // ─── Roulette Screen ────────────────────────────────────
  // ─── Encounter Screen (replaces roulette) ────────────────────


  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${stage.bg} 0%, #fafafa 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: ff, padding: "12px 8px",
    }}>

      <DogAttack active={dogAttack} />

      <CatRescue data={catRescue} />

      <StageClearOverlay active={isWon} particles={stageClearParticles} />

      <PerfectFireworks active={isPerfect} bursts={fireworkBursts} />

      <GameOverOverlay active={gameState === "lost" && !dogAttack} />

      <SkillFlash flash={skillFlash} />

      <UnlockBanner banner={unlockBanner} />

      <PawEffects effects={pawEffects} />

      <CrossEffect effect={crossEffect} boardRef={boardRef} cols={stage.cols} />

      <Toast message={message} gameState={gameState} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{stage.emoji}</span>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#37474f", margin: 0 }}>
          ステージ {stageIdx + 1}: {stage.name}
        </h2>
      </div>

      <div style={{
        display: "flex", gap: 12, alignItems: "center", marginBottom: 8,
        background: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "6px 14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 14, fontWeight: 600,
        flexWrap: "wrap", justifyContent: "center",
      }}>
        <span>❤️ {"♥".repeat(lives)}{"♡".repeat(3 - lives)}</span>
        <span>🐱 {rescued.length}/{stage.cats}</span>
        <span>⭐ {score}</span>
        {luckyShield && (
          <span style={{
            background: "#c8e6c9", color: "#2e7d32",
            padding: "2px 8px", borderRadius: 10,
            fontSize: 11, fontWeight: 800,
            animation: "skillPulse 1.5s ease-in-out infinite",
          }}>🍀 バリア</span>
        )}
        {barrierActive && (
          <span style={{
            background: "#cfd8dc", color: "#37474f",
            padding: "2px 8px", borderRadius: 10,
            fontSize: 11, fontWeight: 800,
            animation: "skillPulse 1s ease-in-out infinite",
          }}>🛡 {barrierRemaining}s</span>
        )}
        {foreseeMode > 0 && (
          <span style={{
            background: "#e1bee7", color: "#4a148c",
            padding: "2px 8px", borderRadius: 10,
            fontSize: 11, fontWeight: 800,
            animation: "skillPulse 1.2s ease-in-out infinite",
          }}>🔮 {foreseeMode}</span>
        )}
        {crossSelecting && (
          <span style={{
            background: "#ffe0b2", color: "#bf360c",
            padding: "2px 8px", borderRadius: 10,
            fontSize: 11, fontWeight: 800,
            animation: "skillPulse 1s ease-in-out infinite",
          }}>✨ 選択中</span>
        )}
        <button
          onClick={() => setFlagMode(!flagMode)}
          style={{
            background: flagMode ? "linear-gradient(135deg, #ffd54f, #ffa726)" : "#fff",
            border: flagMode ? "2px solid #f57c00" : "2px solid #ccc",
            borderRadius: 16, padding: "4px 12px",
            cursor: "pointer", fontSize: 12, fontWeight: 800,
            color: flagMode ? "#fff" : "#666",
            boxShadow: flagMode ? "0 2px 6px rgba(245,124,0,0.4)" : "none",
            transition: "all 0.15s",
          }}
        >🚩 {flagMode ? "フラグON" : "フラグ"}</button>
        <button
          onClick={() => setShowCollection(!showCollection)}
          style={{
            background: "none", border: "1px solid #ccc", borderRadius: 8,
            padding: "2px 8px", cursor: "pointer", fontSize: 12, color: "#666",
          }}
        >図鑑 {collection.length}</button>
      </div>

      {/* Skill gauge bar */}
      {(() => {
        const cat = CAT_TYPES.find(c => c.key === companion) || CAT_TYPES[0];
        const skill = SKILLS[cat.skill];
        const ready = skillGauge >= 100;
        return (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.85)", borderRadius: 12,
            padding: "6px 10px", marginBottom: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: 360, width: "100%",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${skill.color}22`,
              border: `2px solid ${skill.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Sprite name={cat.key} size={28} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: "#666",
                display: "flex", justifyContent: "space-between",
              }}>
                <span>{skill.icon} {skill.name}</span>
                <span>{Math.floor(skillGauge)}%</span>
              </div>
              <div style={{
                height: 8, background: "#e0e0e0", borderRadius: 4,
                overflow: "hidden", marginTop: 2,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
              }}>
                <div style={{
                  width: `${skillGauge}%`, height: "100%",
                  background: ready
                    ? `linear-gradient(90deg, #ffd54f, #ffa726, #ff7043)`
                    : `linear-gradient(90deg, #b0bec5, ${skill.color})`,
                  borderRadius: 4,
                  transition: "width 0.3s ease-out",
                  boxShadow: ready ? `0 0 8px ${skill.color}` : "none",
                  animation: ready ? "gaugeShimmer 1.5s ease-in-out infinite" : "none",
                }} />
              </div>
            </div>
            <button
              onClick={() => {
                if (crossSelecting) {
                  // Cancel cross selection
                  setForeseeTimeOffset(off => off + (Date.now() - crossStartTime));
                  setCrossSelecting(false);
                  setMessage("✨ サーチをキャンセルした");
                  setTimeout(() => setMessage(""), 1500);
                  return;
                }
                activateSkill();
              }}
              disabled={!ready && !crossSelecting}
              style={{
                padding: "6px 14px", borderRadius: 16,
                fontSize: 12, fontWeight: 800,
                background: crossSelecting
                  ? "linear-gradient(135deg, #ef5350, #c62828)"
                  : ready
                    ? `linear-gradient(135deg, ${skill.color}, ${skill.color}cc)`
                    : "#ccc",
                color: "#fff", border: "2px solid #fff",
                cursor: (ready || crossSelecting) ? "pointer" : "not-allowed",
                boxShadow: crossSelecting
                  ? "0 3px 8px rgba(198,40,40,0.5)"
                  : ready ? `0 3px 8px ${skill.color}66` : "none",
                animation: (ready && !crossSelecting) ? "skillPulse 1.2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }}
            >{crossSelecting ? "中止" : "発動"}</button>
          </div>
        );
      })()}

      <div ref={boardRef} style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${stage.cols}, ${cellSize}px)`,
        gap: 3, padding: 8,
        background: flagMode ? "rgba(255, 224, 130, 0.85)" : "rgba(255,255,255,0.6)",
        borderRadius: 12,
        boxShadow: flagMode ? "0 0 0 3px #ffa726, 0 4px 20px rgba(255,167,38,0.3)" : "0 4px 20px rgba(0,0,0,0.08)",
        marginBottom: 8,
        transition: "all 0.2s",
        animation: dogAttack ? "attackShake 0.6s ease-in-out" : (hintPhase !== "done" ? "boardFadeIn 0.4s ease-out" : "none"),
      }}>
        {board.map((cell, i) => (
          <Cell key={i} cell={cell}
            onClick={(e) => handleClick(i, e)}
            onRightClick={() => handleRightClick(i)}
            gameOver={gameState !== "playing"}
            peeking={peekingDogs}
            marked={markedCatIdx === i}
            foreseeing={foreseeMode > 0}
            foreseePreview={foreseePreview && foreseePreview.idx === i}
            crossTarget={crossSelecting} />
        ))}
        {/* Hint highlight overlay */}
        {hintIdx >= 0 && hintPhase !== "done" && (() => {
          const row = Math.floor(hintIdx / stage.cols);
          const col = hintIdx % stage.cols;
          const cx = 8 + col * (cellSize + 3) + cellSize / 2;
          const cy = 8 + row * (cellSize + 3) + cellSize / 2;
          // Generate 10 particles at radial positions
          const particles = Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const distance = 120 + (i % 2) * 30;
            return {
              i,
              startX: Math.cos(angle) * distance,
              startY: Math.sin(angle) * distance,
              delay: (i % 3) * 0.04,
              emoji: i % 3 === 0 ? "✨" : (i % 3 === 1 ? "⭐" : "💫"),
            };
          });
          return (
            <div style={{
              position: "absolute", left: 0, top: 0,
              width: "100%", height: "100%",
              pointerEvents: "none",
            }}>
              {/* Converging particles */}
              {hintPhase === "converge" && particles.map(p => (
                <div key={p.i} style={{
                  position: "absolute", left: cx, top: cy,
                  fontSize: 18,
                  "--start-x": `${p.startX}px`,
                  "--start-y": `${p.startY}px`,
                  animation: `hintParticleConverge 0.48s cubic-bezier(0.4, 0, 0.7, 1) ${p.delay}s forwards`,
                  filter: "drop-shadow(0 0 6px #fff59d) drop-shadow(0 0 10px #ffd54f)",
                } as CSSProperties}>{p.emoji}</div>
              ))}
              {/* Burst flash at center */}
              {(hintPhase === "flash" || hintPhase === "badge") && (
                <div style={{
                  position: "absolute", left: cx, top: cy,
                  width: cellSize + 20, height: cellSize + 20,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,236,130,0.8) 40%, rgba(255,193,7,0.3) 65%, transparent 80%)",
                  animation: "hintFlash 0.25s ease-out forwards",
                }} />
              )}
              {/* Light bulb badge */}
              {hintPhase === "badge" && (
                <div style={{
                  position: "absolute", left: cx, top: cy,
                  fontSize: 28,
                  animation: "hintBadgePop 0.2s ease-out forwards",
                  filter: "drop-shadow(0 2px 6px rgba(255,193,7,0.8))",
                }}>💡</div>
              )}
            </div>
          );
        })()}
      </div>

      {rescued.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {rescued.map((cat, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 10, padding: "4px 10px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)", fontSize: 11,
              display: "flex", alignItems: "center", gap: 4,
              animation: "pop 0.3s ease-out",
            }}>
              <Sprite name={cat.key} size={22} />
              <span style={{ fontWeight: 700 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      )}

      {gameState !== "playing" && (
        <div style={{
          position: "fixed",
          top: gameState === "won" ? "50%" : "auto",
          bottom: gameState === "lost" ? "15%" : "auto",
          left: "50%",
          transform: gameState === "won" ? "translate(-50%, -50%)" : "translateX(-50%)",
          zIndex: 270,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          maxHeight: "92vh",
          width: "min(92vw, 380px)",
          animation: gameState === "lost"
            ? "gameOverSub 0.9s ease-out 2.9s both"
            : "wonPanelIn 0.6s ease-out 1.8s both",
        }}>
          {gameState === "won" && scoreBreakdown && (
            <div style={{
              background: isNewBest
                ? "linear-gradient(135deg, #fff59d, #ffd54f, #ffa726)"
                : "linear-gradient(135deg, #fff9c4, #ffe082)",
              border: isNewBest ? "3px solid #ffeb3b" : "3px solid #fff",
              borderRadius: 20,
              padding: "14px 18px",
              color: "#bf360c",
              textAlign: "center",
              boxShadow: isNewBest
                ? "0 8px 32px rgba(255,193,7,0.6), 0 0 0 4px rgba(255,235,59,0.4)"
                : "0 8px 24px rgba(0,0,0,0.25)",
              width: "100%",
              maxHeight: "78vh",
              overflowY: "auto",
              animation: isNewBest ? "newBestGlow 2s ease-in-out infinite" : "none",
            }}>
              {/* Header */}
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>
                {isPerfect ? "★ パーフェクト！ ★" : "ステージクリア！"}
              </div>
              {isNewBest && (
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #ff5252, #c62828)",
                  color: "#fff",
                  padding: "3px 12px",
                  borderRadius: 12,
                  fontSize: 11, fontWeight: 900,
                  marginBottom: 6,
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  animation: "newBestPulse 0.8s ease-in-out infinite",
                }}>
                  🏆 NEW BEST! 🏆
                </div>
              )}
              {/* Score breakdown items */}
              <div style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: 12,
                padding: "8px 12px",
                marginTop: 6,
                fontSize: 11,
                fontWeight: 700,
                textAlign: "left",
              }}>
                {scoreBreakdown.items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "2px 0",
                    color: item.highlight ? "#d84315" : "#5d4037",
                    fontWeight: item.highlight ? 800 : 600,
                  }}>
                    <span>{item.label}</span>
                    <span>+{item.value}</span>
                  </div>
                ))}
                <div style={{
                  borderTop: "1px dashed #bf360c",
                  marginTop: 4, paddingTop: 4,
                  display: "flex", justifyContent: "space-between",
                  fontSize: 11, color: "#5d4037",
                }}>
                  <span>小計</span>
                  <span>{scoreBreakdown.subtotal}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 11, color: "#5d4037",
                }}>
                  <span>{scoreBreakdown.stageName} 補正</span>
                  <span>×{scoreBreakdown.mult}</span>
                </div>
              </div>
              {/* Total with countup */}
              <div style={{
                marginTop: 8,
                padding: "8px 12px",
                background: "linear-gradient(135deg, #ff6f00, #e65100)",
                borderRadius: 14,
                color: "#fff",
                fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                border: "2px solid #fff",
              }}>
                <span style={{ fontSize: 13 }}>合計</span>
                <span style={{ fontSize: 22 }}>{animatedTotal}</span>
              </div>
              {/* Best comparison */}
              <div style={{
                marginTop: 6, fontSize: 11, fontWeight: 700,
                color: "#5d4037",
              }}>
                {isNewBest ? (
                  <>
                    前回ベスト: {scoreBreakdown.prevBest}
                    {scoreBreakdown.prevBest > 0 && (
                      <span style={{ color: "#d84315", marginLeft: 6 }}>
                        → +{scoreBreakdown.total - scoreBreakdown.prevBest} 更新！
                      </span>
                    )}
                  </>
                ) : (
                  <>ベスト: {scoreBreakdown.prevBest}</>
                )}
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            {gameState === "won" && (
              <button onClick={nextStage}
                style={{
                  padding: "14px 32px", fontSize: 16, fontWeight: 800,
                  background: "linear-gradient(135deg, #66bb6a, #2e7d32)",
                  color: "#fff", border: "2px solid #fff", borderRadius: 28, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(46,125,50,0.5)",
                  whiteSpace: "nowrap", minWidth: 200,
                }}>
                {stageIdx < STAGES.length - 1 ? "次のステージへ ▶" : "エンディング ▶"}
              </button>
            )}
            {gameState === "lost" && (
              <>
                <button onClick={() => initStage(stageIdx)}
                  style={{
                    padding: "12px 32px", fontSize: 14, fontWeight: 700,
                    background: "linear-gradient(135deg, #ef5350, #c62828)",
                    color: "#fff", border: "2px solid #fff",
                    borderRadius: 24, cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    whiteSpace: "nowrap", minWidth: 200,
                  }}>
                  リトライ
                </button>
                <button onClick={() => { setLapCats([]); setScreen("title"); }}
                  style={{
                    padding: "10px 28px", fontSize: 13, fontWeight: 700,
                    background: "rgba(255,255,255,0.9)",
                    color: "#546e7a", border: "2px solid #fff",
                    borderRadius: 24, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    whiteSpace: "nowrap", minWidth: 200,
                  }}>
                  🏠 タイトルへ
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <CollectionModal
        open={showCollection}
        onClose={() => setShowCollection(false)}
        collection={collection}
      />

      <div style={{ fontSize: 11, color: "#888", marginTop: 8, textAlign: "center" }}>
        {flagMode ? "🚩 フラグモード：タップで旗を立てる/外す" : "💡 フラグボタンでフラグモード切替"}
      </div>
    </div>
  );
}
