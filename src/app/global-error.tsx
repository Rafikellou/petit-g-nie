'use client'

import { AppError, ErrorLog } from './error'

export default function GlobalError({
  error,
  reset,
}: {
  error: AppError
  reset: () => void
}) {
  const logGlobalError = async () => {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString()
    };

    try {
      console.error('Global error logged:', errorLog);
      // await logErrorToService(errorLog);
    } catch (e) {
      console.error('Failed to log global error:', e);
    }
  };

  // Log l'erreur immédiatement
  logGlobalError();

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="glass-card p-8 max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-gradient mb-4">
              Une erreur critique est survenue
            </h2>
            <p className="text-white/70 mb-6">
              {error.code === 'NETWORK_ERROR' 
                ? 'Vérifiez votre connexion internet et réessayez.'
                : 'Une erreur inattendue est survenue. Notre équipe a été notifiée et travaille sur la résolution du problème.'}
            </p>
            <button
              onClick={reset}
              className="btn-modern"
            >
              <span className="relative z-10">Réessayer</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
