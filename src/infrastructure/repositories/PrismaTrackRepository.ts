import { ITrackRepository } from '@/domain/repositories/ITrackRepository'
import { Track } from '@/domain/entities/Track'
import { TrackId } from '@/domain/value-objects/TrackId'
import { prisma } from '@/infrastructure/db/prisma'

export class PrismaTrackRepository implements ITrackRepository {
  async findById(trackId: TrackId): Promise<Track | null> {
    const trackData = await prisma.track.findUnique({
      where: { spotifyId: trackId.getValue() }
    })

    if (!trackData) {
      return null
    }

    return this.toDomainEntity(trackData)
  }

  async findByIds(trackIds: TrackId[]): Promise<Track[]> {
    const tracks = await prisma.track.findMany({
      where: {
        spotifyId: {
          in: trackIds.map(id => id.getValue())
        }
      }
    })

    return tracks.map(track => this.toDomainEntity(track))
  }

  async save(track: Track): Promise<void> {
    await prisma.track.upsert({
      where: { spotifyId: track.getId().getValue() },
      update: {
        name: track.getName(),
        artists: track.getArtists() as any,
        album: track.getAlbum() as any,
        durationMs: track.getDurationMs(),
        popularity: track.getPopularity(),
        audioFeatures: track.getAudioFeatures() as any,
        updatedAt: new Date()
      },
      create: {
        spotifyId: track.getId().getValue(),
        name: track.getName(),
        artists: track.getArtists() as any,
        album: track.getAlbum() as any,
        durationMs: track.getDurationMs(),
        popularity: track.getPopularity(),
        audioFeatures: track.getAudioFeatures() as any
      }
    })
  }

  async saveMany(tracks: Track[]): Promise<void> {
    const data = tracks.map(track => ({
      spotifyId: track.getId().getValue(),
      name: track.getName(),
      artists: track.getArtists() as any,
      album: track.getAlbum() as any,
      durationMs: track.getDurationMs(),
      popularity: track.getPopularity(),
      audioFeatures: track.getAudioFeatures() as any
    }))

    await prisma.$transaction(
      data.map(track =>
        prisma.track.upsert({
          where: { spotifyId: track.spotifyId },
          update: {
            ...track,
            updatedAt: new Date()
          },
          create: track
        })
      )
    )
  }

  private toDomainEntity(data: any): Track {
    return new Track(
      new TrackId(data.spotifyId),
      data.name,
      data.artists as any,
      data.album as any,
      data.durationMs,
      data.popularity,
      data.audioFeatures as any
    )
  }
}