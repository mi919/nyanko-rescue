# 🐱 にゃんこレスキュー テキスト・ローカライゼーション仕様書

**バージョン:** 2.1
**最終更新:** 2026/04/19

---

## 1. 概要

本書はゲーム内の全テキストを一覧化し、多言語対応時の参照資料とする。現在は日本語のみ。

---

## 2. キャラクター名

| キー | 日本語 | 英語（参考） |
|------|--------|-------------|
| chatora | ちゃとら | Chatora |
| hachi | はちわれ | Hachi |
| mike | みけねこ | Mike |
| munchkin | マンチカン | Munchkin |
| scottish | スコティッシュ | Scottish |
| kuro | くろねこ | Kuro |
| russian | ロシアンブルー | Russian Blue |
| persian | ペルシャ | Persian |
| shiro | しろねこ | Shiro |
| bengal | ベンガル | Bengal |

---

## 3. スキル名・説明

| キー | 名前 | アイコン | 説明文 |
|------|------|---------|--------|
| heal | 回復 | ❤️ | ライフを1回復 |
| lucky | ラッキー | 🍀 | 次のダメージを無効 |
| pawhit | ねこパンチ | 🐾 | 安全マスを3つ開く |
| mark | マーク | 🎯 | 猫の位置を1つ表示 |
| line | ラインサーチ | ➡️ | 横一列を開く |
| cross | じゅうじサーチ | ✨ | 十字方向を開く |
| peek | 透視 | 👁 | 犬マスを3秒表示 |
| foresee | 予知 | 🔮 | 次の3マスの中身を表示 |
| rush | ねこラッシュ | 🐾 | 5×5範囲を一気に開く |
| barrier | バリア | 🛡 | 3秒間ダメージ無効 |

---

## 4. ステージ名

| インデックス | 名前 | 絵文字 | キャプション（オープニング） |
|------------|------|--------|------------------------|
| 0 | にわ | 🌿 | おうちの庭から |
| 1 | こうえん | 🌳 | 近所の公園へ |
| 2 | しょうてんがい | 🏪 | 夕暮れの商店街 |
| 3 | はいきょ | 🏚️ | 月夜の廃墟、最後へ |

オープニングオーバーレイには上記のキャプションに加え、
- `STAGE {N}`（letter-spacing 0.4em の英字ラベル）
- `TAP TO SKIP`（画面下部のスキップ案内）

を表示する。

---

## 5. タイトル画面

| ID | テキスト | 場所 |
|----|---------|------|
| title_logo | にゃんこレスキュー | ロゴ画像（テキストではなく画像） |
| title_subtitle | ねこをさがして、たすけよう。 | サブタイトルリボン |
| title_rule_btn | ルール | 左上ボタン |
| title_collection_btn | 図鑑 | 右上ボタン |
| title_companion_label | 🐾 おともの ねこ ({N} / {total}) | お供選択ヘッダー |
| title_lock_hint | 🔒 あと {N} 匹のおとも候補が… | 未アンロック表示 |
| title_start_btn | 🐾 はじめる 🐾 | スタートボタン |
| title_footer | ライフは**3つ**！全ての猫を保護してクリア！ ❤️ | フッター |
| title_lap | 🌟 {N}周目 | 周回数（2周目以降） |
| title_debug | 🛠 DEBUG: 全猫コンプ | デバッグボタン |

---

## 6. ゲーム画面

### 6-1. ステータスバー

| ID | テキスト | 条件 |
|----|---------|------|
| status_flag_on | 🚩 フラグON | フラグモードON時 |
| status_flag_off | 🚩 フラグ | フラグモードOFF時 |
| status_collection | 図鑑 {N} | 図鑑ボタン |
| status_lucky | 🍀 バリア | luckyShield有効時 |
| status_barrier | 🛡 {N}s | barrier有効時 |
| status_foresee | 🔮 {N} | foreseeMode > 0 |
| status_cross | ✨ 選択中 | crossSelecting時 |
| skill_activate | 発動 | 発動ボタン通常時 |
| skill_cancel | 中止 | cross選択中 |

### 6-2. フッター

| ID | テキスト | 条件 |
|----|---------|------|
| footer_flag_on | 🚩 フラグモード：タップで旗を立てる/外す | フラグON |
| footer_flag_off | 💡 フラグボタンでフラグモード切替 | フラグOFF |

---

## 7. トーストメッセージ

### 7-1. 猫保護

| ID | テキスト |
|----|---------|
| msg_cat_rescued | {猫名}を保護した！ |

### 7-2. 犬関連

| ID | テキスト |
|----|---------|
| msg_dog_hit | 野良犬だ！ ライフ残り {N} |
| msg_game_over | ゲームオーバー… 猫たちは逃げてしまった |
| msg_lucky_block | 🍀 ラッキー！ダメージを無効化！ |
| msg_barrier_block | 🛡 バリアが犬を弾いた！ |

### 7-3. スキル発動

| ID | テキスト |
|----|---------|
| msg_heal_ok | ❤️ ライフを1回復した！ |
| msg_heal_full | ❤️ ライフは満タンだった… |
| msg_lucky_on | 🍀 ラッキー！次の犬を無効化 |
| msg_lucky_dup | 🍀 すでにバリアが張られている！ |
| msg_pawhit | 🐾 {N}マスを発見！ |
| msg_mark_ok | 🎯 猫の位置をマーク！ |
| msg_mark_empty | 🎯 もう発見できる猫はいない… |
| msg_line | ➡️ {N}行目をサーチ！ |
| msg_line_empty | ➡️ 開ける場所がない… |
| msg_cross_select | ✨ じゅうじサーチ：中心マスを選んで（縦9マス） |
| msg_cross_done | ✨ じゅうじサーチ！{N}マス |
| msg_cross_cancel | ✨ サーチをキャンセルした |
| msg_cross_timeout | ✨ サーチがキャンセルされた… |
| msg_cross_empty | ✨ 開ける場所がない… |
| msg_peek | 👁 犬の位置を透視中… |
| msg_foresee_start | 🔮 次の3マスを予知… マスを選んで |
| msg_foresee_result | 🔮 {内容} |
| msg_foresee_result_more | 🔮 {内容}  (あと{N}マス) |
| msg_foresee_timeout | 🔮 予知の時間切れ… |
| msg_rush | 🐾💨 ねこラッシュ！{N}マス開いた |
| msg_rush_empty | 🐾 開ける場所がない… |
| msg_barrier_on | 🛡 バリア展開！3秒間無敵 |

### 7-4. 予知プレビュー内容

| タイプ | テキスト |
|--------|---------|
| dog | 🐕 犬マス！ |
| cat | 🐱 {猫名} |
| empty | 空白 (犬{N}/猫{N}) |

---

## 8. クリア画面

### 8-1. スコアブレイクダウン

| ID | テキスト |
|----|---------|
| score_cat | 🐱 ねこを保護 ×{N} |
| score_cell | 🔓 マス開封 ×{N} |
| score_number | 🔢 数字マス開封 ×{N} |
| score_clear | ✨ クリアボーナス |
| score_life | ❤️ ライフボーナス ×{N} |
| score_perfect | ★ パーフェクト |
| score_speed_fast | ⚡ 超速クリア ({N}秒) |
| score_speed_normal | ⚡ スピードクリア ({N}秒) |
| score_flag_master | 🚩 フラグマスター |
| score_no_hit | 🛡 無傷クリア |
| score_no_skill | 🧘 ノースキル |

### 8-2. その他

| ID | テキスト |
|----|---------|
| clear_title | ステージクリア！ |
| clear_next | 次のステージへ ▶ |
| clear_ending | エンディング ▶ |
| clear_new_best | 🏆 NEW BEST! 🏆 |
| gameover_title | ゲームオーバー |
| gameover_retry | リトライ |
| gameover_title_btn | 🏠 タイトルへ |

---

## 9. 仲間との出会い画面

| ID | テキスト |
|----|---------|
| enc_clear | 🌟 はいきょ クリア！ 🌟 |
| enc_lap | 〜 {N}周目 〜 |
| enc_cats_label | 今回出会った猫たち |
| enc_hint | 草むらに何かの気配が… |
| enc_peek_btn | 🌿 のぞいてみる |
| enc_rustling | …？ だれかいるみたい… |
| enc_appear | あっ…！ |
| enc_result | ✨ {猫名} ✨ |
| enc_result_sub | なかまになりたそうにこちらを見ている！ |
| enc_nakama_btn | 🐾 なかまにする！ |
| enc_empty | 今回は新しい出会いはなかった… |
| enc_empty_sub | でも猫たちはあなたを待っている！ |
| enc_empty_btn | 次の周回へ ▶ |
| enc_complete | 🏆 全てのおともが集結！ 🏆 |
| enc_complete_sub | みんなの力であなたは最高のレスキュー隊長！ |
| enc_complete_btn | さらなる冒険へ ▶ |

---

## 10. ルールモーダル

| ID | テキスト |
|----|---------|
| rule_title | 🎮 あそびかた |
| rule_1 | マス目をタップして**かくれた猫**を見つけよう！ |
| rule_2 | マスの数字は周囲8マスにいる動物の数： |
| rule_dog | **赤** ＝ 野良犬の数 |
| rule_cat | **緑** ＝ 猫の数 |
| rule_3 | 犬マスを開くとライフが1減ります（最大3）。 |
| rule_4 | 全ての猫を保護したらクリア！ |
| rule_close | とじる |

---

## 11. 図鑑モーダル

| ID | テキスト |
|----|---------|
| col_title | 🐱 ねこ図鑑 ({N}/{total}) |
| col_unknown | ？？？ |
| col_skill_prefix | スキル: |
| col_close | とじる |

---

## 12. ルール説明カード（タイトル画面）

| ID | テキスト |
|----|---------|
| card_dog_title | 赤い数字＝犬 |
| card_dog_desc | キケン！ライフが減るよ |
| card_cat_title | 緑の数字＝猫 |
| card_cat_desc | みつけて保護しよう！ |
| card_flag_title | 長押しでフラグ |
| card_flag_desc | あやしいマスに立てよう |

---

## 13. ローカライゼーション実装方針

### 13-1. 推奨構造

```javascript
// i18n/ja.js
export default {
  title_start_btn: "🐾 はじめる 🐾",
  msg_cat_rescued: (name) => `${name}を保護した！`,
  // ...
};

// i18n/en.js
export default {
  title_start_btn: "🐾 Start 🐾",
  msg_cat_rescued: (name) => `${name} rescued!`,
  // ...
};
```

### 13-2. テキスト埋め込みの注意

- テンプレートリテラル（`${変数}を保護した！`）が多用されている
- 多言語化時は関数型テンプレートに変換が必要
- 絵文字は全言語共通で使用可能

---

*本仕様書は現プログラム実装を正として記述。*
