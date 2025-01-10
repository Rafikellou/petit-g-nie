import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/*
// Routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = ['/auth', '/auth/callback', '/api']

// Routes protégées par rôle
const ROLE_ROUTES = {
  super_admin: ['/super-admin'],
  admin: ['/admin'],
  teacher: ['/teacher'],
  parent: ['/parent']
}
*/

export async function middleware(req: NextRequest) {
  // Middleware temporairement désactivé - toutes les routes sont accessibles
  return NextResponse.next()
}

export const config = {
  matcher: []
}
