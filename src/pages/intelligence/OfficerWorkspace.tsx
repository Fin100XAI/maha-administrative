import { FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserCheck, FileText, CheckCircle2, AlarmClock, Sparkles, Timer, ShieldAlert,
  CalendarClock, Users, FilePlus2, FileSearch, PenLine, Languages, ArrowUpRight,
  BadgeCheck, ScrollText, ClipboardList, Search, RefreshCw, ArrowRight, Bell,
  Undo2, BookOpen, BarChart3, MessageSquareWarning,
} from 'lucide-react'
import {
  IntelligencePageHeader, AIRecommendationPanel, SeverityBadge, TierBadge,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Demo persona data — Desk Officer, GAD                               */
/* ------------------------------------------------------------------ */

const BRIEFS = [
  'Good morning. You have 23 pending files, of which file GAD/2026/0412 (office modernisation concurrence) is 2 days from SLA breach — an AI-drafted note is ready for your review. 6 approvals are waiting on you today, including 2 transfer endorsements that can be batch-processed. Your 15:00 review meeting with the Under Secretary has no MOM template attached — generate one before the meeting. Two citizen grievances assigned to you appear to be duplicates and can be merged.',
  'Updated brief. Priority remains file GAD/2026/0412 — SLA breach in 2 days; the draft concurrence note awaits your edits. Of your 6 pending approvals, the 4 shown below are due before 17:00. The 15:00 Sachivalaya review meeting still needs a MOM template; agenda points have been pre-filled from last week\'s minutes. RTI reply GAD/RTI/1187 is on track but should move to the Under Secretary desk today to stay within the 30-day timeline.',
]

interface BoardTask {
  id: string
  title: string
  type: string
  due: string
  severity: RiskLevel
  col: 0 | 1 | 2
}

const INITIAL_TASKS: BoardTask[] = [
  { id: 't1', title: 'Review AI-drafted concurrence note — file GAD/2026/0412', type: 'File note', due: 'Today 13:00', severity: 'High', col: 0 },
  { id: 't2', title: 'Endorse transfer list annexure (42 Desk Officers)', type: 'Approval', due: 'Today 16:00', severity: 'Medium', col: 0 },
  { id: 't3', title: 'Prepare MOM template — 15:00 review meeting', type: 'Meeting', due: 'Today 14:30', severity: 'High', col: 0 },
  { id: 't4', title: 'Finalise RTI reply GAD/RTI/1187 (severed annexure)', type: 'RTI', due: 'Today 17:00', severity: 'Medium', col: 0 },
  { id: 't5', title: 'Draft reminder to Divisional Commissioners — Seva Pandharwada', type: 'Letter', due: 'Wed 09 Jul', severity: 'Medium', col: 1 },
  { id: 't6', title: 'Compile audit para 3.2 compliance annexure', type: 'Audit', due: 'Thu 10 Jul', severity: 'Medium', col: 1 },
  { id: 't7', title: 'Verify seniority records flagged by HR AI Officer (3 cases)', type: 'HR', due: 'Fri 11 Jul', severity: 'Low', col: 1 },
  { id: 't8', title: 'Marathi translation vetting — GR Misc-2026/C.R.112', type: 'Translation', due: 'Fri 11 Jul', severity: 'Low', col: 1 },
  { id: 't9', title: 'Comments from Finance Dept — modernisation proposal', type: 'Inter-dept', due: 'Awaiting 5 days', severity: 'High', col: 2 },
  { id: 't10', title: 'Law & Judiciary opinion — WP 2841/2026 reply', type: 'Legal', due: 'Awaiting 3 days', severity: 'Medium', col: 2 },
  { id: 't11', title: 'Collectorate Nashik — district action plan inputs', type: 'District', due: 'Awaiting 2 days', severity: 'Low', col: 2 },
]

const COLUMNS = ['Today', 'This Week', 'Waiting on Others'] as const

interface PendingFile {
  id: string
  subject: string
  stage: string
  days: number
  slaDays: number
}

const PENDING_FILES: PendingFile[] = [
  { id: 'GAD/2026/0412', subject: 'Office modernisation — financial concurrence', stage: 'Desk Officer', days: 13, slaDays: 15 },
  { id: 'GAD/2026/0398', subject: 'Transfer list annexure — general transfers 2026', stage: 'Under Secretary', days: 17, slaDays: 15 },
  { id: 'GAD/RTI/1187', subject: 'RTI — file notings on transfer order', stage: 'Desk Officer', days: 24, slaDays: 30 },
  { id: 'GAD/2026/0431', subject: 'Seva Pandharwada 2026 — district action plans', stage: 'Section Officer', days: 6, slaDays: 15 },
  { id: 'GAD/AUD/0088', subject: 'AG audit para 3.2 — compliance reply', stage: 'Desk Officer', days: 31, slaDays: 30 },
  { id: 'GAD/2026/0405', subject: 'Cabinet decision follow-up — drought relief actions', stage: 'Deputy Secretary', days: 12, slaDays: 15 },
]

function slaStatus(f: PendingFile): 'Breached' | 'At risk' | 'On track' {
  if (f.days >= f.slaDays) return 'Breached'
  if (f.slaDays - f.days <= 3) return 'At risk'
  return 'On track'
}

interface ApprovalRow {
  id: string
  title: string
  from: string
  due: string
}

const APPROVALS: ApprovalRow[] = [
  { id: 'a1', title: 'Concurrence note — file GAD/2026/0412 (AI draft, confidence 91%)', from: 'Finance AI Officer', due: 'Today 13:00' },
  { id: 'a2', title: 'Transfer endorsement — Desk Officer batch 1 (21 names)', from: 'HR AI Officer', due: 'Today 16:00' },
  { id: 'a3', title: 'Transfer endorsement — Desk Officer batch 2 (21 names)', from: 'HR AI Officer', due: 'Today 16:00' },
  { id: 'a4', title: 'RTI reply GAD/RTI/1187 — severed annexure version', from: 'RTI AI Officer', due: 'Today 17:00' },
]

const QUICK_ACTIONS: { label: string; icon: JSX.Element; to?: string }[] = [
  { label: 'Generate note', icon: <PenLine className="h-4 w-4" />, to: '/note-drafting' },
  { label: 'Summarize file', icon: <FileSearch className="h-4 w-4" />, to: '/file-summarization' },
  { label: 'Draft reply', icon: <FilePlus2 className="h-4 w-4" />, to: '/letter-drafting' },
  { label: 'Translate', icon: <Languages className="h-4 w-4" />, to: '/translation' },
  { label: 'Escalate', icon: <ArrowUpRight className="h-4 w-4" /> },
  { label: 'Request approval', icon: <BadgeCheck className="h-4 w-4" /> },
  { label: 'Search GR', icon: <ScrollText className="h-4 w-4" />, to: '/gr-repo' },
  { label: 'Create meeting MOM', icon: <ClipboardList className="h-4 w-4" /> },
]

const MEETINGS = [
  { time: '11:30', title: 'Section coordination — weekly file review', agenda: 'Pending files above 10 days · RTI queue · audit para status', room: 'Mantralaya Annexe, Room 512' },
  { time: '15:00', title: 'Review with Under Secretary (GAD)', agenda: 'Modernisation concurrence · transfer list endorsement · MOM pending from last review', room: 'Mantralaya Main, 6th floor' },
]

const ACTION_ITEMS = [
  { title: 'Send draft direction notes to Collectorate Nashik', owner: 'Self', due: '08 Jul', status: 'Open' },
  { title: 'Confirm venue for Seva Pandharwada kickoff', owner: 'Section Officer', due: '09 Jul', status: 'Open' },
  { title: 'Upload signed audit reply to compliance register', owner: 'Self', due: '10 Jul', status: 'In progress' },
  { title: 'Share MOM of 30 Jun review with all sections', owner: 'Self', due: 'Overdue 2 days', status: 'Overdue' },
]

const MY_ALERTS: { text: string; severity: RiskLevel }[] = [
  { text: 'File GAD/AUD/0088 breached its 30-day SLA yesterday.', severity: 'High' },
  { text: 'Approval queue will exceed 6 items if batch 1 and 2 are not cleared today.', severity: 'Medium' },
  { text: 'DPDP retention flag on 2 closed grievance records in your custody.', severity: 'Low' },
]

const RECENT_GRS = [
  { title: 'GR — Seva Pandharwada 2026 guidelines', date: '12 Jun 2026' },
  { title: 'Circular — BEAMS Q1 expenditure review calendar', date: '20 Jun 2026' },
  { title: 'GR — General transfers 2026 modalities', date: '28 Jun 2026' },
  { title: 'Circular — DPDP data handling instructions for Mantralaya desks', date: '02 Jul 2026' },
]

const DEPT_KPIS = [
  { label: 'GAD SLA compliance', value: '87%' },
  { label: 'Avg file disposal', value: '7.8 days' },
  { label: 'Pending > 15 days', value: '64 files' },
  { label: 'AI adoption (GAD)', value: '76%' },
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function OfficerWorkspace() {
  const navigate = useNavigate()
  const [briefIdx, setBriefIdx] = useState(0)
  const [tasks, setTasks] = useState<BoardTask[]>(INITIAL_TASKS)
  const [approvalState, setApprovalState] = useState<Record<string, 'Approved' | 'Returned'>>({})
  const [highlightOverdue, setHighlightOverdue] = useState(false)
  const [query, setQuery] = useState('')

  const moveTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id && t.col < 2 ? { ...t, col: (t.col + 1) as 0 | 1 | 2 } : t)))

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/officer-search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  const decidedCount = useMemo(() => Object.keys(approvalState).length, [approvalState])

  return (
    <div>
      <IntelligencePageHeader
        title="Officer Workspace"
        subtitle="Personal command centre for Shri A. R. Deshmukh, Desk Officer, General Administration Department (GAD), Mantralaya."
        icon={<UserCheck className="h-5 w-5" />}
        confidence={87}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Pending Files" value={23} icon={<FileText className="h-5 w-5" />} source="Demo" hint="6 highest-risk shown below" />
        <MetricCard label="Approvals Due Today" value={6} icon={<CheckCircle2 className="h-5 w-5" />} source="Demo" hint={`${decidedCount} of 4 shown actioned`} />
        <div
          role="button"
          tabIndex={0}
          onClick={() => setHighlightOverdue((v) => !v)}
          onKeyDown={(e) => { if (e.key === 'Enter') setHighlightOverdue((v) => !v) }}
          className={cn('cursor-pointer rounded-2xl transition', highlightOverdue && 'ring-2 ring-red-300')}
          title="Click to highlight overdue items"
        >
          <MetricCard label="Overdue Tasks" value={4} icon={<AlarmClock className="h-5 w-5" />} source="Demo" hint={highlightOverdue ? 'Highlighting overdue rows' : 'Click to highlight overdue rows'} />
        </div>
        <MetricCard label="Drafts Generated" value={18} icon={<Sparkles className="h-5 w-5" />} delta={12.5} source="Demo" hint="By AI officers this week" />
        <MetricCard label="AI Time Saved" value="6.2 hrs" icon={<Timer className="h-5 w-5" />} delta={8.4} source="Demo" hint="This week" />
        <MetricCard label="SLA Risk Items" value={3} icon={<ShieldAlert className="h-5 w-5" />} source="Demo" hint="At-risk files in your queue" />
        <MetricCard label="Meetings Today" value={2} icon={<CalendarClock className="h-5 w-5" />} source="Demo" hint="11:30 and 15:00" />
        <MetricCard label="Citizen Issues Assigned" value={5} icon={<Users className="h-5 w-5" />} source="Demo" hint="2 flagged as duplicates" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* -------------------- Left / main column -------------------- */}
        <div className="space-y-6 xl:col-span-2">
          {/* AI daily brief */}
          <Card>
            <CardHeader
              title={
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Sparkles className="h-3.5 w-3.5" /></span>
                  AI daily brief
                </span>
              }
              subtitle="Monday, 07 July 2026 · generated 09:05 IST from your file queue, approvals and calendar"
              right={
                <div className="flex items-center gap-2">
                  <TierBadge score={89} />
                  <button
                    onClick={() => setBriefIdx((i) => (i + 1) % BRIEFS.length)}
                    className="header-btn-outline !px-3 !py-1.5 !text-xs"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                </div>
              }
            />
            <motion.p
              key={briefIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-4 text-sm leading-relaxed text-ink-700"
            >
              {BRIEFS[briefIdx]}
            </motion.p>
          </Card>

          {/* Task priority board */}
          <Card>
            <CardHeader
              title="Task priority board"
              subtitle="Move a task forward as its state changes — Today → This Week → Waiting on Others"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {COLUMNS.map((col, ci) => (
                <div key={col} className="rounded-xl border border-ink-100 bg-ink-50/40 p-2.5">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="label !mb-0">{col}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-500 ring-1 ring-ink-100">
                      {tasks.filter((t) => t.col === ci).length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter((t) => t.col === ci).map((t) => {
                      const overdue = t.due.startsWith('Overdue') || t.id === 't3' || t.id === 't1'
                      return (
                        <motion.div
                          key={t.id}
                          layout
                          className={cn(
                            'rounded-lg border border-ink-100 bg-white p-3 shadow-sm',
                            highlightOverdue && overdue && ci === 0 && 'border-red-200 bg-red-50/60',
                          )}
                        >
                          <div className="text-xs font-semibold leading-snug text-ink-800">{t.title}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full border border-brand-200 bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand-700">{t.type}</span>
                            <SeverityBadge level={t.severity} />
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-500">
                              <AlarmClock className="h-3 w-3" /> {t.due}
                            </span>
                            {t.col < 2 && (
                              <button
                                onClick={() => moveTask(t.id)}
                                className="inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-600 transition hover:border-brand-200 hover:text-brand-700"
                                title={`Move to ${COLUMNS[t.col + 1]}`}
                              >
                                Move <ArrowRight className="h-2.5 w-2.5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* My pending files */}
          <Card className="!p-0 overflow-hidden">
            <CardHeader
              className="!mb-0 border-b border-ink-100 p-4 sm:p-5"
              title="My pending files"
              subtitle="6 highest-risk of 23 pending · SLA status computed from stage timelines"
              right={highlightOverdue ? <span className="chip border border-red-200 bg-red-50 text-red-700"><AlarmClock className="h-3 w-3" /> Overdue highlighted</span> : undefined}
            />
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr>
                    {['File ID', 'Subject', 'Stage', 'Days', 'SLA status'].map((h) => <th key={h} className="table-th">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PENDING_FILES.map((f) => {
                    const st = slaStatus(f)
                    return (
                      <tr
                        key={f.id}
                        className={cn(
                          'hover:bg-ink-50/40',
                          highlightOverdue && st === 'Breached' && 'bg-red-50/70',
                          highlightOverdue && st === 'At risk' && 'bg-amber-50/60',
                        )}
                      >
                        <td className="table-td font-mono text-xs text-ink-600">{f.id}</td>
                        <td className="table-td text-ink-800">{f.subject}</td>
                        <td className="table-td text-ink-600">{f.stage}</td>
                        <td className="table-td font-medium">{f.days} / {f.slaDays}</td>
                        <td className="table-td">
                          <span className={cn('chip border', {
                            'border-red-200 bg-red-50 text-red-700': st === 'Breached',
                            'border-amber-200 bg-amber-50 text-amber-700': st === 'At risk',
                            'border-emerald-200 bg-emerald-50 text-emerald-700': st === 'On track',
                          })}>
                            {st}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* My approvals */}
          <Card>
            <CardHeader
              title="My approvals"
              subtitle="4 of 6 due today shown · every decision is audit-logged"
              right={<span className="chip border border-sky-200 bg-sky-50 text-sky-700"><UserCheck className="h-3 w-3" /> Human-in-the-loop</span>}
            />
            <ul className="space-y-2">
              {APPROVALS.map((a) => {
                const decided = approvalState[a.id]
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-ink-100 bg-white p-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-800">{a.title}</div>
                      <div className="mt-0.5 text-[11px] text-ink-500">From {a.from} · due {a.due}</div>
                    </div>
                    {decided ? (
                      <span className={cn('chip border', decided === 'Approved'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700')}>
                        {decided === 'Approved' ? <CheckCircle2 className="h-3 w-3" /> : <Undo2 className="h-3 w-3" />}
                        {decided}
                      </span>
                    ) : (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => setApprovalState((s) => ({ ...s, [a.id]: 'Approved' }))}
                          className="rounded-md bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition hover:opacity-90"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setApprovalState((s) => ({ ...s, [a.id]: 'Returned' }))}
                          className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-amber-300 hover:text-amber-700"
                        >
                          Send back
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader title="Quick actions" subtitle="One-tap AI assistance for daily desk work" />
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {QUICK_ACTIONS.map((q) => {
                const inner = (
                  <>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-600 ring-1 ring-brand-100 transition group-hover:bg-brand-gradient group-hover:text-white">
                      {q.icon}
                    </span>
                    <span className="text-xs font-semibold text-ink-700">{q.label}</span>
                  </>
                )
                const cls = 'group flex flex-col items-center gap-2 rounded-xl border border-ink-100 bg-white p-3 text-center transition hover:border-brand-200 hover:shadow-md'
                return q.to
                  ? <Link key={q.label} to={q.to} className={cls}>{inner}</Link>
                  : <button key={q.label} type="button" className={cls}>{inner}</button>
              })}
            </div>
          </Card>

          {/* Personal AI recommendations */}
          <AIRecommendationPanel
            title="AI recommendations for you"
            recommendations={[
              { text: 'File GAD/2026/0412 is 2 days from SLA breach — draft note ready.', confidence: 91, action: 'Open draft' },
              { text: '6 approvals can be batch-processed.', confidence: 88, action: 'Batch' },
              { text: 'Meeting at 15:00 has no MOM template — generate now.', confidence: 90, action: 'Generate' },
              { text: '2 citizen issues assigned to you are duplicates.', confidence: 86, action: 'Merge' },
            ]}
          />
        </div>

        {/* -------------------- Right column -------------------- */}
        <div className="space-y-6">
          {/* My meetings */}
          <Card>
            <CardHeader title="My meetings" subtitle="Today · 07 Jul 2026" right={<CalendarClock className="h-4 w-4 text-ink-400" />} />
            <ul className="space-y-2.5">
              {MEETINGS.map((m) => (
                <li key={m.time} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-brand-gradient px-2 py-1 text-xs font-bold text-white shadow-glow">{m.time}</span>
                    <span className="min-w-0 text-sm font-semibold text-ink-800">{m.title}</span>
                  </div>
                  <div className="mt-1.5 text-xs leading-relaxed text-ink-500">{m.agenda}</div>
                  <div className="mt-1 text-[10.5px] font-medium text-ink-400">{m.room}</div>
                </li>
              ))}
            </ul>
          </Card>

          {/* My action items */}
          <Card>
            <CardHeader title="My action items" right={<ClipboardList className="h-4 w-4 text-ink-400" />} />
            <ul className="space-y-2">
              {ACTION_ITEMS.map((a) => (
                <li
                  key={a.title}
                  className={cn(
                    'rounded-lg border border-ink-100 p-2.5',
                    highlightOverdue && a.status === 'Overdue' && 'border-red-200 bg-red-50/70',
                  )}
                >
                  <div className="text-xs font-semibold text-ink-800">{a.title}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-ink-500">
                    <span>Owner: {a.owner}</span>
                    <span>·</span>
                    <span>{a.due}</span>
                    <span className={cn('ml-auto rounded-full border px-2 py-0.5 font-semibold', {
                      'border-sky-200 bg-sky-50 text-sky-700': a.status === 'Open',
                      'border-amber-200 bg-amber-50 text-amber-700': a.status === 'In progress',
                      'border-red-200 bg-red-50 text-red-700': a.status === 'Overdue',
                    })}>
                      {a.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* My alerts */}
          <Card>
            <CardHeader title="My alerts" right={<Bell className="h-4 w-4 text-ink-400" />} />
            <ul className="space-y-2">
              {MY_ALERTS.map((a) => (
                <li key={a.text} className="flex items-start gap-2.5 rounded-lg border border-ink-100 p-2.5">
                  <MessageSquareWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1 text-xs text-ink-700">{a.text}</span>
                  <SeverityBadge level={a.severity} />
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent GRs / circulars */}
          <Card>
            <CardHeader title="My recent GRs & circulars" right={<BookOpen className="h-4 w-4 text-ink-400" />} />
            <ul className="space-y-2">
              {RECENT_GRS.map((g) => (
                <li key={g.title} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 p-2.5">
                  <span className="min-w-0 text-xs font-medium text-ink-700">{g.title}</span>
                  <span className="shrink-0 rounded-md bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">{g.date}</span>
                </li>
              ))}
            </ul>
            <Link to="/gr-repo" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
              Open GR repository <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* Department KPIs */}
          <Card>
            <CardHeader title="My department KPIs" subtitle="General Administration Department" right={<BarChart3 className="h-4 w-4 text-ink-400" />} />
            <div className="grid grid-cols-2 gap-2.5">
              {DEPT_KPIS.map((k) => (
                <div key={k.label} className="rounded-xl border border-ink-100 bg-ink-50/40 p-3">
                  <div className="text-lg font-semibold text-ink-900">{k.value}</div>
                  <div className="mt-0.5 text-[10.5px] font-medium text-ink-500">{k.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Knowledge search */}
          <Card>
            <CardHeader title="My knowledge search" subtitle="Search GRs, circulars, precedents and file history" />
            <form onSubmit={onSearch} className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. transfer act tenure norms…"
                  className="input pl-9"
                />
              </div>
              <button type="submit" className="header-btn-primary shrink-0 !px-3 !py-2 !text-xs">
                Search
              </button>
            </form>
            <p className="mt-2 text-[10.5px] text-ink-400">Opens Officer Knowledge Search with source-linked answers.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
