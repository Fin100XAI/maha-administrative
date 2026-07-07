import { useMemo, useState } from 'react'
import {
  Timer, Gauge, AlertTriangle, Hourglass, Zap, Turtle, ArrowUpRight, Users,
  Building2, ArrowDown, ArrowUp, Minus, BrainCircuit, Route,
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend, BarChart, Bar, Cell,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, TierBadge,
  DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS, SLA_WORKFLOWS, SlaWorkflow } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data (shared dimensions come from the data module)  */
/* ------------------------------------------------------------------ */

/** SLA breach trend — last 12 weeks, total vs citizen-facing. */
const BREACH_TREND = [
  { week: 'W-11', total: 5, citizen: 3 }, { week: 'W-10', total: 6, citizen: 4 },
  { week: 'W-9', total: 5, citizen: 3 }, { week: 'W-8', total: 7, citizen: 4 },
  { week: 'W-7', total: 6, citizen: 4 }, { week: 'W-6', total: 8, citizen: 5 },
  { week: 'W-5', total: 7, citizen: 5 }, { week: 'W-4', total: 9, citizen: 6 },
  { week: 'W-3', total: 8, citizen: 5 }, { week: 'W-2', total: 10, citizen: 7 },
  { week: 'W-1', total: 9, citizen: 6 }, { week: 'This wk', total: 11, citizen: 8 },
]

/** Workflow funnel — live case position across all monitored workflows. */
const FUNNEL_STAGES = [
  { stage: 'Received', total: 5240, citizen: 3410, note: 'All inward files, applications and references this month' },
  { stage: 'In Process', total: 3186, citizen: 2050, note: 'Under examination at desk / section level' },
  { stage: 'Nearing SLA', total: 412, citizen: 268, note: 'Within 20% of SLA deadline — watchlist' },
  { stage: 'Breached', total: 37, citizen: 24, note: 'Past SLA deadline this month' },
  { stage: 'Escalated', total: 58, citizen: 36, note: 'Escalated to senior officers (incl. pre-breach escalations)' },
]

/** Escalation ageing buckets — 58 open escalations. */
const ESCALATION_AGEING = [
  { bucket: '0–2 days', count: 18, citizen: 12, topWorkflow: 'Citizen grievance', owner: 'Desk Officer', action: 'Reminder issued' },
  { bucket: '3–5 days', count: 15, citizen: 10, topWorkflow: 'RTI response', owner: 'Section Officer', action: 'Daily follow-up' },
  { bucket: '6–10 days', count: 12, citizen: 7, topWorkflow: 'Welfare benefit processing', owner: 'Department Director', action: 'Review meeting fixed' },
  { bucket: '11–15 days', count: 8, citizen: 5, topWorkflow: 'HR transfer', owner: 'Commissioner', action: 'Escalated to Secretary' },
  { bucket: '> 15 days', count: 5, citizen: 2, topWorkflow: 'Audit compliance response', owner: 'Principal Secretary', action: 'CS review flagged' },
]

/** 48-hour breach predictions — the AI centerpiece. */
const BREACH_PREDICTIONS = [
  {
    workflow: 'RTI response', probability: 91, dept: 'Revenue', cases: 6, hoursLeft: 22,
    action: 'Escalate', reason: 'PIO desk backlog — 6 replies pending inside the first-appeal window.',
  },
  {
    workflow: 'Audit compliance response', probability: 87, dept: 'Urban Development', cases: 4, hoursLeft: 31,
    action: 'Add reviewer', reason: 'AG para replies held at a single vetting officer for 5 days.',
  },
  {
    workflow: 'Welfare benefit processing', probability: 78, dept: 'Women & Child Development', cases: 5, hoursLeft: 38,
    action: 'Reallocate', reason: 'Verification queue exceeds sanctioned desk capacity by 40%.',
  },
  {
    workflow: 'Procurement approval', probability: 72, dept: 'Water Resources', cases: 2, hoursLeft: 44,
    action: 'Escalate', reason: 'Tender scrutiny awaiting financial concurrence for 9 days.',
  },
]

const PREDICTION_ACTION_CLASS: Record<string, string> = {
  Escalate: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  Reallocate: 'border-brand-200 bg-brand-soft text-brand-700 hover:bg-brand-100',
  'Add reviewer': 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
}

const RECOMMENDATIONS: Recommendation[] = [
  { text: '4 workflows predicted to breach SLA within 48 hours — RTI response in Revenue carries the highest probability.', confidence: 91, action: 'Review predictions' },
  { text: 'Recommend escalating 6 pending RTI replies in Revenue to the First Appellate Officer before the statutory window closes.', confidence: 88, action: 'Escalate' },
  { text: 'Dependency bottleneck detected: the financial concurrence desk is the common blocker across procurement and audit workflows.', confidence: 86, action: 'View dependency map' },
  { text: 'Suggest reallocating 2 Section Officers from Circular approval (91% compliance) to Welfare benefit processing for 2 weeks.', confidence: 84, action: 'Simulate reallocation' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'RTI response TAT worsening 3 weeks in a row — statutory 30-day limit at risk in Revenue.', severity: 'High', owner: 'Principal Secretary, Revenue', due: '48 hrs' },
  { title: '24 citizen-facing breaches this month — Aaple Sarkar service-guarantee escalations likely.', severity: 'High', owner: 'Citizen Service Cell', due: 'This week' },
  { title: 'Audit compliance response at 80% compliance — AG follow-up para exposure rising.', severity: 'Medium', owner: 'Audit AI Officer', due: '10 days' },
]

/* ------------------------------------------------------------------ */
/* Derivations                                                         */
/* ------------------------------------------------------------------ */

type WorkflowStatus = 'On Track' | 'At Risk' | 'Breaching'

function workflowStatus(w: SlaWorkflow): WorkflowStatus {
  if (w.tatDays <= 0.8 * w.slaDays) return 'On Track'
  if (w.tatDays <= w.slaDays) return 'At Risk'
  return 'Breaching'
}

const STATUS_CLASS: Record<WorkflowStatus, string> = {
  'On Track': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk': 'border-amber-200 bg-amber-50 text-amber-700',
  Breaching: 'border-red-200 bg-red-50 text-red-700',
}

/** Deterministic workflow × department breach intensity for the heatmap. */
function heatValue(w: SlaWorkflow, deptIndex: number, wfIndex: number) {
  const dept = AI_DEPARTMENTS[deptIndex]
  return Math.round((w.breaches * dept.slaBreaches + ((wfIndex + deptIndex) % 4)) / 9)
}

function TrendCell({ trend }: { trend: SlaWorkflow['trend'] }) {
  if (trend === 'improving') {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><ArrowDown className="h-3.5 w-3.5" /> Improving</span>
  }
  if (trend === 'worsening') {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><ArrowUp className="h-3.5 w-3.5" /> Worsening</span>
  }
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500"><Minus className="h-3.5 w-3.5" /> Stable</span>
}

function CitizenToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
        value ? 'border-sky-300 bg-sky-50 text-sky-700' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', value ? 'bg-sky-500' : 'bg-ink-300')} />
      Citizen-facing only
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function WorkflowSLA() {
  const [citizenOnly, setCitizenOnly] = useState(false)
  const [deptFilter, setDeptFilter] = useState('all')

  // Fastest / slowest derived from SLA_WORKFLOWS turnaround.
  const fastest = useMemo(() => SLA_WORKFLOWS.reduce((a, b) => (b.tatDays < a.tatDays ? b : a)), [])
  const slowest = useMemo(() => SLA_WORKFLOWS.reduce((a, b) => (b.tatDays > a.tatDays ? b : a)), [])

  const tableRows = useMemo(
    () => (citizenOnly ? SLA_WORKFLOWS.filter((w) => w.citizenFacing) : SLA_WORKFLOWS),
    [citizenOnly],
  )

  const funnel = useMemo(
    () => FUNNEL_STAGES.map((s) => ({ ...s, value: citizenOnly ? s.citizen : s.total })),
    [citizenOnly],
  )
  const funnelMax = funnel[0].value

  const tatByDept = useMemo(
    () => AI_DEPARTMENTS.map((d) => ({ code: d.code, name: d.name, tat: d.avgDisposalDays })),
    [],
  )

  const columns: Column<SlaWorkflow>[] = [
    { key: 'name', header: 'Workflow', sortable: true, render: (r) => <span className="font-medium text-ink-800">{r.name}</span> },
    { key: 'slaDays', header: 'SLA (days)', sortable: true },
    { key: 'tatDays', header: 'Avg TAT', sortable: true, render: (r) => <span>{r.tatDays.toFixed(1)} d</span> },
    {
      key: 'compliance', header: 'Compliance %', sortable: true, render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.compliance}%` }} /></div>
          <span className="text-xs font-medium">{r.compliance}%</span>
        </div>
      ),
    },
    { key: 'breaches', header: 'Breaches (Qtr)', sortable: true },
    {
      key: 'citizenFacing', header: 'Citizen-facing', render: (r) => (
        <span className={cn(
          'chip border',
          r.citizenFacing ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-ink-200 bg-ink-100 text-ink-600',
        )}>
          {r.citizenFacing ? <Users className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
          {r.citizenFacing ? 'Citizen-facing' : 'Internal'}
        </span>
      ),
    },
    { key: 'trend', header: 'Trend', render: (r) => <TrendCell trend={r.trend} /> },
    {
      key: 'status', header: 'Status', render: (r) => {
        const s = workflowStatus(r)
        return <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', STATUS_CLASS[s])}>{s}</span>
      },
    },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Workflow & SLA Intelligence"
        subtitle="SLA compliance across administrative workflows, citizen services, approvals, file movement and inter-department processes."
        icon={<Timer className="h-5 w-5" />}
        confidence={87}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="SLA Compliance Rate" value="86.4%" delta={2.1} icon={<Gauge className="h-5 w-5" />} confidence={90} hint="All monitored workflows" />
        <MetricCard label="SLA Breaches" value={37} delta={-8.3} icon={<AlertTriangle className="h-5 w-5" />} confidence={92} hint="Last 30 days" />
        <MetricCard label="Average TAT" value="14.2 days" delta={-4.6} icon={<Hourglass className="h-5 w-5" />} confidence={89} hint="Weighted across workflows" />
        <MetricCard label="Fastest Workflow" value={fastest.name} icon={<Zap className="h-5 w-5" />} confidence={88} hint={`${fastest.tatDays.toFixed(1)} d TAT vs ${fastest.slaDays} d SLA`} />
        <MetricCard label="Slowest Workflow" value={slowest.name} icon={<Turtle className="h-5 w-5" />} confidence={88} hint={`${slowest.tatDays.toFixed(1)} d TAT vs ${slowest.slaDays} d SLA`} />
        <MetricCard label="Escalations" value={58} delta={6.2} icon={<ArrowUpRight className="h-5 w-5" />} confidence={91} hint="Open, incl. pre-breach" />
        <MetricCard label="Citizen-facing SLA Breaches" value={24} delta={-5.1} icon={<Users className="h-5 w-5" />} confidence={90} hint="RTI, grievance, welfare (30 days)" />
        <MetricCard label="Internal Workflow Breaches" value={13} delta={-3.4} icon={<Building2 className="h-5 w-5" />} confidence={90} hint="GR, procurement, HR, audit (30 days)" />
      </div>

      {/* 48-hour breach prediction — AI centerpiece */}
      <Card className="mt-6 border-brand-100 bg-gradient-to-br from-brand-50/60 via-white to-white">
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><BrainCircuit className="h-3.5 w-3.5" /></span>
              48-Hour Breach Prediction
            </span>
          }
          subtitle="AI-forecast workflows expected to cross SLA within 48 hours · human approval required before action"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {BREACH_PREDICTIONS.map((p) => (
            <div key={p.workflow} className="flex flex-col rounded-xl border border-ink-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold text-ink-800">{p.workflow}</div>
                <TierBadge score={p.probability} />
              </div>
              <div className="mt-1 text-xs text-ink-500">{p.dept} · {p.cases} cases · ~{p.hoursLeft} hrs to breach</div>
              <div className="mt-2 h-1.5 w-full rounded bg-ink-100">
                <div className="h-full rounded bg-brand-gradient" style={{ width: `${p.probability}%` }} />
              </div>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-600">{p.reason}</p>
              <button className={cn('mt-3 self-start rounded-md border px-2.5 py-1 text-[11px] font-semibold transition', PREDICTION_ACTION_CLASS[p.action])}>
                {p.action}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Trend + funnel */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="SLA breach trend"
          subtitle="Breaches per week · last 12 weeks"
          height={280}
        >
          <ResponsiveContainer>
            <LineChart data={BREACH_TREND} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="total" name="All workflows" stroke="#0B57D0" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="citizen" name="Citizen-facing" stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Workflow funnel"
            subtitle={citizenOnly ? 'Citizen-facing workflows only · current month' : 'All workflows · current month'}
            right={
              <div className="flex flex-wrap items-center gap-2">
                <SourceBadge source="Demo" />
                <CitizenToggle value={citizenOnly} onChange={setCitizenOnly} />
              </div>
            }
          />
          <ul className="space-y-3">
            {funnel.map((s, i) => (
              <li key={s.stage}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium text-ink-800">{s.stage}</span>
                  <span className="text-xs font-semibold text-ink-700">{s.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-1 h-3 w-full rounded bg-ink-100/70">
                  <div
                    className={cn(
                      'h-full rounded',
                      i === 3 ? 'bg-red-400' : i === 4 ? 'bg-rose-500' : 'bg-brand-gradient',
                    )}
                    style={{ width: `${Math.max((s.value / funnelMax) * 100, 1.2)}%` }}
                  />
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">{s.note}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* TAT by department + escalation ageing */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="TAT comparison by department"
          subtitle="Average file disposal days · red = above 9-day state benchmark"
          height={280}
        >
          <ResponsiveContainer>
            <BarChart data={tatByDept} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="code" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit="d" />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v} days`, 'Avg TAT']}
                labelFormatter={(code) => tatByDept.find((d) => d.code === code)?.name ?? String(code)}
              />
              <Bar dataKey="tat" radius={[4, 4, 0, 0]} maxBarSize={26}>
                {tatByDept.map((d) => (
                  <Cell
                    key={d.code}
                    fill={d.tat > 9 ? '#B3261E' : '#0B57D0'}
                    fillOpacity={deptFilter === 'all' || deptFilter === d.code ? 1 : 0.25}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Escalation ageing"
            subtitle="58 open escalations by age since escalation"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr>{['Ageing bucket', 'Escalations', 'Citizen-facing', 'Top workflow', 'Escalated to', 'Current action'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {ESCALATION_AGEING.map((b) => (
                  <tr key={b.bucket} className="hover:bg-ink-50/40">
                    <td className="table-td font-medium text-ink-800">{b.bucket}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${(b.count / 18) * 100}%` }} /></div>
                        <span className="font-medium">{b.count}</span>
                      </div>
                    </td>
                    <td className="table-td text-ink-700">{b.citizen}</td>
                    <td className="table-td text-ink-700">{b.topWorkflow}</td>
                    <td className="table-td text-xs text-ink-600">{b.owner}</td>
                    <td className="table-td text-xs text-ink-600">{b.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Breach heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Breach heatmap — workflow × department"
          subtitle="Quarterly SLA breach intensity · darker = more breaches · select a department to focus"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source="Demo" />
              <DepartmentFilter value={deptFilter} onChange={setDeptFilter} />
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wide text-ink-600">Workflow</th>
                {AI_DEPARTMENTS.map((d) => (
                  <th
                    key={d.code}
                    className={cn(
                      'px-1 pb-2 text-center text-[10px] font-semibold uppercase tracking-wide',
                      deptFilter === 'all' || deptFilter === d.code ? 'text-ink-600' : 'text-ink-300',
                    )}
                    title={d.name}
                  >
                    {d.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLA_WORKFLOWS.map((w, wi) => (
                <tr key={w.name}>
                  <td className="whitespace-nowrap pr-3 text-xs font-medium text-ink-700">{w.name}</td>
                  {AI_DEPARTMENTS.map((d, di) => {
                    const v = heatValue(w, di, wi)
                    const focused = deptFilter === 'all' || deptFilter === d.code
                    return (
                      <td key={d.code} className="p-0">
                        <div
                          className={cn(
                            'grid h-7 min-w-[34px] place-items-center rounded-md text-[10px] font-semibold transition-opacity',
                            v >= 4 ? 'text-white' : 'text-ink-700',
                          )}
                          style={{
                            backgroundColor: `rgba(11, 87, 208, ${0.06 + Math.min(v, 6) * 0.15})`,
                            opacity: focused ? 1 : 0.2,
                          }}
                          title={`${w.name} · ${d.name}: ${v} breaches (Qtr)`}
                        >
                          {v}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
          <span>Fewer</span>
          {[0, 1, 2, 3, 4, 5].map((v) => (
            <span key={v} className="h-3 w-6 rounded-sm" style={{ backgroundColor: `rgba(11, 87, 208, ${0.06 + v * 0.15})` }} />
          ))}
          <span>More breaches</span>
        </div>
      </Card>

      {/* Workflows table */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={tableRows}
          searchKeys={['name']}
          actions={
            <>
              <SourceBadge source="Demo" />
              <CitizenToggle value={citizenOnly} onChange={setCitizenOnly} />
            </>
          }
          emptyText="No workflows match the current filter"
        />
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>

      {/* Method note */}
      <div className="mt-6 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-500">
        <Route className="h-3.5 w-3.5 text-brand-500" />
        Status logic: On Track — TAT ≤ 80% of SLA · At Risk — TAT within SLA · Breaching — TAT above SLA. Breach predictions require human approval before escalation.
      </div>
    </div>
  )
}
