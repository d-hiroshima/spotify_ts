'use client'

import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material'
import { LibraryMusic, Logout } from '@mui/icons-material'

interface DashboardHeaderProps {
  userName?: string | null
  userImage?: string | null
}

export function DashboardHeader({ userName, userImage }: DashboardHeaderProps) {
  return (
    <AppBar position="static" color="secondary" elevation={1}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
          <LibraryMusic />
          <Typography variant="h6" component="h1">
            Spotify Music Stats
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {userName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                src={userImage || undefined} 
                alt={userName}
                sx={{ width: 32, height: 32 }}
              >
                {userName[0]}
              </Avatar>
              <Typography variant="body2">{userName}</Typography>
            </Box>
          )}
          <Button
            color="inherit"
            size="small"
            startIcon={<Logout />}
            href="/api/auth/signout"
          >
            ログアウト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}