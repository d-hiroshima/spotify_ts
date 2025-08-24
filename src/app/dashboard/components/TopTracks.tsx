'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Skeleton,
  Avatar,
  ListItemAvatar,
  Chip,
  Box
} from '@mui/material'
import { MusicNote, PlayCircleOutline } from '@mui/icons-material'

interface Track {
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
  popularity: number
}

export function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify/top-tracks?limit=10')
        if (response.ok) {
          const data = await response.json()
          setTracks(data.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          トップトラック
        </Typography>
        
        {loading ? (
          <List>
            {[...Array(5)].map((_, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="60%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : tracks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              データがありません
            </Typography>
          </Box>
        ) : (
          <List>
            {tracks.slice(0, 5).map((track, index) => (
              <ListItem 
                key={track.id} 
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={track.album.images?.[0]?.url} 
                    sx={{ bgcolor: 'secondary.main' }}
                  >
                    {!track.album.images?.[0]?.url && <MusicNote />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="medium" noWrap>
                      {track.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {track.artists.map(artist => artist.name).join(', ')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <PlayCircleOutline fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDuration(track.duration_ms)} • 人気度: {track.popularity}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mr: 1 }}>
                    #{index + 1}
                  </Typography>
                  {index === 0 && (
                    <Chip
                      label="HOT"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}