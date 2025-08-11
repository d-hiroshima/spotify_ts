'use client'

import { Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { LibraryMusic } from '@mui/icons-material'

function LoginContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  const handleLogin = () => {
    signIn('spotify', { callbackUrl: from })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LibraryMusic sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Spotify Music Stats
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" textAlign="center">
            あなたの音楽統計を見てみましょう
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogin}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Spotifyでログイン
          </Button>

          <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
            Spotifyアカウントでログインすることで、
            あなたの視聴履歴と統計情報にアクセスできます
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}