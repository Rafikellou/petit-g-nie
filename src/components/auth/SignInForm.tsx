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
    <div className="space-y-6">
      <SocialButtons onError={setError} />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white/10 text-white/40">ou</span>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${method === 'email' ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
          onClick={() => setMethod('email')}
        >
          Email
        </button>
        <button
          className={`px-4 py-2 rounded ${method === 'phone' ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
          onClick={() => setMethod('phone')}
        >
          Téléphone
        </button>
      </div>

      {method === 'email' ? (
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-white mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Se connecter
          </button>
        </form>
      ) : (
        <form onSubmit={handlePhoneSignIn} className="space-y-4">
          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-white mb-2"
            >
              Numéro de téléphone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+33612345678"
              required
            />
          </div>
          {otpSent && (
            <div>
              <label 
                htmlFor="otp" 
                className="block text-sm font-medium text-white mb-2"
              >
                Code de vérification
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {otpSent ? 'Vérifier' : 'Envoyer le code'}
          </button>
        </form>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  )
}
