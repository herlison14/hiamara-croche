import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-rosa-400 hover:bg-rosa-500 text-white shadow-btn-rosa hover:shadow-btn-rosa-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  secondary:
    'border-[1.5px] border-rosa-400 text-rosa-400 hover:bg-rosa-100 bg-transparent hover:-translate-y-0.5 active:scale-[0.98]',
  ghost:
    'text-rosa-400 underline-offset-4 hover:underline bg-transparent border-none shadow-none',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-[11px] px-4 py-2 rounded',
  md: 'text-[12px] px-8 py-3 rounded-[6px]',
  lg: 'text-sm px-10 py-4 rounded-[6px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.08em]',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rosa-400 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
        variants[variant],
        variant !== 'ghost' && sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
