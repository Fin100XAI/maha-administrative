import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SourceBadge, ConfidenceBadge, TrendBadge } from './Badges'

export interface MetricCardProps {
  label: string
  value: string | number
  delta?: number
  status?: ReactNode
  source?: 'Live' | 'Public-source linked' | 'Demo' | 'Department API required'
  confidence?: number
  icon?: ReactNode
  hint?: string
  accent?: 'default' | 'brand'
}

export function MetricCard({
  label,
  value,
  delta,
  status,
  source = 'Demo',
  confidence,
  icon,
  hint,
  accent = 'default',
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'group card card-hover relative overflow-hidden p-5 transition-all duration-300',
        accent === 'brand' && 'bg-brand-soft',
      )}
    >
      {/* Corner glow — grows on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-gradient opacity-[0.08] blur-2xl transition-all duration-500 group-hover:opacity-25 group-hover:scale-125"
      />
      {/* Left accent bar */}
      <div className="pointer-events-none absolute inset-y-4 left-0 w-0.5 rounded-full bg-brand-gradient opacity-40 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
            {label}
          </div>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <div className="text-[26px] font-semibold leading-none text-ink-900">
              {value}
            </div>
            {typeof delta === 'number' && <TrendBadge delta={delta} />}
          </div>
          {hint && <div className="mt-1.5 text-xs text-ink-500">{hint}</div>}
        </div>
        {icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-600 shadow-inner ring-1 ring-brand-100 transition-transform duration-300 group-hover:scale-105">
            {icon}
          </div>
        )}
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        {status}
        {source && <SourceBadge source={source} />}
        {typeof confidence === 'number' && <ConfidenceBadge score={confidence} />}
      </div>
    </div>
  )
}
