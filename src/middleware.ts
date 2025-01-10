import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = ['/auth', '/auth/callback', '/api']

// Routes protégées par rôle
const ROLE_ROUTES = {
  super_admin: ['/super-admin'],
  admin: ['/admin'],
  teacher: ['/teacher'],
  parent: ['/parent']
}

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const pathname = req.nextUrl.pathname

    // Ignorer les routes publiques et API
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return res
    }

    // Vérifier l'authentification
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    if (!session) {
      const redirectUrl = new URL('/auth', req.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Vérifier les autorisations basées sur les rôles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    if (!profiles) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    const userRole = profiles.role
    const isAuthorized = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES]?.some(route => 
      pathname.startsWith(route)
    )

    // Si l'utilisateur n'est pas autorisé et essaie d'accéder à une route protégée
    if (!isAuthorized && Object.values(ROLE_ROUTES).flat().some(route => pathname.startsWith(route))) {
      // Rediriger vers la page appropriée selon le rôle
      switch (userRole) {
        case 'super_admin':
          return NextResponse.redirect(new URL('/super-admin', req.url))
        case 'admin':
          return NextResponse.redirect(new URL('/admin', req.url))
        case 'teacher':
          return NextResponse.redirect(new URL('/teacher', req.url))
        case 'parent':
          return NextResponse.redirect(new URL('/parent', req.url))
        default:
          return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
}
