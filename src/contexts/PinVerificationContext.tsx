'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PinVerificationContextType {
  isPinVerified: boolean;
  verifyPin: () => void;
  resetPinVerification: () => void;
}

const PinVerificationContext = createContext<PinVerificationContextType | undefined>(undefined);

export function PinVerificationProvider({ children }: { children: ReactNode }) {
  const [isPinVerified, setIsPinVerified] = useState(false);

  const verifyPin = () => {
    setIsPinVerified(true);
  };

  const resetPinVerification = () => {
    setIsPinVerified(false);
  };

  return (
    <PinVerificationContext.Provider value={{ isPinVerified, verifyPin, resetPinVerification }}>
      {children}
    </PinVerificationContext.Provider>
  );
}

export function usePinVerification() {
  const context = useContext(PinVerificationContext);
  if (context === undefined) {
    throw new Error('usePinVerification must be used within a PinVerificationProvider');
  }
  return context;
}
