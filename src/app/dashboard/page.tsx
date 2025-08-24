import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Box, Typography, Grid } from '@mui/material'
import { StatsOverview } from './components/StatsOverview'
import { TopArtists } from './components/TopArtists'
import { TopTracks } from './components/TopTracks'
import { ListeningPatterns } from './components/ListeningPatterns'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <StatsOverview />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TopArtists />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopTracks />
          </Grid>
        </Grid>

        <ListeningPatterns />
      </Box>
    </DashboardLayout>
  )
}