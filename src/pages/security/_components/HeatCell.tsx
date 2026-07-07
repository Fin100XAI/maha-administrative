// Small reusable heat cell used for MITRE tactic coverage and UBA hour heatmap.
import { cn } from '@/lib/utils'

/** Levels 0..4 (MITRE coverage buckets). */
export function CoverageCell({ level, label }: { level: number; label: string }) {
  const bg =
    level >= 4 ? 'bg-brand-gradient text-white' :
    level === 3 ? 'bg-brand-300 text-brand-900' :
    level === 2 ? 'bg-brand-200 text-brand-800' :
    level === 1 ? 'bg-brand-100 text-brand-700' :
                  'bg-ink-100 text-ink-500'
  return (
    <div
      className={cn(
        'flex h-14 items-center justify-center rounded-md px-2 text-center text-[11px] font-medium leading-tight',
        bg,
      )}
      title={`${label} — coverage ${level}/4`}
    >
      <span className="line-clamp-2">{label}</span>
    </div>
  )
}

/** Simple 0..100 value cell for UBA hour heatmap. */
export function HourCell({ v }: { v: number }) {
  const opacity = Math.min(1, 0.1 + (v / 100) * 0.9)
  return (
    <div
      className="h-6 rounded-sm"
      style={{ backgroundColor: `rgba(11, 87, 208, ${opacity.toFixed(2)})` }}
      title={`${v}`}
    />
  )
}
