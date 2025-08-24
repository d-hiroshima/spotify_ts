import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAuthPage = nextUrl.pathname.startsWith('/login')
  
  // Ensure consistent host usage (127.0.0.1 only)
  const baseUrl = req.url.replace(/localhost/g, '127.0.0.1')
  
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', baseUrl))
    }
    return NextResponse.next()
  }
  
  if (!isLoggedIn && nextUrl.pathname.startsWith('/dashboard')) {
    let from = nextUrl.pathname
    if (nextUrl.search) {
      from += nextUrl.search
    }
    
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, baseUrl)
    )
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}