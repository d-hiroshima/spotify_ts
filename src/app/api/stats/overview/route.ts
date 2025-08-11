import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/infrastructure/config/auth.config'
import { PrismaUserRepository } from '@/infrastructure/repositories/PrismaUserRepository'
import { PrismaPlayHistoryRepository } from '@/infrastructure/repositories/PrismaPlayHistoryRepository'
import { StatisticsCalculator } from '@/domain/services/StatisticsCalculator'
import { GetUserStatistics } from '@/application/use-cases/stats/GetUserStatistics'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const period = request.nextUrl.searchParams.get('period') || 'month'
    
    // Validate period
    if (!['week', 'month', 'year'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be week, month, or year' },
        { status: 400 }
      )
    }

    // Initialize dependencies
    const userRepository = new PrismaUserRepository()
    const playHistoryRepository = new PrismaPlayHistoryRepository()
    const statisticsCalculator = new StatisticsCalculator()

    // Execute use case
    const getUserStatistics = new GetUserStatistics(
      userRepository,
      playHistoryRepository,
      statisticsCalculator
    )

    const result = await getUserStatistics.execute(session.user.id, period)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}