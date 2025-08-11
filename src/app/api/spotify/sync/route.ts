import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/infrastructure/config/auth.config'
import { SpotifyApiClient } from '@/infrastructure/external-services/SpotifyApiClient'
import { PrismaPlayHistoryRepository } from '@/infrastructure/repositories/PrismaPlayHistoryRepository'
import { PrismaTrackRepository } from '@/infrastructure/repositories/PrismaTrackRepository'
import { SyncPlayHistory } from '@/application/use-cases/spotify/SyncPlayHistory'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Initialize dependencies
    const spotifyClient = new SpotifyApiClient()
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
      ...result
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync play history' },
      { status: 500 }
    )
  }
}