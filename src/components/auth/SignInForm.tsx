import { useState } from 'react'
import { authService } from '@/lib/auth'
import SocialButtons from './SocialButtons'

type AuthMethod = 'email' | 'phone'

export default function SignInForm() {
  const [method, setMethod] = useState<AuthMethod>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await authService.signInWithEmail(email, password)
    if (error) setError(error.message)
  }

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otpSent) {
      const { error } = await authService.signInWithPhone(phone)
      if (error) {
        setError(error.message)
      } else {
        setOtpSent(true)
      }
    } else {
      const { error } = await authService.verifyOtp(phone, otp)
      if (error) setError(error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const { error } = await authService.signInWithGoogle()
    if (error) setError(error.message)
  }

  const handleAppleSignIn = async () => {
    setError('')
    const { error } = await authService.signInWithApple()
    if (error) setError(error.message)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <SocialButtons onError={setError} />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${method === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMethod('email')}
        >
          Email
        </button>
        <button
          className={`px-4 py-2 rounded ${method === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMethod('phone')}
        >
          Téléphone
        </button>
      </div>

      {method === 'email' ? (
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
      ) : (
        <form onSubmit={handlePhoneSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="+33612345678"
              required
            />
          </div>
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Code de vérification</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {otpSent ? 'Vérifier' : 'Envoyer le code'}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
