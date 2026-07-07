import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Cell, LabelList,
} from 'recharts'
import {
  Users, UserPlus, Inbox, LifeBuoy, Gauge, Sparkles, Clock, GraduationCap, ClipboardList, HeartHandshake, X,
} from 'lucide-react'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, DepartmentFilter,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { DataTable, Column } from '@/components/ui/DataTable'
import { AI_DEPARTMENTS, AI_ROLES } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Workload status — computed, never hand-labelled                     */
/* ------------------------------------------------------------------ */

export type WorkloadStatus = 'Normal' | 'High' | 'Support Needed' | 'Critical Load'

/** Supportive load classification from pending files. */
function workloadStatus(pendingFiles: number): WorkloadStatus {
  if (pendingFiles <= 15) return 'Normal'
  if (pendingFiles <= 25) return 'High'
  if (pendingFiles <= 35) return 'Support Needed'
  return 'Critical Load'
}

const STATUS_CLASS: Record<WorkloadStatus, string> = {
  Normal: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  High: 'bg-amber-50 text-amber-700 border-amber-200',
  'Support Needed': 'bg-orange-50 text-orange-700 border-orange-200',
  'Critical Load': 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_COLOR: Record<WorkloadStatus, string> = {
  Normal: '#34A853',
  High: '#FBBC05',
  'Support Needed': '#F57C00',
  'Critical Load': '#EA4335',
}

function WorkloadBadge({ status }: { status: WorkloadStatus }) {
  return <span className={cn('chip border', STATUS_CLASS[status])}>{status}</span>
}

/* ------------------------------------------------------------------ */
/* Demo datasets — consistent with the KPI row (4,218 desks total)     */
/* ------------------------------------------------------------------ */

const LOAD_BUCKETS: { status: WorkloadStatus; desks: number; range: string }[] = [
  { status: 'Normal', desks: 2894, range: '≤ 15 pending files' },
  { status: 'High', desks: 864, range: '16–25 pending files' },
  { status: 'Support Needed', desks: 312, range: '26–35 pending files' },
  { status: 'Critical Load', desks: 148, range: 'over 35 pending files' },
]

interface DeskRow {
  role: string
  dept: string
  deptCode: string
  pendingFiles: number
  pendingApprovals: number
  avgDisposalDays: number
  aiUsage: number
  supportRecommendation: string
  trainingNeed: boolean
}

const DESK_ROWS: DeskRow[] = [
  { role: 'Desk Officer', dept: 'Revenue', deptCode: 'REV', pendingFiles: 41, pendingApprovals: 12, avgDisposalDays: 11.2, aiUsage: 58, supportRecommendation: 'Assign shared support desk this fortnight', trainingNeed: true },
  { role: 'Section Officer', dept: 'Revenue', deptCode: 'REV', pendingFiles: 33, pendingApprovals: 9, avgDisposalDays: 9.8, aiUsage: 62, supportRecommendation: 'Rebalance workflow with paired Revenue desk', trainingNeed: true },
  { role: 'Desk Officer', dept: 'Urban Development', deptCode: 'UDD', pendingFiles: 38, pendingApprovals: 11, avgDisposalDays: 10.6, aiUsage: 54, supportRecommendation: 'Add temporary support desk during peak intake', trainingNeed: true },
  { role: 'Section Officer', dept: 'Urban Development', deptCode: 'UDD', pendingFiles: 28, pendingApprovals: 8, avgDisposalDays: 9.1, aiUsage: 66, supportRecommendation: 'Enable AI drafting assist for routine notes', trainingNeed: false },
  { role: 'Desk Officer', dept: 'Home', deptCode: 'HOME', pendingFiles: 22, pendingApprovals: 6, avgDisposalDays: 7.4, aiUsage: 71, supportRecommendation: 'Monitor load weekly; no action needed yet', trainingNeed: false },
  { role: 'Section Officer', dept: 'Health', deptCode: 'HFW', pendingFiles: 12, pendingApprovals: 3, avgDisposalDays: 5.6, aiUsage: 84, supportRecommendation: 'Sustain current cadence; share good practice', trainingNeed: false },
  { role: 'Department Director', dept: 'Finance', deptCode: 'FIN', pendingFiles: 14, pendingApprovals: 5, avgDisposalDays: 6.1, aiUsage: 80, supportRecommendation: 'Sustain current cadence', trainingNeed: false },
  { role: 'Desk Officer', dept: 'Education', deptCode: 'EDU', pendingFiles: 26, pendingApprovals: 7, avgDisposalDays: 8.9, aiUsage: 60, supportRecommendation: 'Recommend AI drafting training module', trainingNeed: true },
  { role: 'Section Officer', dept: 'Rural Development', deptCode: 'RDD', pendingFiles: 19, pendingApprovals: 5, avgDisposalDays: 7.8, aiUsage: 68, supportRecommendation: 'Route overflow to nearby section desk', trainingNeed: false },
  { role: 'District Collector', dept: 'Water Resources', deptCode: 'WR', pendingFiles: 17, pendingApprovals: 6, avgDisposalDays: 8.3, aiUsage: 63, supportRecommendation: 'Prioritise approvals queue with AI summaries', trainingNeed: false },
]

/* AI usage by role — supportive adoption view. */
const AI_USAGE_BY_ROLE = [
  { role: 'Chief Secretary', usage: 82 },
  { role: 'Principal Secretary', usage: 78 },
  { role: 'Commissioner', usage: 74 },
  { role: 'District Collector', usage: 69 },
  { role: 'Municipal Commissioner', usage: 66 },
  { role: 'CEO Zilla Parishad', usage: 61 },
  { role: 'Department Director', usage: 72 },
  { role: 'Desk Officer', usage: 64 },
  { role: 'Section Officer', usage: 58 },
] satisfies { role: (typeof AI_ROLES)[number]; usage: number }[]

/* Pending approval ageing — sums to the 1,842 approval-load KPI. */
const AGEING_BUCKETS = [
  { bucket: '0–7 days', count: 918, share: 50, trend: 'Healthy inflow-outflow balance' },
  { bucket: '8–15 days', count: 462, share: 25, trend: 'Stable · within SLA window' },
  { bucket: '16–30 days', count: 276, share: 15, trend: 'Watch · nudge reminders sent' },
  { bucket: '31–60 days', count: 138, share: 7, trend: 'Support advised · missing documents flagged' },
  { bucket: 'Over 60 days', count: 48, share: 3, trend: 'Escalated for facilitation support' },
]

/* Capacity heatmap — dept × role, supportive levels. */
type CapacityLevel = 'Comfortable' | 'Manageable' | 'Support Advised' | 'Support Needed'
const CAPACITY_CLASS: Record<CapacityLevel, string> = {
  Comfortable: 'bg-emerald-100 text-emerald-800',
  Manageable: 'bg-amber-100 text-amber-800',
  'Support Advised': 'bg-orange-100 text-orange-800',
  'Support Needed': 'bg-red-100 text-red-800',
}
const HEAT_ROLES = ['Department Director', 'Desk Officer', 'Section Officer', 'District Collector', 'Municipal Commissioner'] as const
const HEAT_DEPTS = AI_DEPARTMENTS.slice(0, 8)

function capacityIndex(pendingFiles: number, di: number, ri: number): number {
  return Math.min(100, Math.round(pendingFiles / 7 + ((di * 7 + ri * 13) % 22)))
}
function capacityLevel(v: number): CapacityLevel {
  if (v < 45) return 'Comfortable'
  if (v < 65) return 'Manageable'
  if (v < 80) return 'Support Advised'
  return 'Support Needed'
}

/* Department capacity cards — derived from shared dept metrics. */
function deptCapacityNote(pendingFiles: number): { level: CapacityLevel; note: string } {
  if (pendingFiles > 500) return { level: 'Support Needed', note: 'Additional desks and AI drafting assist recommended.' }
  if (pendingFiles > 350) return { level: 'Support Advised', note: 'Rebalancing between sections would ease pressure.' }
  if (pendingFiles > 250) return { level: 'Manageable', note: 'Load steady; keep weekly capacity check-ins.' }
  return { level: 'Comfortable', note: 'Healthy headroom; can absorb seasonal peaks.' }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function OfficerPerformance() {
  const [dept, setDept] = useState('all')
  const [statusFilter, setStatusFilter] = useState<WorkloadStatus | null>(null)

  const filteredRows = useMemo(() => DESK_ROWS.filter((r) => {
    if (dept !== 'all' && r.deptCode !== dept) return false
    if (statusFilter && workloadStatus(r.pendingFiles) !== statusFilter) return false
    return true
  }), [dept, statusFilter])

  const heatDepts = useMemo(
    () => (dept === 'all' ? HEAT_DEPTS : HEAT_DEPTS.filter((d) => d.code === dept)),
    [dept],
  )

  const columns: Column<DeskRow>[] = [
    { key: 'role', header: 'Officer Role', render: (r) => <span className="font-medium text-ink-800">{r.role}</span> },
    { key: 'dept', header: 'Department' },
    { key: 'pendingFiles', header: 'Pending Files', sortable: true, render: (r) => <span className="font-semibold text-ink-800">{r.pendingFiles}</span> },
    { key: 'pendingApprovals', header: 'Pending Approvals', sortable: true },
    { key: 'avgDisposalDays', header: 'Avg Disposal', sortable: true, render: (r) => `${r.avgDisposalDays} days` },
    { key: 'status', header: 'Workload Status', render: (r) => <WorkloadBadge status={workloadStatus(r.pendingFiles)} /> },
    { key: 'aiUsage', header: 'AI Usage', sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.aiUsage}%` }} /></div>
        <span className="text-xs font-medium">{r.aiUsage}%</span>
      </div>
    )},
    { key: 'supportRecommendation', header: 'Support Recommendation', className: 'min-w-[220px]', render: (r) => <span className="text-xs text-ink-600">{r.supportRecommendation}</span> },
    { key: 'trainingNeed', header: 'Training', render: (r) => (
      <span className={cn('chip border', r.trainingNeed ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-ink-100 text-ink-600 border-ink-200')}>
        {r.trainingNeed ? 'Yes' : 'No'}
      </span>
    )},
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Officer Workload Intelligence"
        subtitle="Decision-support view of desk capacity across Maharashtra's secretariat and field offices — built to route support where it is needed, plan capacity ahead of peaks, and remove bottlenecks. This module informs assistance, never appraisal."
        icon={<Users className="h-5 w-5" />}
        breadcrumb={['Administrative Intelligence', 'Officer Workload Intelligence']}
        confidence={85}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Officers Onboarded" value="4,218" hint="Across Mantralaya + district offices" icon={<UserPlus className="h-5 w-5" />} confidence={92} />
        <MetricCard label="Average Pending Load" value="23 files" hint="Per desk, statewide" icon={<Inbox className="h-5 w-5" />} confidence={88} />
        <MetricCard label="Officers Needing Support" value={312} hint="26–35 pending files" icon={<LifeBuoy className="h-5 w-5" />} confidence={86} />
        <MetricCard label="High Workload Desks" value={148} hint="Critical load — over 35 pending" icon={<Gauge className="h-5 w-5" />} confidence={87} />
        <MetricCard label="AI-Assisted Productivity" value="+28%" hint="Disposal uplift on AI-enabled desks" icon={<Sparkles className="h-5 w-5" />} confidence={84} />
        <MetricCard label="Average Time Saved" value="6.2 hrs/week" hint="Per officer using AI drafting" icon={<Clock className="h-5 w-5" />} confidence={85} />
        <MetricCard label="Training Recommended" value={264} hint="AI adoption enablement, voluntary" icon={<GraduationCap className="h-5 w-5" />} confidence={83} />
        <MetricCard label="Approval Load" value="1,842" hint="Approvals in queue statewide" icon={<ClipboardList className="h-5 w-5" />} confidence={89} />
      </div>

      {/* Workload distribution + AI usage by role */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Workload Distribution"
          subtitle="Desks by pending-load bucket · click a bar to filter the desk table"
          height={280}
          right={statusFilter && (
            <button className="chip border border-brand-200 bg-brand-soft text-brand-700" onClick={() => setStatusFilter(null)}>
              {statusFilter} <X className="h-3 w-3" />
            </button>
          )}
        >
          <ResponsiveContainer>
            <BarChart data={LOAD_BUCKETS} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="status" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip
                cursor={{ fill: 'rgba(11,87,208,0.04)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const p = payload[0].payload as (typeof LOAD_BUCKETS)[number]
                  return (
                    <div className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-xs shadow-lg">
                      <div className="font-semibold text-ink-800">{p.status}</div>
                      <div className="mt-0.5 text-ink-500">{p.desks.toLocaleString('en-IN')} desks · {p.range}</div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="desks"
                radius={[6, 6, 0, 0]}
                cursor="pointer"
                onClick={(d: any) => {
                  const s = d?.status as WorkloadStatus | undefined
                  if (s) setStatusFilter((cur) => (cur === s ? null : s))
                }}
              >
                <LabelList dataKey="desks" position="top" style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} formatter={(v: number) => v.toLocaleString('en-IN')} />
                {LOAD_BUCKETS.map((b) => (
                  <Cell
                    key={b.status}
                    fill={STATUS_COLOR[b.status]}
                    fillOpacity={statusFilter && statusFilter !== b.status ? 0.25 : 0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="AI Usage by Role" subtitle="Share of role's desks actively using AI drafting and summarisation" height={280}>
          <ResponsiveContainer>
            <BarChart data={AI_USAGE_BY_ROLE} layout="vertical" margin={{ top: 4, right: 32, left: 40, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="role" width={110} tick={{ fill: '#64748b', fontSize: 10.5 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'AI usage']} />
              <Bar dataKey="usage" fill="#0B57D0" radius={[0, 4, 4, 0]} barSize={14}>
                <LabelList dataKey="usage" position="right" style={{ fontSize: 10.5, fill: '#475569' }} formatter={(v: number) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Support heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Officer Support Heatmap"
          subtitle="Capacity-risk view by department and role — highlights where support and rebalancing would help most"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <DepartmentFilter value={dept} onChange={setDept} />
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th className="table-th !border-0">Department</th>
                {HEAT_ROLES.map((r) => <th key={r} className="table-th !border-0 text-center">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {heatDepts.map((d, di) => (
                <tr key={d.code}>
                  <td className="whitespace-nowrap rounded-l-md bg-ink-50/60 px-3 py-1.5 text-xs font-medium text-ink-700">{d.name}</td>
                  {HEAT_ROLES.map((role, ri) => {
                    const v = capacityIndex(d.pendingFiles, di, ri)
                    const level = capacityLevel(v)
                    return (
                      <td key={role} className={cn('rounded-md px-2 py-1.5 text-center text-[11px] font-semibold', CAPACITY_CLASS[level])} title={`${d.name} · ${role}: ${level} (capacity index ${v})`}>
                        {level}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {heatDepts.length === 0 && (
                <tr><td colSpan={HEAT_ROLES.length + 1} className="p-6 text-center text-sm text-ink-500">No heatmap coverage for this department yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          {(Object.keys(CAPACITY_CLASS) as CapacityLevel[]).map((l) => (
            <span key={l} className={cn('rounded-full px-2 py-0.5 font-medium', CAPACITY_CLASS[l])}>{l}</span>
          ))}
          <span className="text-ink-500">· Framed as support signals, not individual assessment</span>
        </div>
      </Card>

      {/* Ageing buckets + capacity cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader title="Pending Approval Ageing" subtitle="1,842 approvals in queue · statewide" right={<SourceBadge source="Demo" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>{['Age Bucket', 'Approvals', 'Share', 'Signal'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {AGEING_BUCKETS.map((b) => (
                  <tr key={b.bucket} className="hover:bg-ink-50/40">
                    <td className="table-td font-medium text-ink-800">{b.bucket}</td>
                    <td className="table-td font-semibold">{b.count.toLocaleString('en-IN')}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${b.share}%` }} /></div>
                        <span className="text-xs">{b.share}%</span>
                      </div>
                    </td>
                    <td className="table-td text-xs text-ink-600">{b.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader title="Department-wise Capacity Risk" subtitle="Pending load headroom per department — where extra hands or AI assist would help" right={<SourceBadge source="Demo" />} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...AI_DEPARTMENTS].sort((a, b) => b.pendingFiles - a.pendingFiles).slice(0, 9).map((d) => {
              const c = deptCapacityNote(d.pendingFiles)
              return (
                <div key={d.code} className="rounded-xl border border-ink-100 bg-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 truncate text-sm font-semibold text-ink-800">{d.name}</div>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', CAPACITY_CLASS[c.level])}>{c.level}</span>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-xl font-semibold text-ink-900">{d.pendingFiles}</span>
                    <span className="text-[11px] text-ink-500">pending files</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${Math.min(100, Math.round(d.pendingFiles / 6.5))}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-ink-500">{c.note}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Main desk table */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['role', 'dept', 'supportRecommendation']}
          emptyText="No desks match the current filters"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {statusFilter && (
                <button className="chip border border-brand-200 bg-brand-soft text-brand-700" onClick={() => setStatusFilter(null)}>
                  {statusFilter} <X className="h-3 w-3" />
                </button>
              )}
              <DepartmentFilter value={dept} onChange={setDept} />
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <p className="mt-2 px-1 text-[11px] text-ink-500">
          <HeartHandshake className="mr-1 inline h-3 w-3 text-emerald-600" />
          Desk-level view is anonymised by role. Workload status is a support signal computed from pending files (≤15 Normal · 16–25 High · 26–35 Support Needed · 35+ Critical Load) — used only for capacity planning and assistance.
        </p>
      </div>

      {/* Recommendations + alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel
          title="Decision Support Recommendations"
          recommendations={[
            { text: 'Assign additional support to overloaded desks in Revenue and UDD.', confidence: 90, action: 'Plan support' },
            { text: 'Recommend AI drafting training for low-adoption teams.', confidence: 87, action: 'Nominate' },
            { text: 'Rebalance workflow between two Revenue desks.', confidence: 85, action: 'Rebalance' },
            { text: 'Identify approvals stuck due to missing documents.', confidence: 88, action: 'Run scan' },
          ]}
        />
        <RiskAlertPanel
          title="Capacity Risk Signals"
          alerts={[
            { title: 'Revenue desk cluster approaching capacity — additional support desk recommended before month-end intake', severity: 'High', owner: 'GAD / Revenue', due: 'This week' },
            { title: 'UDD approvals ageing past 30 days rising — facilitation drive on missing documents advised', severity: 'Medium', owner: 'UDD', due: '14 Jul' },
            { title: '264 officers flagged for voluntary AI-enablement training to ease drafting workload', severity: 'Medium', owner: 'Training Cell', due: '31 Jul' },
          ]}
        />
      </div>
    </div>
  )
}
