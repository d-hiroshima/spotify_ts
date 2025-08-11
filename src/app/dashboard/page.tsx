import { auth } from '@/infrastructure/config/auth.config'
import { Box, Typography } from '@mui/material'
import { StatsOverview } from './components/StatsOverview'
import { TopArtists } from './components/TopArtists'
import { TopTracks } from './components/TopTracks'
import { ListeningPatterns } from './components/ListeningPatterns'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <Box>
      <Typography variant="h4" component="h2" gutterBottom>
        ダッシュボード
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <StatsOverview />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <TopArtists />
          <TopTracks />
        </Box>

        <ListeningPatterns />
      </Box>
    </Box>
  )
}