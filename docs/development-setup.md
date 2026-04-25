# 開発環境セットアップ

にゃんこレスキュー（Vite + React 18）の開発環境を構築する手順。

---

## 1. 前提条件

以下のいずれかが利用可能であること。

| 方式 | 必要なもの | 推奨 |
|------|-----------|------|
| Docker | Docker Engine 24+ / Docker Compose v2 | ◎（環境差異なし） |
| ローカル | Node.js 20+ / npm 10+ | ○ |

ブラウザは Chrome / Safari / Firefox 最新版を想定。モバイル動作確認のため Chrome DevTools のデバイスモードを使うとよい。

---

## 2. クイックスタート（Docker）

```bash
git clone <repository-url>
cd nyanko-rescue
docker compose up dev
```

起動後、ブラウザで http://localhost:5173 にアクセスする。

- ソース変更はホットリロードされる（`CHOKIDAR_USEPOLLING=true` によりコンテナ内でも検知）
- 終了は `Ctrl+C`、コンテナ削除は `docker compose down`

---

## 3. ローカル実行（Node.js 直接）

Docker を使わない場合。

```bash
git clone <repository-url>
cd nyanko-rescue
npm install
npm run dev
```

http://localhost:5173 でアクセス可能。`vite.config.js` で `host: "0.0.0.0"` 指定済みのため、同一LAN内の実機からも `http://<開発機IP>:5173` で確認できる。

---

## 4. 本番ビルド確認

### Node 直接

```bash
npm run build      # dist/ に成果物を生成
npm run preview    # http://localhost:4173 でプレビュー
```

### Docker（nginx 配信）

```bash
docker compose --profile prod up --build
```

http://localhost:8080 でアクセス。`Dockerfile` はマルチステージ（build → nginx:1.27-alpine）構成。

---

## 5. ディレクトリ構成

```
nyanko-rescue/
├── src/              # アプリ本体（App.jsx / main.jsx）
├── assets/           # 画像アセット（猫スプライト・背景・ロゴ等）
├── docs/             # 全仕様書（CLAUDE.md 参照）
├── samples/          # プロトタイプ（nyanko-rescue.jsx、参考資料）
├── index.html        # エントリ HTML
├── vite.config.js    # Vite 設定
├── package.json      # スクリプト・依存
├── Dockerfile        # 本番ビルド用（build → nginx）
├── docker-compose.yml# dev / prod プロファイル
└── CLAUDE.md         # プロジェクト規約
```

---

## 6. npm スクリプト

| コマンド | 用途 |
|---------|------|
| `npm run dev` | 開発サーバー起動（HMR、:5173） |
| `npm run build` | 本番ビルド（`dist/` 出力） |
| `npm run preview` | ビルド成果物のプレビュー（:4173） |

---

## 7. 開発の進め方

詳細は [`CLAUDE.md`](../CLAUDE.md) を参照。要点のみ:

1. **計画 → 実装** — 仕様書（`docs/`）とプロトタイプ（`samples/`）を確認したうえで計画を提示し、承認後に実装する
2. **ドキュメント同期更新** — コード変更時は対応する仕様書を同じコミットで更新する
3. **ブランチ運用** — `main` への直接プッシュ禁止。`feat/<内容>` `fix/<内容>` `refactor/<内容>` `docs/<内容>` を切り、PR 経由でマージする
4. **コミットプレフィックス** — `feat:` / `fix:` / `refactor:` / `docs:` / `style:`

---

## 8. トラブルシューティング

| 症状 | 対処 |
|------|------|
| `EADDRINUSE: 5173 already in use` | 他プロセスが使用中。`lsof -i :5173` で確認、または `vite.config.js` の `port` を変更 |
| Docker dev でホットリロードが効かない | `CHOKIDAR_USEPOLLING=true` が設定されているか確認（`docker-compose.yml` の `environment`） |
| `npm install` 後に依存解決エラー | `node_modules` ボリュームを削除して再生成: `docker compose down -v && docker compose up dev` |
| ローカル `node_modules` と Docker 内 `node_modules` の競合 | `docker-compose.yml` で `/app/node_modules` を匿名ボリューム化済み。それでも起きる場合はホスト側の `node_modules` を削除 |
| 実機で表示できない | 開発機のファイアウォール / 同一 Wi-Fi 接続を確認。URL は `http://<開発機IP>:5173` |
| ビルド成果物が古い | `rm -rf dist .vite && npm run build` |

---

## 9. 参考: 仕様書一覧

| ファイル | 内容 |
|---------|------|
| `game-design.md` | ゲームルール・ステージ・猫・スキル・周回 |
| `ui-spec.md` | 画面レイアウト・配色・コンポーネント |
| `animation-spec.md` | 全 51 アニメーション |
| `asset-spec.md` | 画像アセット仕様 |
| `skill-logic.md` | 全 10 スキルの発動ロジック |
| `scoring-detail.md` | スコア計算 |
| `board-algorithm.md` | 盤面生成・フラッドフィル |
| `state-architecture.md` | 全 51 state 変数 |
| `roadmap.md` | 実装状況 |
| `sound-spec.md` | 効果音・BGM（未実装） |
| `localization.md` | テキスト一覧 |
