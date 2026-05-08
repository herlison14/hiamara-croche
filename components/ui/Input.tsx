import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-sans text-[12px] uppercase tracking-[0.1em] text-texto-claro"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-creme-50 border-[1.5px] border-creme-200 rounded-lg',
            'font-sans text-sm text-texto-medio placeholder:text-texto-claro',
            'transition-all duration-200 outline-none',
            'focus:border-rosa-400 focus:shadow-focus-rosa',
            error && 'border-red-400 focus:border-red-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-500 font-sans">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-texto-claro font-sans">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
