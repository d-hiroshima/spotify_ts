import { Statistics } from '@/domain/entities/Statistics'
import { UserId } from '@/domain/value-objects/UserId'
import { DateRange } from '@/domain/value-objects/DateRange'
import { PlayHistory } from '@/domain/entities/PlayHistory'

export interface IStatisticsRepository {
  getPlayHistory(
    userId: UserId,
    dateRange: DateRange
  ): Promise<PlayHistory[]>
  
  getStatistics(
    userId: UserId,
    dateRange: DateRange
  ): Promise<Statistics | null>
  
  saveStatistics(
    userId: UserId,
    statistics: Statistics
  ): Promise<void>
}