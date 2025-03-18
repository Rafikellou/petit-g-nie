import { Metadata } from 'next'
import Link from 'next/link'
import AdminSignUpForm from '@/components/auth/AdminSignUpForm'

export const metadata: Metadata = {
  title: 'Inscription Administrateur | Petit Génie',
  description: 'Créez un compte administrateur pour gérer votre école sur Petit Génie',
}

export default function AdminSignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Petit Génie</h1>
          <h2 className="mt-2 text-xl font-semibold text-white">Inscription Administrateur</h2>
          <p className="mt-2 text-sm text-gray-400">
            Créez un compte pour gérer votre école
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
          <AdminSignUpForm />
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            Déjà inscrit ?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
              Connectez-vous
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
              Inscription parent
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
