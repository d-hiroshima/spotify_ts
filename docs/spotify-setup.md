# Spotify Developer Dashboard セットアップガイド

## 重要: リダイレクトURI設定

Spotifyのセキュリティ要件により、`localhost`は使用できません。
必ず以下の設定を行ってください。

### 1. Spotify Developer Dashboard での設定

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) にアクセス
2. アプリケーションを選択または作成
3. Settings → Basic Information に移動
4. **Redirect URIs** に以下を追加:
   ```
   http://127.0.0.1:3000/api/auth/callback/spotify
   ```
   ⚠️ **重要**: `localhost`ではなく`127.0.0.1`を使用してください

### 2. 環境変数の設定

`.env`ファイルに以下の設定を確認:

```env
# NextAuth設定 - 必ず127.0.0.1を使用
NEXTAUTH_URL="http://127.0.0.1:3000"
AUTH_URL="http://127.0.0.1:3000"

# Spotify API
SPOTIFY_CLIENT_ID="your-client-id"
SPOTIFY_CLIENT_SECRET="your-client-secret"
```

### 3. アプリケーションへのアクセス

開発時は必ず以下のURLでアクセス:
```
http://127.0.0.1:3000
```

⚠️ `http://localhost:3000` は使用しないでください

## トラブルシューティング

### ログインできない場合

1. Spotify Developer Dashboard のリダイレクトURIが正確に設定されているか確認
2. `.env`ファイルのURLが`127.0.0.1`になっているか確認
3. ブラウザで`http://127.0.0.1:3000`にアクセスしているか確認

### エラー: INVALID_CLIENT

- `SPOTIFY_CLIENT_ID`と`SPOTIFY_CLIENT_SECRET`が正しいか確認

### エラー: INVALID_REDIRECT_URI

- Spotify Developer Dashboard のリダイレクトURIが正確に以下と一致しているか確認:
  ```
  http://127.0.0.1:3000/api/auth/callback/spotify
  ```