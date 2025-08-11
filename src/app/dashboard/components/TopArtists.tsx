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
import { Person } from '@mui/icons-material'

interface Artist {
  id: string
  name: string
  playCount: number
}

export function TopArtists() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stats/overview?period=month')
        if (response.ok) {
          const data = await response.json()
          setArtists(data.topArtists || [])
        }
      } catch (error) {
        console.error('Failed to fetch artists:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          トップアーティスト
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
        ) : artists.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              データがありません
            </Typography>
          </Box>
        ) : (
          <List>
            {artists.slice(0, 5).map((artist, index) => (
              <ListItem 
                key={artist.id} 
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="medium">
                      {artist.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {artist.playCount}回再生
                      </Typography>
                    </Box>
                  }
                />
                {index === 0 && (
                  <Chip
                    label="TOP"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}