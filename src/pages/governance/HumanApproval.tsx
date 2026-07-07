import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Check, X, ArrowRight, Clock, Filter, UserCheck } from 'lucide-react'
import { EXTRA_APPROVALS, ApprovalItem } from '@/data/governanceSamples'

type Column = 'Awaiting Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated'

type Item = ApprovalItem

const START: Item[] = [
  { id: 'AP-401', title: 'GR summary for CS desk', dept: 'GAD', officer: 'A. Deshmukh', due: '2026-07-08', risk: 'Low', col: 'Awaiting Review' },
  { id: 'AP-402', title: 'Note draft — MAII roll-out', dept: 'DIT', officer: 'N. Deshpande', due: '2026-07-08', risk: 'Medium', col: 'Awaiting Review' },
  { id: 'AP-403', title: 'Marathi advisory — PMAY-U 2.0', dept: 'UDD', officer: 'K. Kore', due: '2026-07-09', risk: 'Medium', col: 'Under Review' },
  { id: 'AP-404', title: 'FIR summarisation output', dept: 'HOME', officer: 'K. Rao', due: '2026-07-07', risk: 'High', col: 'Escalated' },
  { id: 'AP-405', title: 'Cabinet note distiller', dept: 'GAD', officer: 'V. Patil', due: '2026-07-10', risk: 'Medium', col: 'Approved' },
  { id: 'AP-406', title: 'Crop-loss appeal draft (MR)', dept: 'AGR', officer: 'S. Jadhav', due: '2026-07-11', risk: 'Medium', col: 'Rejected' },
  { id: 'AP-407', title: 'e-Office file movement note', dept: 'ALL', officer: 'M. Kore', due: '2026-07-12', risk: 'Low', col: 'Approved' },
  { id: 'AP-408', title: 'Marathi note tone (v2)', dept: 'GAD', officer: 'A. Deshmukh', due: '2026-07-13', risk: 'Low', col: 'Awaiting Review' },
  ...EXTRA_APPROVALS,
]

const COLS: Column[] = ['Awaiting Review', 'Under Review', 'Approved', 'Rejected', 'Escalated']
const TODAY = new Date('2026-07-07T00:00:00Z')

function slaFor(due: string): { label: string; tone: 'ok' | 'warn' | 'over' } {
  const d = new Date(due + 'T23:59:59Z').getTime()
  const diffH = Math.round((d - TODAY.getTime()) / (1000 * 60 * 60))
  if (diffH < 0) return { label: `Overdue ${Math.abs(diffH)}h`, tone: 'over' }
  if (diffH <= 24) return { label: `Due in ${diffH}h`, tone: 'warn' }
  return { label: `Due in ${Math.round(diffH / 24)}d`, tone: 'ok' }
}

function SlaChip({ due }: { due: string }) {
  const s = slaFor(due)
  const cls =
    s.tone === 'over' ? 'bg-red-50 text-red-700 border-red-200' :
    s.tone === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-emerald-50 text-emerald-700 border-emerald-200'
  return (
    <span className={`chip border !text-[10px] ${cls}`} title={`Due ${due}`}>
      <Clock className="h-3 w-3" /> {s.label}
    </span>
  )
}

export function HumanApproval() {
  const [items, setItems] = useState<Item[]>(START)
  const [risk, setRisk] = useState('All')
  const [dept, setDept] = useState('All')

  const depts = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.dept)))], [items])
  const filtered = useMemo(() => items.filter((i) => (
    (risk === 'All' || i.risk === risk) &&
    (dept === 'All' || i.dept === dept)
  )), [items, risk, dept])

  const grouped = useMemo(() => COLS.reduce<Record<Column, Item[]>>((acc, c) => { acc[c] = filtered.filter((i) => i.col === c); return acc }, {} as any), [filtered])

  const myAssignments = filtered.filter((i) => i.officer === 'A. Deshmukh')
  const overdue = filtered.filter((i) => slaFor(i.due).tone === 'over').length

  const move = (id: string, to: Column) => setItems(items.map((i) => i.id === id ? { ...i, col: to } : i))

  return (
    <div>
      <PageHeader
        title="Human Approval"
        description="Kanban workflow for all AI outputs requiring HITL review."
        breadcrumb={['Governance', 'Human Approval']}
        source="Demo"
      />

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="My assignments"
            subtitle="A. Deshmukh · AI Governance Officer"
            right={<UserCheck className="h-4 w-4 text-brand-500" />}
          />
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-ink-100 p-2">
              <div className="text-lg font-semibold text-ink-900">{myAssignments.length}</div>
              <div className="text-[11px] text-ink-500">Total</div>
            </div>
            <div className="rounded-lg border border-ink-100 p-2">
              <div className="text-lg font-semibold text-amber-700">{myAssignments.filter((i) => i.col === 'Awaiting Review').length}</div>
              <div className="text-[11px] text-ink-500">Awaiting</div>
            </div>
            <div className="rounded-lg border border-ink-100 p-2">
              <div className="text-lg font-semibold text-red-700">{myAssignments.filter((i) => slaFor(i.due).tone === 'over').length}</div>
              <div className="text-[11px] text-ink-500">Overdue</div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Queue snapshot" subtitle="Across all reviewers" right={<SourceBadge source="Demo" />} />
          <div className="grid grid-cols-5 gap-2 text-center">
            {COLS.map((c) => (
              <div key={c} className="rounded-lg border border-ink-100 p-2">
                <div className="text-lg font-semibold text-ink-900">{grouped[c].length}</div>
                <div className="truncate text-[10px] text-ink-500" title={c}>{c.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          {overdue > 0 && (
            <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              {overdue} item{overdue > 1 ? 's' : ''} past due · escalate
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Filters"
            subtitle="Narrow the board"
            right={<Filter className="h-4 w-4 text-brand-500" />}
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-ink-600">
              <span>Risk</span>
              <select value={risk} onChange={(e) => setRisk(e.target.value)} className="input !py-1.5 !text-xs">
                {['All', 'Low', 'Medium', 'High'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink-600">
              <span>Department</span>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="input !py-1.5 !text-xs">
                {depts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-2 text-[11px] text-ink-500">{filtered.length} of {items.length} shown</div>
        </Card>
      </div>

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
                    <SlaChip due={it.due} />
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
