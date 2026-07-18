import { LayoutTemplate } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import type { AdminTemplate } from '@/data/adminSamples'

export function TemplateGallery({
  items,
  title = 'Templates',
  subtitle = 'Pre-built templates ready to use',
  onUse,
  activeId,
}: {
  items: AdminTemplate[]
  title?: string
  subtitle?: string
  onUse?: (template: AdminTemplate) => void
  activeId?: string | null
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        right={
          <div className="flex items-center gap-2">
            <SourceBadge source="Demo" />
            <LayoutTemplate className="h-4 w-4 text-brand-500" />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => {
          const active = activeId === t.id
          return (
            <div
              key={t.id}
              className={`group flex flex-col rounded-xl border bg-white p-4 transition-shadow hover:shadow-glow ${
                active ? 'border-brand-400 shadow-glow ring-1 ring-brand-200' : 'border-ink-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-600">
                  <LayoutTemplate className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900">{t.title}</div>
                  <div className="mt-0.5 text-[11px] text-ink-500">
                    {t.department} · {t.category} · updated {t.updated}
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 min-h-[3.25rem] text-[12.5px] leading-relaxed text-ink-600">
                {t.description}
              </p>
              {t.structure && t.structure.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-[11px] text-ink-500">
                  {t.structure.map((s, i) => (
                    <li key={s.heading} className="flex items-start gap-1.5">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded bg-ink-100 text-[9px] font-semibold text-ink-600">{i + 1}</span>
                      <span className="truncate" title={s.heading}>{s.heading}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => onUse?.(t)}
                disabled={!onUse}
                className="btn-primary mt-3 w-full !py-1.5 text-xs disabled:opacity-60"
              >
                <LayoutTemplate className="h-3.5 w-3.5" /> {active ? 'Applied ✓' : 'Use template'}
              </button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
