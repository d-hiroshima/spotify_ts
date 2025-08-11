import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/infrastructure/config/auth.config'
import { PrismaPlayHistoryRepository } from '@/infrastructure/repositories/PrismaPlayHistoryRepository'
import { UserId } from '@/domain/value-objects/UserId'
import { DateRange } from '@/domain/value-objects/DateRange'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Initialize repository
    const playHistoryRepository = new PrismaPlayHistoryRepository()
    const userId = new UserId(session.user.id)

    let histories

    if (startDate && endDate) {
      // Get history within date range
      const dateRange = new DateRange(
        new Date(startDate),
        new Date(endDate)
      )
      histories = await playHistoryRepository.findByUserIdAndDateRange(
        userId,
        dateRange
      )
    } else {
      // Get recent history
      histories = await playHistoryRepository.findRecentByUserId(
        userId,
        limit
      )
    }

    // Transform to DTO
    const items = histories.map(history => ({
      id: history.getId(),
      trackId: history.getTrackId().getValue(),
      trackName: history.getTrackName(),
      artistName: history.getArtistName(),
      albumName: history.getAlbumName(),
      playedAt: history.getPlayedAt().toISOString(),
      durationMs: history.getDuration().getMilliseconds()
    }))

    return NextResponse.json({
      items,
      total: items.length,
      hasMore: items.length === limit
    })
  } catch (error) {
    console.error('History error:', error)
    return NextResponse.json(
      { error: 'Failed to get play history' },
      { status: 500 }
    )
  }
}