import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Redirection vers l\'inscription | Petit Génie',
}

export default function AdminSignUpPage() {
  // Rediriger vers le formulaire principal avec le rôle présélectionné
  redirect('/auth/signup?role=admin')
  
  // Cette partie ne sera jamais exécutée en raison de la redirection
  return null
}
