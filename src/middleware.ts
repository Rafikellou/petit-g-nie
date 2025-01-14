import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
  '/auth',
  '/auth/callback',
  '/api',
  '/',
  '/_next',
  '/favicon.ico'
]

// Routes protégées par rôle
const ROLE_ROUTES = {
  super_admin: ['/super-admin'],
  admin: ['/admin'],
  teacher: ['/teacher'],
  parent: ['/parent']
}

export async function middleware(req: NextRequest) {
  try {
    // Ne pas traiter les requêtes pour les ressources statiques
    if (req.nextUrl.pathname.startsWith('/_next') || 
        req.nextUrl.pathname.startsWith('/static') ||
        req.nextUrl.pathname === '/favicon.ico') {
      return NextResponse.next()
    }

    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Vérifier la session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Erreur lors de la récupération de la session:', sessionError)
      return redirectToAuth(req)
    }

    const pathname = req.nextUrl.pathname

    // Autoriser les routes publiques
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return res
    }

    // Si pas de session, rediriger vers la page de connexion
    if (!session) {
      console.log('Pas de session active, redirection vers /auth')
      return redirectToAuth(req)
    }

    // Vérifier les permissions basées sur le rôle
    const userRole = session.user.user_metadata?.role
    console.log('Rôle utilisateur:', userRole)
    console.log('Chemin demandé:', pathname)

    if (userRole) {
      const allowedRoutes = ROLE_ROUTES[userRole as keyof typeof ROLE_ROUTES] || []
      if (allowedRoutes.some(route => pathname.startsWith(route))) {
        return res
      }
      console.log('Route non autorisée pour le rôle:', userRole)
    } else {
      console.log('Aucun rôle trouvé pour l\'utilisateur')
    }

    // Si l'utilisateur n'a pas les permissions nécessaires, rediriger vers la page d'accueil
    return redirectToHome(req)
  } catch (error) {
    console.error('Erreur dans le middleware:', error)
    return redirectToHome(req)
  }
}

function redirectToAuth(req: NextRequest) {
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/auth'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

function redirectToHome(req: NextRequest) {
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
