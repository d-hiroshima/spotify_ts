import { IUserRepository } from '@/domain/repositories/IUserRepository'
import { IPlayHistoryRepository } from '@/domain/repositories/IPlayHistoryRepository'
import { StatisticsCalculator } from '@/domain/services/StatisticsCalculator'
import { DateRange } from '@/domain/value-objects/DateRange'
import { UserId } from '@/domain/value-objects/UserId'

export interface StatisticsDto {
  totalTracks: number
  totalDuration: number
  uniqueArtists: number
  uniqueAlbums: number
  topArtists: Array<{
    id: string
    name: string
    playCount: number
  }>
  topTracks: Array<{
    id: string
    name: string
    playCount: number
  }>
  listeningPatterns: Array<{
    hour: number
    count: number
  }>
}

export class GetUserStatistics {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly playHistoryRepository: IPlayHistoryRepository,
    private readonly calculator: StatisticsCalculator
  ) {}

  async execute(userId: string, period: string): Promise<StatisticsDto> {
    const userIdVO = new UserId(userId)
    const user = await this.userRepository.findById(userIdVO)
    
    if (!user) {
      throw new Error('User not found')
    }

    const dateRange = DateRange.fromPeriod(period as 'week' | 'month' | 'year')
    const playHistory = await this.playHistoryRepository.findByUserIdAndDateRange(
      userIdVO,
      dateRange
    )

    const statistics = this.calculator.calculate(playHistory, dateRange)
    
    return {
      totalTracks: statistics.getTotalTracks(),
      totalDuration: statistics.getTotalDurationMs(),
      uniqueArtists: statistics.getUniqueArtists(),
      uniqueAlbums: statistics.getUniqueAlbums(),
      topArtists: statistics.getTopArtists(10).map(artist => ({
        id: artist.id,
        name: artist.name,
        playCount: artist.count
      })),
      topTracks: statistics.getTopTracks(10).map(track => ({
        id: track.id,
        name: track.name,
        playCount: track.count
      })),
      listeningPatterns: statistics.getListeningPatterns().map(pattern => ({
        hour: pattern.hour,
        count: pattern.count
      }))
    }
  }
}