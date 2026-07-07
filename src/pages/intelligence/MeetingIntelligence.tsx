import { useMemo, useState } from 'react'
import {
  MessagesSquare, FileUp, FileText, ListChecks, UserCheck, Target, Send,
  CalendarClock, ClipboardList, AlertOctagon, Gavel, FileCheck2, MailCheck,
  Building2, Play, Check, Sparkles, TrendingUp,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel,
  TierBadge, DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, TrendBadge } from '@/components/ui/Badges'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Demo data — page-specific rows (shared dimensions come from         */
/* administrativeIntelligence.ts)                                      */
/* ------------------------------------------------------------------ */

type ActionStatus = 'Open' | 'In Progress' | 'Closed' | 'Overdue'

interface MeetingActionRow {
  meeting: string
  date: string
  chair: string
  deptCode: string
  dept: string
  decision: string
  actionItem: string
  owner: string
  deadline: string
  status: ActionStatus
  confidence: number
}

const TRACKER_ROWS: MeetingActionRow[] = [
  { meeting: 'State Level Bankers Committee review', date: '24 Jun 2026', chair: 'Chief Secretary', deptCode: 'FIN', dept: 'Finance', decision: 'Kharif crop loan disbursement target revised to ₹86,000 Cr', actionItem: 'Circulate district-wise disbursement plan to lead banks', owner: 'Department Director', deadline: '15 Jul 2026', status: 'In Progress', confidence: 92 },
  { meeting: 'PMAY-U 2.0 implementation review', date: '18 Jun 2026', chair: 'Principal Secretary', deptCode: 'UDD', dept: 'Urban Development', decision: 'DPRs for 14 ULBs approved for central sanction', actionItem: 'Upload verified beneficiary lists to PMAY-U portal', owner: 'Municipal Commissioner', deadline: '05 Jul 2026', status: 'Overdue', confidence: 88 },
  { meeting: 'District Collectors’ VC on monsoon preparedness', date: '12 Jun 2026', chair: 'Chief Secretary', deptCode: 'REV', dept: 'Revenue', decision: 'District flood control rooms to operate 24x7 from 15 June', actionItem: 'Publish control-room duty roster and escalation matrix', owner: 'District Collector', deadline: '20 Jun 2026', status: 'Closed', confidence: 94 },
  { meeting: 'Jal Jeevan Mission progress review', date: '26 Jun 2026', chair: 'Principal Secretary', deptCode: 'WR', dept: 'Water Resources', decision: '312 stalled village schemes to be re-tendered this quarter', actionItem: 'Issue re-tender notices for stalled JJM schemes', owner: 'Department Director', deadline: '25 Jul 2026', status: 'Open', confidence: 86 },
  { meeting: 'State Health Mission governing body', date: '20 Jun 2026', chair: 'Chief Secretary', deptCode: 'HFW', dept: 'Health', decision: '108 ambulance fleet expansion of 240 vehicles cleared', actionItem: 'Float RFP for ambulance procurement and AMC', owner: 'Commissioner', deadline: '31 Jul 2026', status: 'In Progress', confidence: 90 },
  { meeting: 'District Vigilance & Monitoring Committee', date: '10 Jun 2026', chair: 'District Collector', deptCode: 'RDD', dept: 'Rural Development', decision: 'MGNREGS social audit calendar for FY 2026-27 finalised', actionItem: 'Notify gram-panchayat-wise audit schedule', owner: 'CEO Zilla Parishad', deadline: '18 Jun 2026', status: 'Overdue', confidence: 84 },
  { meeting: 'Cabinet sub-committee on school infrastructure', date: '28 Jun 2026', chair: 'Principal Secretary', deptCode: 'EDU', dept: 'Education', decision: '1,200 classrooms sanctioned under Samagra Shiksha', actionItem: 'Issue administrative approvals to executing agencies', owner: 'Department Director', deadline: '22 Jul 2026', status: 'Open', confidence: 89 },
  { meeting: 'Kharif season review with Divisional Commissioners', date: '16 Jun 2026', chair: 'Chief Secretary', deptCode: 'AGR', dept: 'Agriculture', decision: 'Seed and fertiliser buffer fixed at 110% of assessed demand', actionItem: 'Verify taluka-level stock positions and report gaps', owner: 'Commissioner', deadline: '30 Jun 2026', status: 'Closed', confidence: 91 },
  { meeting: 'Law & order review — Ganeshotsav bandobast', date: '30 Jun 2026', chair: 'Principal Secretary', deptCode: 'HOME', dept: 'Home', decision: 'Integrated CCTV command centres approved for 8 cities', actionItem: 'Submit city-wise deployment and manpower plan', owner: 'Commissioner', deadline: '28 Jul 2026', status: 'Open', confidence: 87 },
  { meeting: 'Maitri 2.0 single-window steering committee', date: '22 Jun 2026', chair: 'Principal Secretary', deptCode: 'IND', dept: 'Industries', decision: '48-hour approval SLA adopted for MSME permits', actionItem: 'Integrate six department APIs with Maitri portal', owner: 'Department Director', deadline: '10 Aug 2026', status: 'In Progress', confidence: 90 },
]

/** Total = 74, matches the Overdue Actions KPI. */
const OVERDUE_BY_DEPT = [
  { code: 'UDD', dept: 'Urban Development', overdue: 16 },
  { code: 'REV', dept: 'Revenue', overdue: 14 },
  { code: 'RDD', dept: 'Rural Development', overdue: 9 },
  { code: 'EDU', dept: 'Education', overdue: 8 },
  { code: 'WR', dept: 'Water Resources', overdue: 7 },
  { code: 'HOME', dept: 'Home', overdue: 6 },
  { code: 'FIN', dept: 'Finance', overdue: 5 },
  { code: 'HFW', dept: 'Health', overdue: 4 },
  { code: 'AGR', dept: 'Agriculture', overdue: 3 },
  { code: 'TRN', dept: 'Transport', overdue: 2 },
]

/** Average ≈ 82%, matches the Follow-up Compliance KPI. */
const FOLLOWUP_COMPLIANCE = [
  { code: 'HFW', dept: 'Health', compliance: 90 },
  { code: 'FIN', dept: 'Finance', compliance: 88 },
  { code: 'AGR', dept: 'Agriculture', compliance: 85 },
  { code: 'HOME', dept: 'Home', compliance: 84 },
  { code: 'TRN', dept: 'Transport', compliance: 83 },
  { code: 'RDD', dept: 'Rural Development', compliance: 80 },
  { code: 'EDU', dept: 'Education', compliance: 79 },
  { code: 'WR', dept: 'Water Resources', compliance: 78 },
  { code: 'REV', dept: 'Revenue', compliance: 76 },
  { code: 'UDD', dept: 'Urban Development', compliance: 71 },
]

const OUTCOME_TREND = [
  { m: 'Feb', score: 71 }, { m: 'Mar', score: 73 }, { m: 'Apr', score: 74 },
  { m: 'May', score: 76 }, { m: 'Jun', score: 77 }, { m: 'Jul', score: 78 },
]

const MOM_STATUS = [
  { name: 'Generated', value: 198, color: '#0B57D0' },
  { name: 'Pending', value: 16, color: '#FBBC05' },
]

const WORKFLOW_STEPS = [
  { key: 'upload', title: 'Upload meeting notes', desc: 'Ingest handwritten notes, audio transcripts or e-Office noting of the meeting.', icon: <FileUp className="h-4 w-4" /> },
  { key: 'mom', title: 'Generate MOM', desc: 'Draft formal minutes in government register — agenda-wise, ready for chair approval.', icon: <FileText className="h-4 w-4" /> },
  { key: 'extract', title: 'Extract decisions & action items', desc: 'Identify every decision, directive and actionable with source-paragraph traceability.', icon: <ListChecks className="h-4 w-4" /> },
  { key: 'assign', title: 'Assign owner & deadline', desc: 'Map each action to a responsible role and an SLA-backed deadline for closure.', icon: <UserCheck className="h-4 w-4" /> },
  { key: 'track', title: 'Track closure', desc: 'Monitor compliance, flag overdue actions and escalate per the delegation matrix.', icon: <Target className="h-4 w-4" /> },
  { key: 'letter', title: 'Generate follow-up letter', desc: 'Auto-draft D.O. and reminder letters to departments pending response.', icon: <Send className="h-4 w-4" /> },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: '6 action items from the CS review meeting are unassigned.', confidence: 93, action: 'Assign owners' },
  { text: 'Overdue actions concentrated in 2 departments — issue follow-up letters.', confidence: 90, action: 'Draft letters' },
  { text: '3 decisions require cabinet note preparation.', confidence: 88, action: 'Prepare notes' },
  { text: 'Recurring agenda item detected across 4 meetings — recommend standing SOP.', confidence: 85, action: 'Draft SOP' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'Drought relief directive from Cabinet unimplemented for 45 days', severity: 'Critical', owner: 'Revenue', due: 'Immediate' },
  { title: 'UDD and Revenue together hold 40% of all overdue action items', severity: 'High', owner: 'Chief Secretary Office', due: 'This week' },
  { title: '6 departments have not responded to second follow-up letters', severity: 'Medium', owner: 'GAD Desk Officer', due: '12 Jul 2026' },
]

const STATUS_STYLE: Record<ActionStatus, string> = {
  Open: 'border-sky-200 bg-sky-50 text-sky-700',
  'In Progress': 'border-amber-200 bg-amber-50 text-amber-700',
  Closed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Overdue: 'border-red-200 bg-red-50 text-red-700',
}

const ALL_STATUSES: ActionStatus[] = ['Open', 'In Progress', 'Closed', 'Overdue']

function StatusChip({ status }: { status: ActionStatus }) {
  return <span className={cn('whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold', STATUS_STYLE[status])}>{status}</span>
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function MeetingIntelligence() {
  const [statusFilter, setStatusFilter] = useState<'all' | ActionStatus>('all')
  const [dept, setDept] = useState('all')
  const [momOpen, setMomOpen] = useState(false)
  const [simulated, setSimulated] = useState<Record<string, boolean>>({})

  const statusCounts = useMemo(() => {
    const c: Record<ActionStatus, number> = { Open: 0, 'In Progress': 0, Closed: 0, Overdue: 0 }
    TRACKER_ROWS.forEach((r) => { c[r.status] += 1 })
    return c
  }, [])

  const filteredRows = useMemo(() => TRACKER_ROWS.filter((r) =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (dept === 'all' || r.deptCode === dept),
  ), [statusFilter, dept])

  const overdueChart = useMemo(
    () => (dept === 'all' ? OVERDUE_BY_DEPT : OVERDUE_BY_DEPT.filter((d) => d.code === dept)),
    [dept],
  )

  const runDemo = (key: string) => {
    setSimulated((s) => ({ ...s, [key]: true }))
    if (key === 'mom') setMomOpen(true)
  }

  const columns: Column<MeetingActionRow>[] = [
    { key: 'meeting', header: 'Meeting', sortable: true, className: 'min-w-[200px]', render: (r) => (
      <div>
        <div className="font-medium text-ink-800">{r.meeting}</div>
        <div className="mt-0.5 text-[11px] text-ink-500">{r.dept}</div>
      </div>
    )},
    { key: 'date', header: 'Date', sortable: true, className: 'whitespace-nowrap' },
    { key: 'chair', header: 'Chairperson', className: 'whitespace-nowrap' },
    { key: 'decision', header: 'Decision', className: 'min-w-[200px] text-ink-700' },
    { key: 'actionItem', header: 'Action Item', className: 'min-w-[200px] text-ink-700' },
    { key: 'owner', header: 'Owner', className: 'whitespace-nowrap' },
    { key: 'deadline', header: 'Deadline', sortable: true, className: 'whitespace-nowrap' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusChip status={r.status} /> },
    { key: 'confidence', header: 'AI Confidence', sortable: true, render: (r) => <TierBadge score={r.confidence} /> },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Meeting Intelligence"
        subtitle="Convert government meetings into decisions, action items, responsibilities, timelines, follow-ups and closure tracking."
        icon={<MessagesSquare className="h-5 w-5" />}
        confidence={88}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Meetings Tracked" value={214} delta={9.2} icon={<MessagesSquare className="h-5 w-5" />} hint="FY 2026-27 · state + district level" confidence={94} />
        <MetricCard label="Action Items Created" value="1,462" delta={12.8} icon={<ClipboardList className="h-5 w-5" />} hint="Extracted from meeting records" confidence={91} />
        <MetricCard label="Open Action Items" value={318} delta={-4.6} icon={<ListChecks className="h-5 w-5" />} hint="Awaiting closure by owners" confidence={92} />
        <MetricCard label="Overdue Actions" value={74} delta={-8.1} icon={<AlertOctagon className="h-5 w-5" />} hint="Past committed deadline" confidence={93} />
        <MetricCard label="Decisions Captured" value={486} delta={10.4} icon={<Gavel className="h-5 w-5" />} hint="With source-paragraph traceability" confidence={90} />
        <MetricCard label="MOMs Generated" value={198} delta={15.2} icon={<FileCheck2 className="h-5 w-5" />} hint="AI-drafted, chair-approved" confidence={92} />
        <MetricCard label="Follow-up Compliance" value="82%" delta={3.4} icon={<MailCheck className="h-5 w-5" />} hint="Responses received within SLA" confidence={89} />
        <MetricCard label="Depts Pending Response" value={6} delta={-14.3} icon={<Building2 className="h-5 w-5" />} hint="Second reminder issued" confidence={91} />
      </div>

      {/* Workflow feature strip */}
      <Card className="mt-6">
        <CardHeader
          title="Meeting-to-closure workflow"
          subtitle="Six AI-assisted steps — every output requires human approval before issue"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {WORKFLOW_STEPS.map((s, i) => (
            <div key={s.key} className="group relative overflow-hidden rounded-xl border border-ink-100 p-3.5 transition hover:border-brand-200 hover:shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">{s.icon}</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Step {i + 1}</div>
                  <div className="text-sm font-semibold text-ink-800">{s.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.desc}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => runDemo(s.key)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100"
                >
                  <Play className="h-3 w-3" /> Run demo
                </button>
                {simulated[s.key] && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <Check className="h-3 w-3" /> Simulated
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Inline MOM demo result */}
        <AnimatePresence>
          {momOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50/60 to-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-gradient text-white"><Sparkles className="h-3 w-3" /></span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">AI-drafted MOM excerpt</span>
                  <TierBadge score={91} />
                  <button onClick={() => setMomOpen(false)} className="ml-auto text-[11px] font-medium text-ink-400 transition hover:text-ink-600">Dismiss</button>
                </div>
                <ul className="space-y-1.5 text-[13px] leading-relaxed text-ink-700">
                  <li><span className="font-semibold text-ink-800">Meeting:</span> District Collectors&rsquo; video conference on monsoon preparedness, chaired by the Chief Secretary — 12 Jun 2026, 11:00 hrs.</li>
                  <li><span className="font-semibold text-ink-800">Decision 1:</span> District flood control rooms to operate 24x7 from 15 June; daily situation report to Revenue (Relief &amp; Rehabilitation) by 18:00 hrs.</li>
                  <li><span className="font-semibold text-ink-800">Action:</span> All Collectors to complete pre-monsoon nalla and drain desilting verification by 20 June — owner: District Collector.</li>
                  <li><span className="font-semibold text-ink-800">Follow-up:</span> Divisional Commissioners to confirm NDRF/SDRF pre-positioning for 9 flood-prone districts by 18 June.</li>
                </ul>
                <div className="mt-2.5 text-[11px] text-ink-500">Draft only — requires chairperson approval before circulation. Source: uploaded meeting notes (traceable).</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Tracker filters + table */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="section-title text-ink-800">Meeting action tracker</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
                statusFilter === 'all' ? 'border-brand-300 bg-brand-soft text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200',
              )}
            >
              All · {TRACKER_ROWS.length}
            </button>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
                  statusFilter === s ? STATUS_STYLE[s] : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200',
                )}
              >
                {s} · {statusCounts[s]}
              </button>
            ))}
            <DepartmentFilter value={dept} onChange={setDept} />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['meeting', 'decision', 'actionItem', 'owner', 'dept', 'chair']}
          emptyText="No action items match the selected filters"
          actions={<SourceBadge source="Demo" />}
        />
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Overdue actions by department"
          subtitle="74 overdue action items · past committed deadline"
          right={<span className="chip border border-red-200 bg-red-50 text-red-700"><AlertOctagon className="h-3 w-3" /> Escalation due</span>}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overdueChart} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: any) => [v, 'Overdue actions']}
                labelFormatter={(code: any) => OVERDUE_BY_DEPT.find((d) => d.code === code)?.dept ?? code}
              />
              <Bar dataKey="overdue" radius={[4, 4, 0, 0]}>
                {overdueChart.map((d) => (
                  <Cell key={d.code} fill={d.overdue >= 12 ? '#EA4335' : d.overdue >= 7 ? '#FBBC05' : '#0B57D0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Department-wise follow-up compliance"
            subtitle="Share of follow-up letters answered within the response SLA"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2.5">
            {FOLLOWUP_COMPLIANCE.map((d) => (
              <li key={d.code}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-700">{d.dept}</span>
                  <span className={cn('font-semibold', d.compliance >= 85 ? 'text-emerald-600' : d.compliance >= 78 ? 'text-ink-600' : 'text-red-600')}>{d.compliance}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded bg-ink-100">
                  <div
                    className={cn('h-full rounded', d.compliance >= 85 ? 'bg-emerald-500' : d.compliance >= 78 ? 'bg-brand-gradient' : 'bg-red-500')}
                    style={{ width: `${d.compliance}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Meeting outcome score"
            subtitle="Composite of decision capture, assignment speed and closure rate"
            right={<SourceBadge source="Demo" />}
          />
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold text-ink-900">78</span>
                <span className="text-lg font-medium text-ink-400">/ 100</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <TrendBadge delta={2.6} />
                <span className="text-xs text-ink-500">vs last month</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                <TrendingUp className="h-3 w-3" /> Improving for 5 consecutive months
              </div>
            </div>
            <div className="h-36 min-w-[220px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={OUTCOME_TREND} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[65, 85]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: any) => [v, 'Outcome score']} />
                  <Line type="monotone" dataKey="score" stroke="#0B57D0" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="MOM generation status"
            subtitle="214 meetings tracked · 198 minutes generated, 16 pending"
            right={<span className="chip border border-brand-200 bg-brand-50 text-brand-700"><CalendarClock className="h-3 w-3" /> Avg 22 min turnaround</span>}
          />
          <div className="flex flex-wrap items-center gap-6">
            <div className="h-44 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOM_STATUS} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={3} strokeWidth={2} stroke="#ffffff">
                    {MOM_STATUS.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="min-w-[180px] flex-1 space-y-2.5">
              {MOM_STATUS.map((s) => (
                <li key={s.name} className="flex items-center gap-2.5 rounded-lg border border-ink-100 p-2.5 text-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="flex-1 text-ink-700">{s.name}</span>
                  <span className="font-semibold text-ink-900">{s.value}</span>
                  <span className="text-xs text-ink-500">{Math.round((s.value / 214) * 100)}%</span>
                </li>
              ))}
              <li className="rounded-lg bg-ink-50 p-2.5 text-[11px] leading-relaxed text-ink-600">
                Pending MOMs are meetings awaiting note upload or chairperson approval of the AI draft.
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>
    </div>
  )
}
