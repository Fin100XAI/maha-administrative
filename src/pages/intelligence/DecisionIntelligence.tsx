import { useMemo, useState } from 'react'
import {
  GitBranch, Hourglass, AlertOctagon, TimerOff, Timer, Landmark, Scale,
  Sparkles, UserCheck, Layers, Link2,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, SeverityBadge,
  DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS, RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data                                                */
/* ------------------------------------------------------------------ */

type Category =
  | 'Policy' | 'Finance' | 'Procurement' | 'HR' | 'Infrastructure'
  | 'Welfare' | 'Legal' | 'Emergency' | 'Citizen Services'

const CATEGORY_RISK: { category: Category; count: number; risk: RiskLevel }[] = [
  { category: 'Policy', count: 24, risk: 'High' },
  { category: 'Finance', count: 21, risk: 'High' },
  { category: 'Procurement', count: 18, risk: 'Critical' },
  { category: 'HR', count: 14, risk: 'Medium' },
  { category: 'Infrastructure', count: 22, risk: 'High' },
  { category: 'Welfare', count: 17, risk: 'Medium' },
  { category: 'Legal', count: 12, risk: 'Critical' },
  { category: 'Emergency', count: 6, risk: 'Critical' },
  { category: 'Citizen Services', count: 14, risk: 'Medium' },
]

const FUNNEL = [
  { stage: 'Draft', count: 212 },
  { stage: 'Scrutiny', count: 164 },
  { stage: 'Concurrence', count: 118 },
  { stage: 'Approval', count: 84 },
  { stage: 'Issued', count: 61 },
]

/** Decisions pending per department (sums to 148). */
const DEPT_PENDING: { dept: string; pending: number }[] = [
  { dept: 'REV', pending: 21 }, { dept: 'HOME', pending: 14 }, { dept: 'HFW', pending: 10 },
  { dept: 'UDD', pending: 18 }, { dept: 'RDD', pending: 11 }, { dept: 'FIN', pending: 13 },
  { dept: 'EDU', pending: 12 }, { dept: 'AGR', pending: 9 }, { dept: 'WR', pending: 12 },
  { dept: 'IND', pending: 7 }, { dept: 'TRN', pending: 8 }, { dept: 'WCD', pending: 7 },
  { dept: 'SJ', pending: 6 },
]

type Quadrant = 'critical-urgent' | 'critical-planned' | 'routine-urgent' | 'routine-monitor'

const MATRIX: Record<Quadrant, { title: string; hint: string; chips: string[]; tone: 'red' | 'amber' | 'sky' | 'ink' }> = {
  'critical-urgent': {
    title: 'High Impact · Urgent',
    hint: 'Act now — escalate for immediate approval',
    tone: 'red',
    chips: ['Monsoon SDRF pre-positioning', 'Drought relief package – Marathwada', 'Metro Line-3 cost escalation', 'Kharif procurement price fixation'],
  },
  'critical-planned': {
    title: 'High Impact · Planned',
    hint: 'Schedule for Cabinet / committee cycle',
    tone: 'amber',
    chips: ['Ready Reckoner rate revision', 'EV policy 2.0 incentives', 'District hospital PPP framework'],
  },
  'routine-urgent': {
    title: 'Routine · Urgent',
    hint: 'Delegate with time-bound SLA',
    tone: 'sky',
    chips: ['Staff nurse recruitment sanction', 'MSRTC depot land transfer', 'Scholarship portal vendor renewal'],
  },
  'routine-monitor': {
    title: 'Routine · Monitor',
    hint: 'Track through standard workflow',
    tone: 'ink',
    chips: ['Office premises lease renewals', 'Annual training calendar', 'Vehicle fleet condemnation'],
  },
}

const QUADRANT_TONE = {
  red: 'border-red-200 bg-red-50/60',
  amber: 'border-amber-200 bg-amber-50/60',
  sky: 'border-sky-200 bg-sky-50/60',
  ink: 'border-ink-200 bg-ink-50/60',
} as const

const CHIP_TONE = {
  red: 'border-red-200 bg-white text-red-700',
  amber: 'border-amber-200 bg-white text-amber-700',
  sky: 'border-sky-200 bg-white text-sky-700',
  ink: 'border-ink-200 bg-white text-ink-600',
} as const

type Impact = 'High' | 'Medium' | 'Low'

interface DecisionRow {
  id: string
  subject: string
  dept: string
  deptName: string
  owner: string
  approval: string
  impact: Impact
  risk: RiskLevel
  days: number
  dependency: string
  aiSummary: string
  action: string
  category: Category
}

const DECISION_ROWS: DecisionRow[] = [
  { id: 'DEC-2026-0148', subject: 'Revision of Ready Reckoner rates for FY 2026-27', dept: 'REV', deptName: 'Revenue', owner: 'Principal Secretary (Revenue)', approval: 'Cabinet', impact: 'High', risk: 'High', days: 21, dependency: 'Finance concurrence', aiSummary: 'Affects registration revenue in 36 districts; 2024 precedent GR available.', action: 'Place before Cabinet', category: 'Policy' },
  { id: 'DEC-2026-0141', subject: 'Monsoon pre-positioning of SDRF teams – Konkan division', dept: 'HOME', deptName: 'Home', owner: 'Additional Chief Secretary (Home)', approval: 'CM approval', impact: 'High', risk: 'Critical', days: 9, dependency: 'District readiness reports', aiSummary: 'IMD red-alert forecast; 4 districts below readiness threshold.', action: 'Approve within 48 hrs', category: 'Emergency' },
  { id: 'DEC-2026-0137', subject: 'Drought relief package – Marathwada (8 districts)', dept: 'RDD', deptName: 'Rural Development', owner: 'Principal Secretary (RDD)', approval: 'Cabinet', impact: 'High', risk: 'Critical', days: 17, dependency: 'Budget provision', aiSummary: 'Crop-loss annewari below 50 paise in 6 talukas; welfare impact high.', action: 'Fast-track Cabinet note', category: 'Welfare' },
  { id: 'DEC-2026-0132', subject: 'Metro Line-3 cost escalation approval – MMRDA', dept: 'UDD', deptName: 'Urban Development', owner: 'Metropolitan Commissioner', approval: 'Cabinet + Finance concurrence', impact: 'High', risk: 'High', days: 28, dependency: 'Legal vetting', aiSummary: 'Contract variation of 14%; similar 2024 escalation GR is referenceable.', action: 'Legal vetting first', category: 'Infrastructure' },
  { id: 'DEC-2026-0129', subject: 'Kharif 2026 procurement price fixation – tur and soyabean', dept: 'AGR', deptName: 'Agriculture', owner: 'Secretary (Agriculture)', approval: 'PS approval', impact: 'High', risk: 'High', days: 12, dependency: 'Central MSP notification', aiSummary: 'Sowing window closing; delay risks farmer grievance spike.', action: 'Approve this week', category: 'Finance' },
  { id: 'DEC-2026-0124', subject: 'e-Tender award – district hospital diagnostics PPP', dept: 'HFW', deptName: 'Health', owner: 'Commissioner (Health Services)', approval: 'Finance concurrence', impact: 'Medium', risk: 'Critical', days: 33, dependency: 'Legal vetting', aiSummary: 'Single-bidder scenario flagged; GFR deviation needs recorded justification.', action: 'Refer to Legal', category: 'Procurement' },
  { id: 'DEC-2026-0119', subject: 'Transfer and posting list – Section Officers (GAD)', dept: 'SJ', deptName: 'Social Justice', owner: 'Deputy Secretary (Establishment)', approval: 'PS approval', impact: 'Low', risk: 'Medium', days: 8, dependency: 'Civil Services Board minutes', aiSummary: 'Seniority conflicts auto-checked; 2 objections pending disposal.', action: 'Dispose objections', category: 'HR' },
  { id: 'DEC-2026-0114', subject: 'Krishna–Marathwada lift irrigation revised cost approval', dept: 'WR', deptName: 'Water Resources', owner: 'Secretary (Water Resources)', approval: 'Cabinet + Finance concurrence', impact: 'High', risk: 'High', days: 41, dependency: 'Budget provision', aiSummary: 'Longest-pending critical decision; affects 12 districts downstream.', action: 'Escalate to CS review', category: 'Infrastructure' },
  { id: 'DEC-2026-0108', subject: 'Scholarship disbursal portal – vendor contract renewal', dept: 'EDU', deptName: 'Education', owner: 'Director (Higher Education)', approval: 'Department approval', impact: 'Medium', risk: 'Medium', days: 15, dependency: 'Performance audit report', aiSummary: 'Citizen service impact high; 4.2 lakh students await disbursal.', action: 'Renew with SLA clause', category: 'Citizen Services' },
  { id: 'DEC-2026-0102', subject: 'Amendment to Maharashtra Shops & Establishments Rules', dept: 'IND', deptName: 'Industries', owner: 'Principal Secretary (Industries)', approval: 'Cabinet', impact: 'Medium', risk: 'High', days: 26, dependency: 'Legal vetting', aiSummary: 'Stakeholder consultation closed; draft notification AI-compared with 2017 rules.', action: 'Issue draft notification', category: 'Legal' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const IMPACT_CLASS: Record<Impact, string> = {
  High: 'border-brand-200 bg-brand-soft text-brand-700',
  Medium: 'border-sky-200 bg-sky-50 text-sky-700',
  Low: 'border-ink-200 bg-ink-50 text-ink-600',
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function DecisionIntelligence() {
  const [dept, setDept] = useState('all')
  const [category, setCategory] = useState<Category | null>(null)

  const filteredRows = useMemo(() => {
    let rows = DECISION_ROWS
    if (dept !== 'all') rows = rows.filter((r) => r.dept === dept)
    if (category) rows = rows.filter((r) => r.category === category)
    return rows
  }, [dept, category])

  const deptChart = useMemo(() => {
    const rows = DEPT_PENDING.map((d) => ({
      ...d,
      name: AI_DEPARTMENTS.find((x) => x.code === d.dept)?.name ?? d.dept,
    }))
    return dept === 'all' ? rows : rows.filter((r) => r.dept === dept)
  }, [dept])

  const maxFunnel = FUNNEL[0].count

  const columns: Column<DecisionRow>[] = [
    { key: 'id', header: 'Decision ID', sortable: true, render: (r) => <span className="font-mono text-xs text-ink-700">{r.id}</span> },
    { key: 'subject', header: 'Subject', className: 'min-w-[260px]', render: (r) => <span className="text-ink-800">{r.subject}</span> },
    { key: 'deptName', header: 'Department', sortable: true },
    { key: 'owner', header: 'Owner' },
    { key: 'approval', header: 'Required Approval', render: (r) => <span className="chip border border-ink-200 bg-ink-50 text-ink-700">{r.approval}</span> },
    {
      key: 'impact', header: 'Impact', sortable: true,
      render: (r) => <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', IMPACT_CLASS[r.impact])}>{r.impact}</span>,
    },
    { key: 'risk', header: 'Risk', render: (r) => <SeverityBadge level={r.risk} /> },
    {
      key: 'days', header: 'Days Pending', sortable: true,
      render: (r) => <span className={cn('font-semibold', r.days > 30 ? 'text-red-600' : r.days > 14 ? 'text-amber-600' : 'text-ink-800')}>{r.days}</span>,
    },
    {
      key: 'dependency', header: 'Dependency',
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-xs text-ink-600">
          <Link2 className="h-3 w-3 shrink-0 text-ink-400" /> {r.dependency}
        </span>
      ),
    },
    {
      key: 'aiSummary', header: 'AI Summary', className: 'min-w-[240px]',
      render: (r) => (
        <span className="inline-flex items-start gap-1.5 text-xs text-ink-600">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-brand-500" /> {r.aiSummary}
        </span>
      ),
    },
    {
      key: 'action', header: 'Recommended Action',
      render: (r) => (
        <button className="whitespace-nowrap rounded-md border border-brand-200 bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100">
          {r.action}
        </button>
      ),
    },
  ]

  const recommendations: Recommendation[] = [
    { text: 'This decision affects 12 districts.', confidence: 90, action: 'View impact map' },
    { text: 'Finance concurrence pending on 9 decisions.', confidence: 92, action: 'Nudge Finance' },
    { text: 'Similar GR issued in 2024 is available for reference.', confidence: 88, action: 'Open GR' },
    { text: 'Legal vetting recommended before approval.', confidence: 87, action: 'Route to Legal' },
    { text: 'Citizen service impact is high for 6 pending decisions.', confidence: 89, action: 'Prioritise' },
  ]

  const alerts: RiskAlert[] = [
    { title: 'Krishna–Marathwada revised cost approval pending 41 days — longest-pending critical decision.', severity: 'Critical', owner: 'Chief Secretary Office', due: '10 Jul' },
    { title: 'Single-bidder procurement decision (hospital diagnostics PPP) requires GFR deviation record.', severity: 'High', owner: 'HFW Commissioner', due: '14 Jul' },
    { title: 'Monsoon SDRF pre-positioning decision must clear before IMD red-alert window.', severity: 'Critical', owner: 'ACS (Home)', due: '48 hrs' },
    { title: '17 decisions await the next Cabinet cycle — agenda capacity is 12 items.', severity: 'Medium', owner: 'Cabinet Section, GAD', due: '18 Jul' },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Decision Intelligence"
        subtitle="Track pending administrative decisions, decision risk, approval pipelines, dependencies and policy-level impact across the Secretariat."
        icon={<GitBranch className="h-5 w-5" />}
        confidence={86}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pending Decisions" value={148} delta={-3.2} icon={<Hourglass className="h-5 w-5" />} confidence={92} hint="Across 13 departments" />
        <MetricCard label="Critical Decisions" value={23} delta={2.4} icon={<AlertOctagon className="h-5 w-5" />} confidence={90} hint="High impact + high urgency" />
        <MetricCard label="Decisions Delayed" value={41} delta={-5.8} icon={<TimerOff className="h-5 w-5" />} confidence={89} hint="Beyond internal timeline" />
        <MetricCard label="Average Decision Time" value="12.4 days" delta={-4.1} icon={<Timer className="h-5 w-5" />} confidence={91} hint="Target: 10 days" />
        <MetricCard label="Needing Cabinet Approval" value={17} delta={1.2} icon={<Landmark className="h-5 w-5" />} confidence={93} hint="Next cycle: 18 Jul" />
        <MetricCard label="With Legal Dependency" value={29} delta={3.6} icon={<Scale className="h-5 w-5" />} confidence={88} hint="Awaiting legal vetting" />
        <MetricCard label="AI-Assisted Decisions" value="64%" delta={9.4} icon={<Sparkles className="h-5 w-5" />} confidence={90} hint="Briefs, precedents, drafts" />
        <MetricCard label="Human Approval Pending" value={38} delta={-2.1} icon={<UserCheck className="h-5 w-5" />} confidence={91} hint="AI outputs awaiting sign-off" />
      </div>

      {/* Priority matrix */}
      <Card className="mt-6">
        <CardHeader
          title="Decision priority matrix"
          subtitle="Impact vs urgency · quadrant placement is AI-scored and officer-reviewable"
          right={<SourceBadge source="Demo" />}
        />
        <div className="flex gap-2">
          <div className="hidden shrink-0 items-center sm:flex">
            <span className="-rotate-90 whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-ink-400">Impact →</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(['critical-urgent', 'critical-planned', 'routine-urgent', 'routine-monitor'] as Quadrant[]).map((q) => {
                const m = MATRIX[q]
                return (
                  <div key={q} className={cn('rounded-xl border p-3.5', QUADRANT_TONE[m.tone])}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm font-semibold text-ink-800">{m.title}</div>
                      <span className="text-[11px] font-medium text-ink-500">{m.chips.length} decisions</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-500">{m.hint}</div>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.chips.map((c) => (
                        <span key={c} className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', CHIP_TONE[m.tone])}>{c}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-2 text-center text-[10px] font-semibold uppercase tracking-widest text-ink-400">Urgency →</div>
          </div>
        </div>
      </Card>

      {/* Funnel + dept chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Approval funnel"
            subtitle="Decision pipeline · Draft to Issued, current quarter"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-3">
            {FUNNEL.map((f, i) => {
              const pct = (f.count / maxFunnel) * 100
              const conv = i === 0 ? null : Math.round((f.count / FUNNEL[i - 1].count) * 100)
              return (
                <li key={f.stage}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-medium text-ink-800">{f.stage}</span>
                    <span className="text-xs text-ink-500">
                      <span className="font-semibold text-ink-900">{f.count}</span>
                      {conv !== null && <span className="ml-2">{conv}% from previous</span>}
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-md bg-ink-100">
                    <div
                      className="h-full rounded-md bg-brand-gradient transition-all"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                      title={`${f.stage}: ${f.count} decisions`}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 text-[11px] text-ink-500">Overall conversion Draft → Issued: 29% · 61 decisions issued this quarter.</div>
        </Card>

        <ChartCard
          title="Department-wise pending decisions"
          subtitle="148 decisions across the Secretariat"
          right={<DepartmentFilter value={dept} onChange={setDept} />}
          height={280}
        >
          <ResponsiveContainer>
            <BarChart data={deptChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gDecPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" />
                  <stop offset="100%" stopColor="#062868" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [v, 'Pending decisions']}
                labelFormatter={(code) => deptChart.find((d) => d.dept === code)?.name ?? String(code)}
              />
              <Bar dataKey="pending" fill="url(#gDecPending)" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Risk by category */}
      <Card className="mt-6">
        <CardHeader
          title="Risk by decision category"
          subtitle="Click a category to filter the decision register below"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_RISK.map((c) => {
            const active = category === c.category
            const maxCount = Math.max(...CATEGORY_RISK.map((x) => x.count))
            return (
              <button
                key={c.category}
                onClick={() => setCategory(active ? null : c.category)}
                className={cn(
                  'rounded-xl border p-3 text-left transition',
                  active
                    ? 'border-brand-300 bg-brand-soft ring-1 ring-brand-200'
                    : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-brand-50/40',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('text-sm font-medium', active ? 'text-brand-700' : 'text-ink-800')}>{c.category}</span>
                  <SeverityBadge level={c.risk} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink-800">{c.count}</span>
                </div>
              </button>
            )
          })}
        </div>
        {category && (
          <div className="mt-3 flex items-center gap-2 text-xs text-brand-700">
            <span className="chip border border-brand-200 bg-brand-soft text-brand-700">Filter: {category}</span>
            <button className="font-medium underline-offset-2 hover:underline" onClick={() => setCategory(null)}>Clear</button>
          </div>
        )}
      </Card>

      {/* Decision register */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
          <Layers className="h-4 w-4 text-brand-600" />
          <span className="section-title text-ink-800">Pending decision register</span>
          {category && <span className="chip border border-brand-200 bg-brand-soft text-brand-700">{category}</span>}
        </div>
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['id', 'subject', 'deptName', 'owner', 'approval', 'dependency']}
          emptyText="No decisions match the current filters"
          actions={
            <>
              <DepartmentFilter value={dept} onChange={setDept} />
              <SourceBadge source="Demo" />
            </>
          }
        />
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={recommendations} title="AI Decision Support" />
        <RiskAlertPanel alerts={alerts} />
      </div>
    </div>
  )
}
