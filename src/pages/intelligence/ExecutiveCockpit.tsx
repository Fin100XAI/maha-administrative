import { useMemo, useState } from 'react'
import {
  Gauge, Sparkles, Send, FileClock, AlertTriangle, Building2, FolderClock,
  Users, ShieldCheck, Bot, Landmark, Lock, Radar, UserCheck, ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as ReTooltip, Cell, LabelList,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel,
  SeverityBadge, TierBadge, DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import {
  AI_DEPARTMENTS, INDEX_SCORES, INDEX_TREND, RISK_CLASS, RiskLevel,
} from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local data (dimensions come from the shared data module)       */
/* ------------------------------------------------------------------ */

const TOTAL_PENDING_FILES = AI_DEPARTMENTS.reduce((s, d) => s + d.pendingFiles, 0)
const TOTAL_BREACHES = AI_DEPARTMENTS.reduce((s, d) => s + d.slaBreaches, 0)
const HIGH_RISK_DEPARTMENTS = AI_DEPARTMENTS.filter((d) => d.risk === 'High')
const CITIZEN_SCORE = INDEX_SCORES.subs.find((s) => s.key === 'citizen')?.score ?? 87
const COMPLIANCE_SCORE = INDEX_SCORES.subs.find((s) => s.key === 'compliance')?.score ?? 89
const SECURITY_SCORE = INDEX_SCORES.subs.find((s) => s.key === 'security')?.score ?? 94

/** SLA compliance trend — tracks the Administrative Intelligence Index shape, offset to the SLA band. */
const SLA_TREND = INDEX_TREND.map((p) => ({ m: p.m, sla: p.v - 5 }))

const FUNNEL_STAGES = [
  { stage: 'Received', value: 412 },
  { stage: 'Under Review', value: 296 },
  { stage: 'Concurrence', value: 214 },
  { stage: 'Approval Pending', value: 148 },
  { stage: 'Cleared', value: 96 },
]

interface DecisionRow {
  id: string
  subject: string
  dept: string
  deptName: string
  owner: string
  impact: 'High' | 'Medium'
  risk: RiskLevel
  daysPending: number
}

const DECISION_ROWS: DecisionRow[] = [
  { id: 'DEC-2417', subject: 'Approval of PMAY-U 2.0 district allocation revision', dept: 'UDD', deptName: 'Urban Development', owner: 'Principal Secretary', impact: 'High', risk: 'High', daysPending: 12 },
  { id: 'DEC-2403', subject: 'E-Ferfar mutation backlog clearance directive — Vidarbha division', dept: 'REV', deptName: 'Revenue', owner: 'Commissioner', impact: 'High', risk: 'Critical', daysPending: 21 },
  { id: 'DEC-2422', subject: 'Cabinet follow-up: SARATHI institute expansion status note', dept: 'SJ', deptName: 'Social Justice', owner: 'Principal Secretary', impact: 'High', risk: 'Critical', daysPending: 6 },
  { id: 'DEC-2431', subject: 'GST compensation reconciliation with GoI — FY 2025-26', dept: 'FIN', deptName: 'Finance', owner: 'Principal Secretary', impact: 'High', risk: 'High', daysPending: 14 },
  { id: 'DEC-2436', subject: 'Jal Jeevan Mission O&M fund re-appropriation concurrence', dept: 'WR', deptName: 'Water Resources', owner: 'Department Director', impact: 'Medium', risk: 'High', daysPending: 9 },
  { id: 'DEC-2440', subject: 'District hospital HR sanction — 214 posts (Phase II)', dept: 'HFW', deptName: 'Health', owner: 'Principal Secretary', impact: 'High', risk: 'Medium', daysPending: 5 },
  { id: 'DEC-2444', subject: 'MahaDBT scholarship disbursal pendency review — RTI escalations', dept: 'EDU', deptName: 'Education', owner: 'Commissioner', impact: 'Medium', risk: 'Medium', daysPending: 8 },
  { id: 'DEC-2449', subject: 'PM-KUSUM solar feeder tender award concurrence', dept: 'AGR', deptName: 'Agriculture', owner: 'Department Director', impact: 'Medium', risk: 'Medium', daysPending: 11 },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Revenue has the highest overdue file pressure.', confidence: 91, action: 'Escalate to Department' },
  { text: 'Urban Development has an increased SLA breach trend.', confidence: 88, action: 'Escalate to Department' },
  { text: 'Health department approvals improved by 9.4%.', confidence: 90, action: 'Share with Secretariat' },
  { text: 'Education requires RTI backlog review.', confidence: 84, action: 'Schedule Review' },
  { text: 'DPDP consent review needed in 3 departments.', confidence: 86, action: 'Assign Compliance Officer' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'Cabinet follow-up due: SARATHI expansion implementation brief', severity: 'Critical', owner: 'Cabinet Section, GAD', due: 'Due today' },
  { title: 'Contempt-risk case: High Court order compliance — land acquisition award', severity: 'Critical', owner: 'Revenue (Law & Judiciary)', due: 'Due in 2 days' },
  { title: 'RTI backlog above SLA in Education — 96 replies past 30-day limit', severity: 'High', owner: 'Education (RTI Cell)', due: 'Due this week' },
  { title: 'DPDP consent gap flagged in 3 departmental citizen datasets', severity: 'Medium', owner: 'Compliance AI Officer', due: 'Due in 10 days' },
]

const POSTURE_CARDS = [
  { label: 'Zero Trust Score', value: SECURITY_SCORE, suffix: '/100', icon: <ShieldCheck className="h-4 w-4" />, bar: SECURITY_SCORE, hint: 'Identity, device & network posture' },
  { label: 'DPDP Compliance', value: COMPLIANCE_SCORE, suffix: '/100', icon: <Lock className="h-4 w-4" />, bar: COMPLIANCE_SCORE, hint: 'Consent, retention & purpose limits' },
  { label: 'AI SOC Alerts (Open)', value: 3, suffix: '', icon: <Radar className="h-4 w-4" />, bar: 12, hint: '2 prompt-injection · 1 access anomaly' },
  { label: 'Human Approvals Pending', value: 21, suffix: '', icon: <UserCheck className="h-4 w-4" />, bar: 42, hint: 'AI outputs awaiting officer sign-off' },
]

/* Risk heatmap thresholds — derived from the shared department metrics */
function slaRisk(v: number): RiskLevel { return v >= 90 ? 'Low' : v >= 85 ? 'Medium' : v >= 80 ? 'High' : 'Critical' }
function backlogRisk(v: number): RiskLevel { return v <= 200 ? 'Low' : v <= 350 ? 'Medium' : v <= 550 ? 'High' : 'Critical' }
function breachRisk(v: number): RiskLevel { return v <= 2 ? 'Low' : v <= 4 ? 'Medium' : v <= 6 ? 'High' : 'Critical' }
function dpdpRisk(v: number): RiskLevel { return v >= 90 ? 'Low' : v >= 86 ? 'Medium' : v >= 84 ? 'High' : 'Critical' }

const RISK_CELL: Record<RiskLevel, string> = {
  Low: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-orange-200 text-orange-900',
  Critical: 'bg-red-200 text-red-900',
}

type HighlightKey = 'decisions' | 'breaches' | 'alerts' | 'files'

const HIGHLIGHT_PREDICATES: Record<HighlightKey, (r: DecisionRow) => boolean> = {
  decisions: (r) => r.impact === 'High',
  breaches: (r) => r.daysPending > 15,
  alerts: (r) => r.risk === 'Critical' || r.risk === 'High',
  files: (r) => r.daysPending > 7,
}

const HIGHLIGHT_LABEL: Record<HighlightKey, string> = {
  decisions: 'high-impact decisions',
  breaches: 'decisions past SLA window',
  alerts: 'critical / high-risk items',
  files: 'items pending beyond 7 days',
}

const CHART_STYLES = {
  tick: { fill: '#64748b', fontSize: 11 },
  grid: '#eef2f7',
  tooltip: { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 },
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function ExecutiveCockpit() {
  const [deptFilter, setDeptFilter] = useState('all')
  const [highlight, setHighlight] = useState<HighlightKey | null>(null)
  const [briefStamp, setBriefStamp] = useState('06:30 IST · 7 Jul 2026')

  const deptSorted = useMemo(() => [...AI_DEPARTMENTS].sort((a, b) => b.score - a.score), [])
  const decisionRows = useMemo(
    () => (deptFilter === 'all' ? DECISION_ROWS : DECISION_ROWS.filter((r) => r.dept === deptFilter)),
    [deptFilter],
  )
  const matrixRows = useMemo(
    () => (deptFilter === 'all' ? AI_DEPARTMENTS : AI_DEPARTMENTS.filter((d) => d.code === deptFilter)),
    [deptFilter],
  )
  const isHighlighted = (r: DecisionRow) => (highlight ? HIGHLIGHT_PREDICATES[highlight](r) : false)

  const regenerateBrief = () => {
    setBriefStamp(`${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} IST · 7 Jul 2026 (regenerated)`)
  }

  const decisionColumns: Column<DecisionRow>[] = [
    { key: 'id', header: 'Ref', sortable: true, render: (r) => <span className="font-mono text-xs text-ink-600">{r.id}</span> },
    { key: 'subject', header: 'Decision Subject', render: (r) => (
      <span className={cn('text-ink-800', isHighlighted(r) && 'rounded-md bg-amber-50 px-1.5 py-0.5 font-medium ring-1 ring-amber-200')}>
        {r.subject}
      </span>
    ) },
    { key: 'deptName', header: 'Department', sortable: true },
    { key: 'owner', header: 'Owner', render: (r) => <span className="text-xs text-ink-600">{r.owner}</span> },
    { key: 'impact', header: 'Impact', sortable: true, render: (r) => (
      <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', r.impact === 'High' ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-ink-200 bg-ink-50 text-ink-600')}>
        {r.impact}
      </span>
    ) },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => <SeverityBadge level={r.risk} /> },
    { key: 'daysPending', header: 'Days Pending', sortable: true, render: (r) => (
      <span className={cn('font-semibold tabular-nums', r.daysPending > 15 ? 'text-red-600' : r.daysPending > 7 ? 'text-amber-600' : 'text-ink-700')}>
        {r.daysPending}
      </span>
    ) },
    { key: 'action', header: 'Action', render: () => (
      <button className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-brand-200 bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100">
        Open Department Drilldown <ArrowUpRight className="h-3 w-3" />
      </button>
    ) },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Executive Intelligence Cockpit"
        subtitle="Chief Secretary / Principal Secretary level command cockpit — daily administrative priorities, risks, pending decisions, department health, AI usage, compliance and security posture."
        icon={<Gauge className="h-5 w-5" />}
        confidence={86}
      />

      {/* Toolbar — scopes the decisions table and health matrix */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="label text-ink-500">Scope</span>
        <DepartmentFilter value={deptFilter} onChange={setDeptFilter} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button className="btn-outline !px-3 !py-1.5 !text-xs" onClick={() => undefined}>
            <Send className="h-3.5 w-3.5" /> Escalate to Department
          </button>
          <button className="btn-primary !px-3 !py-1.5 !text-xs" onClick={regenerateBrief}>
            <Sparkles className="h-3.5 w-3.5" /> Generate Brief
          </button>
        </div>
      </div>

      {/* 1 · Daily Administrative Brief */}
      <Card className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gradient opacity-[0.07] blur-2xl" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Bot className="h-4 w-4" /></span>
          <div>
            <div className="section-title text-ink-800">Daily Administrative Brief</div>
            <div className="text-[11px] text-ink-500">AI-generated for the Chief Secretary · {briefStamp}</div>
          </div>
          <span className="ml-auto flex flex-wrap items-center gap-2">
            <TierBadge score={86} />
            <SourceBadge source="Demo" />
            <button className="btn-primary !px-3 !py-1.5 !text-xs" onClick={regenerateBrief}>
              <Sparkles className="h-3.5 w-3.5" /> Generate Brief
            </button>
          </span>
        </div>
        <p className="mt-4 max-w-5xl text-sm leading-relaxed text-ink-700">
          Overdue file pressure remains concentrated in the Revenue Department, which holds 612 pending files —
          the highest across Mantralaya — with e-Ferfar mutation backlogs in the Vidarbha division driving 9 active
          SLA breaches. Urban Development shows a worsening SLA breach trend (8 breaches, 79% compliance) linked to
          PMAY-U 2.0 allocation decisions awaiting Principal Secretary approval. Health department approvals improved
          by 9.4% month-on-month, lifting its health score to 89 with the lowest average disposal time of 5.8 days.
          Two cabinet follow-ups fall due this week, including the SARATHI expansion implementation brief, and a
          contempt-risk High Court compliance matter in Revenue requires disposal within 48 hours.
        </p>
      </Card>

      {/* 2 · KPI row — clicking a card highlights matching rows in the decisions table */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Administrative Health Score" value={`${INDEX_SCORES.overall}/100`} delta={1.1} icon={<Gauge className="h-5 w-5" />} hint="Administrative Intelligence Index" confidence={92} accent="brand" />
        <KpiClickable active={highlight === 'decisions'} onClick={() => setHighlight(highlight === 'decisions' ? null : 'decisions')}>
          <MetricCard label="Pending High-Priority Decisions" value={148} icon={<FileClock className="h-5 w-5" />} hint="At Approval Pending stage · click to highlight" confidence={90} />
        </KpiClickable>
        <KpiClickable active={highlight === 'breaches'} onClick={() => setHighlight(highlight === 'breaches' ? null : 'breaches')}>
          <MetricCard label="SLA Breaches" value={37} icon={<AlertTriangle className="h-5 w-5" />} hint={`This month · ${TOTAL_BREACHES} open across departments`} confidence={88} />
        </KpiClickable>
        <KpiClickable active={highlight === 'alerts'} onClick={() => setHighlight(highlight === 'alerts' ? null : 'alerts')}>
          <MetricCard label="Critical Department Alerts" value={12} icon={<Building2 className="h-5 w-5" />} hint="Across 13 departments · click to highlight" confidence={87} />
        </KpiClickable>
        <KpiClickable active={highlight === 'files'} onClick={() => setHighlight(highlight === 'files' ? null : 'files')}>
          <MetricCard label="Files Pending > 7 Days" value="2,418" icon={<FolderClock className="h-5 w-5" />} hint={`Of ${TOTAL_PENDING_FILES.toLocaleString('en-IN')} total pending files`} confidence={89} />
        </KpiClickable>
        <MetricCard label="Citizen Grievance Resolution" value={`${CITIZEN_SCORE}%`} delta={2.4} icon={<Users className="h-5 w-5" />} hint="Aaple Sarkar + PG Portal combined" confidence={90} />
        <MetricCard label="DPDP Compliance" value={`${COMPLIANCE_SCORE}/100`} delta={1.8} icon={<Lock className="h-5 w-5" />} hint="Consent, retention & purpose audits" confidence={91} />
        <MetricCard label="AI Recommendation Confidence" value="86%" icon={<Bot className="h-5 w-5" />} hint="Mean confidence across AI officers" confidence={86} />
      </div>

      {/* 3 · Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Department Health Scores" subtitle="Composite health score by department · higher is better" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptSorted} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="ecDeptBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" />
                  <stop offset="100%" stopColor="#062868" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_STYLES.grid} />
              <XAxis dataKey="code" tick={CHART_STYLES.tick} tickLine={false} axisLine={false} interval={0} />
              <YAxis domain={[60, 100]} tick={CHART_STYLES.tick} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={CHART_STYLES.tooltip} formatter={(v: number) => [`${v}/100`, 'Health score']} labelFormatter={(code: string) => AI_DEPARTMENTS.find((d) => d.code === code)?.name ?? code} />
              <Bar dataKey="score" fill="url(#ecDeptBar)" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="SLA Compliance Trend" subtitle="12-month statewide SLA compliance · improving" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SLA_TREND} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_STYLES.grid} />
              <XAxis dataKey="m" tick={CHART_STYLES.tick} tickLine={false} axisLine={false} />
              <YAxis domain={[74, 92]} tick={CHART_STYLES.tick} tickLine={false} axisLine={false} unit="%" />
              <ReTooltip contentStyle={CHART_STYLES.tooltip} formatter={(v: number) => [`${v}%`, 'SLA compliance']} />
              <Line type="monotone" dataKey="sla" stroke="#0B57D0" strokeWidth={2.5} dot={{ r: 3, fill: '#0B57D0' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Department Risk Heatmap"
          subtitle="Risk posture across five administrative dimensions"
          height={320}
          right={<HeatmapLegend />}
        >
          <div className="h-full overflow-auto pr-1">
            <table className="w-full min-w-[520px] border-separate" style={{ borderSpacing: '2px' }}>
              <thead>
                <tr>
                  <th className="sticky top-0 bg-white pb-1 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-500">Department</th>
                  {['SLA', 'Backlog', 'Breaches', 'DPDP', 'Overall'].map((h) => (
                    <th key={h} className="sticky top-0 bg-white pb-1 text-center text-[10px] font-semibold uppercase tracking-widest text-ink-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AI_DEPARTMENTS.map((d) => {
                  const cells: RiskLevel[] = [slaRisk(d.sla), backlogRisk(d.pendingFiles), breachRisk(d.slaBreaches), dpdpRisk(d.dpdp), d.risk]
                  return (
                    <tr key={d.code}>
                      <td className="whitespace-nowrap pr-2 text-xs font-medium text-ink-700">{d.name}</td>
                      {cells.map((level, i) => (
                        <td key={i} title={`${d.name} · ${['SLA', 'Backlog', 'Breaches', 'DPDP', 'Overall'][i]}: ${level}`} className={cn('rounded-md px-1.5 py-1.5 text-center text-[10px] font-semibold', RISK_CELL[level])}>
                          {level.charAt(0)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Priority Decision Funnel" subtitle="High-priority decisions by workflow stage · current cycle" height={320}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FUNNEL_STAGES} layout="vertical" margin={{ top: 8, right: 44, left: 24, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_STYLES.grid} />
              <XAxis type="number" tick={CHART_STYLES.tick} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="stage" width={110} tick={CHART_STYLES.tick} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={CHART_STYLES.tooltip} formatter={(v: number) => [v, 'Decisions']} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={26}>
                {FUNNEL_STAGES.map((_, i) => (
                  <Cell key={i} fill="#0B57D0" fillOpacity={1 - i * 0.16} />
                ))}
                <LabelList dataKey="value" position="right" style={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 4 · Top pending decisions */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="section-title text-ink-800">Top Pending Decisions</span>
          {highlight && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
              Highlighting {HIGHLIGHT_LABEL[highlight]}
              <button className="font-semibold underline decoration-dotted underline-offset-2" onClick={() => setHighlight(null)}>Clear</button>
            </span>
          )}
        </div>
        <DataTable
          columns={decisionColumns}
          rows={decisionRows}
          searchKeys={['id', 'subject', 'deptName', 'owner']}
          emptyText="No pending decisions for the selected department"
          actions={
            <>
              <DepartmentFilter value={deptFilter} onChange={setDeptFilter} />
              <SourceBadge source="Demo" />
            </>
          }
        />
      </div>

      {/* 5 · High-risk departments strip */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="section-title text-ink-800">High-Risk Departments</span>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">{HIGH_RISK_DEPARTMENTS.length} flagged</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HIGH_RISK_DEPARTMENTS.map((d) => (
            <Card key={d.code} className="border-l-2 !border-l-orange-400">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-ink-900">{d.name}</div>
                  <div className="mt-0.5 text-xs text-ink-500">Health score {d.score}/100 · avg disposal {d.avgDisposalDays} days</div>
                </div>
                <SeverityBadge level={d.risk} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <div className="label text-ink-500">SLA</div>
                  <div className="text-lg font-semibold text-ink-900">{d.sla}%</div>
                </div>
                <div>
                  <div className="label text-ink-500">Pending Files</div>
                  <div className="text-lg font-semibold text-ink-900">{d.pendingFiles}</div>
                </div>
                <div>
                  <div className="label text-ink-500">Breaches</div>
                  <div className="text-lg font-semibold text-red-600">{d.slaBreaches}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button className="btn-outline !px-2.5 !py-1 !text-[11px]">
                  <ArrowUpRight className="h-3 w-3" /> Open Department Drilldown
                </button>
                <button className="btn-outline !px-2.5 !py-1 !text-[11px]">
                  <Send className="h-3 w-3" /> Escalate to Department
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 6 · Department health matrix */}
      <Card className="mt-6">
        <CardHeader
          title="Department Health Matrix"
          subtitle="Compact view across all monitored departments · scoped by the department filter"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <DepartmentFilter value={deptFilter} onChange={setDeptFilter} />
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                {['Department', 'Score', 'SLA %', 'Pending Files', 'Breaches', 'Risk'].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((d) => (
                <tr key={d.code} className="hover:bg-ink-50/40">
                  <td className="table-td py-2 font-medium text-ink-800">{d.name}</td>
                  <td className="table-td py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${d.score}%` }} /></div>
                      <span className="text-xs font-semibold tabular-nums">{d.score}</span>
                    </div>
                  </td>
                  <td className="table-td py-2 tabular-nums">{d.sla}%</td>
                  <td className="table-td py-2 tabular-nums">{d.pendingFiles}</td>
                  <td className="table-td py-2 tabular-nums">{d.slaBreaches}</td>
                  <td className="table-td py-2"><SeverityBadge level={d.risk} /></td>
                </tr>
              ))}
              {deptFilter === 'all' && (
                <tr className="border-t border-ink-100 bg-ink-50/40">
                  <td className="table-td py-2 font-semibold text-ink-900">All departments</td>
                  <td className="table-td py-2 text-xs font-semibold text-ink-700">{INDEX_SCORES.overall} (index)</td>
                  <td className="table-td py-2" />
                  <td className="table-td py-2 font-semibold tabular-nums">{TOTAL_PENDING_FILES.toLocaleString('en-IN')}</td>
                  <td className="table-td py-2 font-semibold tabular-nums">{TOTAL_BREACHES}</td>
                  <td className="table-td py-2" />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 7 + 8 · AI recommendations and risk alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel title="AI Recommendations for the Chief Secretary" recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel title="Risks & Alerts — Immediate Attention" alerts={RISK_ALERTS} />
      </div>

      {/* 9 · Security & DPDP posture strip */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100"><Landmark className="h-3.5 w-3.5" /></span>
          <span className="section-title text-ink-800">Security & DPDP Posture</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {POSTURE_CARDS.map((c) => (
            <Card key={c.label} className="!p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="label text-ink-500">{c.label}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">{c.icon}</span>
              </div>
              <div className="mt-1.5 text-2xl font-semibold text-ink-900">{c.value}<span className="text-sm font-medium text-ink-500">{c.suffix}</span></div>
              <div className="mt-2 h-1.5 w-full rounded bg-ink-100">
                <div className="h-full rounded bg-brand-gradient" style={{ width: `${c.bar}%` }} />
              </div>
              <div className="mt-1.5 text-[11px] text-ink-500">{c.hint}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */

function KpiClickable({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={cn('cursor-pointer rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-brand-300', active && 'ring-2 ring-brand-400')}
    >
      {children}
    </div>
  )
}

function HeatmapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(RISK_CLASS) as RiskLevel[]).map((level) => (
        <span key={level} className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-600">
          <span className={cn('h-2.5 w-2.5 rounded-sm', RISK_CELL[level])} /> {level}
        </span>
      ))}
    </div>
  )
}
