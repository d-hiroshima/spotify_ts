import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
    accessToken?: string
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    spotifyId?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
  }
}