import { DateRange } from '@/domain/value-objects/DateRange'

interface TopItem {
  id: string
  name: string
  count: number
  percentage: number
}

interface ListeningPattern {
  hour: number
  count: number
  percentage: number
}

export class Statistics {
  constructor(
    private readonly dateRange: DateRange,
    private readonly totalTracks: number,
    private readonly totalDurationMs: number,
    private readonly uniqueArtists: number,
    private readonly uniqueAlbums: number,
    private readonly topArtists: TopItem[],
    private readonly topTracks: TopItem[],
    private readonly listeningPatterns: ListeningPattern[],
    private readonly averageTrackDurationMs: number,
    private readonly skippedTracksCount: number
  ) {}

  getDateRange(): DateRange {
    return this.dateRange
  }

  getTotalTracks(): number {
    return this.totalTracks
  }

  getTotalDurationMs(): number {
    return this.totalDurationMs
  }

  getTotalDurationHours(): number {
    return Math.floor(this.totalDurationMs / (1000 * 60 * 60))
  }

  getUniqueArtists(): number {
    return this.uniqueArtists
  }

  getUniqueAlbums(): number {
    return this.uniqueAlbums
  }

  getTopArtists(limit: number = 10): TopItem[] {
    return this.topArtists.slice(0, limit)
  }

  getTopTracks(limit: number = 10): TopItem[] {
    return this.topTracks.slice(0, limit)
  }

  getListeningPatterns(): ListeningPattern[] {
    return this.listeningPatterns
  }

  getAverageTrackDurationMs(): number {
    return this.averageTrackDurationMs
  }

  getSkipRate(): number {
    if (this.totalTracks === 0) return 0
    return (this.skippedTracksCount / this.totalTracks) * 100
  }

  getPeakListeningHour(): number | null {
    if (this.listeningPatterns.length === 0) return null
    
    const peak = this.listeningPatterns.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    )
    
    return peak.hour
  }
}