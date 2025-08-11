import { IUserRepository } from '@/domain/repositories/IUserRepository'
import { User } from '@/domain/entities/User'
import { UserId } from '@/domain/value-objects/UserId'
import { prisma } from '@/infrastructure/db/prisma'

export class PrismaUserRepository implements IUserRepository {
  async findById(userId: UserId): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id: userId.getValue() }
    })

    if (!userData) {
      return null
    }

    return new User(
      userId,
      userData.email || '',
      userData.name || '',
      userData.spotifyId || '',
      userData.image,
      userData.createdAt,
      userData.updatedAt
    )
  }

  async findBySpotifyId(spotifyId: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { spotifyId }
    })

    if (!userData) {
      return null
    }

    return new User(
      new UserId(userData.id),
      userData.email || '',
      userData.name || '',
      userData.spotifyId || '',
      userData.image,
      userData.createdAt,
      userData.updatedAt
    )
  }

  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.getId().getValue() },
      update: {
        email: user.getEmail(),
        name: user.getDisplayName(),
        image: user.getImageUrl(),
        updatedAt: new Date()
      },
      create: {
        id: user.getId().getValue(),
        email: user.getEmail(),
        name: user.getDisplayName(),
        spotifyId: user.getSpotifyId(),
        image: user.getImageUrl()
      }
    })
  }
}