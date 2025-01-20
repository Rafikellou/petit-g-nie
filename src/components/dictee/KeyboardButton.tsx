'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface KeyboardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function KeyboardButton({ children, className, ...props }: KeyboardButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
