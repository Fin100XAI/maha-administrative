import { useMemo, useState } from 'react'
import {
  ClipboardList, AlertTriangle, Hourglass, CheckCircle2, IndianRupee,
  Repeat, Building2, Gauge, X,
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, LineChart, Line, Cell,
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

const AUDIT_CATEGORIES = ['AG Audit', 'Internal Audit', 'PAC Paras', 'CAG Performance', 'Departmental Inspection'] as const

/** Dept × category risk score (0-100). Higher = greater audit risk. */
const HEATMAP_ROWS: { code: string; name: string; scores: number[] }[] = [
  { code: 'REV', name: 'Revenue', scores: [86, 72, 91, 68, 58] },
  { code: 'UDD', name: 'Urban Development', scores: [78, 66, 74, 82, 61] },
  { code: 'WR', name: 'Water Resources', scores: [71, 63, 58, 77, 52] },
  { code: 'RDD', name: 'Rural Development', scores: [57, 49, 44, 69, 47] },
  { code: 'EDU', name: 'Education', scores: [61, 54, 38, 46, 42] },
  { code: 'FIN', name: 'Finance', scores: [42, 36, 52, 33, 28] },
  { code: 'TRN', name: 'Transport', scores: [48, 44, 31, 39, 36] },
  { code: 'HFW', name: 'Health', scores: [33, 29, 24, 41, 26] },
]

type AgeBucket = '0-30' | '31-90' | '91-180' | '180+'

const AGEING_BUCKETS: { bucket: AgeBucket; label: string; count: number; exposureCr: number }[] = [
  { bucket: '0-30', label: '0–30 days', count: 118, exposureCr: 64 },
  { bucket: '31-90', label: '31–90 days', count: 104, exposureCr: 96 },
  { bucket: '91-180', label: '91–180 days', count: 76, exposureCr: 118 },
  { bucket: '180+', label: '180+ days', count: 58, exposureCr: 134 },
]

/** Financial exposure by department — sums to ₹412 Cr. */
const EXPOSURE_BY_DEPT: { code: string; dept: string; exposure: number }[] = [
  { code: 'REV', dept: 'Revenue', exposure: 118 },
  { code: 'UDD', dept: 'Urban Dev.', exposure: 78 },
  { code: 'WR', dept: 'Water Res.', exposure: 64 },
  { code: 'RDD', dept: 'Rural Dev.', exposure: 46 },
  { code: 'FIN', dept: 'Finance', exposure: 34 },
  { code: 'TRN', dept: 'Transport', exposure: 28 },
  { code: 'EDU', dept: 'Education', exposure: 22 },
  { code: 'HFW', dept: 'Health', exposure: 12 },
  { code: 'AGR', dept: 'Agriculture', exposure: 10 },
]

/** Monthly closures — sums to 486 closed observations. */
const CLOSURE_TREND = [
  { m: 'Aug', closed: 24 }, { m: 'Sep', closed: 28 }, { m: 'Oct', closed: 30 },
  { m: 'Nov', closed: 33 }, { m: 'Dec', closed: 35 }, { m: 'Jan', closed: 38 },
  { m: 'Feb', closed: 41 }, { m: 'Mar', closed: 44 }, { m: 'Apr', closed: 47 },
  { m: 'May', closed: 52 }, { m: 'Jun', closed: 55 }, { m: 'Jul', closed: 59 },
]

/** Top recurring observation categories — sums to 68 repeat issues. */
const REPEAT_ISSUES = [
  { category: 'Utilisation certificates pending', count: 21, years: '3 consecutive years' },
  { category: 'Non-recovery of advances', count: 16, years: '3 consecutive years' },
  { category: 'Excess payment to contractor', count: 12, years: '2 consecutive years' },
  { category: 'Idle machinery / assets', count: 11, years: '2 consecutive years' },
  { category: 'Non-adjustment of temporary advances', count: 8, years: '2 consecutive years' },
]

type ObsStatus = 'Response Pending' | 'Under Review' | 'Reply Sent' | 'Closed'

interface AuditRow {
  id: string
  deptCode: string
  dept: string
  observation: string
  risk: RiskLevel
  impact: string
  impactCr: number
  due: string
  status: ObsStatus
  owner: string
  ai: string
  age: AgeBucket
}

const AUDIT_ROWS: AuditRow[] = [
  { id: 'AG/2026/REV/041', deptCode: 'REV', dept: 'Revenue', observation: 'Utilisation certificates for ₹18.4 Cr grants pending beyond 18 months', risk: 'Critical', impact: '₹18.4 Cr', impactCr: 18.4, due: '14 Jul 2026', status: 'Response Pending', owner: 'Desk Officer (Revenue)', ai: 'Draft reply citing GR-2024-FIN-118 with UC recovery timeline.', age: '180+' },
  { id: 'PAC/2026/FIN/007', deptCode: 'FIN', dept: 'Finance', observation: 'Excess payment of ₹6.2 Cr to contractor against revised estimates — Pune works division', risk: 'Critical', impact: '₹6.2 Cr', impactCr: 6.2, due: '10 Jul 2026', status: 'Under Review', owner: 'Section Officer (Finance)', ai: 'Recovery order draft ready; link measurement-book variance annexure.', age: '91-180' },
  { id: 'AG/2026/UDD/033', deptCode: 'UDD', dept: 'Urban Development', observation: 'Non-recovery of mobilisation advances of ₹11.8 Cr from 4 municipal contractors', risk: 'High', impact: '₹11.8 Cr', impactCr: 11.8, due: '21 Jul 2026', status: 'Response Pending', owner: 'Municipal Commissioner', ai: 'Adjust against running-account bills; recovery notices drafted.', age: '91-180' },
  { id: 'IA/2026/WR/019', deptCode: 'WR', dept: 'Water Resources', observation: 'Idle dredging machinery worth ₹7.5 Cr at Jayakwadi division since 2023', risk: 'High', impact: '₹7.5 Cr', impactCr: 7.5, due: '28 Jul 2026', status: 'Reply Sent', owner: 'Department Director', ai: 'Redeployment plan to Krishna basin divisions suggested.', age: '180+' },
  { id: 'CAG/2025/RDD/012', deptCode: 'RDD', dept: 'Rural Development', observation: 'Performance audit: 34% PMGSY works delayed beyond scheduled completion', risk: 'High', impact: '₹9.6 Cr', impactCr: 9.6, due: '18 Jul 2026', status: 'Under Review', owner: 'CEO Zilla Parishad', ai: 'Milestone-wise delay attribution table auto-compiled.', age: '31-90' },
  { id: 'AG/2026/EDU/027', deptCode: 'EDU', dept: 'Education', observation: 'Non-adjustment of temporary advances of ₹2.1 Cr drawn for Samagra Shiksha events', risk: 'Medium', impact: '₹2.1 Cr', impactCr: 2.1, due: '24 Jul 2026', status: 'Response Pending', owner: 'Desk Officer (Education)', ai: 'Adjustment vouchers traced for ₹1.6 Cr; balance flagged.', age: '31-90' },
  { id: 'IA/2026/HFW/008', deptCode: 'HFW', dept: 'Health', observation: 'Short-levy of licence fees from private hospitals — ₹1.4 Cr across 3 districts', risk: 'Medium', impact: '₹1.4 Cr', impactCr: 1.4, due: '31 Jul 2026', status: 'Reply Sent', owner: 'Section Officer (Health)', ai: 'Demand notices generated from licensing registry.', age: '0-30' },
  { id: 'AG/2026/TRN/015', deptCode: 'TRN', dept: 'Transport', observation: 'Vehicle fitness fee remittances of ₹3.2 Cr parked in PLA beyond permissible period', risk: 'Medium', impact: '₹3.2 Cr', impactCr: 3.2, due: '05 Aug 2026', status: 'Response Pending', owner: 'Department Director', ai: 'Sweep-to-Consolidated-Fund order drafted per Finance circular.', age: '31-90' },
  { id: 'PAC/2025/REV/052', deptCode: 'REV', dept: 'Revenue', observation: 'Recovery of ₹4.9 Cr land conversion premium pending in 3 talukas', risk: 'High', impact: '₹4.9 Cr', impactCr: 4.9, due: '12 Jul 2026', status: 'Under Review', owner: 'District Collector', ai: 'Taluka-wise recovery position compiled; RRC recommended for 2 cases.', age: '180+' },
  { id: 'IA/2026/AGR/011', deptCode: 'AGR', dept: 'Agriculture', observation: 'Seed subsidy of ₹0.8 Cr released without utilisation verification', risk: 'Low', impact: '₹0.8 Cr', impactCr: 0.8, due: 'Closed 02 Jul 2026', status: 'Closed', owner: 'Desk Officer (Agriculture)', ai: 'Verification reports received; para recommended for closure.', age: '0-30' },
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'Categorize 38 new audit observations automatically.', confidence: 91, action: 'Run' },
  { text: 'Draft departmental replies for 12 paras due this week.', confidence: 88, action: 'Draft' },
  { text: 'Recurring para pattern detected in works expenditure — recommend systemic correction.', confidence: 86, action: 'Review' },
  { text: 'Corrective action linked to Finance Department circular of 2024.', confidence: 90, action: 'Open' },
  { text: 'Link 6 paras to relevant GR/circular for reply grounding.', confidence: 87, action: 'Link' },
]

const ALERTS: RiskAlert[] = [
  { title: 'PAC sitting on 14 Jul 2026 — replies pending for 9 paras of Revenue & Finance', severity: 'Critical', owner: 'Desk Officer (Finance)', due: '7 days' },
  { title: '₹196 Cr exposure concentrated in Revenue and Urban Development (48% of total)', severity: 'High', owner: 'Principal Secretary', due: 'This month' },
  { title: 'Repeat para on utilisation certificates flagged for 3rd consecutive year', severity: 'High', owner: 'Department Director', due: '15 days' },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function heatClass(v: number) {
  if (v >= 80) return 'bg-red-500 text-white'
  if (v >= 65) return 'bg-orange-400 text-white'
  if (v >= 50) return 'bg-amber-300 text-ink-900'
  if (v >= 35) return 'bg-amber-100 text-ink-700'
  return 'bg-emerald-100 text-emerald-800'
}

const STATUS_CHIP: Record<ObsStatus, string> = {
  'Response Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-sky-50 text-sky-700 border-sky-200',
  'Reply Sent': 'bg-brand-50 text-brand-700 border-brand-200',
  Closed: 'bg-ink-100 text-ink-600 border-ink-200',
}

const BRAND = '#0B57D0'
const BRAND_DIM = '#C7D7F4'
const TOOLTIP_STYLE = { borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 } as const

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function AuditIntelligence() {
  const [dept, setDept] = useState('all')
  const [bucket, setBucket] = useState<AgeBucket | 'all'>('all')

  const filteredRows = useMemo(
    () => AUDIT_ROWS.filter((r) =>
      (dept === 'all' || r.deptCode === dept) && (bucket === 'all' || r.age === bucket),
    ),
    [dept, bucket],
  )

  const columns: Column<AuditRow>[] = [
    { key: 'id', header: 'Audit ID', sortable: true, render: (r) => <span className="font-mono text-xs text-ink-700">{r.id}</span> },
    { key: 'dept', header: 'Department', sortable: true },
    { key: 'observation', header: 'Observation', className: 'min-w-[260px]', render: (r) => <span className="text-ink-800">{r.observation}</span> },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => <SeverityBadge level={r.risk} /> },
    { key: 'impactCr', header: 'Financial Impact', sortable: true, render: (r) => <span className="font-medium text-ink-900">{r.impact}</span> },
    { key: 'due', header: 'Response Due', sortable: true },
    { key: 'status', header: 'Status', render: (r) => <span className={cn('chip border', STATUS_CHIP[r.status])}>{r.status}</span> },
    { key: 'owner', header: 'Owner' },
    { key: 'ai', header: 'AI Recommendation', className: 'min-w-[220px]', render: (r) => <span className="text-xs text-ink-600">{r.ai}</span> },
  ]

  return (
    <div>
      <IntelligencePageHeader
        title="Audit Intelligence"
        subtitle="AG, CAG, PAC and internal audit observations — compliance, financial exposure, departmental responses and closure."
        icon={<ClipboardList className="h-5 w-5" />}
        confidence={87}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Audit Observations" value="842" icon={<ClipboardList className="h-5 w-5" />} delta={4.2} hint="All sources · FY 2025-26" confidence={92} />
        <MetricCard label="High Risk Observations" value="96" icon={<AlertTriangle className="h-5 w-5" />} delta={-6.1} hint="High + Critical severity" confidence={89} />
        <MetricCard label="Pending Responses" value="214" icon={<Hourglass className="h-5 w-5" />} delta={-9.4} hint="Awaiting departmental reply" confidence={91} />
        <MetricCard label="Closed Observations" value="486" icon={<CheckCircle2 className="h-5 w-5" />} delta={12.8} hint="Settled this fiscal year" confidence={93} />
        <MetricCard label="Financial Exposure" value="₹412 Cr" icon={<IndianRupee className="h-5 w-5" />} delta={-3.6} hint="Across open observations" confidence={88} />
        <MetricCard label="Repeat Audit Issues" value="68" icon={<Repeat className="h-5 w-5" />} delta={-11.2} hint="Recurring para categories" confidence={86} />
        <MetricCard label="Departments at Risk" value="4" icon={<Building2 className="h-5 w-5" />} hint="Revenue, UDD, Water Res., Education" confidence={87} />
        <MetricCard label="Compliance Score" value="81" icon={<Gauge className="h-5 w-5" />} delta={5.3} hint="Reply timeliness + closure quality" confidence={90} accent="brand" />
      </div>

      {/* Audit risk heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Audit risk heatmap"
          subtitle="Department × audit category · composite risk score (0–100) from open paras, exposure and ageing"
          right={<SourceBadge source="Demo" />}
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="table-th !border-0 text-left">Department</th>
                {AUDIT_CATEGORIES.map((c) => (
                  <th key={c} className="table-th !border-0 text-center">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_ROWS.map((row) => (
                <tr key={row.code}>
                  <td className="whitespace-nowrap pr-2 text-sm font-medium text-ink-800">{row.name}</td>
                  {row.scores.map((s, i) => (
                    <td key={i} className="p-0">
                      <div
                        title={`${row.name} · ${AUDIT_CATEGORIES[i]} — risk ${s}/100`}
                        className={cn('grid h-9 min-w-[72px] place-items-center rounded-md text-xs font-semibold transition-transform hover:scale-[1.04]', heatClass(s))}
                      >
                        {s}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-100 ring-1 ring-emerald-200" /> Low (&lt;35)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-100 ring-1 ring-amber-200" /> Guarded (35–49)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-300" /> Elevated (50–64)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-orange-400" /> High (65–79)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> Severe (80+)</span>
        </div>
      </Card>

      {/* Ageing buckets + exposure chart */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Observation ageing"
            subtitle="356 open observations · click a bucket to filter the register below"
            right={<SourceBadge source="Demo" />}
          />
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="table-th text-left">Ageing bucket</th>
                <th className="table-th text-right">Observations</th>
                <th className="table-th text-right">Exposure (₹ Cr)</th>
                <th className="table-th text-left">Share of exposure</th>
              </tr>
            </thead>
            <tbody>
              {AGEING_BUCKETS.map((b) => {
                const active = bucket === b.bucket
                return (
                  <tr
                    key={b.bucket}
                    onClick={() => setBucket(active ? 'all' : b.bucket)}
                    className={cn('cursor-pointer transition-colors hover:bg-brand-50/50', active && 'bg-brand-50')}
                  >
                    <td className="table-td font-medium text-ink-800">
                      <span className="inline-flex items-center gap-2">
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                        {b.label}
                      </span>
                    </td>
                    <td className="table-td text-right font-medium">{b.count}</td>
                    <td className="table-td text-right font-medium text-ink-900">₹{b.exposureCr} Cr</td>
                    <td className="table-td">
                      <div className="h-1.5 w-full max-w-[140px] rounded bg-ink-100">
                        <div className="h-full rounded bg-brand-gradient" style={{ width: `${(b.exposureCr / 412) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
            <span>Older paras hold the largest exposure — ₹134 Cr sits beyond 180 days.</span>
            {bucket !== 'all' && (
              <button className="inline-flex items-center gap-1 rounded-md border border-ink-200 px-2 py-0.5 font-medium text-ink-600 hover:bg-ink-50" onClick={() => setBucket('all')}>
                <X className="h-3 w-3" /> Clear filter
              </button>
            )}
          </div>
        </Card>

        <ChartCard
          title="Financial exposure by department"
          subtitle="₹ Cr across open observations · select a department to highlight"
          height={288}
          right={<DepartmentFilter value={dept} onChange={setDept} />}
        >
          <ResponsiveContainer>
            <BarChart data={EXPOSURE_BY_DEPT} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="dept" tick={{ fontSize: 10.5 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={0} angle={-18} textAnchor="end" height={44} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${v} Cr`, 'Exposure']} cursor={{ fill: 'rgba(11,87,208,0.05)' }} />
              <Bar dataKey="exposure" radius={[4, 4, 0, 0]} maxBarSize={34}>
                {EXPOSURE_BY_DEPT.map((d) => (
                  <Cell key={d.code} fill={dept === 'all' || dept === d.code ? BRAND : BRAND_DIM} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Closure trend + repeat issues */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Closure trend"
          subtitle="Observations closed per month · trailing 12 months, improving"
          height={260}
        >
          <ResponsiveContainer>
            <LineChart data={CLOSURE_TREND} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 70]} />
              <ReTooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [v, 'Closed']} />
              <Line type="monotone" dataKey="closed" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Repeat issue analysis"
            subtitle="Top 5 recurring observation categories · 68 repeat paras"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2.5">
            {REPEAT_ISSUES.map((r) => (
              <li key={r.category} className="rounded-lg border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="text-sm font-medium text-ink-800">{r.category}</span>
                  <span className="text-xs text-ink-500">{r.years}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${(r.count / 21) * 100}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-semibold text-ink-800">{r.count} paras</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Main register */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredRows}
          searchKeys={['id', 'dept', 'observation', 'owner', 'status']}
          emptyText="No observations match the current filters"
          actions={
            <>
              {bucket !== 'all' && (
                <button
                  className="chip border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
                  onClick={() => setBucket('all')}
                >
                  Ageing: {bucket} days <X className="h-3 w-3" />
                </button>
              )}
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
