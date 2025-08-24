# デプロイメントガイド

## 環境設定

### 開発環境 (localhost)

1. `.env.example`を`.env`にコピー
2. Spotify Developer Dashboardで開発用アプリを作成
3. Redirect URIに `http://localhost:3000/api/auth/callback/spotify` を追加
4. 環境変数を設定

### 本番環境

1. `.env.production.example`を参考に環境変数を設定
2. Spotify Developer Dashboardで本番用アプリを作成（または既存アプリに本番URIを追加）
3. Redirect URIに `https://your-domain.com/api/auth/callback/spotify` を追加
4. 環境変数を設定：
   - `NEXTAUTH_URL` と `AUTH_URL` を本番ドメインに変更
   - `NEXTAUTH_SECRET` と `AUTH_SECRET` を安全なランダム文字列に変更
   - `NEXT_PUBLIC_APP_URL` を本番ドメインに変更

## Spotify Developer Dashboard設定

### 複数環境の設定方法

#### オプション1: 同一アプリで複数のRedirect URI（推奨）

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)にアクセス
2. アプリを選択
3. Settings > Basic Information
4. Redirect URIsに以下をすべて追加：
   ```
   http://localhost:3000/api/auth/callback/spotify
   http://localhost:3001/api/auth/callback/spotify
   https://your-staging-domain.com/api/auth/callback/spotify
   https://your-production-domain.com/api/auth/callback/spotify
   ```
5. Saveをクリック

#### オプション2: 環境ごとに別アプリ

開発用、ステージング用、本番用で別々のSpotifyアプリを作成し、それぞれに対応する環境変数を設定

### 環境変数の生成

#### AUTH_SECRET / NEXTAUTH_SECRETの生成

```bash
# Linux/Mac
openssl rand -base64 32

# または Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Docker環境での設定

### docker-compose.yml

```yaml
services:
  app:
    environment:
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
      - AUTH_URL=${AUTH_URL:-http://localhost:3000}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
```

### 本番用Docker Compose

```yaml
services:
  app:
    env_file:
      - .env.production
```

## Vercel/Netlifyへのデプロイ

### Vercel

1. プロジェクトをインポート
2. Environment Variablesに以下を設定：
   - `AUTH_URL`: `https://your-vercel-app.vercel.app`
   - `AUTH_SECRET`: 生成したシークレット
   - `AUTH_TRUST_HOST`: `true`
   - `SPOTIFY_CLIENT_ID`: Spotifyアプリの Client ID
   - `SPOTIFY_CLIENT_SECRET`: Spotifyアプリの Client Secret
   - その他必要な環境変数

### カスタムドメイン使用時

カスタムドメインを使用する場合は、すべてのURL関連の環境変数をカスタムドメインに更新：
- `AUTH_URL`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`

Spotify Developer DashboardのRedirect URIも同様に更新が必要です。

## トラブルシューティング

### "Host must be trusted"エラー

- `AUTH_TRUST_HOST=true`が設定されているか確認
- `AUTH_URL`が正しいドメインになっているか確認

### リダイレクトループ

- Spotify Developer DashboardのRedirect URIが正確に一致しているか確認
- 環境変数のURLにtypoがないか確認
- HTTPSを使用している場合、すべてのURLがHTTPSになっているか確認