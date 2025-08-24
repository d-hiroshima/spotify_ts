'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Skeleton,
  Tooltip,
  useTheme
} from '@mui/material'
import { AccessTime } from '@mui/icons-material'

interface Pattern {
  hour: number
  count: number
}

export function ListeningPatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    // For now, show mock data
    setLoading(false)
    // TODO: Implement actual listening patterns from Spotify API
  }, [])

  const maxCount = Math.max(...patterns.map(p => p.count), 1)

  const getTimeLabel = (hour: number) => {
    if (hour === 0) return '0時'
    if (hour === 12) return '12時'
    return `${hour}時`
  }

  const getActivityLevel = (count: number) => {
    const percentage = (count / maxCount) * 100
    if (percentage > 75) return { label: '高', color: theme.palette.error.main }
    if (percentage > 50) return { label: '中', color: theme.palette.warning.main }
    if (percentage > 25) return { label: '低', color: theme.palette.info.main }
    return { label: '極低', color: theme.palette.grey[400] }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <AccessTime color="action" />
          <Typography variant="h6" component="h3">
            視聴パターン
          </Typography>
        </Box>

        {loading ? (
          <Box>
            <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
            {[...Array(6)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="rectangular" height={20} />
              </Box>
            ))}
          </Box>
        ) : patterns.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              データがありません
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              時間帯別再生回数
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {patterns
                .filter(p => p.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((pattern) => {
                  const activity = getActivityLevel(pattern.count)
                  const percentage = (pattern.count / maxCount) * 100
                  
                  return (
                    <Box key={pattern.hour} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">
                          {getTimeLabel(pattern.hour)}
                        </Typography>
                        <Tooltip title={`${pattern.count}回再生`}>
                          <Typography variant="caption" color="text.secondary">
                            {pattern.count}曲
                          </Typography>
                        </Tooltip>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: activity.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  )
                })}
            </Box>

            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                最も活発な時間帯: {
                  patterns.length > 0 
                    ? getTimeLabel(patterns.reduce((max, p) => p.count > max.count ? p : max).hour)
                    : '-'
                }
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}