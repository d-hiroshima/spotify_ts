import { IPlayHistoryRepository } from '@/domain/repositories/IPlayHistoryRepository'
import { PlayHistory } from '@/domain/entities/PlayHistory'
import { UserId } from '@/domain/value-objects/UserId'
import { TrackId } from '@/domain/value-objects/TrackId'
import { ListeningDuration } from '@/domain/value-objects/ListeningDuration'
import { DateRange } from '@/domain/value-objects/DateRange'
import { prisma } from '@/infrastructure/db/prisma'

export class PrismaPlayHistoryRepository implements IPlayHistoryRepository {
  async findByUserIdAndDateRange(
    userId: UserId,
    dateRange: DateRange
  ): Promise<PlayHistory[]> {
    const histories = await prisma.playHistory.findMany({
      where: {
        userId: userId.getValue(),
        playedAt: {
          gte: dateRange.getStartDate(),
          lte: dateRange.getEndDate()
        }
      },
      orderBy: {
        playedAt: 'desc'
      }
    })

    return histories.map(history => this.toDomainEntity(history))
  }

  async findRecentByUserId(
    userId: UserId,
    limit: number
  ): Promise<PlayHistory[]> {
    const histories = await prisma.playHistory.findMany({
      where: {
        userId: userId.getValue()
      },
      orderBy: {
        playedAt: 'desc'
      },
      take: limit
    })

    return histories.map(history => this.toDomainEntity(history))
  }

  async save(playHistory: PlayHistory): Promise<void> {
    await prisma.playHistory.create({
      data: {
        userId: playHistory.getUserId().getValue(),
        trackId: playHistory.getTrackId().getValue(),
        trackName: playHistory.getTrackName(),
        artistName: playHistory.getArtistName(),
        albumName: playHistory.getAlbumName(),
        playedAt: playHistory.getPlayedAt(),
        durationMs: playHistory.getDuration().getMilliseconds()
      }
    })
  }

  async saveMany(playHistories: PlayHistory[]): Promise<void> {
    const data = playHistories.map(history => ({
      userId: history.getUserId().getValue(),
      trackId: history.getTrackId().getValue(),
      trackName: history.getTrackName(),
      artistName: history.getArtistName(),
      albumName: history.getAlbumName(),
      playedAt: history.getPlayedAt(),
      durationMs: history.getDuration().getMilliseconds()
    }))

    await prisma.playHistory.createMany({
      data,
      skipDuplicates: true
    })
  }

  async getLastPlayedAt(userId: UserId): Promise<Date | null> {
    const lastHistory = await prisma.playHistory.findFirst({
      where: {
        userId: userId.getValue()
      },
      orderBy: {
        playedAt: 'desc'
      },
      select: {
        playedAt: true
      }
    })

    return lastHistory?.playedAt || null
  }

  private toDomainEntity(data: any): PlayHistory {
    return new PlayHistory(
      data.id,
      new UserId(data.userId),
      new TrackId(data.trackId),
      data.trackName,
      data.artistName,
      data.albumName,
      data.playedAt,
      ListeningDuration.fromMilliseconds(data.durationMs)
    )
  }
}