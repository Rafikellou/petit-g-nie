import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Rediriger vers le dashboard admin
  redirect('/admin/dashboard')
  
  // Cette partie ne sera jamais exécutée en raison de la redirection
  return null
}
