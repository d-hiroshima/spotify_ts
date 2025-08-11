import { Track } from '@/domain/entities/Track'
import { TrackId } from '@/domain/value-objects/TrackId'

export interface ITrackRepository {
  findById(trackId: TrackId): Promise<Track | null>
  findByIds(trackIds: TrackId[]): Promise<Track[]>
  save(track: Track): Promise<void>
  saveMany(tracks: Track[]): Promise<void>
}