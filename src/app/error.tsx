'use client'

import { useEffect } from 'react'

interface AppError extends Error {
  digest?: string;
  code?: string;
  context?: Record<string, unknown>;
  timestamp?: string;
  userInfo?: {
    id?: string;
    role?: string;
    lastAction?: string;
  };
}

interface ErrorLog {
  error: AppError;
  timestamp: string;
  url: string;
  userAgent: string;
  severity: 'warning' | 'error' | 'critical';
}

export default function Error({
  error,
  reset,
}: {
  error: AppError;
  reset: () => void;
}) {
  useEffect(() => {
    const logError = async () => {
      const errorLog: ErrorLog = {
        error: {
          name: error.name,
          message: error.message,
          digest: error.digest,
          code: error.code,
          context: error.context,
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: error.name === 'FatalError' ? 'critical' : 'error'
      };

      try {
        // Loguer l'erreur sur un service d'erreur
        console.error('Error logged:', errorLog);
        // await logErrorToService(errorLog);
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    };

    logError();
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-gradient mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-white/70 mb-6">
          {error.code === 'NETWORK_ERROR' 
            ? 'Vérifiez votre connexion internet et réessayez.'
            : 'Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille sur la résolution du problème.'}
        </p>
        <button
          onClick={reset}
          className="btn-modern"
        >
          <span className="relative z-10">Réessayer</span>
        </button>
      </div>
    </div>
  );
}
