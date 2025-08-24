import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

const SPOTIFY_URL = 'https://accounts.spotify.com/authorize'

const scopes = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-private',
  'user-read-email',
  'playlist-read-private'
].join(' ')

const authConfig = NextAuth({
  trustHost: true,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        url: SPOTIFY_URL,
        params: {
          scope: scopes,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
        },
      },
      token: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/spotify`,
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] SignIn Callback:', {
        user,
        account: account ? { 
          provider: account.provider,
          access_token: account.access_token ? 'exists' : 'missing',
          refresh_token: account.refresh_token ? 'exists' : 'missing',
          expires_at: account.expires_at
        } : 'missing',
        profile
      })
      return true
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } 
      
      return true
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, we need to refresh it
      return token
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.accessTokenExpires = token.accessTokenExpires as number
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(error) {
      console.error('[NextAuth Error]:', error)
    },
    warn(warning) {
      console.warn('[NextAuth Warning]:', warning)
    },
    debug(message, metadata) {
      console.log('[NextAuth Debug]:', message, metadata)
    }
  },
})

export const { handlers, signIn, signOut, auth } = authConfig