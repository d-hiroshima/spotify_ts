import { TrackId } from '@/domain/value-objects/TrackId'
import { UserId } from '@/domain/value-objects/UserId'
import { ListeningDuration } from '@/domain/value-objects/ListeningDuration'

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

  getId(): string {
    return this.id
  }

  getUserId(): UserId {
    return this.userId
  }

  getTrackId(): TrackId {
    return this.trackId
  }

  getTrackName(): string {
    return this.trackName
  }

  getArtistName(): string {
    return this.artistName
  }

  getAlbumName(): string {
    return this.albumName
  }

  getPlayedAt(): Date {
    return this.playedAt
  }

  getDuration(): ListeningDuration {
    return this.duration
  }

  isRecentlyPlayed(): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return this.playedAt > oneHourAgo
  }

  wasSkipped(trackDurationMs: number): boolean {
    return this.duration.isSkipped(trackDurationMs)
  }

  getPlayedHour(): number {
    return this.playedAt.getHours()
  }

  getPlayedDayOfWeek(): number {
    return this.playedAt.getDay()
  }
}