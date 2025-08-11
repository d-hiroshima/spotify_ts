import { auth } from '@/infrastructure/config/auth.config'
import { prisma } from '@/infrastructure/db/prisma'

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{
    id: string
    name: string
  }>
  album: {
    id: string
    name: string
    images: Array<{
      url: string
      height: number
      width: number
    }>
  }
  duration_ms: number
  popularity?: number
}

interface SpotifyRecentlyPlayed {
  items: Array<{
    track: SpotifyTrack
    played_at: string
    context: {
      type: string
      uri: string
    } | null
  }>
  next: string | null
  cursors: {
    after: string
    before: string
  }
  limit: number
  href: string
}

interface SpotifyTopItems<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  previous: string | null
  next: string | null
}

export class SpotifyApiClient {
  private baseUrl = 'https://api.spotify.com/v1'

  private async getAccessToken(userId: string): Promise<string | null> {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'spotify',
      },
    })

    if (!account?.access_token) {
      throw new Error('No access token found')
    }

    // TODO: Implement token refresh logic if expired
    return account.access_token
  }

  private async makeRequest<T>(
    endpoint: string,
    accessToken: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Spotify API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getRecentlyPlayed(
    userId: string,
    limit: number = 50
  ): Promise<SpotifyRecentlyPlayed> {
    const accessToken = await this.getAccessToken(userId)
    if (!accessToken) throw new Error('No access token')

    return this.makeRequest<SpotifyRecentlyPlayed>(
      `/me/player/recently-played?limit=${limit}`,
      accessToken
    )
  }

  async getTopArtists(
    userId: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyTopItems<any>> {
    const accessToken = await this.getAccessToken(userId)
    if (!accessToken) throw new Error('No access token')

    return this.makeRequest<SpotifyTopItems<any>>(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      accessToken
    )
  }

  async getTopTracks(
    userId: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyTopItems<SpotifyTrack>> {
    const accessToken = await this.getAccessToken(userId)
    if (!accessToken) throw new Error('No access token')

    return this.makeRequest<SpotifyTopItems<SpotifyTrack>>(
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      accessToken
    )
  }

  async getTrackAudioFeatures(
    userId: string,
    trackIds: string[]
  ): Promise<{
    audio_features: Array<{
      id: string
      danceability: number
      energy: number
      key: number
      loudness: number
      mode: number
      speechiness: number
      acousticness: number
      instrumentalness: number
      liveness: number
      valence: number
      tempo: number
      duration_ms: number
      time_signature: number
    } | null>
  }> {
    const accessToken = await this.getAccessToken(userId)
    if (!accessToken) throw new Error('No access token')

    const ids = trackIds.join(',')
    return this.makeRequest(
      `/audio-features?ids=${ids}`,
      accessToken
    )
  }
}