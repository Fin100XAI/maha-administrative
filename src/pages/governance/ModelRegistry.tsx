import { useMemo, useState } from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts'
import { Eye, GitCompare, ClipboardCheck, Undo2, XOctagon, ChevronDown, Filter } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { MODELS, ModelEntry } from '@/data/models'
import { EXTRA_MODELS } from '@/data/governanceSamples'

const ALL_MODELS: ModelEntry[] = [...MODELS, ...EXTRA_MODELS]

export function ModelRegistry() {
  const [hosting, setHosting] = useState<string>('All')
  const [risk, setRisk] = useState<string>('All')
  const [status, setStatus] = useState<string>('All')
  const [compareOpen, setCompareOpen] = useState(true)

  const filtered = useMemo(() => ALL_MODELS.filter((m) => (
    (hosting === 'All' || m.hosting === hosting) &&
    (risk === 'All' || m.riskClass === risk) &&
    (status === 'All' || m.status === status)
  )), [hosting, risk, status])

  // Pick three models for radar comparison
  const compareSet = ['bharat-gpt-1', 'sarvam-m', 'claude-opus']
  const comparison = compareSet
    .map((id) => ALL_MODELS.find((m) => m.id === id))
    .filter((m): m is ModelEntry => Boolean(m))

  const radarData = [
    { dim: 'Accuracy', ...Object.fromEntries(comparison.map((m) => [m.name.split(' ')[0], m.accuracy])) },
    { dim: 'Language', ...Object.fromEntries(comparison.map((m) => [m.name.split(' ')[0], m.languageStrength])) },
    { dim: 'Document', ...Object.fromEntries(comparison.map((m) => [m.name.split(' ')[0], m.documentStrength])) },
    { dim: 'Speed', ...Object.fromEntries(comparison.map((m) => [m.name.split(' ')[0], Math.round(100 - m.latencyMs / 10)])) },
    { dim: 'Security', ...Object.fromEntries(comparison.map((m) => [m.name.split(' ')[0], m.securityRating === 'A+' ? 96 : m.securityRating === 'A' ? 88 : m.securityRating === 'B' ? 74 : 60])) },
  ]

  const columns: Column<ModelEntry>[] = [
    { key: 'name', header: 'Model', sortable: true, render: (r) => (
      <div className="min-w-0">
        <div className="truncate font-medium text-ink-900">{r.name}</div>
        <div className="truncate text-xs text-ink-500">{r.provider} · v{r.version}</div>
      </div>
    )},
    { key: 'hosting', header: 'Hosting', sortable: true, render: (r) => (
      <span className="chip border border-ink-200 bg-ink-50 text-ink-700">{r.hosting}</span>
    )},
    { key: 'approvedFor', header: 'Approved for', render: (r) => (
      <div className="flex flex-wrap gap-1">{r.approvedFor.map((c) => <span key={c} className="chip border border-ink-200 bg-white text-ink-600">{c}</span>)}</div>
    )},
    { key: 'riskClass', header: 'Risk', sortable: true, render: (r) => <RiskBadge level={r.riskClass} /> },
    { key: 'accuracy', header: 'Accuracy', sortable: true, render: (r) => <span>{r.accuracy}%</span> },
    { key: 'latencyMs', header: 'Latency', sortable: true, render: (r) => <span>{r.latencyMs}ms</span> },
    { key: 'lastEvaluation', header: 'Last eval', sortable: true },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: () => (
      <div className="flex items-center gap-1">
        <button className="btn-ghost !p-1.5" title="View"><Eye className="h-4 w-4" /></button>
        <button className="btn-ghost !p-1.5" title="Compare"><GitCompare className="h-4 w-4" /></button>
        <button className="btn-ghost !p-1.5" title="Approve"><ClipboardCheck className="h-4 w-4 text-emerald-600" /></button>
        <button className="btn-ghost !p-1.5" title="Rollback"><Undo2 className="h-4 w-4 text-amber-600" /></button>
        <button className="btn-ghost !p-1.5" title="Retire"><XOctagon className="h-4 w-4 text-red-500" /></button>
      </div>
    )},
  ]

  const COLORS = ['#D81B60', '#6A1B9A', '#4A148C']

  return (
    <div>
      <PageHeader
        title="Model Registry"
        description="All AI models approved, pending, retired or rolled-back for MAII. Governance authority: DIT Model Risk Committee."
        breadcrumb={['Governance', 'Model Registry']}
        source="Demo"
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
            <Filter className="h-4 w-4" /> Filters
          </div>
          <FilterSelect label="Hosting" value={hosting} onChange={setHosting} options={['All', 'On-Prem', 'Cloud', 'Hybrid']} />
          <FilterSelect label="Risk" value={risk} onChange={setRisk} options={['All', 'Low', 'Medium', 'High']} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', 'Approved', 'Under Review', 'Retired', 'Rolled Back']} />
          <div className="ml-auto text-xs text-ink-500">{filtered.length} of {ALL_MODELS.length} models</div>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader
          title="Model comparison"
          subtitle="Radar view — BharatGPT · Sarvam · Claude Opus"
          right={
            <div className="flex items-center gap-2">
              <SourceBadge source="Demo" />
              <button
                onClick={() => setCompareOpen((v) => !v)}
                className="btn-outline !py-1"
                title="Toggle drawer"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${compareOpen ? 'rotate-180' : ''}`} />
                {compareOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>
          }
        />
        {compareOpen && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_1fr]">
            <div style={{ height: 280 }} className="w-full">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#eef2f7" />
                  <PolarAngleAxis dataKey="dim" tick={{ fill: '#64748b', fontSize: 11 }} />
                  {comparison.map((m, i) => (
                    <Radar
                      key={m.id}
                      name={m.name.split(' ')[0]}
                      dataKey={m.name.split(' ')[0]}
                      stroke={COLORS[i]}
                      fill={COLORS[i]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {comparison.map((m, i) => (
                <div key={m.id} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[i] }} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-ink-800">{m.name}</div>
                      <div className="truncate text-[11px] text-ink-500">{m.provider} · v{m.version}</div>
                    </div>
                    <RiskBadge level={m.riskClass} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-ink-600">
                    <span><b className="text-ink-900">{m.accuracy}%</b> accuracy</span>
                    <span><b className="text-ink-900">{m.latencyMs}ms</b> p50</span>
                    <span><b className="text-ink-900">{m.securityRating}</b> sec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <DataTable
        columns={columns}
        rows={filtered}
        searchKeys={['name', 'provider', 'owner', 'status']}
        actions={<>
          <SourceBadge source="Demo" />
          <button className="btn-outline">Compare selected</button>
          <button className="btn-primary">Register new model</button>
        </>}
      />
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
