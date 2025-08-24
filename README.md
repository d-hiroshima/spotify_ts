## 技術スタック

- **フレームワーク**: Next.js 14+ (App Router, TypeScript)
- **認証**: NextAuth.js (Spotify OAuth)
- **データベース**: PostgreSQL
- **キャッシュ**: Redis
- **ORM**: Prisma
- **アーキテクチャ**: DDDオニオンアーキテクチャ
- **コンテナ**: Docker

## セットアップ

### 前提条件

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Spotify Developer アカウント

### 1. Spotify App の作成

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) にアクセス
2. 新しいアプリを作成
3. **重要**: Redirect URIに以下を追加（環境に応じて）:
   - 開発環境: `http://127.0.0.1:3000/api/auth/callback/spotify`
   - 本番環境: `https://your-domain.com/api/auth/callback/spotify`
4. Client ID と Client Secret を取得

### 2. 環境変数の設定

`.env` ファイルを作成:

```bash
cp .env.example .env
```

以下の値を設定:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spotify_stats"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="your-secret-key" # openssl rand -base64 32 で生成
AUTH_URL="http://127.0.0.1:3000"
AUTH_SECRET="your-secret-key"
AUTH_TRUST_HOST="true"

# Spotify API
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Application
NEXT_PUBLIC_APP_URL="http://127.0.0.1:3000"
```

**本番環境では**: `.env.production.example`を参考に、すべてのURLを本番ドメインに変更してください。

## 起動方法

### 🚀 開発モード（ホットリロード有効）

```bash
# Docker開発環境でホットリロード
npm run dev:docker

# または
docker-compose -f docker-compose.dev.yml up --build
```

**特徴:**
- ✅ ファイル変更時の自動リロード
- ✅ リアルタイムでコード変更が反映
- ✅ デバッグ情報表示
- ✅ ボリュームマウントによる高速開発

### 🏭 本番モード

```bash
# 本番環境用
npm run prod:docker

# または
docker-compose up --build
```

### 🔧 ローカル開発（Node.js直接実行）

```bash
# 依存関係のインストール
npm install

# データベース起動（PostgreSQL + Redis）
docker-compose up postgres redis -d

# Prisma設定
npx prisma migrate dev
npx prisma generate

# 開発サーバー起動
npm run dev
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
├── components/             # 共通UIコンポーネント
├── domain/                 # ドメインロジック
├── application/            # アプリケーションサービス
├── infrastructure/         # インフラ層
│   ├── config/            # 設定
│   ├── db/                # データベース
│   ├── external-services/ # 外部API
│   └── repositories/      # リポジトリ実装
└── middleware.ts          # NextAuth認証ミドルウェア
```

## 🔧 よく使うコマンド

```bash
# 開発環境起動（ホットリロード）
npm run dev:docker

# 本番環境起動
npm run prod:docker

# ログ確認
docker-compose logs -f app

# コンテナ停止
docker-compose down

# データベースリセット
docker-compose down -v
```

## 🌐 アクセス

- **アプリケーション**: http://127.0.0.1:3000
- **ログイン**: http://127.0.0.1:3000/login
- **ダッシュボード**: http://127.0.0.1:3000/dashboard

**注意**: `localhost`ではなく`127.0.0.1`を使用してください（Spotify OAuth要件）

## 📊 テスト

```bash
# 全テスト実行
npm test

# ユニットテスト
npm run test:unit

# インテグレーションテスト
npm run test:integration

# ドメインテスト
npm run test:domain
```

## 📚 詳細ドキュメント

- [Spotifyセットアップガイド](./docs/spotify-setup.md)
- [デプロイメントガイド](./docs/deployment.md)
- [アーキテクチャ](./docs/spotify-music-stats-architecture.md)