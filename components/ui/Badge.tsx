import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'destaque' | 'novo' | 'top' | 'categoria'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default:   'bg-rosa-100 text-rosa-500',
  destaque:  'bg-rosa-400 text-white',
  novo:      'bg-amber-400 text-white',
  top:       'bg-texto-escuro text-white',
  categoria: 'bg-rosa-100 text-rosa-500',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full font-sans text-[11px] font-semibold uppercase tracking-[0.1em]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
