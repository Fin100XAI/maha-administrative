import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Check, X, ArrowRight } from 'lucide-react'

type Column = 'Awaiting Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated'

interface Item {
  id: string
  title: string
  dept: string
  officer: string
  due: string
  risk: 'Low' | 'Medium' | 'High'
  col: Column
}

const START: Item[] = [
  { id: 'AP-401', title: 'GR summary for CS desk', dept: 'GAD', officer: 'A. Deshmukh', due: '2026-07-08', risk: 'Low', col: 'Awaiting Review' },
  { id: 'AP-402', title: 'Note draft — MAII roll-out', dept: 'DIT', officer: 'N. Deshpande', due: '2026-07-08', risk: 'Medium', col: 'Awaiting Review' },
  { id: 'AP-403', title: 'Marathi advisory — PMAY-U 2.0', dept: 'UDD', officer: 'K. Kore', due: '2026-07-09', risk: 'Medium', col: 'Under Review' },
  { id: 'AP-404', title: 'FIR summarisation output', dept: 'HOME', officer: 'K. Rao', due: '2026-07-07', risk: 'High', col: 'Escalated' },
  { id: 'AP-405', title: 'Cabinet note distiller', dept: 'GAD', officer: 'V. Patil', due: '2026-07-10', risk: 'Medium', col: 'Approved' },
  { id: 'AP-406', title: 'Crop-loss appeal draft (MR)', dept: 'AGR', officer: 'S. Jadhav', due: '2026-07-11', risk: 'Medium', col: 'Rejected' },
  { id: 'AP-407', title: 'e-Office file movement note', dept: 'ALL', officer: 'M. Kore', due: '2026-07-12', risk: 'Low', col: 'Approved' },
  { id: 'AP-408', title: 'Marathi note tone (v2)', dept: 'GAD', officer: 'A. Deshmukh', due: '2026-07-13', risk: 'Low', col: 'Awaiting Review' },
]

const COLS: Column[] = ['Awaiting Review', 'Under Review', 'Approved', 'Rejected', 'Escalated']

export function HumanApproval() {
  const [items, setItems] = useState(START)
  const grouped = useMemo(() => COLS.reduce<Record<Column, Item[]>>((acc, c) => { acc[c] = items.filter((i) => i.col === c); return acc }, {} as any), [items])

  const move = (id: string, to: Column) => setItems(items.map((i) => i.id === id ? { ...i, col: to } : i))

  return (
    <div>
      <PageHeader
        title="Human Approval"
        description="Kanban workflow for all AI outputs requiring HITL review."
        breadcrumb={['Governance', 'Human Approval']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {COLS.map((c) => (
          <Card key={c} className="min-h-[300px] min-w-0">
            <CardHeader
              title={c}
              subtitle={`${grouped[c].length} item${grouped[c].length === 1 ? '' : 's'}`}
              right={<SourceBadge source="Demo" />}
            />
            <div className="space-y-2">
              {grouped[c].map((it) => (
                <div key={it.id} className="min-w-0 rounded-xl border border-ink-100 bg-white p-3">
                  <div className="truncate text-[11px] text-ink-500" title={`${it.id} · ${it.dept} · due ${it.due}`}>
                    {it.id} · {it.dept} · due {it.due}
                  </div>
                  <div
                    className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-ink-800"
                    title={it.title}
                  >
                    {it.title}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <RiskBadge level={it.risk} />
                    <span className="truncate text-[11px] text-ink-500" title={it.officer}>{it.officer}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {c !== 'Approved' ? (
                      <button
                        onClick={() => move(it.id, 'Approved')}
                        className="btn-outline !px-1 !py-1 text-[11px] text-emerald-700"
                        title="Approve"
                      >
                        <Check className="h-3 w-3" />
                        <span className="hidden xl:inline">Approve</span>
                      </button>
                    ) : <span />}
                    {c !== 'Rejected' ? (
                      <button
                        onClick={() => move(it.id, 'Rejected')}
                        className="btn-outline !px-1 !py-1 text-[11px] text-red-600"
                        title="Reject"
                      >
                        <X className="h-3 w-3" />
                        <span className="hidden xl:inline">Reject</span>
                      </button>
                    ) : <span />}
                    {c !== 'Escalated' ? (
                      <button
                        onClick={() => move(it.id, 'Escalated')}
                        className="btn-outline !px-1 !py-1 text-[11px] text-amber-600"
                        title="Escalate"
                      >
                        <ArrowRight className="h-3 w-3" />
                        <span className="hidden xl:inline">Escalate</span>
                      </button>
                    ) : <span />}
                  </div>
                </div>
              ))}
              {grouped[c].length === 0 && (
                <div className="rounded-md border border-dashed border-ink-200 p-4 text-center text-xs text-ink-500">No items</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
