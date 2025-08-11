'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Skeleton,
  Alert,
  Snackbar
} from '@mui/material'
import { Sync, MusicNote, Album, Person, AccessTime } from '@mui/icons-material'

interface Stats {
  totalTracks: number
  totalArtists: number
  totalAlbums: number
  totalListeningTime: number
  lastSync: string | null
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stats/overview')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const syncData = async () => {
    try {
      setSyncing(true)
      setError(null)
      const response = await fetch('/api/spotify/sync', {
        method: 'POST',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to sync data')
      }
      
      setSuccess(true)
      await fetchStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSyncing(false)
    }
  }

  const formatListeningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days}日 ${hours % 24}時間`
    }
    return `${hours}時間 ${minutes % 60}分`
  }

  const statItems = [
    {
      icon: <MusicNote fontSize="large" />,
      label: '総再生楽曲数',
      value: stats?.totalTracks || 0,
      color: 'primary.main'
    },
    {
      icon: <Person fontSize="large" />,
      label: '総アーティスト数',
      value: stats?.totalArtists || 0,
      color: 'secondary.main'
    },
    {
      icon: <Album fontSize="large" />,
      label: '総アルバム数',
      value: stats?.totalAlbums || 0,
      color: 'success.main'
    },
    {
      icon: <AccessTime fontSize="large" />,
      label: '総再生時間',
      value: stats ? formatListeningTime(stats.totalListeningTime) : '0分',
      color: 'info.main'
    }
  ]

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              統計概要
            </Typography>
            <Button
              variant="contained"
              startIcon={<Sync />}
              onClick={syncData}
              disabled={syncing}
            >
              {syncing ? '同期中...' : 'データを同期'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-around' }}>
            {statItems.map((item, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                {loading ? (
                  <>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                    <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                  </>
                ) : (
                  <>
                    <Box sx={{ color: item.color, mb: 1 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </>
                )}
              </Box>
            ))}
          </Box>

          {stats?.lastSync && (
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                最終同期: {new Date(stats.lastSync).toLocaleString('ja-JP')}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          データの同期が完了しました！
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}