import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  Legend, BarChart, Bar, ScatterChart, Scatter, Cell,
} from 'recharts'
import {
  Building2, Trophy, ShieldAlert, TimerOff, Bot, ShieldOff, Inbox, Sigma, ArrowUpDown,
} from 'lucide-react'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, SeverityBadge,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { DataTable, Column } from '@/components/ui/DataTable'
import { AI_DEPARTMENTS, DeptMetrics, RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Derived intelligence — everything computed FROM AI_DEPARTMENTS      */
/* ------------------------------------------------------------------ */

const RISK_WEIGHT: Record<RiskLevel, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 }

const byScore = [...AI_DEPARTMENTS].sort((a, b) => b.score - a.score)
const best = byScore[0]
const highestRisk = [...AI_DEPARTMENTS].sort(
  (a, b) => RISK_WEIGHT[b.risk] - RISK_WEIGHT[a.risk] || b.slaBreaches - a.slaBreaches,
)[0]
const highestBreach = [...AI_DEPARTMENTS].sort((a, b) => b.slaBreaches - a.slaBreaches)[0]
const highestAI = [...AI_DEPARTMENTS].sort((a, b) => b.aiAdoption - a.aiAdoption)[0]
const lowestDpdp = [...AI_DEPARTMENTS].sort((a, b) => a.dpdp - b.dpdp)[0]
const highestGrievanceLoad = [...AI_DEPARTMENTS].sort((a, b) => b.pendingFiles - a.pendingFiles)[0]

const avg = (fn: (d: DeptMetrics) => number) =>
  Math.round(AI_DEPARTMENTS.reduce((s, d) => s + fn(d), 0) / AI_DEPARTMENTS.length)

/** Indexed disposal pace (higher = faster) so slower depts read lower on the heatmap. */
const disposalPace = (d: DeptMetrics) => Math.round(100 - (d.avgDisposalDays - 5) * 5)

type MetricKey = 'score' | 'sla' | 'dpdp' | 'aiAdoption'
const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: 'score', label: 'Composite Score' },
  { key: 'sla', label: 'SLA Compliance' },
  { key: 'dpdp', label: 'DPDP Compliance' },
  { key: 'aiAdoption', label: 'AI Adoption' },
]

/** Sequential brand-blue intensity for the heatmap (single hue, light→dark). */
function heatStyle(value: number) {
  const alpha = Math.min(1, Math.max(0.08, (value - 58) / 40))
  return {
    backgroundColor: `rgba(11, 87, 208, ${alpha.toFixed(2)})`,
    color: alpha > 0.55 ? '#ffffff' : '#0f2a5e',
  }
}

function recommendationFor(d: DeptMetrics): string {
  if (d.slaBreaches >= 8) return 'Escalate SLA breach review; add disposal war-room.'
  if (d.dpdp < 85) return 'Prioritise DPDP compliance remediation sprint.'
  if (d.aiAdoption < 70) return 'Roll out AI drafting onboarding for sections.'
  if (d.avgDisposalDays > 9) return 'Rebalance file routing to cut disposal time.'
  if (d.grievanceResolution < 85) return 'Strengthen grievance triage and closure loop.'
  return 'Sustain performance; share playbook with peer departments.'
}

/* 6-month score trend for 3 focus departments — converges to current scores. */
const TREND = [
  { m: 'Feb', Health: 84, Revenue: 74, 'Urban Development': 72 },
  { m: 'Mar', Health: 85, Revenue: 73, 'Urban Development': 74 },
  { m: 'Apr', Health: 86, Revenue: 75, 'Urban Development': 73 },
  { m: 'May', Health: 87, Revenue: 76, 'Urban Development': 74 },
  { m: 'Jun', Health: 88, Revenue: 77, 'Urban Development': 75 },
  { m: 'Jul', Health: 89, Revenue: 78, 'Urban Development': 76 },
]

const BENCHMARK = [
  { metric: 'SLA', average: avg((d) => d.sla), top: Math.max(...AI_DEPARTMENTS.map((d) => d.sla)) },
  { metric: 'Grievance', average: avg((d) => d.grievanceResolution), top: Math.max(...AI_DEPARTMENTS.map((d) => d.grievanceResolution)) },
  { metric: 'DPDP', average: avg((d) => d.dpdp), top: Math.max(...AI_DEPARTMENTS.map((d) => d.dpdp)) },
  { metric: 'AI Adoption', average: avg((d) => d.aiAdoption), top: Math.max(...AI_DEPARTMENTS.map((d) => d.aiAdoption)) },
  { metric: 'Score', average: avg((d) => d.score), top: Math.max(...AI_DEPARTMENTS.map((d) => d.score)) },
]

const HEAT_METRICS: { label: string; get: (d: DeptMetrics) => number }[] = [
  { label: 'SLA', get: (d) => d.sla },
  { label: 'Disposal Pace', get: disposalPace },
  { label: 'Grievance', get: (d) => d.grievanceResolution },
  { label: 'DPDP', get: (d) => d.dpdp },
  { label: 'AI Adoption', get: (d) => d.aiAdoption },
]

interface TableRow extends DeptMetrics { rank: number; recommendation: string }

const TABLE_ROWS: TableRow[] = byScore.map((d, i) => ({
  ...d, rank: i + 1, recommendation: recommendationFor(d),
}))

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function DepartmentPerformance() {
  const [metric, setMetric] = useState<MetricKey>('score')
  const [selected, setSelected] = useState<string>(best.code)

  const leaderboard = useMemo(
    () => [...AI_DEPARTMENTS].sort((a, b) => b[metric] - a[metric]),
    [metric],
  )
  const metricLabel = METRIC_OPTIONS.find((m) => m.key === metric)!.label

  const columns: Column<TableRow>[] = [
    { key: 'rank', header: 'Rank', sortable: true, render: (r) => <span className="font-semibold text-ink-700">#{r.rank}</span> },
    { key: 'name', header: 'Department', render: (r) => <span className="font-medium text-ink-800">{r.name}</span> },
    { key: 'score', header: 'Score', sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.score}%` }} /></div>
        <span className="text-xs font-semibold">{r.score}</span>
      </div>
    )},
    { key: 'sla', header: 'SLA %', sortable: true, render: (r) => <span>{r.sla}%</span> },
    { key: 'filesDisposed', header: 'Files Disposed', sortable: true, render: (r) => r.filesDisposed.toLocaleString('en-IN') },
    { key: 'avgDisposalDays', header: 'Avg Disposal', sortable: true, render: (r) => `${r.avgDisposalDays} days` },
    { key: 'grievanceResolution', header: 'Grievance %', sortable: true, render: (r) => `${r.grievanceResolution}%` },
    { key: 'dpdp', header: 'DPDP', sortable: true, render: (r) => `${r.dpdp}` },
    { key: 'aiAdoption', header: 'AI Adoption', sortable: true, render: (r) => `${r.aiAdoption}%` },
    { key: 'risk', header: 'Risk', render: (r) => <SeverityBadge level={r.risk} /> },
    { key: 'recommendation', header: 'Recommendation', className: 'min-w-[220px]', render: (r) => <span className="text-xs text-ink-600">{r.recommendation}</span> },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Department Performance Intelligence"
        subtitle="Cross-department comparison of productivity, SLA discipline, file movement, grievance redressal, DPDP compliance, AI adoption and risk across the Government of Maharashtra Mantralaya secretariat."
        icon={<Building2 className="h-5 w-5" />}
        confidence={88}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Best Performing" value={best.name} hint={`Composite score ${best.score}/100`} icon={<Trophy className="h-5 w-5" />} confidence={92} />
        <MetricCard label="Highest Risk" value={highestRisk.name} hint={`${highestRisk.risk} risk · ${highestRisk.slaBreaches} SLA breaches`} icon={<ShieldAlert className="h-5 w-5" />} confidence={88} />
        <MetricCard label="Most SLA Breaches" value={highestBreach.name} hint={`${highestBreach.slaBreaches} breaches this quarter`} icon={<TimerOff className="h-5 w-5" />} confidence={90} />
        <MetricCard label="Top AI Adoption" value={highestAI.name} hint={`${highestAI.aiAdoption}% desks AI-enabled`} icon={<Bot className="h-5 w-5" />} confidence={89} />
        <MetricCard label="Lowest DPDP Score" value={lowestDpdp.name} hint={`DPDP compliance ${lowestDpdp.dpdp}/100`} icon={<ShieldOff className="h-5 w-5" />} confidence={87} />
        <MetricCard label="Highest Grievance Load" value={highestGrievanceLoad.name} hint={`${highestGrievanceLoad.pendingFiles} pending files`} icon={<Inbox className="h-5 w-5" />} confidence={86} />
      </div>

      {/* Score formula */}
      <Card className="mt-6 border border-brand-100 bg-brand-soft/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Sigma className="h-4 w-4" /></span>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-700">Department Score Formula</div>
            <p className="mt-0.5 text-sm text-ink-700">
              Department Score = <strong>30%</strong> SLA + <strong>20%</strong> file disposal + <strong>15%</strong> grievance resolution + <strong>15%</strong> compliance + <strong>10%</strong> AI adoption + <strong>10%</strong> risk reduction
            </p>
          </div>
          <span className="ml-auto"><SourceBadge source="Demo" /></span>
        </div>
      </Card>

      {/* Leaderboard + scorecards */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Department Leaderboard"
            subtitle={`Ranked by ${metricLabel.toLowerCase()} · click a row to inspect the scorecard`}
            right={
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-ink-400" />
                <select className="input !w-auto !py-1.5 !text-xs" value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)}>
                  {METRIC_OPTIONS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select>
              </div>
            }
          />
          <ul className="space-y-1.5">
            {leaderboard.map((d, i) => {
              const rank = i + 1
              const active = selected === d.code
              return (
                <li key={d.code}>
                  <button
                    onClick={() => setSelected(d.code)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition',
                      active ? 'border-brand-300 bg-brand-soft shadow-sm' : 'border-ink-100 bg-white hover:bg-ink-50/60',
                    )}
                  >
                    <span className={cn(
                      'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                      rank === 1 && 'bg-brand-gradient text-white shadow-glow',
                      rank === 2 && 'bg-brand-100 text-brand-700 ring-1 ring-brand-200',
                      rank === 3 && 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
                      rank > 3 && 'bg-ink-50 text-ink-500 ring-1 ring-ink-100',
                    )}>
                      {rank}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-800">{d.name}</span>
                      <span className="mt-1 block h-1.5 w-full rounded bg-ink-100">
                        <span className="block h-full rounded bg-brand-gradient" style={{ width: `${d[metric]}%` }} />
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink-900">{d[metric]}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader title="Performance Scorecards" subtitle="Composite score, SLA and risk posture per department" right={<SourceBadge source="Demo" />} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {byScore.map((d) => {
              const active = selected === d.code
              return (
                <button
                  key={d.code}
                  onClick={() => setSelected(d.code)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition',
                    active ? 'border-brand-300 bg-brand-soft shadow-md ring-1 ring-brand-200' : 'border-ink-100 bg-white hover:shadow-sm',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink-800">{d.name}</div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-ink-400">{d.code}</div>
                    </div>
                    <SeverityBadge level={d.risk} />
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold text-ink-900">{d.score}</span>
                    <span className="text-xs text-ink-500">/100</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${d.score}%` }} />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] text-ink-500">
                    <div><div className="text-xs font-semibold text-ink-800">{d.sla}%</div>SLA</div>
                    <div><div className="text-xs font-semibold text-ink-800">{d.avgDisposalDays}d</div>Disposal</div>
                    <div><div className="text-xs font-semibold text-ink-800">{d.pendingFiles}</div>Pending</div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Department × Metric Heatmap"
          subtitle="Darker blue = stronger performance · disposal pace indexed from average disposal days"
          right={<SourceBadge source="Demo" />}
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th className="table-th !border-0">Department</th>
                {HEAT_METRICS.map((m) => <th key={m.label} className="table-th !border-0 text-center">{m.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {byScore.map((d) => (
                <tr key={d.code}>
                  <td className="whitespace-nowrap rounded-l-md bg-ink-50/60 px-3 py-1.5 text-xs font-medium text-ink-700">{d.name}</td>
                  {HEAT_METRICS.map((m) => {
                    const v = m.get(d)
                    return (
                      <td key={m.label} className="rounded-md px-2 py-1.5 text-center text-xs font-semibold" style={heatStyle(v)} title={`${d.name} · ${m.label}: ${v}`}>
                        {v}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
          <span>Lower</span>
          <span className="h-2 w-28 rounded bg-gradient-to-r from-brand-50 to-brand-700" />
          <span>Higher</span>
        </div>
      </Card>

      {/* Trend + Scatter */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Composite Score Trend" subtitle="Top performer vs the two departments under watch · last 6 months" height={280}>
          <ResponsiveContainer>
            <LineChart data={TREND} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[68, 92]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Health" stroke="#0B57D0" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Revenue" stroke="#EA4335" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Urban Development" stroke="#FBBC05" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk vs Productivity" subtitle="Composite score (x) against SLA breaches (y) · one point per department" height={280}>
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 8, right: 16, left: -8, bottom: 4 }}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis type="number" dataKey="score" name="Score" domain={[72, 92]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'Composite score', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }} />
              <YAxis type="number" dataKey="slaBreaches" name="SLA breaches" domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'SLA breaches', angle: -90, position: 'insideLeft', offset: 18, fontSize: 11, fill: '#94a3b8' }} />
              <ReTooltip
                cursor={{ strokeDasharray: '4 4', stroke: '#cbd5e1' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0].payload as DeptMetrics
                  return (
                    <div className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs shadow-lg">
                      <div className="font-semibold text-ink-800">{p.name}</div>
                      <div className="mt-0.5 text-ink-500">Score {p.score} · {p.slaBreaches} SLA breaches · {p.risk} risk</div>
                    </div>
                  )
                }}
              />
              <Scatter data={AI_DEPARTMENTS} fill="#0B57D0">
                {AI_DEPARTMENTS.map((d) => (
                  <Cell key={d.code} fill={d.risk === 'High' ? '#EA4335' : d.risk === 'Medium' ? '#FBBC05' : '#34A853'} stroke="#ffffff" strokeWidth={1.5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Benchmark */}
      <div className="mt-6">
        <ChartCard title="Benchmark Comparison" subtitle="State average vs top-performing department per metric" height={280}>
          <ResponsiveContainer>
            <BarChart data={BENCHMARK} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar name="State average" dataKey="average" fill="#4285F4" fillOpacity={0.45} radius={[4, 4, 0, 0]} />
              <Bar name="Top performer" dataKey="top" fill="#0B57D0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Full table */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={TABLE_ROWS}
          searchKeys={['name', 'code', 'risk']}
          actions={<SourceBadge source="Demo" />}
        />
      </div>

      {/* Recommendations + alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel
          recommendations={[
            { text: 'Deploy a disposal war-room for Revenue — 9 SLA breaches and 612 pending files are the state\'s largest backlog.', confidence: 91, action: 'Create plan' },
            { text: 'Pair Urban Development with Health for an SLA mentorship exchange; UDD trails the top performer by 13 SLA points.', confidence: 87, action: 'Schedule' },
            { text: 'Run a DPDP remediation sprint in Education (score 83) before the next compliance audit cycle.', confidence: 88, action: 'Assign' },
            { text: 'Extend Health\'s AI drafting workflow (83% adoption) to Water Resources and Social Justice, both below 70%.', confidence: 85, action: 'Roll out' },
            { text: 'Publish a quarterly inter-department benchmark brief to the Chief Secretary\'s office to sustain competitive improvement.', confidence: 82, action: 'Draft brief' },
          ]}
        />
        <RiskAlertPanel
          alerts={[
            { title: 'Revenue SLA breaches trending above threshold for a second consecutive quarter', severity: 'High', owner: 'Revenue Dept', due: 'This week' },
            { title: 'Urban Development average disposal time crossed 10 days — file movement audit advised', severity: 'High', owner: 'UDD', due: '10 Jul' },
            { title: 'Education DPDP score (83) is the lowest statewide ahead of the annual compliance review', severity: 'Medium', owner: 'Education Dept', due: '21 Jul' },
          ]}
        />
      </div>
    </div>
  )
}
