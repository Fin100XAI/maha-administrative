import { useMemo, useState } from 'react'
import {
  Scale, CalendarClock, FileText, ClipboardCheck, Gavel,
  CheckCircle2, ShieldAlert, Timer, X,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, Cell,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel,
  SeverityBadge, DepartmentFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { RiskLevel } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data (API-replaceable)                              */
/* ------------------------------------------------------------------ */

type LegalStatus = 'Affidavit Due' | 'Compliance Pending' | 'Arguments Stage' | 'Notice Issued' | 'Reserved for Orders'
type RequiredAction = 'Affidavit' | 'Compliance report' | 'Appearance' | 'Written statement'

interface CaseRow {
  id: string
  court: string
  deptCode: string
  dept: string
  matter: string
  hearing: string
  action: RequiredAction
  risk: RiskLevel
  officer: string
  status: LegalStatus
  ai: string
  contempt: boolean
}

const CASE_ROWS: CaseRow[] = [
  { id: 'WP/2026/03911', court: 'Bombay HC Nagpur Bench', deptCode: 'WR', dept: 'Water Resources', matter: 'Contempt petition — non-payment of enhanced compensation, Gosikhurd project', hearing: '07 Jul 2026', action: 'Compliance report', risk: 'Critical', officer: 'Department Director', status: 'Compliance Pending', ai: 'Payment tranche evidence compiled; contempt exposure high.', contempt: true },
  { id: 'CC/2026/00092', court: 'Bombay HC', deptCode: 'FIN', dept: 'Finance', matter: 'Contempt — non-implementation of pay fixation order for pensioners', hearing: '07 Jul 2026', action: 'Compliance report', risk: 'Critical', officer: 'Desk Officer (Finance)', status: 'Compliance Pending', ai: 'Fixation orders issued for 82% cases; balance list annexed.', contempt: true },
  { id: 'OA/2026/0456', court: 'MAT Mumbai', deptCode: 'HFW', dept: 'Health', matter: 'Regularisation of contractual staff — MAT', hearing: '08 Jul 2026', action: 'Written statement', risk: 'High', officer: 'Section Officer (Health)', status: 'Notice Issued', ai: '2023 precedent order supports department position.', contempt: false },
  { id: 'WP/2026/04098', court: 'Bombay HC', deptCode: 'UDD', dept: 'Urban Development', matter: 'Stay on demolition of unauthorised construction — Kalyan-Dombivli', hearing: '08 Jul 2026', action: 'Affidavit', risk: 'High', officer: 'Municipal Commissioner', status: 'Affidavit Due', ai: 'Counter-affidavit outline drafted from survey records.', contempt: false },
  { id: 'CA/2026/00871', court: 'Supreme Court', deptCode: 'UDD', dept: 'Urban Development', matter: 'SLP against HC order quashing cluster redevelopment tender — Thane', hearing: '09 Jul 2026', action: 'Appearance', risk: 'Critical', officer: 'Principal Secretary', status: 'Arguments Stage', ai: 'Case brief and tender chronology prepared for AOR.', contempt: false },
  { id: 'WP/2026/02764', court: 'Bombay HC', deptCode: 'HOME', dept: 'Home', matter: 'PIL on police housing repairs — compliance of 2025 directions', hearing: '10 Jul 2026', action: 'Compliance report', risk: 'High', officer: 'Commissioner', status: 'Compliance Pending', ai: 'Works-completion certificates pending from 3 divisions.', contempt: true },
  { id: 'WP/2026/04182', court: 'Bombay HC', deptCode: 'REV', dept: 'Revenue', matter: 'Land acquisition compensation enhancement — Samruddhi Mahamarg package 7', hearing: '13 Jul 2026', action: 'Affidavit', risk: 'Critical', officer: 'District Collector', status: 'Affidavit Due', ai: 'Affidavit outline drafted; GR-2025-REV-201 linked as grounds.', contempt: false },
  { id: 'OA/2026/0510', court: 'MAT Mumbai', deptCode: 'RDD', dept: 'Rural Development', matter: 'Seniority list challenge — Gram Sevak cadre', hearing: '13 Jul 2026', action: 'Appearance', risk: 'Medium', officer: 'CEO Zilla Parishad', status: 'Arguments Stage', ai: 'Cadre seniority register digitised; parity chart ready.', contempt: false },
  { id: 'RA/2026/00218', court: 'District Court Pune', deptCode: 'REV', dept: 'Revenue', matter: 'Reference under LA Act — enhanced compensation, Pune Ring Road land pooling', hearing: '16 Jul 2026', action: 'Written statement', risk: 'Medium', officer: 'District Collector', status: 'Notice Issued', ai: 'Valuation comparables from 2024 awards attached.', contempt: false },
  { id: 'WP/2026/03547', court: 'Bombay HC Nagpur Bench', deptCode: 'AGR', dept: 'Agriculture', matter: 'PIL — crop insurance claim disbursal delay in Vidarbha districts', hearing: '21 Jul 2026', action: 'Affidavit', risk: 'Medium', officer: 'Department Director', status: 'Reserved for Orders', ai: 'District-wise disbursal status compiled from insurer MIS.', contempt: false },
]

/** Next 7 days from today (07 Jul 2026) — counts sum to 46 urgent hearings. */
const HEARING_DAYS = [
  { key: '07 Jul 2026', day: 'Tue', date: '07 Jul', count: 9, top: 'Gosikhurd contempt petition', today: true },
  { key: '08 Jul 2026', day: 'Wed', date: '08 Jul', count: 8, top: 'MAT staff regularisation', today: false },
  { key: '09 Jul 2026', day: 'Thu', date: '09 Jul', count: 7, top: 'SC SLP — cluster redevelopment', today: false },
  { key: '10 Jul 2026', day: 'Fri', date: '10 Jul', count: 10, top: 'PIL — police housing compliance', today: false },
  { key: '11 Jul 2026', day: 'Sat', date: '11 Jul', count: 0, top: 'No board', today: false },
  { key: '12 Jul 2026', day: 'Sun', date: '12 Jul', count: 0, top: 'No board', today: false },
  { key: '13 Jul 2026', day: 'Mon', date: '13 Jul', count: 12, top: 'Samruddhi land acquisition', today: false },
]

/** Department-wise active case counts — sums to 1,284. */
const CASES_BY_DEPT: { code: string; dept: string; cases: number }[] = [
  { code: 'REV', dept: 'Revenue', cases: 292 },
  { code: 'UDD', dept: 'Urban Dev.', cases: 218 },
  { code: 'HOME', dept: 'Home', cases: 176 },
  { code: 'WR', dept: 'Water Res.', cases: 141 },
  { code: 'RDD', dept: 'Rural Dev.', cases: 118 },
  { code: 'HFW', dept: 'Health', cases: 102 },
  { code: 'EDU', dept: 'Education', cases: 88 },
  { code: 'FIN', dept: 'Finance', cases: 64 },
  { code: 'TRN', dept: 'Transport', cases: 47 },
  { code: 'AGR', dept: 'Agriculture', cases: 38 },
]

const DEADLINES: { what: string; caseId: string; days: number }[] = [
  { what: 'Compliance report — Gosikhurd enhanced compensation', caseId: 'WP/2026/03911', days: 0 },
  { what: 'Compliance affidavit — pensioner pay fixation contempt', caseId: 'CC/2026/00092', days: 1 },
  { what: 'Written statement — contractual staff regularisation', caseId: 'OA/2026/0456', days: 1 },
  { what: 'Counter-affidavit — KDMC demolition stay', caseId: 'WP/2026/04098', days: 3 },
  { what: 'Affidavit — Samruddhi land acquisition enhancement', caseId: 'WP/2026/04182', days: 5 },
  { what: 'Parawise remarks to GP — police housing PIL', caseId: 'WP/2026/02764', days: 6 },
]

/** Compliance order ageing — sums to 38 pending orders. */
const COMPLIANCE_AGEING = [
  { bucket: '0–15 days', count: 14, note: 'Within response window' },
  { bucket: '16–30 days', count: 11, note: 'Escalated to HoD' },
  { bucket: '31–60 days', count: 8, note: 'Secretary review listed' },
  { bucket: '60+ days', count: 5, note: 'Contempt exposure zone' },
]

const RISK_MATRIX: { title: string; hint: string; tone: string; cases: string[] }[] = [
  { title: 'Hearing ≤ 7 days · High consequence', hint: 'Act now — senior officer sign-off today', tone: 'border-red-200 bg-red-50/70', cases: ['WP/2026/03911', 'CC/2026/00092', 'CA/2026/00871', 'WP/2026/04182'] },
  { title: 'Hearing ≤ 7 days · Standard consequence', hint: 'Prepare appearance and pleadings', tone: 'border-amber-200 bg-amber-50/70', cases: ['OA/2026/0456', 'WP/2026/04098', 'OA/2026/0510'] },
  { title: 'Hearing later · High consequence', hint: 'Monitor closely — brief GP in advance', tone: 'border-orange-200 bg-orange-50/60', cases: ['WP/2026/02764', 'RA/2026/00218'] },
  { title: 'Hearing later · Standard consequence', hint: 'Routine track via legal cell', tone: 'border-emerald-200 bg-emerald-50/60', cases: ['WP/2026/03547'] },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Summarize case files for 8 urgent hearings.', confidence: 90, action: 'Summarize' },
  { text: 'Affidavit due in WP/2026/04182 within 5 days — outline drafted.', confidence: 88, action: 'Open draft' },
  { text: 'Contempt risk flagged in 2 compliance matters.', confidence: 87, action: 'Review' },
  { text: 'Relevant GR-2025-REV-201 linked to land acquisition matters.', confidence: 91, action: 'View GR' },
  { text: 'Precedent order of 2023 available for service matter defence.', confidence: 86, action: 'Attach' },
]

const ALERTS: RiskAlert[] = [
  { title: 'Contempt exposure in Gosikhurd compensation matter — hearing listed today', severity: 'Critical', owner: 'Secretary (WR)', due: 'Today' },
  { title: 'Compliance order in pensioner pay fixation overdue by 12 days', severity: 'Critical', owner: 'Desk Officer (Finance)', due: 'Overdue' },
  { title: 'Affidavit for Samruddhi land acquisition due in 5 days', severity: 'High', owner: 'District Collector', due: '12 Jul' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS_CHIP: Record<LegalStatus, string> = {
  'Affidavit Due': 'bg-amber-50 text-amber-700 border-amber-200',
  'Compliance Pending': 'bg-red-50 text-red-700 border-red-200',
  'Arguments Stage': 'bg-sky-50 text-sky-700 border-sky-200',
  'Notice Issued': 'bg-brand-50 text-brand-700 border-brand-200',
  'Reserved for Orders': 'bg-ink-100 text-ink-600 border-ink-200',
}

const BRAND = '#0B57D0'
const BRAND_DIM = '#C7D7F4'
const TOOLTIP_STYLE = { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 } as const

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function CourtCaseIntelligence() {
  const [dept, setDept] = useState('all')
  const [day, setDay] = useState<string | 'all'>('all')
  const [contemptOnly, setContemptOnly] = useState(false)

  const filteredRows = useMemo(
    () => CASE_ROWS.filter((r) =>
      (dept === 'all' || r.deptCode === dept)
      && (day === 'all' || r.hearing === day)
      && (!contemptOnly || r.contempt),
    ),
    [dept, day, contemptOnly],
  )

  const columns: Column<CaseRow>[] = [
    { key: 'id', header: 'Case ID', sortable: true, render: (r) => (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-700">
        {r.id}
        {r.contempt && <span title="Contempt risk"><Gavel className="h-3 w-3 text-red-500" /></span>}
      </span>
    )},
    { key: 'court', header: 'Court', sortable: true },
    { key: 'dept', header: 'Department', sortable: true },
    { key: 'matter', header: 'Matter', className: 'min-w-[260px]', render: (r) => <span className="text-ink-800">{r.matter}</span> },
    { key: 'hearing', header: 'Next Hearing', sortable: true },
    { key: 'action', header: 'Required Action' },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => <SeverityBadge level={r.risk} /> },
    { key: 'officer', header: 'Responsible Officer' },
    { key: 'status', header: 'Legal Status', render: (r) => <span className={cn('chip border', STATUS_CHIP[r.status])}>{r.status}</span> },
    { key: 'ai', header: 'AI Summary', className: 'min-w-[220px]', render: (r) => <span className="text-xs text-ink-600">{r.ai}</span> },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Court Case Intelligence"
        subtitle="Litigation involving departments — hearings, affidavits, compliance orders, contempt risk and legal dependencies."
        icon={<Scale className="h-5 w-5" />}
        confidence={86}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active Cases" value="1,284" icon={<Scale className="h-5 w-5" />} delta={2.1} hint="All courts · all departments" confidence={92} />
        <MetricCard label="Urgent Hearings (7 days)" value="46" icon={<CalendarClock className="h-5 w-5" />} delta={8.4} hint="Listed 07–13 Jul 2026" confidence={90} />
        <MetricCard label="Affidavits Pending" value="92" icon={<FileText className="h-5 w-5" />} delta={-4.7} hint="Drafting or filing stage" confidence={89} />
        <MetricCard label="Compliance Orders Pending" value="38" icon={<ClipboardCheck className="h-5 w-5" />} delta={-6.2} hint="Court directions awaiting action" confidence={88} />
        <MetricCard label="Contempt Risk Cases" value="11" icon={<Gavel className="h-5 w-5" />} delta={-8.3} hint="Non-compliance beyond deadline" confidence={87} />
        <MetricCard label="Cases Closed (FY)" value="312" icon={<CheckCircle2 className="h-5 w-5" />} delta={11.6} hint="Disposed / withdrawn / settled" confidence={91} />
        <MetricCard label="Department Legal Risk" value="Medium" icon={<ShieldAlert className="h-5 w-5" />} hint="Composite of exposure and ageing" confidence={86} />
        <MetricCard label="Average Response Time" value="9.4 days" icon={<Timer className="h-5 w-5" />} delta={-12.1} hint="Court direction to department action" confidence={89} accent="brand" />
      </div>

      {/* Hearing calendar */}
      <Card className="mt-6">
        <CardHeader
          title="Upcoming hearing calendar"
          subtitle="Next 7 days · click a day to filter the case register below"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {HEARING_DAYS.map((d) => {
            const active = day === d.key
            const noBoard = d.count === 0
            return (
              <button
                key={d.key}
                disabled={noBoard}
                onClick={() => setDay(active ? 'all' : d.key)}
                className={cn(
                  'rounded-xl border p-3 text-left transition-all',
                  noBoard
                    ? 'cursor-default border-dashed border-ink-200 bg-ink-50/40'
                    : active
                      ? 'border-brand-300 bg-brand-50 shadow-sm ring-1 ring-brand-200'
                      : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-brand-50/40',
                  d.today && !noBoard && 'ring-1 ring-brand-300',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-[11px] font-semibold uppercase tracking-wide', noBoard ? 'text-ink-400' : 'text-ink-500')}>
                    {d.day}
                  </span>
                  {d.today && <span className="rounded-full bg-brand-gradient px-1.5 py-0.5 text-[9px] font-semibold text-white">Today</span>}
                </div>
                <div className={cn('mt-0.5 text-sm font-semibold', noBoard ? 'text-ink-400' : 'text-ink-900')}>{d.date}</div>
                <div className={cn('mt-1.5 text-xl font-semibold leading-none', noBoard ? 'text-ink-300' : 'text-brand-700')}>
                  {noBoard ? '—' : d.count}
                </div>
                <div className={cn('mt-1.5 line-clamp-2 text-[11px] leading-snug', noBoard ? 'text-ink-400' : 'text-ink-600')}>
                  {d.top}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Risk matrix + dept chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Case risk matrix"
            subtitle="Hearing proximity × consequence severity"
            right={<SourceBadge source="Demo" />}
          />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {RISK_MATRIX.map((q) => (
              <div key={q.title} className={cn('rounded-xl border p-3', q.tone)}>
                <div className="text-xs font-semibold text-ink-800">{q.title}</div>
                <div className="mt-0.5 text-[11px] text-ink-500">{q.hint}</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {q.cases.map((c) => (
                    <span key={c} className="rounded-md border border-white/60 bg-white/80 px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-ink-700 shadow-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ChartCard
          title="Department-wise case count"
          subtitle="Active cases per department · select a department to highlight"
          height={300}
          right={<DepartmentFilter value={dept} onChange={setDept} />}
        >
          <ResponsiveContainer>
            <BarChart data={CASES_BY_DEPT} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="dept" tick={{ fontSize: 10.5 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={0} angle={-18} textAnchor="end" height={44} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v, 'Active cases']} cursor={{ fill: 'rgba(11,87,208,0.05)' }} />
              <Bar dataKey="cases" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {CASES_BY_DEPT.map((d) => (
                  <Cell key={d.code} fill={dept === 'all' || dept === d.code ? BRAND : BRAND_DIM} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Deadline tracker + compliance ageing */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Legal deadline tracker"
            subtitle="Six nearest filing and compliance deadlines"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2">
            {DEADLINES.map((d) => {
              const urgent = d.days <= 3
              return (
                <li key={d.caseId + d.what} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-ink-100 p-2.5 text-sm">
                  <span className="min-w-0 flex-1 text-ink-800">{d.what}</span>
                  <span className="font-mono text-[11px] text-ink-500">{d.caseId}</span>
                  <span className={cn(
                    'shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                    urgent ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700',
                  )}>
                    {d.days === 0 ? 'Due today' : `${d.days} day${d.days > 1 ? 's' : ''} left`}
                  </span>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Compliance order ageing"
            subtitle="38 pending court directions by age since order date"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2.5">
            {COMPLIANCE_AGEING.map((b) => (
              <li key={b.bucket} className="rounded-lg border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-medium text-ink-800">{b.bucket}</span>
                  <span className="text-xs text-ink-500">{b.note}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${(b.count / 14) * 100}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-semibold text-ink-800">{b.count} orders</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-500">5 orders beyond 60 days carry direct contempt exposure — listed in the register below.</p>
        </Card>
      </div>

      {/* Main register */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['id', 'court', 'dept', 'matter', 'officer', 'status']}
          emptyText="No cases match the current filters"
          actions={
            <>
              {day !== 'all' && (
                <button
                  className="chip border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
                  onClick={() => setDay('all')}
                >
                  Hearing: {day} <X className="h-3 w-3" />
                </button>
              )}
              <button
                className={cn(
                  'chip border transition-colors',
                  contemptOnly
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
                )}
                onClick={() => setContemptOnly((v) => !v)}
              >
                <Gavel className="h-3 w-3" /> Contempt risk only
              </button>
              <DepartmentFilter value={dept} onChange={setDept} />
              <SourceBadge source="Demo" />
            </>
          }
        />
      </div>

      {/* AI recommendations + alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={ALERTS} />
      </div>
    </div>
  )
}
