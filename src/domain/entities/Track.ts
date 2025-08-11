import { TrackId } from '@/domain/value-objects/TrackId'

interface Artist {
  id: string
  name: string
}

interface Album {
  id: string
  name: string
  imageUrl?: string
}

interface AudioFeatures {
  danceability: number
  energy: number
  valence: number
  tempo: number
  acousticness: number
  instrumentalness: number
}

export class Track {
  constructor(
    private readonly id: TrackId,
    private readonly name: string,
    private readonly artists: Artist[],
    private readonly album: Album,
    private readonly durationMs: number,
    private readonly popularity: number | null,
    private readonly audioFeatures: AudioFeatures | null
  ) {}

  getId(): TrackId {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getArtists(): Artist[] {
    return this.artists
  }

  getArtistNames(): string {
    return this.artists.map(a => a.name).join(', ')
  }

  getAlbum(): Album {
    return this.album
  }

  getDurationMs(): number {
    return this.durationMs
  }

  getPopularity(): number | null {
    return this.popularity
  }

  getAudioFeatures(): AudioFeatures | null {
    return this.audioFeatures
  }

  isEnergetic(): boolean {
    return this.audioFeatures ? this.audioFeatures.energy > 0.7 : false
  }

  isDanceable(): boolean {
    return this.audioFeatures ? this.audioFeatures.danceability > 0.7 : false
  }

  isHappy(): boolean {
    return this.audioFeatures ? this.audioFeatures.valence > 0.7 : false
  }
}