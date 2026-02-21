import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/about', '/contact', '/', '/products', '/privacy-policy', '/terms', '/refund-policy']
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith('/products/') ||  // Allow individual product pages
    pathname.startsWith('/api/auth')
  )

  // Allow public routes, static files, and API routes (API routes handle their own auth)
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin routes
  if (pathname.startsWith('/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
}
