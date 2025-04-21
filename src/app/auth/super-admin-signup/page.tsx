import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Redirection vers l\'inscription | Petit Génie',
  description: 'Créez un compte super administrateur pour Petit Génie',
}

export default function SuperAdminSignUpPage() {
  // Rediriger vers le formulaire principal avec le rôle présélectionné
  redirect('/auth/signup?role=super_admin')
  
  // Cette partie ne sera jamais exécutée en raison de la redirection
  return null
}
