import { useMemo, useState } from 'react'
import {
  ClipboardCheck, CalendarCheck2, CheckCircle2, AlertTriangle, Hourglass,
  Camera, MapPinned, Repeat2, Gauge, School, Stethoscope, Baby, Store,
  TrafficCone, Droplets, Building2, Factory, HeartHandshake, FileWarning,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, LineChart, Line, Cell,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel,
  SeverityBadge, DistrictFilter, Recommendation, RiskAlert,
} from '@/components/intelligence'
import { AI_DEPARTMENTS, AI_DISTRICTS, RiskLevel } from '@/data/administrativeIntelligence'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Demo data — page-specific rows (shared dimensions come from         */
/* administrativeIntelligence.ts)                                      */
/* ------------------------------------------------------------------ */

type InspectionType =
  | 'Schools' | 'Hospitals' | 'Anganwadi' | 'PDS shops' | 'Roads'
  | 'Water works' | 'Municipal services' | 'Industrial safety' | 'Welfare scheme sites'

/** Counts sum to 1,240 — matches the Inspections Scheduled KPI. */
const INSPECTION_TYPES: { type: InspectionType; count: number; icon: JSX.Element }[] = [
  { type: 'Schools', count: 262, icon: <School className="h-3.5 w-3.5" /> },
  { type: 'PDS shops', count: 189, icon: <Store className="h-3.5 w-3.5" /> },
  { type: 'Anganwadi', count: 171, icon: <Baby className="h-3.5 w-3.5" /> },
  { type: 'Hospitals', count: 148, icon: <Stethoscope className="h-3.5 w-3.5" /> },
  { type: 'Water works', count: 121, icon: <Droplets className="h-3.5 w-3.5" /> },
  { type: 'Roads', count: 116, icon: <TrafficCone className="h-3.5 w-3.5" /> },
  { type: 'Municipal services', count: 98, icon: <Building2 className="h-3.5 w-3.5" /> },
  { type: 'Welfare scheme sites', count: 71, icon: <HeartHandshake className="h-3.5 w-3.5" /> },
  { type: 'Industrial safety', count: 64, icon: <Factory className="h-3.5 w-3.5" /> },
]

interface InspectionRow {
  id: string
  type: InspectionType
  site: string
  district: string
  date: string
  findings: string
  severity: RiskLevel
  evidence: 'Uploaded' | 'Missing'
  closure: 'Open' | 'Report Filed' | 'Notice Issued' | 'Closed'
  nextAction: string
}

const INSPECTION_ROWS: InspectionRow[] = [
  { id: 'INSP/2026/0432', type: 'Schools', site: 'ZP Primary School, Karjat', district: 'Ahmednagar', date: '28 Jun 2026', findings: 'Two classrooms structurally unsafe; ramp missing', severity: 'High', evidence: 'Uploaded', closure: 'Notice Issued', nextAction: 'PWD structural audit within 15 days' },
  { id: 'INSP/2026/0451', type: 'Hospitals', site: 'Rural Hospital, Shirur', district: 'Pune', date: '30 Jun 2026', findings: 'Fire NOC expired; oxygen line audit pending', severity: 'Critical', evidence: 'Uploaded', closure: 'Open', nextAction: 'Escalate to Civil Surgeon; fire audit in 7 days' },
  { id: 'INSP/2026/0388', type: 'PDS shops', site: 'PDS Shop 114, Solapur', district: 'Solapur', date: '22 Jun 2026', findings: 'Stock register mismatch of 18% in foodgrain', severity: 'High', evidence: 'Uploaded', closure: 'Notice Issued', nextAction: 'Show-cause notice to FPS licensee' },
  { id: 'INSP/2026/0407', type: 'Anganwadi', site: 'Anganwadi Kendra 27, Hadgaon', district: 'Nanded', date: '24 Jun 2026', findings: 'THR stock short by 12 days; weighing scale defective', severity: 'Medium', evidence: 'Missing', closure: 'Report Filed', nextAction: 'Upload weighment evidence; replenish THR' },
  { id: 'INSP/2026/0463', type: 'Roads', site: 'PMGSY road, Trimbak stretch', district: 'Nashik', date: '01 Jul 2026', findings: 'Surface distress on 2.4 km; shoulder erosion', severity: 'Medium', evidence: 'Uploaded', closure: 'Closed', nextAction: 'Re-inspection after monsoon (Oct 2026)' },
  { id: 'INSP/2026/0419', type: 'Water works', site: 'JJM pipeline, Chalisgaon', district: 'Jalgaon', date: '26 Jun 2026', findings: 'Chlorination unit non-functional at head works', severity: 'High', evidence: 'Uploaded', closure: 'Notice Issued', nextAction: 'Contractor rectification within 15 days' },
  { id: 'INSP/2026/0396', type: 'Municipal services', site: 'SWM transfer station, Kalyan', district: 'Thane', date: '23 Jun 2026', findings: 'Leachate discharged untreated into open drain', severity: 'Critical', evidence: 'Uploaded', closure: 'Open', nextAction: 'MPCB reference; stop-work notice' },
  { id: 'INSP/2026/0441', type: 'Industrial safety', site: 'MIDC unit F-42, Butibori', district: 'Nagpur', date: '29 Jun 2026', findings: 'Pressure vessel test certificate lapsed', severity: 'High', evidence: 'Missing', closure: 'Report Filed', nextAction: 'Obtain evidence; issue compliance notice' },
  { id: 'INSP/2026/0374', type: 'Welfare scheme sites', site: 'Shravan Bal camp, Miraj', district: 'Sangli', date: '20 Jun 2026', findings: 'Attendance and disbursal records verified; no deviation', severity: 'Low', evidence: 'Uploaded', closure: 'Closed', nextAction: 'None — compliant' },
  { id: 'INSP/2026/0466', type: 'Schools', site: 'Model School, Achalpur', district: 'Amravati', date: '02 Jul 2026', findings: 'Mid-day meal kitchen hygiene deviation', severity: 'Medium', evidence: 'Uploaded', closure: 'Notice Issued', nextAction: 'Compliance verification within 7 days' },
]

/** Sums to 236 — matches the Non-compliance Found KPI. */
const SEVERITY_DIST: { severity: RiskLevel; count: number; color: string }[] = [
  { severity: 'Critical', count: 18, color: '#EA4335' },
  { severity: 'High', count: 64, color: '#F29900' },
  { severity: 'Medium', count: 92, color: '#FBBC05' },
  { severity: 'Low', count: 62, color: '#34A853' },
]

/** 1,082 conducted − 964 closed = 118 closure pending (matches KPI). */
const CLOSURE_FUNNEL = [
  { stage: 'Scheduled', value: 1240, hint: 'FY 2026-27 inspection calendar' },
  { stage: 'Conducted', value: 1082, hint: '87% of scheduled visits completed' },
  { stage: 'Report Filed', value: 1011, hint: 'Field report uploaded to portal' },
  { stage: 'Notice Issued', value: 978, hint: 'Compliance / closure notice served' },
  { stage: 'Closed', value: 964, hint: '118 pending closure verification' },
]

/** Ends at 57 — matches the Repeat Violations KPI. */
const REPEAT_TREND = [
  { m: 'Feb', repeats: 74 }, { m: 'Mar', repeats: 71 }, { m: 'Apr', repeats: 66 },
  { m: 'May', repeats: 63 }, { m: 'Jun', repeats: 60 }, { m: 'Jul', repeats: 57 },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Summarize inspection report for 12 pending sites.', confidence: 92, action: 'Summarize' },
  { text: 'Missing evidence detected in 9 inspections.', confidence: 90, action: 'Request evidence' },
  { text: 'Repeat non-compliance at 6 sites — recommend reinspection.', confidence: 88, action: 'Schedule visits' },
  { text: 'Generate compliance notices for 14 findings.', confidence: 87, action: 'Draft notices' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'Fire NOC expired at Rural Hospital, Shirur — occupancy risk', severity: 'Critical', owner: 'Civil Surgeon, Pune', due: 'Immediate' },
  { title: '6 sites show repeat non-compliance across 3 consecutive quarters', severity: 'High', owner: 'Divisional Commissioner', due: '10 Jul 2026' },
  { title: 'Evidence missing for 9 inspections older than 21 days', severity: 'Medium', owner: 'District Collector', due: 'This week' },
]

const CLOSURE_STYLE: Record<InspectionRow['closure'], string> = {
  Open: 'border-sky-200 bg-sky-50 text-sky-700',
  'Report Filed': 'border-brand-200 bg-brand-50 text-brand-700',
  'Notice Issued': 'border-amber-200 bg-amber-50 text-amber-700',
  Closed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

/** Derive plausible district counts from shared AI_DISTRICTS dimensions. */
const DISTRICT_ROWS = AI_DISTRICTS.map((d) => ({
  district: d.name,
  inspections: Math.round(d.grievances / 33),
  compliance: d.inspectionScore,
  repeatIssues: Math.max(1, Math.round((100 - d.inspectionScore) / 2.6)),
}))

const DEPT_INSPECTION_SCORES = [...AI_DEPARTMENTS]
  .map((d) => ({ code: d.code, dept: d.name, score: Math.round((d.score + d.sla) / 2) }))
  .sort((a, b) => b.score - a.score)

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function InspectionIntelligence() {
  const [typeFilter, setTypeFilter] = useState<'all' | InspectionType>('all')
  const [district, setDistrict] = useState('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | RiskLevel>('all')

  const filteredRows = useMemo(() => INSPECTION_ROWS.filter((r) =>
    (typeFilter === 'all' || r.type === typeFilter) &&
    (district === 'all' || r.district === district) &&
    (severityFilter === 'all' || r.severity === severityFilter),
  ), [typeFilter, district, severityFilter])

  const columns: Column<InspectionRow>[] = [
    { key: 'id', header: 'Inspection ID', sortable: true, className: 'whitespace-nowrap font-mono text-xs text-ink-600' },
    { key: 'type', header: 'Type', sortable: true, className: 'whitespace-nowrap' },
    { key: 'site', header: 'Site', className: 'min-w-[180px] font-medium text-ink-800' },
    { key: 'district', header: 'District', sortable: true, className: 'whitespace-nowrap' },
    { key: 'date', header: 'Date', sortable: true, className: 'whitespace-nowrap' },
    { key: 'findings', header: 'Findings', className: 'min-w-[220px] text-ink-700' },
    { key: 'severity', header: 'Severity', sortable: true, render: (r) => <SeverityBadge level={r.severity} /> },
    { key: 'evidence', header: 'Evidence', render: (r) => (
      <span className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold',
        r.evidence === 'Uploaded' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700',
      )}>
        <Camera className="h-2.5 w-2.5" /> {r.evidence}
      </span>
    )},
    { key: 'closure', header: 'Closure Status', sortable: true, render: (r) => (
      <span className={cn('whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold', CLOSURE_STYLE[r.closure])}>{r.closure}</span>
    )},
    { key: 'nextAction', header: 'Next Action', className: 'min-w-[200px] text-ink-700' },
  ]

  const districtColumns: Column<(typeof DISTRICT_ROWS)[number]>[] = [
    { key: 'district', header: 'District', sortable: true, className: 'whitespace-nowrap font-medium text-ink-800' },
    { key: 'inspections', header: 'Inspections Done', sortable: true, render: (r) => <span className="font-medium">{r.inspections}</span> },
    { key: 'compliance', header: 'Compliance Score', sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-24 rounded bg-ink-100">
          <div
            className={cn('h-full rounded', r.compliance >= 88 ? 'bg-emerald-500' : r.compliance >= 84 ? 'bg-brand-gradient' : 'bg-amber-500')}
            style={{ width: `${r.compliance}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-ink-700">{r.compliance}</span>
      </div>
    )},
    { key: 'repeatIssues', header: 'Repeat Issues', sortable: true, render: (r) => (
      <span className={cn(
        'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
        r.repeatIssues >= 6 ? 'border-red-200 bg-red-50 text-red-700' : r.repeatIssues >= 4 ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700',
      )}>
        {r.repeatIssues}
      </span>
    )},
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Inspection Intelligence"
        subtitle="Track field inspections, compliance visits, evidence, defects, closure status and district-level inspection performance."
        icon={<ClipboardCheck className="h-5 w-5" />}
        confidence={86}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Inspections Scheduled" value="1,240" delta={6.8} icon={<CalendarCheck2 className="h-5 w-5" />} hint="FY 2026-27 inspection calendar" confidence={93} />
        <MetricCard label="Completed" value="1,082" delta={9.4} icon={<CheckCircle2 className="h-5 w-5" />} hint="87% of scheduled visits" confidence={94} />
        <MetricCard label="Non-compliance Found" value={236} delta={-5.2} icon={<AlertTriangle className="h-5 w-5" />} hint="Across 1,082 completed visits" confidence={90} />
        <MetricCard label="Closure Pending" value={118} delta={-11.3} icon={<Hourglass className="h-5 w-5" />} hint="Awaiting compliance verification" confidence={91} />
        <MetricCard label="Evidence Uploaded" value="91%" delta={4.1} icon={<Camera className="h-5 w-5" />} hint="Geo-tagged photo / document proof" confidence={92} />
        <MetricCard label="High-Risk Sites" value={42} delta={-7.6} icon={<MapPinned className="h-5 w-5" />} hint="Critical or repeat findings" confidence={89} />
        <MetricCard label="Repeat Violations" value={57} delta={-9.5} icon={<Repeat2 className="h-5 w-5" />} hint="Same defect in consecutive visits" confidence={88} />
        <MetricCard label="District Compliance Score" value={85} delta={2.4} icon={<Gauge className="h-5 w-5" />} hint="State average · out of 100" confidence={90} />
      </div>

      {/* Inspection type chips */}
      <Card className="mt-6">
        <CardHeader
          title="Inspection types"
          subtitle="1,240 scheduled inspections — click a type to filter the inspection register"
          right={<SourceBadge source="Demo" />}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
              typeFilter === 'all' ? 'border-brand-300 bg-brand-soft text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200',
            )}
          >
            All types · 1,240
          </button>
          {INSPECTION_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => setTypeFilter(typeFilter === t.type ? 'all' : t.type)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition',
                typeFilter === t.type ? 'border-brand-300 bg-brand-soft text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200',
              )}
            >
              {t.icon} {t.type}
              <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-semibold', typeFilter === t.type ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600')}>{t.count}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Main inspection register */}
      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="section-title text-ink-800">Inspection register</span>
          {severityFilter !== 'all' && (
            <button
              onClick={() => setSeverityFilter('all')}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-600 transition hover:border-red-200"
            >
              Severity: <SeverityBadge level={severityFilter} /> ✕
            </button>
          )}
          <div className="ml-auto">
            <DistrictFilter value={district} onChange={setDistrict} />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['id', 'type', 'site', 'district', 'findings', 'nextAction']}
          emptyText="No inspections match the selected filters"
          actions={<SourceBadge source="Demo" />}
        />
      </div>

      {/* Charts row 1: severity + funnel */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Violation severity distribution"
          subtitle="236 non-compliance findings — click a bar to filter the register"
          right={<span className="chip border border-red-200 bg-red-50 text-red-700"><FileWarning className="h-3 w-3" /> 18 critical</span>}
          height={260}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEVERITY_DIST} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="severity" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: any) => [v, 'Findings']}
                cursor={{ fill: 'rgba(11, 87, 208, 0.05)' }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                className="cursor-pointer"
                onClick={(entry: any) => {
                  const sev = entry?.payload?.severity as RiskLevel | undefined
                  if (sev) setSeverityFilter((s) => (s === sev ? 'all' : sev))
                }}
              >
                {SEVERITY_DIST.map((s) => (
                  <Cell key={s.severity} fill={s.color} fillOpacity={severityFilter === 'all' || severityFilter === s.severity ? 1 : 0.3} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Inspection closure funnel"
            subtitle="Lifecycle from schedule to verified closure · FY 2026-27"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2.5">
            {CLOSURE_FUNNEL.map((s, i) => {
              const pct = (s.value / CLOSURE_FUNNEL[0].value) * 100
              return (
                <li key={s.stage}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-ink-700">{i + 1}. {s.stage}</span>
                    <span className="font-semibold text-ink-800">{s.value.toLocaleString('en-IN')} <span className="font-normal text-ink-400">· {Math.round(pct)}%</span></span>
                  </div>
                  <div className="mt-1 h-3 w-full rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${pct}%`, opacity: 0.55 + (i * 0.45) / (CLOSURE_FUNNEL.length - 1) }} />
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-400">{s.hint}</div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      {/* Charts row 2: repeat trend + department scores */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Repeat issue trend"
          subtitle="Sites with the same defect found in consecutive inspections · last 6 months"
          right={<span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700"><Repeat2 className="h-3 w-3" /> Declining 23%</span>}
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REPEAT_TREND} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 90]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: any) => [v, 'Repeat violations']} />
              <Line type="monotone" dataKey="repeats" stroke="#0B57D0" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Department-wise inspection score"
          subtitle="Composite of inspection coverage, closure speed and SLA adherence"
          height={240}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEPT_INSPECTION_SCORES} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="code" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: any) => [v, 'Inspection score']}
                labelFormatter={(code: any) => DEPT_INSPECTION_SCORES.find((d) => d.code === code)?.dept ?? code}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {DEPT_INSPECTION_SCORES.map((d) => (
                  <Cell key={d.code} fill={d.score >= 88 ? '#0B57D0' : d.score >= 82 ? '#4285F4' : '#FBBC05'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* District inspection performance */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="section-title text-ink-800">District inspection performance</span>
        </div>
        <DataTable
          columns={districtColumns}
          rows={DISTRICT_ROWS}
          searchKeys={['district']}
          compact
          actions={
            <>
              <span className="chip border border-ink-200 bg-ink-100 text-ink-700"><MapPinned className="h-3 w-3" /> 15 districts</span>
              <SourceBadge source="Demo" />
            </>
          }
        />
      </div>

      {/* AI panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>
    </div>
  )
}
