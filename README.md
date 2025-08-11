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
3. Redirect URI に `http://localhost:3000/api/auth/callback/spotify` を追加
4. Client ID と Client Secret を取得

### 2. 環境変数の設定

`.env.local` ファイルを作成:

```bash
cp .env.local.example .env.local
```

以下の値を設定:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spotify_stats"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=your-secret-key # openssl rand -base64 32 で生成

# Spotify API
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## 起動方法

### 方法1: Docker Compose を使用（推奨）

```bash
# リポジトリをクローン
git clone <repository-url>
cd spotify_ts

# 環境変数を設定
cp .env.local.example .env.local
# .env.localを編集してSpotifyの認証情報を設定

# Docker環境を起動
docker-compose up -d

# 初回のみ: データベースのマイグレーション
docker-compose exec app npm run prisma:migrate

# アプリケーションにアクセス
# http://localhost:3000
```


#### 2. データベースの作成

```bash
# PostgreSQLにログイン
psql -U postgres

# データベースとユーザーを作成
CREATE USER user WITH PASSWORD 'password';
CREATE DATABASE spotify_stats OWNER user;
\q
```

#### 3. アプリケーションのセットアップ

```bash
# 依存関係をインストール
npm install

# Prismaクライアントを生成
npm run prisma:generate

# データベースのマイグレーション
npm run prisma:migrate

# 開発サーバーを起動
npm run dev

# アプリケーションにアクセス
# http://localhost:3000
```

## 開発ツール

### Prisma Studio（データベース管理UI）

```bash
npm run prisma:studio
# http://localhost:5555 でアクセス
```

### データベースのリセット

```bash
# Docker使用時
docker-compose exec app npx prisma migrate reset

# ローカル環境
npx prisma migrate reset
```

## トラブルシューティング

### ポートが使用中の場合

```bash
# PostgreSQL (5432) や Redis (6379) のポートを確認
lsof -i :5432
lsof -i :6379

# Docker Composeの場合、ポート番号を変更可能
# docker-compose.yml の ports セクションを編集
```

### 認証エラーが発生する場合

1. Spotify Developer Dashboardで Redirect URI が正しく設定されているか確認
2. `.env.local` の `NEXTAUTH_SECRET` が設定されているか確認
3. ブラウザのCookieをクリアして再度ログイン

## プロジェクト構造

DDDオニオンアーキテクチャに基づいた構造:

```
src/
├── app/                    # Next.js App Router (Presentation Layer)
├── domain/                 # Domain Layer (Core Business Logic)
├── application/            # Application Layer (Use Cases)
├── infrastructure/         # Infrastructure Layer
└── interface-adapters/     # Interface Adapters Layer
```

## ライセンス

MIT