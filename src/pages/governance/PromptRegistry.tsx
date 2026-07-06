import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip as ReTooltip } from 'recharts'
import { Filter } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { EXTRA_PROMPTS, PromptRow } from '@/data/governanceSamples'

const rows: PromptRow[] = [
  { name: 'GR 5-bullet summariser', department: 'GAD', version: 'v3', risk: 'Low', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-28' },
  { name: 'Marathi citizen advisory', department: 'GAD', version: 'v2', risk: 'Medium', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-24' },
  { name: 'RTI Section 6 reply', department: 'All', version: 'v1', risk: 'Medium', createdBy: 'V. Patil', approvedBy: '—', status: 'Needs Review', updated: '2026-07-03' },
  { name: 'Crop-loss appeal draft', department: 'AGR', version: 'v2', risk: 'Medium', createdBy: 'S. Jadhav', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-14' },
  { name: 'FIR sensitive redaction', department: 'HOME', version: 'v1', risk: 'High', createdBy: 'K. Rao', approvedBy: '—', status: 'Needs Review', updated: '2026-07-02' },
  { name: 'Welfare shortlist explain', department: 'WCD', version: 'v1', risk: 'High', createdBy: 'S. Mahale', approvedBy: '—', status: 'Deprecated', updated: '2026-04-11' },
  { name: 'e-Office file movement note', department: 'All', version: 'v4', risk: 'Low', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-30' },
  { name: 'Cabinet note distiller', department: 'GAD', version: 'v3', risk: 'Medium', createdBy: 'V. Patil', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-19' },
  ...EXTRA_PROMPTS,
]

// Deterministic 7-day success-rate series per top prompt (mock)
const PERF_TOP: { name: string; series: { d: string; v: number }[] }[] = [
  { name: 'GR 5-bullet summariser', series: [92, 93, 91, 94, 95, 94, 96] },
  { name: 'Marathi citizen advisory', series: [88, 89, 90, 88, 91, 92, 92] },
  { name: 'e-Office file movement note', series: [96, 95, 96, 97, 97, 96, 97] },
  { name: 'Cabinet note distiller', series: [83, 85, 84, 86, 87, 88, 88] },
  { name: 'Crop-loss appeal draft', series: [79, 81, 82, 84, 83, 85, 86] },
].map((p) => ({ name: p.name, series: p.series.map((v, i) => ({ d: `D-${6 - i}`, v })) }))

export function PromptRegistry() {
  const [dept, setDept] = useState('All')
  const [risk, setRisk] = useState('All')
  const [status, setStatus] = useState('All')

  const depts = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.department)))], [])

  const filtered = useMemo(() => rows.filter((r) => (
    (dept === 'All' || r.department === dept) &&
    (risk === 'All' || r.risk === risk) &&
    (status === 'All' || r.status === status)
  )), [dept, risk, status])

  const columns: Column<PromptRow>[] = [
    { key: 'name', header: 'Prompt', sortable: true },
    { key: 'department', header: 'Dept', sortable: true },
    { key: 'version', header: 'Version', sortable: true },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => <RiskBadge level={r.risk} /> },
    { key: 'createdBy', header: 'Created by' },
    { key: 'approvedBy', header: 'Approved by' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'updated', header: 'Last updated', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="Prompt Registry"
        description="All prompts in the platform — versioned, department-scoped, risk-classified."
        breadcrumb={['Governance', 'Prompt Registry']}
        source="Demo"
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <FilterSelect label="Dept" value={dept} onChange={setDept} options={depts} />
          <FilterSelect label="Risk" value={risk} onChange={setRisk} options={['All', 'Low', 'Medium', 'High']} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', 'Draft', 'Approved', 'Needs Review', 'Deprecated']} />
          <div className="ml-auto text-xs text-ink-500">{filtered.length} of {rows.length} prompts</div>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader
          title="Prompt performance"
          subtitle="Success rate — top 5 prompts, last 7 days"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {PERF_TOP.map((p) => {
            const last = p.series[p.series.length - 1].v
            const first = p.series[0].v
            const delta = last - first
            return (
              <div key={p.name} className="min-w-0 rounded-xl border border-ink-100 p-3">
                <div className="truncate text-xs font-semibold text-ink-800" title={p.name}>{p.name}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-ink-900">{last}%</span>
                  <span className={`text-[11px] ${delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{delta >= 0 ? '▲' : '▼'} {Math.abs(delta)} pts</span>
                </div>
                <div style={{ height: 56 }} className="mt-1">
                  <ResponsiveContainer>
                    <LineChart data={p.series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <YAxis domain={[70, 100]} hide />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 11 }} />
                      <Line type="monotone" dataKey="v" stroke="#D81B60" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <DataTable columns={columns} rows={filtered} searchKeys={['name', 'department', 'createdBy', 'approvedBy']} actions={<>
        <SourceBadge source="Demo" /><button className="btn-primary">Register prompt</button>
      </>} />
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-ink-600">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input !w-auto !py-1.5 !text-xs">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
