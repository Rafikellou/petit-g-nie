import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

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
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Vérifier la session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Autoriser les routes publiques
  if (PUBLIC_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    return res
  }

  // Si pas de session, rediriger vers la page de connexion
  if (!session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Récupérer les détails de l'utilisateur depuis user_details
  const { data: userDetails } = await supabase
    .from('user_details')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  // Vérifier les permissions basées sur le rôle
  const userRole = userDetails?.role
  if (userRole) {
    const allowedRoutes = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || []
    if (allowedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return res
    }
  }

  // Si l'utilisateur n'a pas les permissions nécessaires, rediriger vers la page d'accueil
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/'
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
