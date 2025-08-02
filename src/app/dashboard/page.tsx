import { getServerSession } from 'next-auth'
import { authOptions } from '@/infrastructure/config/auth.config'
import { StatsOverview } from './components/StatsOverview'
import { TopArtists } from './components/TopArtists'
import { TopTracks } from './components/TopTracks'
import { ListeningPatterns } from './components/ListeningPatterns'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-6">ダッシュボード</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-8">
          <StatsOverview />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopArtists />
          <TopTracks />
        </div>

        <div className="mt-8">
          <ListeningPatterns />
        </div>
      </div>
    </div>
  )
}