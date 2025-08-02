# Spotify音楽統計アプリケーション アーキテクチャ設計書（モノリス版）

## 1. システム概要

### 1.1 アプリケーション概要
- **目的**: Spotifyの視聴履歴を分析し、ユーザーの音楽統計情報を可視化するWebアプリケーション
- **アーキテクチャ**: モノリス構成（Next.js フルスタックアプリケーション）
- **主要機能**:
  - Spotify OAuth認証
  - 視聴履歴の取得と保存
  - 統計情報のダッシュボード表示

### 1.2 技術スタック
- **フレームワーク**: Next.js 14+ (App Router, TypeScript)
- **APIルート**: Next.js API Routes
- **データベース**: PostgreSQL
- **セッション管理**: Redis
- **ORM**: Prisma
- **認証**: NextAuth.js
- **コンテナ**: Docker
- **インフラ**: AWS ECS on Fargate

## 2. システムアーキテクチャ

### 2.1 全体構成図（モノリス）

```mermaid
graph TB
    subgraph "Client Browser"
        A[React Components]
    end
    
    subgraph "AWS Cloud"
        subgraph "VPC"
            subgraph "Public Subnet"
                B[Application Load Balancer]
            end
            
            subgraph "Private Subnet 1"
                C[ECS Fargate - Next.js App]
            end
            
            subgraph "Private Subnet 2"
                D[RDS PostgreSQL]
                E[ElastiCache Redis]
            end
        end
    end
    
    subgraph "External Services"
        F[Spotify Web API]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
```

### 2.2 DDDオニオンアーキテクチャ構成

```
/
├── src/
│   ├── app/                        # Next.js App Router (Presentation Layer)
│   │   ├── (auth)/                # 認証関連ページ
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── callback/
│   │   │       └── page.tsx
│   │   ├── dashboard/             # ダッシュボードページ
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── components/
│   │   │       ├── StatsOverview.tsx
│   │   │       ├── TopArtists.tsx
│   │   │       ├── TopTracks.tsx
│   │   │       └── ListeningPatterns.tsx
│   │   ├── api/                   # API Routes (Interface Adapters)
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── logout/
│   │   │   │       └── route.ts
│   │   │   ├── spotify/
│   │   │   │   ├── sync/
│   │   │   │   │   └── route.ts
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   └── stats/
│   │   │       ├── overview/
│   │   │       │   └── route.ts
│   │   │       └── history/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                # 共通UIコンポーネント
│   │   ├── ui/
│   │   └── shared/
│   ├── domain/                    # Domain Layer (Core Business Logic)
│   │   ├── entities/              # エンティティ
│   │   │   ├── User.ts
│   │   │   ├── Track.ts
│   │   │   ├── PlayHistory.ts
│   │   │   └── Statistics.ts
│   │   ├── value-objects/         # 値オブジェクト
│   │   │   ├── UserId.ts
│   │   │   ├── TrackId.ts
│   │   │   ├── DateRange.ts
│   │   │   └── ListeningDuration.ts
│   │   ├── repositories/          # リポジトリインターフェース
│   │   │   ├── IUserRepository.ts
│   │   │   ├── ITrackRepository.ts
│   │   │   ├── IPlayHistoryRepository.ts
│   │   │   └── IStatisticsRepository.ts
│   │   ├── services/              # ドメインサービス
│   │   │   ├── StatisticsCalculator.ts
│   │   │   └── ListeningPatternAnalyzer.ts
│   │   └── errors/                # ドメインエラー
│   │       ├── DomainError.ts
│   │       └── ValidationError.ts
│   ├── application/               # Application Layer (Use Cases)
│   │   ├── use-cases/             # ユースケース
│   │   │   ├── auth/
│   │   │   │   ├── LoginUser.ts
│   │   │   │   └── LogoutUser.ts
│   │   │   ├── spotify/
│   │   │   │   ├── SyncPlayHistory.ts
│   │   │   │   └── RefreshUserToken.ts
│   │   │   └── stats/
│   │   │       ├── GetUserStatistics.ts
│   │   │       ├── GetTopArtists.ts
│   │   │       ├── GetTopTracks.ts
│   │   │       └── GetListeningPatterns.ts
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── UserDto.ts
│   │   │   ├── StatisticsDto.ts
│   │   │   └── PlayHistoryDto.ts
│   │   └── mappers/               # DTOマッパー
│   │       ├── UserMapper.ts
│   │       └── StatisticsMapper.ts
│   ├── infrastructure/            # Infrastructure Layer
│   │   ├── repositories/          # リポジトリ実装
│   │   │   ├── PrismaUserRepository.ts
│   │   │   ├── PrismaTrackRepository.ts
│   │   │   ├── PrismaPlayHistoryRepository.ts
│   │   │   └── CachedStatisticsRepository.ts
│   │   ├── external-services/     # 外部サービス
│   │   │   ├── SpotifyApiClient.ts
│   │   │   └── SpotifyAuthProvider.ts
│   │   ├── cache/                 # キャッシュ実装
│   │   │   └── RedisCache.ts
│   │   ├── db/                    # データベース設定
│   │   │   └── prisma.ts
│   │   └── config/                # インフラ設定
│   │       ├── database.config.ts
│   │       └── redis.config.ts
│   ├── interface-adapters/        # Interface Adapters Layer
│   │   ├── controllers/           # APIコントローラー
│   │   │   ├── AuthController.ts
│   │   │   ├── SpotifyController.ts
│   │   │   └── StatsController.ts
│   │   ├── presenters/            # プレゼンター
│   │   │   └── StatisticsPresenter.ts
│   │   └── validators/            # 入力検証
│   │       ├── AuthValidator.ts
│   │       └── StatsValidator.ts
│   ├── shared/                    # 共有ユーティリティ
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   └── middleware.ts              # Next.js Middleware
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/                         # テストコード
│   ├── unit/
│   │   ├── domain/
│   │   └── application/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.local
├── Dockerfile
├── docker-compose.yml
├── next.config.js
└── package.json
```

### 2.3 オニオンアーキテクチャの層構造

```mermaid
graph TD
    subgraph "外側の層"
        A[Presentation Layer<br/>Next.js Pages/Components]
        B[Infrastructure Layer<br/>Database/External APIs]
    end
    
    subgraph "Interface Adapters"
        C[Controllers<br/>API Routes]
        D[Repositories Implementation<br/>Prisma]
    end
    
    subgraph "Application Layer"
        E[Use Cases<br/>Business Operations]
        F[DTOs & Mappers]
    end
    
    subgraph "Domain Layer (Core)"
        G[Entities<br/>Business Objects]
        H[Value Objects]
        I[Domain Services]
        J[Repository Interfaces]
    end
    
    A --> C
    B --> D
    C --> E
    D --> E
    E --> G
    E --> I
    E --> J
    D -.-> J
```

### 2.4 各層の責務

#### Domain Layer（ドメイン層）
- **責務**: ビジネスロジックとビジネスルールの実装
- **依存**: 他の層に依存しない（最も内側）
- **内容**:
  - Entities: User, Track, PlayHistory
  - Value Objects: UserId, TrackId, DateRange
  - Domain Services: 統計計算、パターン分析
  - Repository Interfaces: データアクセスの抽象化

#### Application Layer（アプリケーション層）
- **責務**: ユースケースの実装とオーケストレーション
- **依存**: Domain Layerのみ
- **内容**:
  - Use Cases: 各機能の具体的な処理フロー
  - DTOs: データ転送オブジェクト
  - Mappers: エンティティとDTOの変換

#### Interface Adapters Layer（インターフェースアダプター層）
- **責務**: 外部とのインターフェース変換
- **依存**: Application Layer, Domain Layer
- **内容**:
  - Controllers: HTTPリクエスト/レスポンスの処理
  - Presenters: データの表示形式への変換
  - Validators: 入力データの検証

#### Infrastructure Layer（インフラストラクチャ層）
- **責務**: 技術的な実装詳細
- **依存**: すべての内側の層
- **内容**:
  - Repository実装: Prismaを使用したデータアクセス
  - 外部サービス: Spotify API クライアント
  - キャッシュ: Redis実装

## 3. 認証フロー設計

### 3.1 NextAuth.js を使用した Spotify OAuth 2.0フロー

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS
    participant NextAuth
    participant Spotify
    participant Database
    
    User->>Browser: ログインボタンをクリック
    Browser->>NextJS: /api/auth/signin
    NextJS->>NextAuth: signIn('spotify')
    NextAuth->>Browser: Spotify認証URLへリダイレクト
    Browser->>Spotify: 認証画面表示
    User->>Spotify: ログイン・権限承認
    Spotify->>Browser: /api/auth/callback/spotify
    Browser->>NextAuth: コールバック処理
    NextAuth->>Spotify: アクセストークン取得
    Spotify->>NextAuth: トークン返却
    NextAuth->>Database: ユーザー情報保存
    NextAuth->>Browser: セッションCookie設定
    Browser->>User: ダッシュボードへリダイレクト
```

### 3.2 必要なSpotifyスコープ
- `user-read-recently-played`: 最近再生した曲の取得
- `user-top-read`: トップアーティスト・トラックの取得
- `user-read-private`: ユーザープロファイル情報
- `user-read-email`: メールアドレス

## 4. データベース設計

### 4.1 Prisma スキーマ

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// NextAuth.js用のテーブル
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String       @id @default(cuid())
  email         String?      @unique
  emailVerified DateTime?
  image         String?
  name          String?
  spotifyId     String?      @unique
  accounts      Account[]
  sessions      Session[]
  playHistory   PlayHistory[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

// アプリケーション固有のテーブル
model PlayHistory {
  id          String   @id @default(cuid())
  userId      String
  trackId     String
  trackName   String
  artistName  String
  albumName   String
  playedAt    DateTime
  durationMs  Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  track       Track?   @relation(fields: [trackId], references: [spotifyId])
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([playedAt(sort: Desc)])
}

model Track {
  spotifyId      String         @id
  name           String
  artists        Json
  album          Json
  durationMs     Int
  popularity     Int?
  audioFeatures  Json?
  playHistories  PlayHistory[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}
```

## 5. API設計（Next.js API Routes）

### 5.1 認証関連エンドポイント（NextAuth.js）
```typescript
// NextAuth.js が自動的に処理
GET /api/auth/signin         // サインインページ
GET /api/auth/callback/*     // OAuth コールバック
GET /api/auth/session        // セッション取得
POST /api/auth/signout       // サインアウト
```

### 5.2 Spotify API エンドポイント
```typescript
// 再生履歴の同期
POST /api/spotify/sync
// NextAuth セッションで認証
Response: {
  success: boolean,
  syncedCount: number
}

// 統計情報取得
GET /api/stats/overview
Query: { period: 'week' | 'month' | 'year' }
Response: {
  totalTracks: number,
  totalDuration: number,
  topArtists: Artist[],
  topTracks: Track[],
  listeningPatterns: Pattern[]
}

// 詳細な再生履歴
GET /api/stats/history
Query: {
  limit?: number,
  offset?: number,
  startDate?: string,
  endDate?: string
}
Response: {
  items: PlayHistory[],
  total: number,
  hasMore: boolean
}
```

### 5.3 DDDオニオンアーキテクチャでの実装例

#### Domain Entity
```typescript
// src/domain/entities/User.ts
import { UserId } from '@/domain/value-objects/UserId';

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: string,
    private readonly displayName: string,
    private readonly spotifyId: string,
    private readonly createdAt: Date
  ) {}

  getId(): UserId {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getSpotifyId(): string {
    return this.spotifyId;
  }

  getDisplayName(): string {
    return this.displayName;
  }
}
```

#### Use Case
```typescript
// src/application/use-cases/stats/GetUserStatistics.ts
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IStatisticsRepository } from '@/domain/repositories/IStatisticsRepository';
import { StatisticsCalculator } from '@/domain/services/StatisticsCalculator';
import { DateRange } from '@/domain/value-objects/DateRange';
import { UserId } from '@/domain/value-objects/UserId';
import { StatisticsDto } from '@/application/dto/StatisticsDto';
import { StatisticsMapper } from '@/application/mappers/StatisticsMapper';

export class GetUserStatistics {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly statisticsRepository: IStatisticsRepository,
    private readonly calculator: StatisticsCalculator
  ) {}

  async execute(userId: string, period: string): Promise<StatisticsDto> {
    const userIdVO = new UserId(userId);
    const user = await this.userRepository.findById(userIdVO);
    
    if (!user) {
      throw new Error('User not found');
    }

    const dateRange = DateRange.fromPeriod(period as 'week' | 'month' | 'year');
    const playHistory = await this.statisticsRepository.getPlayHistory(
      userIdVO,
      dateRange
    );

    const statistics = this.calculator.calculate(playHistory, dateRange);
    
    return StatisticsMapper.toDto(statistics);
  }
}
```

#### Controller (API Route)
```typescript
// src/app/api/stats/overview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/infrastructure/config/auth.config';
import { StatsController } from '@/interface-adapters/controllers/StatsController';

const controller = new StatsController();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const period = request.nextUrl.searchParams.get('period') || 'month';
    const result = await controller.getOverview(session.user.id, period);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

#### Repository Implementation
```typescript
// src/infrastructure/repositories/PrismaUserRepository.ts
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';
import { UserId } from '@/domain/value-objects/UserId';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaUserRepository implements IUserRepository {
  async findById(userId: UserId): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id: userId.getValue() }
    });

    if (!userData) {
      return null;
    }

    return new User(
      userId,
      userData.email || '',
      userData.name || '',
      userData.spotifyId || '',
      userData.createdAt
    );
  }

  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.getId().getValue() },
      update: {
        email: user.getEmail(),
        name: user.getDisplayName()
      },
      create: {
        id: user.getId().getValue(),
        email: user.getEmail(),
        name: user.getDisplayName(),
        spotifyId: user.getSpotifyId()
      }
    });
  }
}
```

### 5.4 依存性注入（DI）設定
```typescript
// src/infrastructure/config/di.config.ts
import { Container } from 'inversify';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository';
import { GetUserStatistics } from '@/application/use-cases/stats/GetUserStatistics';

const container = new Container();

// Repositories
container.bind<IUserRepository>('UserRepository').to(PrismaUserRepository);

// Use Cases
container.bind<GetUserStatistics>(GetUserStatistics).toSelf();

export { container };
```

## 6. Docker構成（モノリス）

### 6.1 Dockerfile
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prismaクライアントの生成
RUN npx prisma generate

# Next.jsのビルド
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 本番イメージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Prismaマイグレーションとアプリケーション起動
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

### 6.2 docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/spotify_stats
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}
      - SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}
    depends_on:
      - postgres
      - redis
    command: sh -c "npx prisma migrate dev && npm run dev"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=spotify_stats
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 7. セキュリティ考慮事項

### 7.1 認証・認可
- NextAuth.js によるセキュアなセッション管理
- HTTPOnly Cookie によるセッション保存
- CSRF保護の自動実装

### 7.2 データ保護
- HTTPS通信の強制（Next.js Middleware）
- 環境変数による機密情報管理
- Prisma によるSQLインジェクション対策

### 7.3 レート制限
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }
  
  return NextResponse.next();
}
```

## 8. パフォーマンス最適化

### 8.1 キャッシュ戦略
- Redis によるAPI結果キャッシュ
- Next.js App Router のキャッシュ機能活用
- React Server Components による効率的なレンダリング

### 8.2 データ取得最適化
```typescript
// Server Component でのデータ取得
// src/app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { StatsService } from '@/services/stats.service';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // 並列データ取得
  const [overview, recentTracks] = await Promise.all([
    StatsService.getOverview(session.user.id, 'month'),
    StatsService.getRecentTracks(session.user.id, 10)
  ]);
  
  return (
    <div>
      {/* Server Component で直接レンダリング */}
    </div>
  );
}
```

## 9. DDDオニオンアーキテクチャの実装ガイドライン

### 9.1 各層の実装原則

#### Domain Layer
- 外部ライブラリへの依存を避ける
- ビジネスロジックに集中
- 単体テストを容易にする設計

#### Application Layer
- ドメインロジックのオーケストレーション
- トランザクション境界の管理
- 外部サービスとの調整

#### Infrastructure Layer
- 技術的詳細の隠蔽
- 外部サービスの抽象化
- パフォーマンス最適化

### 9.2 テスト戦略

```typescript
// tests/unit/domain/services/StatisticsCalculator.test.ts
describe('StatisticsCalculator', () => {
  it('should calculate total listening time correctly', () => {
    const calculator = new StatisticsCalculator();
    const playHistory = [
      new PlayHistory(/* ... */),
      // ...
    ];
    
    const result = calculator.calculate(playHistory, dateRange);
    
    expect(result.totalDuration).toBe(expectedDuration);
  });
});
```

### 9.3 開発のベストプラクティス

1. **依存性の方向**
   - 内側の層は外側の層に依存しない
   - インターフェースを使用した疎結合

2. **ドメイン駆動設計**
   - ユビキタス言語の使用
   - 境界づけられたコンテキストの明確化

3. **クリーンアーキテクチャ**
   - ビジネスロジックの独立性
   - テスタビリティの向上

### 9.4 モノリスの利点を活かしたDDD

- 単一のコードベースでドメイン知識を管理
- リファクタリングが容易
- 開発初期の迅速な実装

### 9.5 将来的な拡張性

- マイクロサービスへの移行パス
- モジュール境界の明確化
- イベント駆動アーキテクチャへの対応

## 10. 環境変数設定

```env
# .env.local
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spotify_stats"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Spotify API
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Monitoring
ENABLE_PERFORMANCE_MONITORING="true"
LOG_LEVEL="info"
```

## 11. DDDオニオンアーキテクチャでのフォルダ構成例

### エンティティの例
```typescript
// src/domain/entities/PlayHistory.ts
import { TrackId } from '@/domain/value-objects/TrackId';
import { UserId } from '@/domain/value-objects/UserId';
import { ListeningDuration } from '@/domain/value-objects/ListeningDuration';

export class PlayHistory {
  constructor(
    private readonly id: string,
    private readonly userId: UserId,
    private readonly trackId: TrackId,
    private readonly trackName: string,
    private readonly artistName: string,
    private readonly albumName: string,
    private readonly playedAt: Date,
    private readonly duration: ListeningDuration
  ) {}

  // ビジネスロジック
  isRecentlyPlayed(): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.playedAt > oneHourAgo;
  }

  wasSkipped(): boolean {
    return this.duration.getSeconds() < 30;
  }
}
```

### 値オブジェクトの例
```typescript
// src/domain/value-objects/DateRange.ts
export class DateRange {
  constructor(
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {
    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  static fromPeriod(period: 'week' | 'month' | 'year'): DateRange {
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    return new DateRange(startDate, endDate);
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  getDaysCount(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

## 12. デプロイメント戦略

### 12.1 CI/CD パイプライン（DDDテスト込み）
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS ECS

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run domain tests
        run: npm run test:domain

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: spotify-music-stats
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster production \
            --service spotify-music-stats \
            --force-new-deployment
```

### 12.2 環境構成
- 開発環境: docker-compose (ローカル)
- ステージング環境: AWS ECS on Fargate
- 本番環境: AWS ECS on Fargate (Auto Scaling設定)

## 13. まとめ

このアーキテクチャは以下の特徴を持ちます：

1. **モノリス構成**: Next.js単体でフロントエンドとバックエンドを実装
2. **DDDオニオンアーキテクチャ**: ビジネスロジックの分離と保守性の向上
3. **TypeScript**: 型安全性による開発効率の向上
4. **Docker/AWS ECS**: スケーラブルなインフラストラクチャ

この設計により、以下が実現できます：
- ビジネスロジックの独立性と再利用性
- テスタビリティの向上
- 将来的なマイクロサービス化への移行パス
- 開発効率と保守性の両立