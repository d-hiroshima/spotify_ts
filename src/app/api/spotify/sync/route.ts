import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { SpotifyApiClient } from '@/infrastructure/external-services/SpotifyApiClient'
import { PrismaPlayHistoryRepository } from '@/infrastructure/repositories/PrismaPlayHistoryRepository'
import { PrismaTrackRepository } from '@/infrastructure/repositories/PrismaTrackRepository'
import { SyncPlayHistory } from '@/application/use-cases/spotify/SyncPlayHistory'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize dependencies with access token
    const spotifyClient = new SpotifyApiClient(session.accessToken)
    const playHistoryRepository = new PrismaPlayHistoryRepository()
    const trackRepository = new PrismaTrackRepository()

    // Execute use case
    const syncPlayHistory = new SyncPlayHistory(
      spotifyClient,
      playHistoryRepository,
      trackRepository
    )

    const result = await syncPlayHistory.execute(session.user.id)

    return NextResponse.json({
      success: true,
      synced: true,
      message: 'Data synchronized successfully',
      ...result
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync play history' },
      { status: 500 }
    )
  }
}