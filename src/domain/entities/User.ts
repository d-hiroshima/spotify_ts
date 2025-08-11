import { UserId } from '@/domain/value-objects/UserId'

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: string,
    private readonly displayName: string,
    private readonly spotifyId: string,
    private readonly imageUrl: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  getId(): UserId {
    return this.id
  }

  getEmail(): string {
    return this.email
  }

  getSpotifyId(): string {
    return this.spotifyId
  }

  getDisplayName(): string {
    return this.displayName
  }

  getImageUrl(): string | null {
    return this.imageUrl
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }
}