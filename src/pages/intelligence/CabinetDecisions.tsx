import { useMemo, useState } from 'react'
import {
  Landmark, CheckCircle2, ScrollText, IndianRupee, Map, Clock, Flag, Activity,
  ChevronRight, Route,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Cell, ReferenceLine,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, SeverityBadge,
  DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge } from '@/components/ui/Badges'
import { RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Types + page-local demo data                                        */
/* ------------------------------------------------------------------ */

type GrStatus = 'Issued' | 'Draft' | 'Pending'
type BudgetStatus = 'Provisioned' | 'Supplementary Demanded' | 'Pending' | 'Not Required'
type StageKey = 'decision' | 'gr-drafting' | 'gr-issued' | 'budget' | 'rollout' | 'outcome'

interface CabinetDecisionRow {
  id: string
  decision: string
  date: string
  deptCode: string
  dept: string
  owner: string
  grStatus: GrStatus
  grRef?: string
  budgetStatus: BudgetStatus
  rollout: number // districts covered of 36
  outcomeKpi: string
  outcomeTracked: boolean
  risk: RiskLevel
  nextAction: string
}

const DECISIONS: CabinetDecisionRow[] = [
  {
    id: 'D-2026-04', decision: 'Maha Krishi Samruddhi Yojana expansion', date: '12 Feb 2026',
    deptCode: 'AGR', dept: 'Agriculture', owner: 'Principal Secretary (Agriculture)',
    grStatus: 'Issued', grRef: 'GR-2026-AGR-041', budgetStatus: 'Provisioned', rollout: 28,
    outcomeKpi: 'Farmer enrolment +18%', outcomeTracked: true, risk: 'Low',
    nextAction: 'Saturation drive in 8 Vidarbha districts',
  },
  {
    id: 'D-2026-09', decision: 'Coastal road phase-II land transfer', date: '3 Mar 2026',
    deptCode: 'UDD', dept: 'Urban Development', owner: 'Metropolitan Commissioner, MMRDA',
    grStatus: 'Issued', grRef: 'GR-2026-URD-096', budgetStatus: 'Supplementary Demanded', rollout: 2,
    outcomeKpi: 'Land parcels transferred 61%', outcomeTracked: true, risk: 'High',
    nextAction: 'Supplementary demand in monsoon session',
  },
  {
    id: 'D-2026-11', decision: 'Shakti Sadan women’s shelter upgrades', date: '10 Mar 2026',
    deptCode: 'WCD', dept: 'Women & Child Development', owner: 'Commissioner (WCD)',
    grStatus: 'Draft', budgetStatus: 'Pending', rollout: 0,
    outcomeKpi: 'Shelter capacity +2,400 beds', outcomeTracked: false, risk: 'Medium',
    nextAction: 'GR vetting with Law & Judiciary',
  },
  {
    id: 'D-2026-15', decision: 'Jalyukt Shivar 2.0 watershed revival', date: '24 Mar 2026',
    deptCode: 'WR', dept: 'Water Resources', owner: 'Secretary (Water Conservation)',
    grStatus: 'Issued', grRef: 'GR-2026-WCD-115', budgetStatus: 'Provisioned', rollout: 31,
    outcomeKpi: 'Water structures 4,120 completed', outcomeTracked: true, risk: 'Low',
    nextAction: 'Quarterly outcome review with Collectors',
  },
  {
    id: 'D-2026-18', decision: 'District hospital oxygen self-sufficiency', date: '7 Apr 2026',
    deptCode: 'HFW', dept: 'Health', owner: 'Director, Health Services',
    grStatus: 'Issued', grRef: 'GR-2026-PHD-124', budgetStatus: 'Provisioned', rollout: 36,
    outcomeKpi: 'PSA plants operational 100%', outcomeTracked: true, risk: 'Low',
    nextAction: 'Close-out report to Cabinet Secretariat',
  },
  {
    id: 'D-2026-22', decision: 'e-Bus fleet for municipal corporations', date: '21 Apr 2026',
    deptCode: 'TRN', dept: 'Transport', owner: 'Transport Commissioner',
    grStatus: 'Pending', budgetStatus: 'Pending', rollout: 0,
    outcomeKpi: '500 e-buses inducted', outcomeTracked: false, risk: 'High',
    nextAction: 'Assign GR drafting desk · fix owner',
  },
  {
    id: 'D-2026-27', decision: 'Unified DBT portal for welfare schemes', date: '12 May 2026',
    deptCode: 'FIN', dept: 'Finance', owner: 'Principal Secretary (Financial Reforms)',
    grStatus: 'Issued', grRef: 'GR-2026-FIN-152', budgetStatus: 'Provisioned', rollout: 14,
    outcomeKpi: 'Schemes onboarded 46/83', outcomeTracked: true, risk: 'Medium',
    nextAction: 'Phase-2 district onboarding sprint',
  },
  {
    id: 'D-2026-31', decision: 'Slum rehabilitation fast-track approvals', date: '2 Jun 2026',
    deptCode: 'UDD', dept: 'Urban Development', owner: 'CEO, Slum Rehabilitation Authority',
    grStatus: 'Draft', budgetStatus: 'Supplementary Demanded', rollout: 0,
    outcomeKpi: 'Approval TAT ≤ 60 days', outcomeTracked: false, risk: 'High',
    nextAction: 'Link to GR-2026-URD-118 · issue GR',
  },
]

/** Implementation pipeline — decision-to-outcome stage flow with live counts. */
const PIPELINE: { key: StageKey; label: string; count: number; note: string }[] = [
  { key: 'decision', label: 'Cabinet Decision', count: 96, note: 'Decisions tracked FY 2025-26' },
  { key: 'gr-drafting', label: 'GR Drafting', count: 14, note: 'GR pending issuance' },
  { key: 'gr-issued', label: 'GR Issued', count: 82, note: 'Government Resolutions notified' },
  { key: 'budget', label: 'Budget Release', count: 9, note: 'Awaiting budget approval' },
  { key: 'rollout', label: 'District Rollout', count: 12, note: 'Rollout in progress' },
  { key: 'outcome', label: 'Outcome Tracking', count: 61, note: 'Implemented · KPIs monitored' },
]

/** Stage filters are semantic — each card selects register rows at that stage. */
const STAGE_PREDICATE: Record<StageKey, (d: CabinetDecisionRow) => boolean> = {
  decision: () => true,
  'gr-drafting': (d) => d.grStatus !== 'Issued',
  'gr-issued': (d) => d.grStatus === 'Issued',
  budget: (d) => d.budgetStatus === 'Pending' || d.budgetStatus === 'Supplementary Demanded',
  rollout: (d) => d.grStatus === 'Issued' && d.rollout > 0 && d.rollout < 36,
  outcome: (d) => d.outcomeTracked,
}

/** Department-wise pending actions (GR + budget + rollout) — 35 total. */
const PENDING_BY_DEPT = [
  { code: 'UDD', name: 'Urban Development', pending: 7 },
  { code: 'REV', name: 'Revenue', pending: 6 },
  { code: 'WR', name: 'Water Resources', pending: 5 },
  { code: 'AGR', name: 'Agriculture', pending: 4 },
  { code: 'HFW', name: 'Health', pending: 3 },
  { code: 'EDU', name: 'Education', pending: 3 },
  { code: 'TRN', name: 'Transport', pending: 3 },
  { code: 'FIN', name: 'Finance', pending: 2 },
  { code: 'SJ', name: 'Social Justice', pending: 2 },
]

/** Decision-to-GR issuance time — target 15 days. */
const GR_TIMELINE = [
  { id: 'D-2026-18', label: 'Hospital oxygen self-sufficiency', days: 9 },
  { id: 'D-2026-04', label: 'Krishi Samruddhi expansion', days: 11 },
  { id: 'D-2026-15', label: 'Jalyukt Shivar 2.0', days: 13 },
  { id: 'D-2026-27', label: 'Unified DBT portal', days: 14 },
  { id: 'D-2026-22', label: 'e-Bus fleet (projected)', days: 21 },
  { id: 'D-2026-09', label: 'Coastal road phase-II', days: 24 },
]

/** Budget linkage across all 96 tracked decisions. */
const BUDGET_LINKAGE: { status: BudgetStatus; count: number }[] = [
  { status: 'Provisioned', count: 52 },
  { status: 'Supplementary Demanded', count: 18 },
  { status: 'Pending', count: 9 },
  { status: 'Not Required', count: 17 },
]

type RolloutStatus = 'Completed' | 'In Progress' | 'Pending'

/** District rollout matrix — 8 districts × 4 flagship decisions. */
const DISTRICT_ROLLOUT: { district: string; krishi: RolloutStatus; jalyukt: RolloutStatus; dbt: RolloutStatus; oxygen: RolloutStatus }[] = [
  { district: 'Mumbai', krishi: 'Pending', jalyukt: 'Pending', dbt: 'Completed', oxygen: 'Completed' },
  { district: 'Pune', krishi: 'Completed', jalyukt: 'Completed', dbt: 'Completed', oxygen: 'Completed' },
  { district: 'Thane', krishi: 'In Progress', jalyukt: 'In Progress', dbt: 'Completed', oxygen: 'Completed' },
  { district: 'Nagpur', krishi: 'Completed', jalyukt: 'Completed', dbt: 'In Progress', oxygen: 'Completed' },
  { district: 'Nashik', krishi: 'Completed', jalyukt: 'In Progress', dbt: 'In Progress', oxygen: 'Completed' },
  { district: 'Chhatrapati Sambhajinagar', krishi: 'Completed', jalyukt: 'Completed', dbt: 'Pending', oxygen: 'Completed' },
  { district: 'Solapur', krishi: 'In Progress', jalyukt: 'Completed', dbt: 'Pending', oxygen: 'Completed' },
  { district: 'Amravati', krishi: 'Completed', jalyukt: 'In Progress', dbt: 'Pending', oxygen: 'Completed' },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Generate cabinet follow-up note for 8 delayed decisions.', confidence: 90, action: 'Draft note' },
  { text: 'Detect delayed implementation in 2 departments — Urban Development and Transport trail the GR issuance target.', confidence: 88, action: 'View analysis' },
  { text: 'Link decision D-2026-31 to GR-2026-URD-118.', confidence: 93, action: 'Link GR' },
  { text: 'Suggest responsible department for unassigned decision — e-Bus fleet induction maps to Transport with STU coordination.', confidence: 85, action: 'Assign owner' },
  { text: 'Budget dependency identified for 9 decisions — supplementary demands due before the monsoon session.', confidence: 87, action: 'Notify Finance' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'Coastal road phase-II land transfer stalled — supplementary demand not yet moved to Finance.', severity: 'High', owner: 'Principal Secretary, UDD', due: 'This week' },
  { title: '8 delayed decisions cross the 90-day implementation threshold — CS review recommended.', severity: 'High', owner: 'Cabinet Secretariat Cell', due: '5 days' },
  { title: 'Outcome tracking disabled for 25 decisions — KPI baselines missing for FY 2025-26 additions.', severity: 'Medium', owner: 'Planning AI Officer', due: '15 days' },
]

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

const GR_CHIP: Record<GrStatus, string> = {
  Issued: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Draft: 'border-ink-200 bg-ink-100 text-ink-600',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
}

const BUDGET_CHIP: Record<BudgetStatus, string> = {
  Provisioned: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Supplementary Demanded': 'border-sky-200 bg-sky-50 text-sky-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  'Not Required': 'border-ink-200 bg-ink-100 text-ink-600',
}

const ROLLOUT_CHIP: Record<RolloutStatus, string> = {
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'In Progress': 'border-sky-200 bg-sky-50 text-sky-700',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
}

function RolloutChip({ status }: { status: RolloutStatus }) {
  return <span className={cn('whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold', ROLLOUT_CHIP[status])}>{status}</span>
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CabinetDecisions() {
  const [stageFilter, setStageFilter] = useState<StageKey | null>(null)
  const [deptFilter, setDeptFilter] = useState('all')

  const tableRows = useMemo(() => {
    let rows = DECISIONS
    if (stageFilter) rows = rows.filter(STAGE_PREDICATE[stageFilter])
    if (deptFilter !== 'all') rows = rows.filter((d) => d.deptCode === deptFilter)
    return rows
  }, [stageFilter, deptFilter])

  const columns: Column<CabinetDecisionRow>[] = [
    {
      key: 'decision', header: 'Cabinet Decision', sortable: true, render: (r) => (
        <div className="min-w-[220px]">
          <div className="font-medium text-ink-800">{r.decision}</div>
          <div className="text-[11px] text-ink-500">{r.id}</div>
        </div>
      ),
    },
    { key: 'date', header: 'Date' },
    { key: 'dept', header: 'Department', sortable: true },
    { key: 'owner', header: 'Implementation Owner', render: (r) => <span className="text-xs text-ink-700">{r.owner}</span> },
    {
      key: 'grStatus', header: 'GR Status', sortable: true, render: (r) => (
        <div>
          <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', GR_CHIP[r.grStatus])}>{r.grStatus}</span>
          {r.grRef && <div className="mt-0.5 font-mono text-[10px] text-ink-500">{r.grRef}</div>}
        </div>
      ),
    },
    {
      key: 'budgetStatus', header: 'Budget Status', render: (r) => (
        <span className={cn('whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold', BUDGET_CHIP[r.budgetStatus])}>{r.budgetStatus}</span>
      ),
    },
    {
      key: 'rollout', header: 'District Rollout', sortable: true, render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${(r.rollout / 36) * 100}%` }} /></div>
          <span className="whitespace-nowrap text-xs font-medium">{r.rollout}/36</span>
        </div>
      ),
    },
    { key: 'outcomeKpi', header: 'Outcome KPI', render: (r) => <span className="text-xs text-ink-700">{r.outcomeKpi}</span> },
    { key: 'risk', header: 'Risk', render: (r) => <SeverityBadge level={r.risk} /> },
    { key: 'nextAction', header: 'Next Action', render: (r) => <span className="text-xs text-ink-600">{r.nextAction}</span> },
  ]

  const activeStage = stageFilter ? PIPELINE.find((s) => s.key === stageFilter) : null

  return (
    <div>
      <IntelligencePageHeader
        title="Cabinet Decision Intelligence"
        subtitle="Track Cabinet decisions, implementation status, department ownership, GR issuance, budget linkage, district rollout and outcome monitoring."
        icon={<Landmark className="h-5 w-5" />}
        confidence={88}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Cabinet Decisions Tracked" value={96} delta={9.1} icon={<Landmark className="h-5 w-5" />} confidence={92} hint="FY 2025-26" />
        <MetricCard label="Implemented" value={61} delta={12.9} icon={<CheckCircle2 className="h-5 w-5" />} confidence={91} hint="GR issued · budget released · rollout done" />
        <MetricCard label="GR Pending" value={14} delta={-6.7} icon={<ScrollText className="h-5 w-5" />} confidence={90} hint="In drafting or vetting" />
        <MetricCard label="Budget Approval Pending" value={9} delta={-10} icon={<IndianRupee className="h-5 w-5" />} confidence={89} hint="Incl. supplementary demands" />
        <MetricCard label="District Rollout Pending" value={12} delta={-7.7} icon={<Map className="h-5 w-5" />} confidence={88} hint="Partially rolled out" />
        <MetricCard label="Delayed Decisions" value={8} delta={14.3} icon={<Clock className="h-5 w-5" />} confidence={90} hint="> 90 days without milestone" />
        <MetricCard label="High Impact Decisions" value={22} icon={<Flag className="h-5 w-5" />} confidence={87} hint="Flagship / CM priority" />
        <MetricCard label="Outcome Tracking Enabled" value="74%" delta={5.7} icon={<Activity className="h-5 w-5" />} confidence={88} hint="71 of 96 decisions with live KPIs" />
      </div>

      {/* Implementation pipeline */}
      <Card className="mt-6">
        <CardHeader
          title="Implementation pipeline"
          subtitle="Decision-to-outcome stage flow · select a stage to filter the decision register below"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source="Demo" />
              {activeStage && (
                <button
                  className="rounded-full border border-brand-200 bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-700 transition hover:bg-brand-100"
                  onClick={() => setStageFilter(null)}
                >
                  Clear: {activeStage.label} ×
                </button>
              )}
            </div>
          }
        />
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[960px] items-stretch gap-2">
            {PIPELINE.map((s, i) => (
              <div key={s.key} className="flex flex-1 items-stretch gap-2">
                <button
                  onClick={() => setStageFilter(stageFilter === s.key ? null : s.key)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition',
                    stageFilter === s.key
                      ? 'border-brand-300 bg-brand-soft ring-1 ring-brand-200'
                      : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-brand-50/40',
                  )}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">Stage {i + 1}</div>
                  <div className="mt-0.5 text-sm font-semibold text-ink-800">{s.label}</div>
                  <div className="mt-1 text-2xl font-semibold leading-none text-brand-700">{s.count}</div>
                  <div className="mt-1 text-[11px] text-ink-500">{s.note}</div>
                </button>
                {i < PIPELINE.length - 1 && <ChevronRight className="h-4 w-4 shrink-0 self-center text-ink-300" />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Pending actions + GR timeline */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Department-wise pending actions"
          subtitle="Open GR, budget and rollout actions per department · 35 total"
          height={280}
        >
          <ResponsiveContainer>
            <BarChart data={PENDING_BY_DEPT} margin={{ top: 8, right: 8, left: -26, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="code" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v} pending actions`, 'Pending']}
                labelFormatter={(code) => PENDING_BY_DEPT.find((d) => d.code === code)?.name ?? String(code)}
              />
              <Bar dataKey="pending" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {PENDING_BY_DEPT.map((d) => (
                  <Cell
                    key={d.code}
                    fill="#0B57D0"
                    fillOpacity={deptFilter === 'all' || deptFilter === d.code ? 1 : 0.25}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Decision-to-GR timeline"
          subtitle="Days from Cabinet decision to GR issuance · target 15 days · red = above target"
          height={280}
        >
          <ResponsiveContainer>
            <BarChart data={GR_TIMELINE} layout="vertical" margin={{ top: 16, right: 24, left: 44, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit="d" domain={[0, 28]} />
              <YAxis type="category" dataKey="label" width={150} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v} days`, 'Decision → GR']}
              />
              <ReferenceLine x={15} stroke="#B3261E" strokeDasharray="4 4" label={{ value: 'Target 15 d', position: 'top', fill: '#B3261E', fontSize: 10 }} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {GR_TIMELINE.map((d) => (
                  <Cell key={d.id} fill={d.days > 15 ? '#B3261E' : '#0B57D0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Budget linkage + district rollout */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Budget linkage"
          subtitle="All 96 tracked decisions by budget status"
          height={300}
        >
          <ResponsiveContainer>
            <BarChart data={BUDGET_LINKAGE} margin={{ top: 8, right: 8, left: -22, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v} decisions`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {BUDGET_LINKAGE.map((b) => (
                  <Cell key={b.status} fill={b.status === 'Pending' ? '#F59E0B' : b.status === 'Not Required' ? '#94A3B8' : '#0B57D0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="District rollout status"
            subtitle="Flagship Cabinet decisions across key districts"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>{['District', 'Krishi Samruddhi', 'Jalyukt Shivar 2.0', 'Unified DBT', 'Oxygen Plants'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {DISTRICT_ROLLOUT.map((d) => (
                  <tr key={d.district} className="hover:bg-ink-50/40">
                    <td className="table-td font-medium text-ink-800">{d.district}</td>
                    <td className="table-td"><RolloutChip status={d.krishi} /></td>
                    <td className="table-td"><RolloutChip status={d.jalyukt} /></td>
                    <td className="table-td"><RolloutChip status={d.dbt} /></td>
                    <td className="table-td"><RolloutChip status={d.oxygen} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Decision register */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={tableRows}
          searchKeys={['decision', 'dept', 'owner', 'id']}
          actions={
            <>
              <SourceBadge source="Demo" />
              <DepartmentFilter value={deptFilter} onChange={setDeptFilter} />
              {activeStage && (
                <span className="rounded-full border border-brand-200 bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                  Stage: {activeStage.label}
                </span>
              )}
            </>
          }
          emptyText="No Cabinet decisions match the current stage / department filter"
        />
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} title="AI Recommendations — Cabinet follow-up" />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>

      {/* Method note */}
      <div className="mt-6 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-500">
        <Route className="h-3.5 w-3.5 text-brand-500" />
        Pipeline stage cards act as semantic filters on the decision register. GR references follow the Maharashtra GR numbering convention. Follow-up notes require human approval before dispatch.
      </div>
    </div>
  )
}
