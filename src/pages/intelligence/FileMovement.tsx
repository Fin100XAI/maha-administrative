import { useMemo, useState } from 'react'
import {
  FileStack, Files, CheckCircle2, Timer, Clock, AlertTriangle, ArrowUpRight,
  MonitorSmartphone, Sparkles, ChevronRight, GitPullRequest, PenLine,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, DepartmentFilter,
  Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, TrendBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data (shared dimensions come from the data module)  */
/* ------------------------------------------------------------------ */

const STAGES = [
  { name: 'Receipt', count: 1240, avgDays: 0.4 },
  { name: 'Dak Section', count: 1876, avgDays: 0.9 },
  { name: 'Desk Officer', count: 4310, avgDays: 2.1 },
  { name: 'Section Officer', count: 5120, avgDays: 3.4 },
  { name: 'Under Secretary', count: 3245, avgDays: 2.6 },
  { name: 'Deputy Secretary', count: 1830, avgDays: 1.8 },
  { name: 'Approval', count: 821, avgDays: 1.1 },
] as const

type AgeBucket = { bucket: string; min: number; max: number; count: number; trend: number }

const AGE_BUCKETS: AgeBucket[] = [
  { bucket: '0–3 days', min: 0, max: 3, count: 9860, trend: 4.2 },
  { bucket: '4–7 days', min: 4, max: 7, count: 6164, trend: 1.8 },
  { bucket: '8–15 days', min: 8, max: 15, count: 1412, trend: -3.1 },
  { bucket: '16–30 days', min: 16, max: 30, count: 520, trend: -6.4 },
  { bucket: '30+ days', min: 31, max: Infinity, count: 486, trend: -9.2 },
]

const TOTAL_ACTIVE = 18442

/** Dept × stage avg-days grid for the bottleneck heatmap. */
const HEATMAP_DEPTS = ['REV', 'HOME', 'HFW', 'UDD', 'RDD', 'FIN', 'EDU', 'WR'] as const
const HEATMAP: Record<string, number[]> = {
  REV: [0.5, 1.2, 3.1, 4.8, 3.6, 2.2, 1.4],
  HOME: [0.4, 0.8, 2.0, 3.1, 2.4, 1.6, 0.9],
  HFW: [0.3, 0.7, 1.6, 2.4, 1.9, 1.2, 0.8],
  UDD: [0.6, 1.1, 2.9, 5.2, 3.9, 2.6, 1.3],
  RDD: [0.4, 0.9, 2.2, 3.3, 2.5, 1.7, 1.0],
  FIN: [0.3, 0.6, 1.7, 2.5, 2.0, 1.3, 0.7],
  EDU: [0.5, 1.0, 2.4, 3.8, 2.9, 1.9, 1.1],
  WR: [0.5, 1.0, 2.7, 4.1, 3.2, 2.1, 1.2],
}

interface OfficerLoad { role: string; dept: string; pending: number; avgPendency: number }

const OFFICER_LOAD: OfficerLoad[] = [
  { role: 'Section Officer (Land Records)', dept: 'REV', pending: 214, avgPendency: 9.6 },
  { role: 'Under Secretary (Compensation)', dept: 'REV', pending: 168, avgPendency: 8.2 },
  { role: 'Desk Officer (Town Planning)', dept: 'UDD', pending: 196, avgPendency: 10.4 },
  { role: 'Section Officer (PMAY Cell)', dept: 'UDD', pending: 152, avgPendency: 8.8 },
  { role: 'Deputy Secretary (Police Infra)', dept: 'HOME', pending: 121, avgPendency: 6.9 },
  { role: 'Section Officer (Budget)', dept: 'FIN', pending: 98, avgPendency: 5.4 },
  { role: 'Under Secretary (Schemes)', dept: 'RDD', pending: 117, avgPendency: 7.3 },
  { role: 'Desk Officer (Irrigation Projects)', dept: 'WR', pending: 143, avgPendency: 9.1 },
]

type Priority = 'Routine' | 'Priority' | 'Immediate'

interface FileRow {
  id: string
  dept: string
  deptName: string
  subject: string
  officer: string
  stage: string
  daysPending: number
  sla: number
  priority: Priority
  aiRec: string
}

const FILE_ROWS: FileRow[] = [
  { id: 'REV/2026/04412', dept: 'REV', deptName: 'Revenue', subject: 'Land acquisition compensation – Ratnagiri bypass', officer: 'Under Secretary (Compensation)', stage: 'Under Secretary', daysPending: 34, sla: 21, priority: 'Immediate', aiRec: 'Escalate to Deputy Secretary; award order draft ready.' },
  { id: 'UDD/2026/02981', dept: 'UDD', deptName: 'Urban Development', subject: 'PMAY(U) 2.0 annexure revision – Pimpri-Chinchwad cluster', officer: 'Section Officer (PMAY Cell)', stage: 'Section Officer', daysPending: 19, sla: 21, priority: 'Priority', aiRec: 'Similar annexure approved for Nashik; reuse note format.' },
  { id: 'HFW/2026/01765', dept: 'HFW', deptName: 'Health', subject: 'Staff nurse recruitment – district hospitals (Vidarbha)', officer: 'Desk Officer (Establishment)', stage: 'Desk Officer', daysPending: 6, sla: 15, priority: 'Priority', aiRec: 'Seniority list verified; draft office note available.' },
  { id: 'FIN/2026/03310', dept: 'FIN', deptName: 'Finance', subject: 'Re-appropriation of funds – Minor head 2202 (Education)', officer: 'Section Officer (Budget)', stage: 'Section Officer', daysPending: 9, sla: 10, priority: 'Immediate', aiRec: 'SLA due tomorrow; move for concurrence today.' },
  { id: 'HOME/2026/02214', dept: 'HOME', deptName: 'Home', subject: 'CCTV surveillance phase-III – Pune City Police', officer: 'Deputy Secretary (Police Infra)', stage: 'Deputy Secretary', daysPending: 12, sla: 21, priority: 'Priority', aiRec: 'Vendor compliance report attached; no blockers detected.' },
  { id: 'WR/2026/01108', dept: 'WR', deptName: 'Water Resources', subject: 'Krishna–Marathwada lift irrigation – revised administrative approval', officer: 'Under Secretary (Projects)', stage: 'Under Secretary', daysPending: 41, sla: 30, priority: 'Immediate', aiRec: 'Circular dependency with FIN concurrence; break via joint note.' },
  { id: 'RDD/2026/02876', dept: 'RDD', deptName: 'Rural Development', subject: 'Jal Jeevan Mission works – Nanded block consolidation', officer: 'Desk Officer (Schemes)', stage: 'Desk Officer', daysPending: 3, sla: 15, priority: 'Routine', aiRec: 'Auto-drafted consolidation note pending officer review.' },
  { id: 'AGR/2026/01542', dept: 'AGR', deptName: 'Agriculture', subject: 'Crop insurance disbursal reconciliation – Kharif 2025', officer: 'Section Officer (Insurance)', stage: 'Section Officer', daysPending: 20, sla: 21, priority: 'Priority', aiRec: 'Duplicate movement detected with AGR/2026/01498; merge files.' },
  { id: 'TRN/2026/00987', dept: 'TRN', deptName: 'Transport', subject: 'e-Bus fleet augmentation – MSRTC Nashik division', officer: 'Desk Officer (Fleet)', stage: 'Dak Section', daysPending: 5, sla: 15, priority: 'Routine', aiRec: 'Awaiting depot readiness certificate; reminder drafted.' },
  { id: 'EDU/2026/02411', dept: 'EDU', deptName: 'Education', subject: 'Model school infrastructure grants – Gadchiroli', officer: 'Under Secretary (Infrastructure)', stage: 'Under Secretary', daysPending: 29, sla: 30, priority: 'Immediate', aiRec: 'Aspirational-district file; SLA breach imminent, escalate.' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type SlaState = 'OK' | 'At Risk' | 'Breached'

function slaStatus(daysPending: number, sla: number): SlaState {
  if (daysPending > sla) return 'Breached'
  if (sla - daysPending <= 2) return 'At Risk'
  return 'OK'
}

const SLA_CLASS: Record<SlaState, string> = {
  OK: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'At Risk': 'border-amber-200 bg-amber-50 text-amber-700',
  Breached: 'border-red-200 bg-red-50 text-red-700',
}

const PRIORITY_CLASS: Record<Priority, string> = {
  Routine: 'border-ink-200 bg-ink-50 text-ink-600',
  Priority: 'border-sky-200 bg-sky-50 text-sky-700',
  Immediate: 'border-red-200 bg-red-50 text-red-700',
}

/** Sequential single-hue (brand blue) heat scale — magnitude only. */
function heatClass(days: number): string {
  if (days >= 4.5) return 'bg-brand-700 text-white'
  if (days >= 3.5) return 'bg-brand-600 text-white'
  if (days >= 2.5) return 'bg-brand-400 text-white'
  if (days >= 1.5) return 'bg-brand-200 text-brand-900'
  if (days >= 0.8) return 'bg-brand-100 text-brand-800'
  return 'bg-brand-50 text-brand-700'
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function FileMovement() {
  const [dept, setDept] = useState('all')
  const [bucketIdx, setBucketIdx] = useState<number | null>(null)

  const bottleneckStage = useMemo(
    () => STAGES.reduce((max, s) => (s.avgDays > max.avgDays ? s : max), STAGES[0]),
    [],
  )

  const deptPendingChart = useMemo(
    () => AI_DEPARTMENTS.map((d) => ({ dept: d.code, name: d.name, pending: d.pendingFiles })),
    [],
  )

  const filteredFiles = useMemo(() => {
    let rows = FILE_ROWS
    if (dept !== 'all') rows = rows.filter((r) => r.dept === dept)
    if (bucketIdx !== null) {
      const b = AGE_BUCKETS[bucketIdx]
      rows = rows.filter((r) => r.daysPending >= b.min && r.daysPending <= b.max)
    }
    return rows
  }, [dept, bucketIdx])

  const filteredOfficers = useMemo(
    () => (dept === 'all' ? OFFICER_LOAD : OFFICER_LOAD.filter((o) => o.dept === dept)),
    [dept],
  )

  const columns: Column<FileRow>[] = [
    { key: 'id', header: 'File ID', sortable: true, render: (r) => <span className="font-mono text-xs text-ink-700">{r.id}</span> },
    { key: 'deptName', header: 'Department', sortable: true },
    { key: 'subject', header: 'Subject', className: 'min-w-[240px]', render: (r) => <span className="text-ink-800">{r.subject}</span> },
    { key: 'officer', header: 'Current Officer' },
    { key: 'stage', header: 'Current Stage' },
    {
      key: 'daysPending', header: 'Days Pending', sortable: true,
      render: (r) => <span className={cn('font-semibold', r.daysPending > r.sla ? 'text-red-600' : 'text-ink-800')}>{r.daysPending}</span>,
    },
    {
      key: 'priority', header: 'Priority',
      render: (r) => <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', PRIORITY_CLASS[r.priority])}>{r.priority}</span>,
    },
    {
      key: 'sla', header: 'SLA Status', sortable: true,
      render: (r) => {
        const s = slaStatus(r.daysPending, r.sla)
        return <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', SLA_CLASS[s])}>{s} · {r.sla}d SLA</span>
      },
    },
    {
      key: 'aiRec', header: 'AI Recommendation', className: 'min-w-[220px]',
      render: (r) => (
        <span className="inline-flex items-start gap-1.5 text-xs text-ink-600">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-brand-500" /> {r.aiRec}
        </span>
      ),
    },
    {
      key: 'actions', header: 'Actions', className: 'min-w-[220px]',
      render: () => (
        <div className="flex flex-wrap items-center gap-1.5">
          <button className="rounded-md border border-ink-200 bg-white px-2 py-1 text-[11px] font-medium text-ink-700 transition hover:bg-ink-50">Open Timeline</button>
          <button className="rounded-md border border-brand-200 bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100">Draft Note</button>
          <button className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 transition hover:bg-red-100">Escalate</button>
        </div>
      ),
    },
  ]

  const recommendations: Recommendation[] = [
    { text: 'Auto-prioritise 14 high-impact files pending over 30 days — 6 relate to land acquisition compensation.', confidence: 91, action: 'Prioritise' },
    { text: 'Note drafting suggested for 42 files at Section Officer stage; AI drafts are ready for officer review.', confidence: 88, action: 'Review drafts' },
    { text: 'Duplicate file movement detected: AGR/2026/01542 and AGR/2026/01498 cover the same Kharif reconciliation.', confidence: 86, action: 'Merge files' },
    { text: 'Circular dependency flagged: WR revised approval waits on FIN concurrence, which waits on the same WR file annexure.', confidence: 84, action: 'Break loop' },
    { text: 'Escalate 9 SLA-breaching files to Deputy Secretary level with pre-drafted escalation memos.', confidence: 90, action: 'Escalate' },
  ]

  const alerts: RiskAlert[] = [
    { title: '486 files pending beyond 30 days — 118 are citizen-facing and carry grievance exposure.', severity: 'High', owner: 'GAD Monitoring Cell', due: 'This week' },
    { title: 'Section Officer stage is the systemic bottleneck at 3.4 avg days; UDD peaks at 5.2 days.', severity: 'Medium', owner: 'UDD Principal Secretary', due: '15 Jul' },
    { title: 'Revenue department SLA breaches rose to 9 this month, driven by land compensation files.', severity: 'High', owner: 'Revenue Secretary', due: '12 Jul' },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="File Movement Intelligence"
        subtitle="Track file lifecycles, disposal velocity, ageing, bottleneck stages and officer-level workflow pressure across Mantralaya departments."
        icon={<FileStack className="h-5 w-5" />}
        confidence={87}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Active Files" value="18,442" delta={2.1} icon={<Files className="h-5 w-5" />} confidence={92} hint="Across 13 departments" />
        <MetricCard label="Files Disposed This Month" value="6,214" delta={8.4} icon={<CheckCircle2 className="h-5 w-5" />} confidence={93} hint="July 2026 to date" />
        <MetricCard label="Average Disposal Time" value="7.8 days" delta={-6.2} icon={<Timer className="h-5 w-5" />} confidence={90} hint="Target: 7.0 days" />
        <MetricCard label="Pending > 7 Days" value="2,418" delta={-4.8} icon={<Clock className="h-5 w-5" />} confidence={91} hint="13.1% of active files" />
        <MetricCard label="Pending > 30 Days" value={486} delta={-9.2} icon={<AlertTriangle className="h-5 w-5" />} confidence={91} hint="Deep-pendency register" />
        <MetricCard label="Files Escalated" value={121} delta={5.6} icon={<ArrowUpRight className="h-5 w-5" />} confidence={89} hint="To DS level and above" />
        <MetricCard label="Digital File Adoption" value="92%" delta={3.4} icon={<MonitorSmartphone className="h-5 w-5" />} confidence={94} hint="e-Office coverage" />
        <MetricCard label="AI Draft Support Used" value="38%" delta={11.2} icon={<Sparkles className="h-5 w-5" />} confidence={88} hint="Of notes drafted this month" />
      </div>

      {/* File lifecycle flow */}
      <Card className="mt-6">
        <CardHeader
          title="File lifecycle flow"
          subtitle="Stage-wise active files and average residence time · bottleneck stage highlighted in amber"
          right={<SourceBadge source="Demo" />}
        />
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-[980px] items-stretch gap-0">
            {STAGES.map((s, i) => {
              const isBottleneck = s.name === bottleneckStage.name
              return (
                <div key={s.name} className="flex flex-1 items-center">
                  <div
                    className={cn(
                      'flex-1 rounded-xl border p-3 transition-all',
                      isBottleneck
                        ? 'border-amber-300 bg-amber-50 ring-1 ring-amber-200'
                        : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-brand-50/40',
                    )}
                  >
                    <div className={cn('text-xs font-semibold', isBottleneck ? 'text-amber-800' : 'text-ink-800')}>{s.name}</div>
                    <div className={cn('mt-1.5 text-lg font-semibold leading-none', isBottleneck ? 'text-amber-900' : 'text-ink-900')}>
                      {s.count.toLocaleString('en-IN')}
                    </div>
                    <div className={cn('mt-1 text-[11px]', isBottleneck ? 'text-amber-700' : 'text-ink-500')}>
                      {s.avgDays} avg days
                    </div>
                    {isBottleneck && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        <AlertTriangle className="h-2.5 w-2.5" /> Bottleneck
                      </span>
                    )}
                  </div>
                  {i < STAGES.length - 1 && <ChevronRight className="mx-0.5 h-4 w-4 shrink-0 text-ink-300" />}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Dept pending chart + Ageing table */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Department-wise pending files"
          subtitle="Active pendency by department"
          height={280}
        >
          <ResponsiveContainer>
            <BarChart data={deptPendingChart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gFilePending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" />
                  <stop offset="100%" stopColor="#062868" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [v.toLocaleString('en-IN'), 'Pending files']}
                labelFormatter={(code) => deptPendingChart.find((d) => d.dept === code)?.name ?? String(code)}
              />
              <Bar dataKey="pending" fill="url(#gFilePending)" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Ageing buckets"
            subtitle="Click a bucket to filter the file register below"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr>
                  {['Bucket', 'Files', 'Share', 'Trend (MoM)'].map((h) => <th key={h} className="table-th">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {AGE_BUCKETS.map((b, i) => {
                  const active = bucketIdx === i
                  const share = (b.count / TOTAL_ACTIVE) * 100
                  return (
                    <tr
                      key={b.bucket}
                      onClick={() => setBucketIdx(active ? null : i)}
                      className={cn('cursor-pointer transition', active ? 'bg-brand-soft' : 'hover:bg-ink-50/40')}
                    >
                      <td className={cn('table-td font-medium', active ? 'text-brand-700' : 'text-ink-800')}>{b.bucket}</td>
                      <td className="table-td font-semibold text-ink-900">{b.count.toLocaleString('en-IN')}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded bg-ink-100">
                            <div className="h-full rounded bg-brand-gradient" style={{ width: `${Math.max(share, 3)}%` }} />
                          </div>
                          <span className="text-xs font-medium text-ink-600">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="table-td"><TrendBadge delta={b.trend} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {bucketIdx !== null && (
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-700">
              <span className="chip border border-brand-200 bg-brand-soft text-brand-700">Filter: {AGE_BUCKETS[bucketIdx].bucket}</span>
              <button className="font-medium underline-offset-2 hover:underline" onClick={() => setBucketIdx(null)}>Clear</button>
            </div>
          )}
        </Card>
      </div>

      {/* Bottleneck heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Bottleneck heatmap"
          subtitle="Average residence days by department × stage · darker = slower"
          right={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-medium text-ink-500">
                Fast
                <span className="flex overflow-hidden rounded">
                  {['bg-brand-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-400', 'bg-brand-600', 'bg-brand-700'].map((c) => (
                    <span key={c} className={cn('h-3 w-4', c)} />
                  ))}
                </span>
                Slow
              </span>
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-1">
              <div />
              {STAGES.map((s) => (
                <div key={s.name} className="px-1 pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-ink-500">{s.name}</div>
              ))}
              {HEATMAP_DEPTS.map((code) => {
                const deptName = AI_DEPARTMENTS.find((d) => d.code === code)?.name ?? code
                return [
                  <div key={`${code}-label`} className="flex items-center pr-2 text-xs font-medium text-ink-700">{deptName}</div>,
                  ...HEATMAP[code].map((v, si) => (
                    <div
                      key={`${code}-${si}`}
                      title={`${deptName} · ${STAGES[si].name}: ${v} avg days`}
                      className={cn(
                        'grid h-9 place-items-center rounded-md text-[11px] font-semibold transition hover:ring-2 hover:ring-brand-300',
                        heatClass(v),
                      )}
                    >
                      {v.toFixed(1)}
                    </div>
                  )),
                ]
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Officer workload */}
      <Card className="mt-6">
        <CardHeader
          title="Officer workload"
          subtitle="Pending files and average pendency at officer desks"
          right={
            <div className="flex items-center gap-2">
              <DepartmentFilter value={dept} onChange={setDept} />
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>{['Officer Role', 'Department', 'Pending Files', 'Avg Pendency', 'Load'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredOfficers.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-sm text-ink-500">No officer records for this department.</td></tr>
              )}
              {filteredOfficers.map((o) => (
                <tr key={o.role} className="hover:bg-ink-50/40">
                  <td className="table-td font-medium text-ink-800">{o.role}</td>
                  <td className="table-td text-ink-700">{AI_DEPARTMENTS.find((d) => d.code === o.dept)?.name ?? o.dept}</td>
                  <td className="table-td font-semibold text-ink-900">{o.pending}</td>
                  <td className="table-td">
                    <span className={cn('font-medium', o.avgPendency > 9 ? 'text-red-600' : o.avgPendency > 7 ? 'text-amber-600' : 'text-ink-700')}>
                      {o.avgPendency} days
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="h-1.5 w-28 rounded bg-ink-100">
                      <div
                        className={cn('h-full rounded', o.pending > 180 ? 'bg-amber-500' : 'bg-brand-gradient')}
                        style={{ width: `${Math.min((o.pending / 220) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Main file register */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
          <GitPullRequest className="h-4 w-4 text-brand-600" />
          <span className="section-title text-ink-800">Live file register</span>
          {bucketIdx !== null && (
            <span className="chip border border-brand-200 bg-brand-soft text-brand-700">Ageing: {AGE_BUCKETS[bucketIdx].bucket}</span>
          )}
        </div>
        <DataTable
          columns={columns}
          rows={filteredFiles}
          searchKeys={['id', 'subject', 'deptName', 'officer', 'stage']}
          emptyText="No files match the current filters"
          actions={
            <>
              <DepartmentFilter value={dept} onChange={setDept} />
              <button className="header-btn-outline !px-3 !py-1.5 !text-xs"><PenLine className="h-3.5 w-3.5" /> Bulk Draft Notes</button>
              <SourceBadge source="Demo" />
            </>
          }
        />
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={recommendations} />
        <RiskAlertPanel alerts={alerts} />
      </div>
    </div>
  )
}
