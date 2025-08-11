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
  playCount: number
}

export function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stats/overview?period=month')
        if (response.ok) {
          const data = await response.json()
          setTracks(data.topTracks || [])
        }
      } catch (error) {
        console.error('Failed to fetch tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const parseTrackInfo = (trackName: string) => {
    const parts = trackName.split(' - ')
    return {
      title: parts[0] || trackName,
      artist: parts[1] || ''
    }
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
            {tracks.slice(0, 5).map((track, index) => {
              const { title, artist } = parseTrackInfo(track.name)
              return (
                <ListItem 
                  key={track.id} 
                  disablePadding
                  sx={{ mb: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <MusicNote />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="medium" noWrap>
                        {title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {artist && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {artist}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <PlayCircleOutline fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {track.playCount}回再生
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
              )
            })}
          </List>
        )}
      </CardContent>
    </Card>
  )
}