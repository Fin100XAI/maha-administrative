import { GitCompare, Plus, Minus, Pencil } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'

export type DiffKind = 'added' | 'removed' | 'modified' | 'unchanged'

export interface DiffRow {
  clause: string
  left: string
  right: string
  kind: DiffKind
}

const kindStyles: Record<DiffKind, string> = {
  added: 'border-emerald-200 bg-emerald-50/60',
  removed: 'border-red-200 bg-red-50/60',
  modified: 'border-amber-200 bg-amber-50/60',
  unchanged: 'border-ink-100 bg-white',
}

const kindIcon: Record<DiffKind, any> = {
  added: Plus,
  removed: Minus,
  modified: Pencil,
  unchanged: GitCompare,
}

export function CompareDiff({
  leftLabel,
  rightLabel,
  rows,
  title = 'Compare versions',
  subtitle = 'Side-by-side clause diff',
}: {
  leftLabel: string
  rightLabel: string
  rows: DiffRow[]
  title?: string
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        right={
          <div className="flex items-center gap-2">
            <SourceBadge source="Demo" />
            <GitCompare className="h-4 w-4 text-brand-500" />
          </div>
        }
      />
      <div className="mb-3 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2 font-medium text-ink-700">{leftLabel}</div>
        <div className="rounded-lg border border-brand-200 bg-brand-soft px-3 py-2 font-medium text-brand-700">{rightLabel}</div>
      </div>
      <ul className="space-y-2">
        {rows.map((r) => {
          const Icon = kindIcon[r.kind]
          return (
            <li key={r.clause} className={`rounded-lg border p-3 ${kindStyles[r.kind]}`}>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-ink-600">
                <Icon className="h-3 w-3" /> {r.clause} · {r.kind}
              </div>
              <div className="grid grid-cols-1 gap-3 text-[12.5px] text-ink-700 md:grid-cols-2">
                <div className="min-w-0 rounded-md border border-ink-100 bg-white p-2 leading-relaxed">{r.left || <em className="text-ink-400">— absent —</em>}</div>
                <div className="min-w-0 rounded-md border border-ink-100 bg-white p-2 leading-relaxed">{r.right || <em className="text-ink-400">— absent —</em>}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
