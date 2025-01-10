import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles suivant les recommandations Apple
          'inline-flex items-center justify-center rounded-lg',
          'min-h-[44px] min-w-[44px] px-4',  // Taille minimale pour les cibles tactiles
          'text-base font-medium leading-none', // Taille de texte minimale recommandée
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variantes
          {
            'bg-primary text-white hover:bg-primary/90': variant === 'primary',
            'bg-secondary/10 text-secondary hover:bg-secondary/20': variant === 'secondary',
            'hover:bg-accent/10': variant === 'ghost',
            'bg-red-500/90 text-white hover:bg-red-500/80': variant === 'destructive',
          },
          // Tailles
          {
            'text-sm': size === 'sm',
            'text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
