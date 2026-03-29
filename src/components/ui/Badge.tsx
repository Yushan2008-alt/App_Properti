import { cn } from '@/lib/utils'
import { ShieldCheck } from 'lucide-react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'verified' | 'status' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-sm',
        {
          'bg-accent-gold-pale text-accent-gold': variant === 'gold',
          'bg-status-success-bg text-status-success': variant === 'verified',
          'bg-bg-secondary text-text-secondary border border-border': variant === 'status',
          'bg-bg-secondary text-text-secondary': variant === 'default',
        },
        className
      )}
    >
      {variant === 'verified' && <ShieldCheck className="w-3 h-3" />}
      {children}
    </span>
  )
}
