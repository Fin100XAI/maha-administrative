import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string
  hint?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 bg-ink-50/40 py-10 text-center">
      {icon && <div className="text-ink-400">{icon}</div>}
      <div className="text-sm font-medium text-ink-700">{title}</div>
      {hint && <div className="text-xs text-ink-500">{hint}</div>}
    </div>
  )
}
