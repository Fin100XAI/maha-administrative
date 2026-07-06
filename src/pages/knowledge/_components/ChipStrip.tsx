import { cn } from '@/lib/utils'

export interface ChipStripOption {
  value: string
  label: string
  count?: number
}

export function ChipStrip({
  options,
  value,
  onChange,
  className,
}: {
  options: ChipStripOption[]
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'chip border transition-all',
              active
                ? 'bg-brand-gradient text-white border-transparent shadow-glow'
                : 'bg-white text-ink-700 border-ink-200 hover:border-brand-300 hover:text-brand-600',
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span className={cn('rounded-full px-1.5 text-[10px] font-semibold', active ? 'bg-white/20' : 'bg-ink-100 text-ink-600')}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
