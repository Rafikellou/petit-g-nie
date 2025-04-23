'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function VerifyPage() {
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Récupérer l'email depuis le localStorage
    const storedEmail = localStorage.getItem('signupEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-white mb-2">
          Vérifiez votre email
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        <div className="glass-card p-8 space-y-6 bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20">
              <Mail className="h-10 w-10 text-indigo-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-white">Votre compte a été créé avec succès !</h3>
              
              <p className="text-gray-400">
                {email ? (
                  <>
                    Un email de confirmation a été envoyé à <span className="text-indigo-400">{email}</span>.
                  </>
                ) : (
                  <>
                    Un email de confirmation a été envoyé à l'adresse que vous avez fournie.
                  </>
                )}
              </p>
              
              <p className="text-gray-400 mt-2">
                Veuillez cliquer sur le lien dans cet email pour vérifier votre compte et pouvoir vous connecter.
              </p>
            </div>
            
            <div className="space-y-2 border-t border-gray-700 pt-6 w-full">
              <h4 className="text-white font-medium">Que faire ensuite ?</h4>
              
              <ul className="space-y-3 mt-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm text-left">
                    Vérifiez votre boîte de réception et cliquez sur le lien de vérification
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm text-left">
                    Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou courrier indésirable
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm text-left">
                    Une fois votre email vérifié, vous pourrez vous connecter à votre compte
                  </span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="/auth" 
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
