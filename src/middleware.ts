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
  // MIDDLEWARE DISABLED - Authentication and role-based redirections are bypassed
  // All requests are allowed to pass through without authentication checks
  console.log('Middleware disabled - allowing all requests to pass through')
  return NextResponse.next()
  
  /* ORIGINAL CODE COMMENTED OUT
  try {
    // Vérifier si nous sommes déjà en train de rediriger vers /auth pour éviter les boucles
    if (req.nextUrl.pathname === '/auth' && req.nextUrl.searchParams.get('redirected')) {
      return NextResponse.next()
    }

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
      return redirectToAuth(req, true)
    }

    const pathname = req.nextUrl.pathname

    // Autoriser les routes publiques
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return res
    }

    // Si pas de session, rediriger vers la page de connexion
    if (!session) {
      console.log('Pas de session active, redirection vers /auth')
      return redirectToAuth(req, true)
    }

    // Vérification des autorisations basées sur les rôles
    if (session) {
      // Récupérer le rôle de l'utilisateur depuis la base de données
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error || !userData) {
        // En cas d'erreur ou si l'utilisateur n'existe pas, déconnexion
        await supabase.auth.signOut()
        return redirectToAuth(req, true)
      }

      const role = userData.role

      // Routes réservées aux super administrateurs
      if (req.nextUrl.pathname.startsWith('/super-admin') && role !== 'super_admin') {
        return redirectToHome(req)
      }

      // Routes réservées aux administrateurs et super administrateurs
      if (req.nextUrl.pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(role)) {
        return redirectToHome(req)
      }

      // Routes réservées aux enseignants, administrateurs et super administrateurs
      if (req.nextUrl.pathname.startsWith('/teacher') && !['teacher', 'admin', 'super_admin'].includes(role)) {
        return redirectToHome(req)
      }

      // Routes réservées aux parents
      if (req.nextUrl.pathname.startsWith('/parent') && !['parent', 'super_admin'].includes(role)) {
        return redirectToHome(req)
      }
    }

    return res
  } catch (error) {
    console.error('Erreur dans le middleware:', error)
    return redirectToHome(req)
  }
  */
}

function redirectToAuth(req: NextRequest, addRedirectFlag = false) {
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/auth'
  if (addRedirectFlag) {
    redirectUrl.searchParams.set('redirected', 'true')
  }
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
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
