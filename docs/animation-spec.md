# 🐱 にゃんこレスキュー アニメーション仕様書

**バージョン:** 3.2
**最終更新:** 2026/05/05

---

## 1. 概要

全 51 種類の CSS キーフレームアニメーションを、用途別に分類して定義する。

**v3.0 (PR 2) からの構成変更:**
- 全キーフレームは `src/components/effects/keyframes.ts` の `ALL_KEYFRAMES` テンプレート文字列に集約
- `src/components/effects/KeyframeStyles.tsx` の `<KeyframeStyles />` コンポーネントが `<style>{ALL_KEYFRAMES}</style>` を出力
- `src/main.tsx` で `<KeyframeStyles />` を `<App />` の前に 1 度だけレンダ（グローバル注入）
- v2.x までの 3 箇所に分散していた `<style>` タグは削除済み

---

## 2. 演出カテゴリ一覧

| カテゴリ | アニメーション数 | 用途 |
|---------|--------------|------|
| ステージオープニング | 9 | ステージ開始時の背景＋タイトル演出 |
| 犬噛みつき | 4 | 犬マス開封時の衝撃演出 |
| 猫保護 | 4 | 猫マス開封時の祝福演出 |
| ヒント誘導 | 3 | オープニング後の最初の1マス |
| スキルシステム | 9 | ゲージ・発動・透視・マーク・じゅうじ |
| ステージクリア | 8 | クリア・パーフェクト・NEW BEST |
| ゲームオーバー | 3 | 敗北演出 |
| 仲間との出会い | 8 | 周回クリア後の草むら演出 |
| UI汎用 | 5 | フロート・トースト等 |
| 肉球エフェクト | 1 | スキルで開いたマスの演出 |
| アンロック | 1 | 新キャラ獲得バナー |
| その他 | 5 | 紙吹雪・花びら等 |

---

## 2-1. ステージオープニング演出

### トリガー: `useInitStage(idx)` 呼び出し時（タイトル「はじめる」/ 次のステージへ / リトライ）
### 全体時間: 2400ms（タップで短縮スキップ可）

`uiStore.stageIntroPhase` で `"curtain" → "showing" → "exiting" → "done"` の 4 段階を進行する。
`<StageIntro>` オーバーレイ（z-index: 260）が画面全体を覆い、ステージ背景画像を主役にして
`STAGE N` ラベル＋絵文字＋ステージ名＋短いキャプションを順次出す。

| No. | 名前 | 時間 | easing | 対象 | 内容 |
|-----|------|------|--------|------|------|
| 1 | `stageIntroCurtain` | 0.4s | ease-out | オーバーレイ全体 | opacity 0→1 でフェードイン |
| 2 | `stageIntroBgZoom` | 2.4s | cubic-bezier(0.22,1,0.36,1) | 背景画像 | scale(1.08)→1.0 のゆっくりズームアウト＋彩度復帰 |
| 3 | `stageIntroVignette` | 2.4s | ease-out | 周辺ビネット | opacity 0.55→0.18 のビネット薄化 |
| 4 | `stageIntroLabelIn` | 0.55s @0.15s | cubic-bezier(0.22,1,0.36,1) | "STAGE N" ラベル | translateY(-12px)→0、letter-spacing 0.6em→0.4em |
| 5 | `stageIntroUnderline` | 0.5s @0.45s | cubic-bezier(0.22,1,0.36,1) | 区切り線 | scaleX(0)→1 |
| 6 | `stageIntroEmojiIn` | 0.7s @0.3s | cubic-bezier(0.34,1.56,0.64,1) | ステージ絵文字 | scale(0.6)→1.15→1.0、回転＋バウンス |
| 7 | `stageIntroTitleIn` | 0.55s @0.55s | cubic-bezier(0.22,1,0.36,1) | ステージ名 | translateY(18px)→0、blur(6px)→0 |
| 8 | `stageIntroCaptionIn` | 0.55s @0.85s | ease-out | キャプション | translateY(10px)→0、opacity 0→0.9 |
| 9 | `stageIntroExit` | 0.4s | ease-in | オーバーレイ全体 | opacity 1→0、translateY(0)→-18px |

加えて、オーバーレイ消失と同期させた以下も同カテゴリに含む（key: `stageIntroUiRise`）:

- ゲーム UI ラッパー（盤面・ステータス・ゲージを含む内側コンテナ）に `stageIntroUiRise 0.45s` を当て、
  下から立ち上げる演出。`stageIntroPhase === "exiting"` の間だけ適用する。
- 盤面コンテナの `boardFadeIn 0.4s` も `stageIntroPhase === "exiting"` 時のみ走らせ、
  従来 `hintPhase !== "done"` で発火していた箇所と差し替え（ヒント開始時の二重フェードを防止）。

### フェーズタイミング

```
0ms:    stageIntroPhase = "curtain"
        → curtain + bgZoom + vignette 開始
150ms:  STAGE Nラベル登場
300ms:  ステージ絵文字バウンス
400ms:  stageIntroPhase = "showing"
450ms:  区切り線スライド
550ms:  ステージ名スライドイン
850ms:  キャプション登場
2000ms: stageIntroPhase = "exiting"
        → stageIntroExit + UI rise + board fade in 同時開始
2400ms: stageIntroPhase = "done"
        → ヒント演出（converge）が始動
3150ms: ヒント完了 → 操作可能
```

### スキップ動作

オーバーレイをタップすると `skipStageIntro()` が走り、以下の手順でショートカット:

```
即時:  stageIntroPhase = "exiting"（残りの自動タイムアウトを clearIntroTimeouts でキャンセル）
       stageStartTime = Date.now() + 280  (スキップ時は短い exit を考慮)
280ms: stageIntroPhase = "done"
       → ヒント演出（converge）が始動
```

### スコアタイマーとの関係

`gameStore.stageStartTime` はオープニング完了後に開始される（`Date.now() + 2400`）。
スキップ時は短縮 exit を考慮して `Date.now() + 280` に補正する。
これにより 2.4s の演出時間が「⚡ スピードクリア」ボーナス（30秒/60秒）を圧迫しない。

### 注意事項

- オーバーレイは z-index: 260 で **クリアパネル(270)・ゲームオーバー より下**、
  通常 UI(z-index 1)・トースト(150)・モーダル(200) より上
- `pointerEvents: "auto"` で全画面をスキップタップ領域として扱う
- リトライ時もフル再生（仕様: 周回ごとの場所感を毎回見せたい）
- ヒント演出は **オープニング完了後**に開始（並行して走らない）

---

## 3. 犬噛みつき演出

### トリガー: 犬マスを開封したとき
### 全体時間: 1.1秒

| No. | 名前 | 時間 | easing | 対象 | 内容 |
|-----|------|------|--------|------|------|
| 1 | `dogZoom` | 1.1s | cubic-bezier(0.2,0.8,0.3,1) | 犬画像 | scale(0.2)→1.4→1.25→1.35→1.2→0.6、回転付き |
| 2 | `attackShake` | 0.6s | ease-in-out | 盤面コンテナ | 左右+上下に8px幅で振動 |
| 3 | `redFlash` | 1.1s | ease-out | フルスクリーンオーバーレイ | 透明→赤(0.55)→黒(0.55)→黒(0.45)→透明 |
| 4 | `radiateLines` | 0.6s | ease-out | 衝撃線 | scale(0.3)→1→2.2、フェードアウト |

### 連携タイミング

```
0ms:    redFlash + radiateLines + dogZoom 開始
0ms:    attackShake 開始（盤面のみ）
800ms:  ライフ減算 + トーストメッセージ表示
1100ms: dogAttack = false、全演出終了
```

### 注意事項
- `dogAttack === true` の間、`handleClick` は無効化（誤タップ防止）
- バリア/ラッキーで無効化された場合、噛みつき演出は発生しない

---

## 4. 猫保護演出

### トリガー: 猫マスを開封したとき
### 全体時間: 700ms

| No. | 名前 | 時間 | easing | 対象 | 内容 |
|-----|------|------|--------|------|------|
| 1 | `catPop` | 0.7s | cubic-bezier(0.2,1.5,0.4,1) | 猫スプライト | scale(0)→1.5→1.2→1.0、上方に移動（-130%→-180%）、回転 |
| 2 | `sparkleFly` | 0.6s | ease-out | キラキラ粒子 | 中心→各方向へ放射状に飛散 |
| 3 | `ringExpand` | 0.6s | ease-out | 光のリング | scale(0.3)→2.6、フェードアウト |

### パーティクル配置

7個のキラキラ粒子（💕✨💖🌟）:

| 粒子 | 絵文字 | dx | dy | delay |
|------|--------|----|----|-------|
| 1 | 💕 | -50 | -40 | 0s |
| 2 | ✨ | 50 | -45 | 0.05s |
| 3 | 💖 | -55 | 10 | 0.1s |
| 4 | 🌟 | 55 | 15 | 0.08s |
| 5 | ✨ | 0 | -60 | 0.12s |
| 6 | 💕 | -30 | 50 | 0.15s |
| 7 | 🌟 | 30 | 55 | 0.18s |

各粒子は `--dx`, `--dy` CSS変数で方向を制御。

### 座標の取得
`e.currentTarget.getBoundingClientRect()` でタップしたセルの中心座標を取得し、`position: fixed` で表示。

---

## 5. ヒント誘導演出

### トリガー: ステージ開始時
### 全体時間: 750ms

| No. | 名前 | 時間 | easing | 対象 | 内容 |
|-----|------|------|--------|------|------|
| 1 | `hintParticleConverge` | 0.48s | cubic-bezier(0.4,0,0.7,1) | 10個の粒子 | 外周→中心へ収束 |
| 2 | `hintFlash` | 0.25s | ease-out | ヒントマス背景 | 白→黄→薄黄のフラッシュ |
| 3 | `hintBadgePop` | 0.2s | ease-out | 数字バッジ | scale(0)→1.3→1 のバウンス |

### フェーズタイミング

```
0ms:    hintPhase = "converge"、10粒子の収束開始
500ms:  hintPhase = "flash"、マス開封+フラッシュ
575ms:  hintPhase = "badge"、数字表示
750ms:  hintPhase = "done"、操作可能
```

---

## 6. スキルシステム関連

### 6-1. ゲージ・ボタン（常時ループ）

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `gaugeShimmer` | 1.5s | ゲージバー（満タン時） | brightness 1→1.3→1 |
| `skillPulse` | 1.2s | 発動ボタン（満タン時） | scale 1→1.08→1 |

### 6-2. 発動フラッシュ

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `skillFlash` | 0.6s | 画面中央の放射円 | scale(0)→1.5→2.5、フェードアウト。色はスキルごとに異なる |

### 6-3. 透視

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `peekPulse` | 1s（ループ） | 犬マスのハイライト | box-shadow 0px→4px→0px、赤い光 |

### 6-4. マーク

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `markPulse` | 1s（ループ） | マークした猫マス | box-shadow 8px→16px→8px、緑の光 |

### 6-5. じゅうじサーチ

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `crossPulse` | 1s（ループ） | 選択待ちの全未開封マス | box-shadow 8px→18px→8px、オレンジの光 |
| `crossBeamV` | 0.6s | 縦方向光線 | scaleY(0)→0.6→1→1、フェードアウト |
| `crossBeamH` | 0.6s | 横方向光線 | scaleX(0)→0.6→1→1、フェードアウト |
| `crossHalo` | 0.7s | 外周の光の輪 | scale(0.2)→1→1.6、フェードアウト |
| `crossCore` | 0.6s | 中心の白い核 | scale(0)→1.4→2.2、フェードアウト |

---

## 7. ステージクリア演出

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `wonPanelIn` | 0.5s | クリアパネル全体 | scale(0.8)→1、フェードイン |
| `confettiFall` | 3s | 個々の紙吹雪 | 上から下へ落下+横揺れ |
| `confettiRain` | 3s | 紙吹雪コンテナ | 表示制御 |
| `fireworkBurst` | - | 花火エフェクト | 破裂アニメーション |
| `flashBurst` | - | フラッシュバースト | 閃光 |
| `perfectText` | 2s | 「PERFECT!」テキスト | scale(0)→1.5→1.1→1.2→1.15→1.4、回転付き |
| `newBestGlow` | 2s（ループ） | NEW BESTパネル背景 | 金色の脈動 |
| `newBestPulse` | 1.5s（ループ） | 🏆バッジ | scale(1)→1.2→1 |

---

## 8. ゲームオーバー演出

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `gameOverDrain` | 1.2s | 盤面背景 | 下から赤く染まる |
| `gameOverText` | - | 「ゲームオーバー」テキスト | フェードイン |
| `gameOverSub` | - | サブテキスト | フェードイン（遅延） |

---

## 9. 仲間との出会い演出

### トリガー: はいきょクリア後の出会い画面
### 全体時間: 約4秒

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `grassSway` | 2s（ループ） | 草むら | scaleX/skewXで緩やかに揺れる |
| `grassIntense` | 0.5s（ループ） | 草むら（猫登場前） | skewX/scaleYで激しく揺れる |
| `catEmerge` | 1s | 猫スプライト | translateY(100%)→30%→5%→-5%→0%、フェードイン |
| `softGlow` | 1s | 猫背後の光の輪 | scale(0.3)→1→1.5、opacity 0→0.8→0.4 |
| `nameReveal` | 0.4-0.6s | テキスト要素 | opacity 0→1、translateY(15px)→0 |
| `catsFadeIn` | 0.4s | 出会った猫の一覧 | opacity 0→1、scale(0.5)→1 |
| `completeStar` | 1.5s（ループ） | 全コンプ時の猫並び | scale(1)→1.15→1、rotate(0)→5deg→0 |
| `questionMark` | 0.6s（ループ） | ❓マーク（草むら揺れ中） | translateY(0)→-6px→0 |

### フェーズ連携

```
idle:     grassSway（緩やかな揺れ）
           ↓ 「のぞいてみる」ボタン押下
rustling: grassIntense + questionMark（激しい揺れ + ❓）
           ↓ 1.8秒後
emerging: catEmerge + softGlow（猫登場 + 光の輪）
           ↓ 1.0秒後
revealed: nameReveal（テキスト表示）
```

---

## 10. UI汎用アニメーション

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `float` | 2.5s（ループ） | はじめるボタン | translateY(0)→-8px→0 |
| `pop` | 0.3s | 汎用ポップ | scale(0)→1.3→1 |
| `shake` | 0.4s | 汎用シェイク | translateX -4→4→-3→3→0 |
| `shimmer` | 3s（ループ） | ロゴ | brightness 1→1.15→1 |
| `toastIn` | 0.3s | トースト出現 | translate(-50%,-20px)→(-50%,0)、フェードイン |

---

## 11. 肉球エフェクト

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `catPunch` | 0.4s | 肉球マーク | scale(0)→1.4→1.0→1.6、rotate付き、フェードアウト |

### triggerPawEffects の仕様

```javascript
triggerPawEffects(indices, { stagger = 100, big = false })
```

- `boardRef` からセル座標を計算
- 各セルに肉球エフェクトを配置
- `stagger` ms ずつ遅延して順次表示
- `big = true`: ねこラッシュ用の大きめサイズ
- 自動削除: `totalDuration` ms 後に `setPawEffects` から削除

---

## 12. アンロックバナー

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `unlockBannerIn` | 2.5s | バナー全体 | translate(-50%, 100px)→0→0→100px |

### バナー表示

```
position: fixed, bottom: 60px, left: 50%
background: linear-gradient(135deg, #ffd54f, #ff8a65)
zIndex: 280, pointerEvents: none
内容: Sprite + "✨ 新しいおとも！ ○○が仲間に！"
```

---

## 13. その他

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `boardFadeIn` | - | 盤面全体 | 初期表示のフェードイン |
| `petalFloat` | - | 花びら | 装飾用の浮遊 |
| `catSpin` | - | 猫保護バリエーション | 回転しながら登場 |
| `catJump` | - | 猫保護バリエーション | ジャンプして登場 |

---

## 15. アンビエント・グラスUIアニメ（v3.1 追加）

### トリガー: ゲーム画面の常時演出

| 名前 | 時間 | 対象 | 内容 |
|------|------|------|------|
| `ambientDrift` | 28〜52s linear infinite | 背景ブロブ（5個） | `translate3d(-10%→110%, 0, 0)` で水平に流れる |
| `ambientFloat` | 6〜10s ease-in-out infinite | 背景ブロブ | `translateY(0↔-12px) + scale(1↔1.04)` の上下浮遊 |
| `gaugeGlowPulse` | 1.6s ease-in-out infinite | スキルゲージ猫アイコン | 100%時に `box-shadow` のグロー強弱 |
| `gaugeReadyBurst` | 単発（予約） | スキルゲージ | 0→1.4→2.0倍にスケールしフェード |
| `panelSheen` | 2.4s ease-in-out infinite | スキルゲージパネル | 100%時に半透明白の斜めシーンが横切る |
| `cellRipple` | 0.5s ease-out forwards | セルタップ | タップ位置から放射状の波紋 (radial-gradient) |
| `cellLift` | 単発（予約） | セルホバー | `translateY(0→-2px)` の浮き上がり |
| `breakdownRowIn` | 0.32s ease-out (×0.04i stagger) | クリアパネルの行 | 各行を 40ms ずらしで `translateX(-10px→0)+opacity` |

### 設計意図

- **アンビエント**: 背景の単調さを解消し、グラスUIの透けを引き立てる。`pointerEvents: none` & `zIndex: 0` で操作を阻害しない
- **gaugeGlowPulse / panelSheen**: ゲージ満タン時の発動可能状態を視覚的に強調
- **cellRipple**: タッチフィードバックを Material Design 風に。`pointer-events: none` で誤動作なし
- **breakdownRowIn**: スコア内訳をカスケード表示することで、達成感を演出

### モバイル配慮

- `ambientDrift` と `ambientFloat` は `transform` のみ使用（reflow なし）
- `backdrop-filter` は Safari/iOS Chrome 互換のため `WebkitBackdropFilter` も併記
- `cellRipple` は最大 1 セルあたり数個までに自動消滅（500ms で removal）

---

## 14. レイアウト保護原則

1. **トーストはposition:fixed** → 盤面の位置が動かない
2. **演出はポインターイベントなし** → `pointerEvents: "none"` で誤タップ防止
3. **シェイクは盤面のみ** → 画面全体は揺らさない（モーション酔い防止）
4. **dogAttack中はクリック無効** → 演出中の操作をブロック

---

*本仕様書は現プログラム実装を正として記述。*
