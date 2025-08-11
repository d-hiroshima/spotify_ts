import { User } from '@/domain/entities/User'
import { UserId } from '@/domain/value-objects/UserId'

export interface IUserRepository {
  findById(userId: UserId): Promise<User | null>
  findBySpotifyId(spotifyId: string): Promise<User | null>
  save(user: User): Promise<void>
}