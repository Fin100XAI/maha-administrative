import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge, RiskBadge, SourceBadge } from '@/components/ui/Badges'
import { Timer, Archive, Trash2, ShieldCheck, CalendarDays, Gavel, Workflow } from 'lucide-react'
import { RETENTION_CALENDAR, LEGAL_HOLDS, DISPOSAL_LOG } from '@/data/dpdpSamples'

interface Row {
  category: string
  policy: string
  expiring: number
  archived: number
  legalHold: boolean
  owner: string
  status: 'Approved' | 'Under Review'
}
const rows: Row[] = [
  { category: 'GR / Circular', policy: '10 years', expiring: 128, archived: 62410, legalHold: false, owner: 'GAD', status: 'Approved' },
  { category: 'Note sheets', policy: '7 years', expiring: 342, archived: 148230, legalHold: false, owner: 'All depts', status: 'Approved' },
  { category: 'RTI replies', policy: '10 years', expiring: 22, archived: 42180, legalHold: false, owner: 'ALL', status: 'Approved' },
  { category: 'Beneficiary records', policy: '5 years', expiring: 512, archived: 218420, legalHold: true, owner: 'MahaDBT', status: 'Under Review' },
  { category: 'Health records', policy: '15 years', expiring: 12, archived: 82140, legalHold: false, owner: 'HFW', status: 'Approved' },
  { category: 'Cabinet notes', policy: '25 years', expiring: 6, archived: 4210, legalHold: true, owner: 'GAD', status: 'Approved' },
]

// Bucket calendar by week for a compact 30-day view.
function calendarWeek(day: string): string {
  const n = parseInt(day.replace('D+', ''), 10)
  if (n <= 7) return 'Week 1'
  if (n <= 14) return 'Week 2'
  if (n <= 21) return 'Week 3'
  return 'Week 4'
}

const WORKFLOW_STEPS: { key: string; label: string; owner: string; status: 'done' | 'active' | 'wait' }[] = [
  { key: 'flag',    label: 'System flags record past retention',    owner: 'Retention engine', status: 'done'   },
  { key: 'dept',    label: 'Owning department reviews',              owner: 'Dept records officer', status: 'done' },
  { key: 'dpo',     label: 'DPO reviews consent + legal hold status',owner: 'DPO Cell',         status: 'active' },
  { key: 'legal',   label: 'Legal counsel clearance (if applicable)',owner: 'GAD Legal',        status: 'wait'   },
  { key: 'approve', label: 'Dual approval (owner + DPO)',            owner: 'Dept + DPO',       status: 'wait'   },
  { key: 'dispose', label: 'Cryptographic erase + audit log',        owner: 'DIT storage',      status: 'wait'   },
]

export function DataRetention() {
  const columns: Column<Row>[] = [
    { key: 'category', header: 'Category', sortable: true },
    { key: 'policy', header: 'Retention', sortable: true },
    { key: 'expiring', header: 'Expiring (30d)', sortable: true },
    { key: 'archived', header: 'Archived', sortable: true },
    { key: 'legalHold', header: 'Legal hold', render: (r) => <StatusBadge status={r.legalHold ? 'Active' : 'Closed'} /> },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]

  const buckets = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  return (
    <div>
      <PageHeader
        title="Data Retention"
        description="Retention policies, expiring data, legal holds and deletion approvals."
        breadcrumb={['DPDP', 'Data Retention']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Policies enforced" value={12} icon={<ShieldCheck className="h-5 w-5" />} delta={0} source="Demo" confidence={92} />
        <MetricCard label="Expiring in 30 days" value="1,022" icon={<Timer className="h-5 w-5" />} delta={0} source="Demo" confidence={88} />
        <MetricCard label="Archived (all-time)" value="5.58 L" icon={<Archive className="h-5 w-5" />} delta={5.1} source="Demo" confidence={90} />
        <MetricCard label="Retention violations" value={3} icon={<Trash2 className="h-5 w-5" />} delta={-50} source="Demo" confidence={90} />
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={rows} searchKeys={['category', 'owner']} actions={<><SourceBadge source="Demo" /></>} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Retention calendar - next 30 days"
            subtitle="Records reaching end-of-retention, grouped by week"
            right={<div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {buckets.map((wk) => {
              const items = RETENTION_CALENDAR.filter((r) => calendarWeek(r.day) === wk)
              const total = items.reduce((s, i) => s + i.count, 0)
              return (
                <div key={wk} className="rounded-xl border border-ink-100 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">{wk}</div>
                    <span className="text-[10px] text-ink-500">{total.toLocaleString()} rec</span>
                  </div>
                  <ul className="space-y-2">
                    {items.length === 0 && (
                      <li className="text-xs text-ink-400">None</li>
                    )}
                    {items.map((i) => (
                      <li key={i.day + i.category} className="rounded-md border border-ink-100 px-2 py-1.5">
                        <div className="flex items-center justify-between text-[10px] text-ink-500">
                          <span>{i.day}</span>
                          <span>{i.owner}</span>
                        </div>
                        <div className="mt-0.5 truncate text-xs font-medium text-ink-800">{i.category}</div>
                        <div className="text-[10px] text-ink-500">{i.count} rec - policy {i.policy}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Disposal approval workflow"
            subtitle="Every deletion passes six gates"
            right={<Workflow className="h-4 w-4 text-brand-500" />}
          />
          <ol className="relative space-y-3 border-l border-dashed border-ink-200 pl-4">
            {WORKFLOW_STEPS.map((s, i) => (
              <li key={s.key} className="relative">
                <span className={`absolute -left-[21px] top-1 grid h-3 w-3 rounded-full ring-2 ${
                  s.status === 'done' ? 'bg-emerald-500 ring-emerald-200' :
                  s.status === 'active' ? 'bg-amber-500 ring-amber-200 animate-pulse' :
                  'bg-white ring-ink-200'
                }`} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">Step {i + 1} - {s.label}</div>
                    <div className="text-xs text-ink-500">{s.owner}</div>
                  </div>
                  <span className={`chip border text-[10px] shrink-0 ${
                    s.status === 'done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    s.status === 'active' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-ink-100 text-ink-600 border-ink-200'
                  }`}>{s.status === 'done' ? 'Cleared' : s.status === 'active' ? 'In progress' : 'Pending'}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.2fr]">
        <Card>
          <CardHeader
            title="Active legal holds"
            subtitle="Erasure suspended pending case outcome"
            right={<Gavel className="h-4 w-4 text-brand-500" />}
          />
          <ul className="space-y-2">
            {LEGAL_HOLDS.map((h) => (
              <li key={h.id} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{h.case}</div>
                    <div className="mt-0.5 truncate text-xs text-ink-500">
                      {h.id} - {h.category} - initiated {h.date}
                    </div>
                    <div className="text-xs text-ink-500">Initiator: {h.initiator}</div>
                  </div>
                  <StatusBadge status="Active" />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Disposal history log"
            subtitle="Immutable audit trail of the last 8 disposals"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr>{['ID', 'Date', 'Category', 'Records', 'Approver', 'Method'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {DISPOSAL_LOG.map((d) => (
                  <tr key={d.id} className="hover:bg-ink-50/40">
                    <td className="table-td font-mono text-xs">{d.id}</td>
                    <td className="table-td text-xs">{d.date}</td>
                    <td className="table-td">{d.category}</td>
                    <td className="table-td font-mono">{d.count}</td>
                    <td className="table-td text-xs">{d.approver}</td>
                    <td className="table-td text-xs text-ink-500">{d.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Violations & required actions" />
        <ul className="space-y-2 text-sm">
          <li className="rounded-md border border-ink-100 px-3 py-2 flex items-center justify-between gap-3">
            <span>Beneficiary records retained 3 months beyond 5-year policy in Rural Development</span>
            <RiskBadge level="Medium" />
          </li>
          <li className="rounded-md border border-ink-100 px-3 py-2 flex items-center justify-between gap-3">
            <span>2 note sheets flagged for deletion but held by DPO decision - awaiting review</span>
            <RiskBadge level="Low" />
          </li>
        </ul>
      </Card>
    </div>
  )
}
