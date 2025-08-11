import { PlayHistory } from '@/domain/entities/PlayHistory'
import { UserId } from '@/domain/value-objects/UserId'
import { DateRange } from '@/domain/value-objects/DateRange'

export interface IPlayHistoryRepository {
  findByUserIdAndDateRange(
    userId: UserId,
    dateRange: DateRange
  ): Promise<PlayHistory[]>
  
  findRecentByUserId(
    userId: UserId,
    limit: number
  ): Promise<PlayHistory[]>
  
  save(playHistory: PlayHistory): Promise<void>
  saveMany(playHistories: PlayHistory[]): Promise<void>
  
  getLastPlayedAt(userId: UserId): Promise<Date | null>
}