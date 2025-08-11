import { PlayHistory } from '@/domain/entities/PlayHistory'
import { Statistics } from '@/domain/entities/Statistics'
import { DateRange } from '@/domain/value-objects/DateRange'

export class StatisticsCalculator {
  calculate(playHistories: PlayHistory[], dateRange: DateRange): Statistics {
    if (playHistories.length === 0) {
      return new Statistics(
        dateRange,
        0, 0, 0, 0,
        [], [], [],
        0, 0
      )
    }

    // Calculate basic metrics
    const totalTracks = playHistories.length
    const totalDurationMs = playHistories.reduce(
      (sum, history) => sum + history.getDuration().getMilliseconds(),
      0
    )

    // Calculate unique artists and albums
    const uniqueArtists = new Set(playHistories.map(h => h.getArtistName())).size
    const uniqueAlbums = new Set(playHistories.map(h => h.getAlbumName())).size

    // Calculate top artists
    const artistCounts = new Map<string, number>()
    playHistories.forEach(history => {
      const artist = history.getArtistName()
      artistCounts.set(artist, (artistCounts.get(artist) || 0) + 1)
    })

    const topArtists = Array.from(artistCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({
        id: name,
        name,
        count,
        percentage: (count / totalTracks) * 100
      }))

    // Calculate top tracks
    const trackCounts = new Map<string, { name: string; artist: string; count: number }>()
    playHistories.forEach(history => {
      const key = `${history.getTrackId().getValue()}`
      const existing = trackCounts.get(key)
      if (existing) {
        existing.count++
      } else {
        trackCounts.set(key, {
          name: history.getTrackName(),
          artist: history.getArtistName(),
          count: 1
        })
      }
    })

    const topTracks = Array.from(trackCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([id, data]) => ({
        id,
        name: `${data.name} - ${data.artist}`,
        count: data.count,
        percentage: (data.count / totalTracks) * 100
      }))

    // Calculate listening patterns by hour
    const hourCounts = new Map<number, number>()
    for (let i = 0; i < 24; i++) {
      hourCounts.set(i, 0)
    }
    
    playHistories.forEach(history => {
      const hour = history.getPlayedHour()
      hourCounts.set(hour, hourCounts.get(hour)! + 1)
    })

    const listeningPatterns = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({
        hour,
        count,
        percentage: (count / totalTracks) * 100
      }))
      .sort((a, b) => a.hour - b.hour)

    // Calculate average track duration
    const averageTrackDurationMs = totalDurationMs / totalTracks

    // Calculate skipped tracks (simplified - tracks played less than 30 seconds)
    const skippedTracksCount = playHistories.filter(
      history => history.getDuration().getSeconds() < 30
    ).length

    return new Statistics(
      dateRange,
      totalTracks,
      totalDurationMs,
      uniqueArtists,
      uniqueAlbums,
      topArtists,
      topTracks,
      listeningPatterns,
      averageTrackDurationMs,
      skippedTracksCount
    )
  }
}