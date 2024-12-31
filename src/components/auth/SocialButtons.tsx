import { authService } from '@/lib/auth'

interface SocialButtonsProps {
  onError: (error: string) => void
}

export default function SocialButtons({ onError }: SocialButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...')
      const { data, error } = await authService.signInWithGoogle()
      console.log('Google sign-in response:', { data, error })
      if (error) {
        console.error('Google sign-in error:', error)
        onError(error.message)
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err)
      onError('Une erreur inattendue est survenue')
    }
  }

  const handleAppleSignIn = async () => {
    const { error } = await authService.signInWithApple()
    if (error) onError(error.message)
  }

  return (
    <>
      <div className="space-y-4 mb-6">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Continuer avec Google
        </button>

        <button
          onClick={handleAppleSignIn}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M17.05,11.97 C17.0246,9.28 19.2346,7.99 19.31,7.94 C17.9946,6.06 15.9846,5.73 15.2746,5.70 C13.5546,5.52 11.9046,6.70 11.0246,6.70 C10.1346,6.70 8.79457,5.72 7.36457,5.75 C5.50457,5.77 3.79457,6.77 2.88457,8.32 C0.994573,11.51 2.39457,16.14 4.19457,18.76 C5.09457,20.04 6.14457,21.47 7.54457,21.42 C8.90457,21.36 9.41457,20.56 11.0446,20.56 C12.6646,20.56 13.1346,21.42 14.5646,21.39 C16.0346,21.36 16.9446,20.09 17.8146,18.80 C18.8646,17.32 19.2846,15.86 19.3046,15.79 C19.2746,15.78 17.0796,14.92 17.0546,11.97"
            />
          </svg>
          Continuer avec Apple
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>
    </>
  )
}
