import { useMemo, useState } from 'react'
import {
  Users, CheckCircle2, Hourglass, AlarmClock, ArrowUpRight, Repeat2, Star,
  Timer, MapPin, Inbox, Filter, X,
} from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Legend,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, SeverityBadge,
  DistrictFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS, AI_DISTRICTS, RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data (district/department dimensions come from the  */
/* shared data module — totals below are derived, not hard-coded).     */
/* ------------------------------------------------------------------ */

const GRIEVANCE_SLA_DAYS = 21

/** Intake channels — counts sum to the state-wide grievance total. */
const SOURCES = [
  { name: 'Aaple Sarkar', count: 18410 },
  { name: 'Helpline 1962', count: 6240 },
  { name: 'Department portals', count: 4880 },
  { name: 'Email', count: 3190 },
  { name: 'RTI-linked', count: 1480 },
  { name: 'Field complaints', count: 1100 },
]

/** Category chips — counts sum to the state-wide grievance total. */
const CATEGORIES = [
  { name: 'Revenue', count: 6420 },
  { name: 'Water', count: 5830 },
  { name: 'Municipal', count: 5240 },
  { name: 'Health', count: 3980 },
  { name: 'Welfare', count: 3410 },
  { name: 'Education', count: 2890 },
  { name: 'Police', count: 2460 },
  { name: 'Transport', count: 2110 },
  { name: 'Agriculture', count: 1720 },
  { name: 'Electricity', count: 1240 },
]

/** Validated categorical palette — fixed order, assigned per category. */
const TREND_COLORS: Record<string, string> = {
  Revenue: '#0B57D0',
  Water: '#E37400',
  Municipal: '#0E8A5F',
  Health: '#7C3AED',
  Welfare: '#0891B2',
}

/** Monthly registrations for the top 5 categories — Feb to Jul. */
const CATEGORY_TREND = [
  { m: 'Feb', Revenue: 980, Water: 760, Municipal: 810, Health: 620, Welfare: 540 },
  { m: 'Mar', Revenue: 1010, Water: 790, Municipal: 840, Health: 610, Welfare: 555 },
  { m: 'Apr', Revenue: 1050, Water: 860, Municipal: 870, Health: 640, Welfare: 560 },
  { m: 'May', Revenue: 1090, Water: 940, Municipal: 880, Health: 665, Welfare: 575 },
  { m: 'Jun', Revenue: 1115, Water: 1060, Municipal: 905, Health: 680, Welfare: 585 },
  { m: 'Jul', Revenue: 1140, Water: 1180, Municipal: 930, Health: 695, Welfare: 595 },
]

const SENTIMENT = [
  { label: 'Positive', pct: 46, delta: 3.2, cls: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Neutral', pct: 32, delta: -1.1, cls: 'bg-ink-400', chip: 'bg-ink-100 text-ink-600 border-ink-200' },
  { label: 'Negative', pct: 22, delta: -2.1, cls: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200' },
]

interface GrievanceRow {
  id: string
  category: string
  district: string
  subject: string
  source: string
  daysOpen: number
  severity: RiskLevel
  dept: string
  aiAction: string
}

const GRIEVANCE_ROWS: GrievanceRow[] = [
  { id: 'AS/2026/118422', category: 'Water', district: 'Pune', subject: 'Water supply disruption - Hadapsar ward 14', source: 'Aaple Sarkar', daysOpen: 9, severity: 'High', dept: 'Urban Development', aiAction: 'Systemic cluster: ward 14 pipeline (38 linked cases)' },
  { id: 'AS/2026/117901', category: 'Revenue', district: 'Nashik', subject: '7/12 extract correction pending 40 days', source: 'Aaple Sarkar', daysOpen: 40, severity: 'Critical', dept: 'Revenue', aiAction: 'Escalated to Tahsildar desk with draft order' },
  { id: 'AS/2026/118250', category: 'Water', district: 'Pune', subject: 'Low-pressure water supply - Hadapsar ward 14 lane 6', source: 'Helpline 1962', daysOpen: 7, severity: 'Medium', dept: 'Urban Development', aiAction: 'Duplicate of AS/2026/118422 — merged' },
  { id: 'AS/2026/116734', category: 'Welfare', district: 'Nanded', subject: 'Sanjay Gandhi Niradhar pension not credited for 3 months', source: 'Field complaints', daysOpen: 34, severity: 'Critical', dept: 'Social Justice', aiAction: 'Escalate: senior-citizen pension delay pattern' },
  { id: 'AS/2026/118011', category: 'Municipal', district: 'Thane', subject: 'Garbage collection stopped - Kalwa sector 3 for 2 weeks', source: 'Department portals', daysOpen: 15, severity: 'Medium', dept: 'Urban Development', aiAction: 'Routed to ward officer; response draft ready' },
  { id: 'AS/2026/117544', category: 'Health', district: 'Chhatrapati Sambhajinagar', subject: 'PHC Paithan: medicine stock-out for BP/diabetes patients', source: 'Helpline 1962', daysOpen: 23, severity: 'High', dept: 'Health', aiAction: 'Linked to district supply-chain alert DH-114' },
  { id: 'AS/2026/118390', category: 'Revenue', district: 'Ahmednagar', subject: 'Mutation entry (ferfar) not reflected after e-payment', source: 'Email', daysOpen: 5, severity: 'Low', dept: 'Revenue', aiAction: 'Auto-classified; acknowledgement sent' },
  { id: 'AS/2026/117215', category: 'Education', district: 'Jalgaon', subject: 'RTE 25% admission reimbursement pending - 12 schools', source: 'RTI-linked', daysOpen: 28, severity: 'High', dept: 'Education', aiAction: 'Duplicate of AS/2026/116802 — merged cluster' },
  { id: 'AS/2026/118477', category: 'Transport', district: 'Mumbai', subject: 'ST bus pass renewal portal failing OTP verification', source: 'Department portals', daysOpen: 3, severity: 'Low', dept: 'Transport', aiAction: 'Suggested routing: MSRTC IT cell' },
  { id: 'AS/2026/116980', category: 'Electricity', district: 'Solapur', subject: 'Agricultural pump connection pending despite paid demand note', source: 'Aaple Sarkar', daysOpen: 31, severity: 'High', dept: 'Water Resources', aiAction: 'Escalated: SLA breach — draft reply queued' },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Classify 214 new grievances automatically.', confidence: 92, action: 'Run classifier' },
  { text: 'Duplicate complaints detected — 96 clusters merged.', confidence: 90, action: 'Review clusters' },
  { text: 'Systemic issue: water supply complaints up 32% in 2 wards.', confidence: 88, action: 'Open ward map' },
  { text: 'Responsible department suggested for 48 unrouted grievances.', confidence: 86, action: 'Approve routing' },
  { text: 'Draft citizen responses queued for 120 resolved cases.', confidence: 89, action: 'Review drafts' },
  { text: 'Escalate 12 high-risk grievances (senior-citizen pension delays).', confidence: 91, action: 'Escalate' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: '1,214 grievances past the 21-day SLA — Aaple Sarkar service-guarantee penalties possible in 4 districts.', severity: 'High', owner: 'Citizen Service Cell', due: '72 hrs' },
  { title: 'Water-supply complaint surge in Pune (Hadapsar) — systemic infrastructure issue, not individual cases.', severity: 'High', owner: 'Municipal Commissioner, Pune', due: 'This week' },
  { title: 'Repeat complaints at 1,092 (3.1%) — repeated closures without citizen confirmation in 2 departments.', severity: 'Medium', owner: 'Grievance Redressal Officer', due: '10 days' },
]

/* ------------------------------------------------------------------ */
/* Derivations                                                         */
/* ------------------------------------------------------------------ */

const TOTAL_GRIEVANCES = AI_DISTRICTS.reduce((s, d) => s + d.grievances, 0)
const TOTAL_RESOLVED = AI_DISTRICTS.reduce((s, d) => s + d.resolved, 0)
const TOTAL_PENDING = TOTAL_GRIEVANCES - TOTAL_RESOLVED

/** Resolution funnel — Registered down to citizen-confirmed closure. */
const FUNNEL = [
  { stage: 'Registered', count: TOTAL_GRIEVANCES, note: 'All channels, last 12 months' },
  { stage: 'Acknowledged', count: 34610, note: 'Acknowledgement issued to citizen' },
  { stage: 'Assigned', count: 33480, note: 'Routed to responsible department desk' },
  { stage: 'Resolved', count: TOTAL_RESOLVED, note: 'Closure recorded by department' },
  { stage: 'Citizen Confirmed', count: 27410, note: 'Citizen accepted the resolution' },
]

function slaStatus(daysOpen: number): 'On Track' | 'At Risk' | 'Overdue' {
  if (daysOpen > GRIEVANCE_SLA_DAYS) return 'Overdue'
  if (daysOpen > GRIEVANCE_SLA_DAYS * 0.75) return 'At Risk'
  return 'On Track'
}

const SLA_CLASS: Record<ReturnType<typeof slaStatus>, string> = {
  'On Track': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk': 'border-amber-200 bg-amber-50 text-amber-700',
  Overdue: 'border-red-200 bg-red-50 text-red-700',
}

/** Pending-ratio heat bucket — sequential single hue (rose), light→dark. */
function heatClass(ratio: number) {
  if (ratio >= 0.17) return 'border-rose-300 bg-rose-200/70'
  if (ratio >= 0.15) return 'border-rose-200 bg-rose-100'
  if (ratio >= 0.12) return 'border-rose-200 bg-rose-50'
  return 'border-emerald-200 bg-emerald-50'
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CitizenGrievance() {
  const [category, setCategory] = useState<string>('all')
  const [district, setDistrict] = useState<string>('all')
  const [overdueOnly, setOverdueOnly] = useState(false)

  const filteredRows = useMemo(() => GRIEVANCE_ROWS.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (district !== 'all' && r.district !== district) return false
    if (overdueOnly && slaStatus(r.daysOpen) !== 'Overdue') return false
    return true
  }), [category, district, overdueOnly])

  const deptRanking = useMemo(
    () => [...AI_DEPARTMENTS].sort((a, b) => a.grievanceResolution - b.grievanceResolution),
    [],
  )

  const columns: Column<GrievanceRow>[] = [
    { key: 'id', header: 'Grievance ID', sortable: true, render: (r) => <span className="font-mono text-xs text-ink-700">{r.id}</span> },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'district', header: 'District', sortable: true },
    { key: 'subject', header: 'Subject', className: 'min-w-[240px]', render: (r) => <span className="text-ink-800">{r.subject}</span> },
    { key: 'source', header: 'Source' },
    { key: 'daysOpen', header: 'Days Open', sortable: true },
    { key: 'sla', header: 'SLA Status', render: (r) => {
      const s = slaStatus(r.daysOpen)
      return <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', SLA_CLASS[s])}>{s}</span>
    } },
    { key: 'severity', header: 'Severity', render: (r) => <SeverityBadge level={r.severity} /> },
    { key: 'dept', header: 'Assigned Department' },
    { key: 'aiAction', header: 'AI Action', className: 'min-w-[200px]', render: (r) => <span className="text-xs text-ink-600">{r.aiAction}</span> },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Citizen Grievance Intelligence"
        subtitle="Monitors citizen grievances from Aaple Sarkar, RTI, email, helpline, department portals, social signals and field complaints."
        icon={<Users className="h-5 w-5" />}
        confidence={88}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Grievances" value={TOTAL_GRIEVANCES.toLocaleString('en-IN')} icon={<Inbox className="h-5 w-5" />} delta={6.2} confidence={95} hint="Last 12 months · all channels" />
        <MetricCard label="Resolved" value={TOTAL_RESOLVED.toLocaleString('en-IN')} icon={<CheckCircle2 className="h-5 w-5" />} delta={8.4} confidence={95} hint={`${Math.round((TOTAL_RESOLVED / TOTAL_GRIEVANCES) * 100)}% resolution rate`} />
        <MetricCard label="Pending" value={TOTAL_PENDING.toLocaleString('en-IN')} icon={<Hourglass className="h-5 w-5" />} delta={-4.1} confidence={95} hint="In process across departments" />
        <button
          className={cn('block w-full text-left transition', overdueOnly && 'rounded-2xl ring-2 ring-red-400 ring-offset-2')}
          onClick={() => setOverdueOnly((v) => !v)}
          title="Click to filter the register to overdue grievances"
        >
          <MetricCard label="Overdue" value={(1214).toLocaleString('en-IN')} icon={<AlarmClock className="h-5 w-5" />} delta={-2.8} confidence={93} hint={overdueOnly ? 'Filter active — click to clear' : `Past ${GRIEVANCE_SLA_DAYS}-day SLA · click to filter`} />
        </button>
        <MetricCard label="Escalated" value={486} icon={<ArrowUpRight className="h-5 w-5" />} delta={3.5} confidence={92} hint="To senior officers" />
        <MetricCard label="Repeat Complaints" value={(1092).toLocaleString('en-IN')} icon={<Repeat2 className="h-5 w-5" />} delta={-6.3} confidence={90} hint="Re-opened after closure" />
        <MetricCard label="Citizen Satisfaction" value="4.1 / 5" icon={<Star className="h-5 w-5" />} delta={5.1} confidence={88} hint="Post-resolution feedback" />
        <MetricCard label="Avg Resolution Time" value="14.8 days" icon={<Timer className="h-5 w-5" />} delta={-9.2} confidence={92} hint={`SLA: ${GRIEVANCE_SLA_DAYS} days`} />
      </div>

      {/* Source strip */}
      <Card className="mt-6">
        <CardHeader
          title="Intake channels"
          subtitle="Grievances received per channel · last 12 months"
          right={<SourceBadge source="Demo" />}
        />
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700">
              {s.name}
              <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-700">{s.count.toLocaleString('en-IN')}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* District heatmap + category trend */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="District pending heatmap"
            subtitle="Tile shade = pending share of registered grievances · click a tile to filter the register"
            right={<SourceBadge source="Demo" />}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AI_DISTRICTS.map((d) => {
              const pending = d.grievances - d.resolved
              const ratio = pending / d.grievances
              const active = district === d.name
              return (
                <button
                  key={d.name}
                  onClick={() => setDistrict(active ? 'all' : d.name)}
                  className={cn(
                    'rounded-xl border p-2.5 text-left transition hover:shadow-sm',
                    heatClass(ratio),
                    active && 'ring-2 ring-brand-500 ring-offset-1',
                  )}
                >
                  <div className="flex items-center gap-1 text-xs font-semibold text-ink-800">
                    <MapPin className="h-3 w-3 shrink-0 text-ink-500" />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold leading-none text-ink-900">{pending.toLocaleString('en-IN')}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">pending · {Math.round(ratio * 100)}% of {d.grievances.toLocaleString('en-IN')}</div>
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-ink-500">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-emerald-200 bg-emerald-50" /> &lt;12% pending</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-rose-200 bg-rose-50" /> 12–15%</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-rose-200 bg-rose-100" /> 15–17%</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm border border-rose-300 bg-rose-200/70" /> ≥17%</span>
          </div>
        </Card>

        <ChartCard
          title="Category trend — top 5 categories"
          subtitle="Monthly registrations, Feb to Jul · water complaints rising sharply"
          height={330}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CATEGORY_TREND} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <ReTooltip
                cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(TREND_COLORS).map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category chips */}
      <Card className="mt-6">
        <CardHeader
          title="Categories"
          subtitle="Click a category to filter the grievance register"
          right={category !== 'all' ? (
            <button className="chip border border-ink-200 bg-ink-100 text-ink-700 hover:bg-ink-200/60" onClick={() => setCategory('all')}>
              <X className="h-3 w-3" /> Clear filter
            </button>
          ) : undefined}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.name
            return (
              <button
                key={c.name}
                onClick={() => setCategory(active ? 'all' : c.name)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                  active
                    ? 'border-brand-500 bg-brand-gradient text-white shadow-glow'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50/50',
                )}
              >
                {c.name}
                <span className={cn('rounded-full px-2 py-0.5 font-semibold', active ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-600')}>
                  {c.count.toLocaleString('en-IN')}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Department ranking + funnel + sentiment */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Department pending pressure"
            subtitle="Unresolved grievance share (100 − resolution %) · worst first"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2">
            {deptRanking.slice(0, 8).map((d) => {
              const pendingShare = 100 - d.grievanceResolution
              return (
                <li key={d.code}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink-800">{d.name}</span>
                    <span className="text-ink-500">{pendingShare}% unresolved</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded bg-ink-100">
                    <div
                      className={cn('h-full rounded', pendingShare >= 18 ? 'bg-rose-500' : pendingShare >= 15 ? 'bg-amber-500' : 'bg-brand-500')}
                      style={{ width: `${(pendingShare / 25) * 100}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Resolution funnel"
            subtitle="Registered → citizen-confirmed closure"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2">
            {FUNNEL.map((f, i) => {
              const pct = (f.count / FUNNEL[0].count) * 100
              return (
                <li key={f.stage} className="rounded-lg border border-ink-100 p-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink-800">{i + 1}. {f.stage}</span>
                    <span className="font-semibold text-ink-900">{f.count.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-ink-500">{f.note} · {pct.toFixed(0)}%</div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Citizen sentiment"
            subtitle="Post-resolution feedback + social signals · monthly delta"
            right={<SourceBadge source="Demo" />}
          />
          <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
            {SENTIMENT.map((s) => (
              <div key={s.label} className={cn('h-full first:rounded-l-full last:rounded-r-full', s.cls)} style={{ width: `${s.pct}%` }} />
            ))}
          </div>
          <ul className="mt-4 space-y-2.5">
            {SENTIMENT.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', s.cls)} />
                <span className="w-16 text-sm font-medium text-ink-800">{s.label}</span>
                <div className="h-1.5 flex-1 rounded bg-ink-100">
                  <div className={cn('h-full rounded', s.cls)} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-9 text-right text-sm font-semibold text-ink-900">{s.pct}%</span>
                <span className={cn('chip border text-[10px]', s.chip)}>
                  {s.delta >= 0 ? '▲' : '▼'} {Math.abs(s.delta).toFixed(1)} pts
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg border border-ink-100 bg-ink-50/50 p-2.5 text-xs text-ink-600">
            Positive sentiment up 3.2 pts this month — driven by faster water and revenue closures. Negative sentiment is concentrated in pension and municipal categories.
          </p>
        </Card>
      </div>

      {/* Grievance register */}
      <div className="mt-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 px-1">
          <span className="section-title text-ink-800">Grievance register</span>
          {category !== 'all' && <span className="chip border border-brand-200 bg-brand-soft text-brand-700">Category: {category}</span>}
          {district !== 'all' && <span className="chip border border-brand-200 bg-brand-soft text-brand-700">District: {district}</span>}
          {overdueOnly && <span className="chip border border-red-200 bg-red-50 text-red-700">Overdue only</span>}
        </div>
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['id', 'subject', 'category', 'district', 'dept']}
          emptyText="No grievances match the active filters"
          actions={
            <>
              <DistrictFilter value={district} onChange={setDistrict} />
              <SourceBadge source="Demo" />
              {(category !== 'all' || district !== 'all' || overdueOnly) && (
                <button
                  className="chip border border-ink-200 bg-ink-100 text-ink-700 hover:bg-ink-200/60"
                  onClick={() => { setCategory('all'); setDistrict('all'); setOverdueOnly(false) }}
                >
                  <Filter className="h-3 w-3" /> Clear all
                </button>
              )}
            </>
          }
        />
      </div>

      {/* AI recommendations + risk alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>
    </div>
  )
}
