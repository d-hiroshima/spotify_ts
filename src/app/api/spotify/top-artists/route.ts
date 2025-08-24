import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { SpotifyApiClient } from '@/infrastructure/external-services/SpotifyApiClient'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const timeRange = request.nextUrl.searchParams.get('time_range') || 'medium_term'
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')

    // Validate time range
    if (!['short_term', 'medium_term', 'long_term'].includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time_range. Must be short_term, medium_term, or long_term' },
        { status: 400 }
      )
    }

    const spotifyClient = new SpotifyApiClient(session.accessToken)
    const topArtists = await spotifyClient.getTopArtists(
      timeRange as 'short_term' | 'medium_term' | 'long_term',
      limit
    )

    return NextResponse.json(topArtists)
  } catch (error) {
    console.error('Top artists error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get top artists' },
      { status: 500 }
    )
  }
}