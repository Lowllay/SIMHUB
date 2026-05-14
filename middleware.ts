import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques — accessibles sans connexion
  const publicPaths = ['/login', '/register', '/auth/callback']
  if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next()

  // Vérifie la présence du cookie de session Supabase
  const hasSession = request.cookies.getAll().some(c => c.name.includes('auth-token') || c.name.includes('sb-'))

  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
