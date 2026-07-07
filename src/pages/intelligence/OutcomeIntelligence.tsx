import { useMemo, useState } from 'react'
import {
  Target, Zap, HeartHandshake, Layers, ShieldCheck, ShieldAlert, Eye,
  IndianRupee, TrendingUp, Sparkles, CalendarClock,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ReTooltip, Legend,
} from 'recharts'
import {
  IntelligencePageHeader, AIRecommendationPanel, RiskAlertPanel, TierBadge,
  Recommendation, RiskAlert,
} from '@/components/intelligence'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, TrendBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS, OUTCOME_METRICS } from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page-local demo data (scorecard metrics come from the shared        */
/* OUTCOME_METRICS export — this page only extends, never redefines).  */
/* ------------------------------------------------------------------ */

/** Scorecard = 8 shared outcome metrics + 2 page-level additions. */
const SCORECARD = [
  ...OUTCOME_METRICS,
  { label: 'Service delivery improvement', value: '+14%', delta: 14 },
  { label: 'Administrative productivity gain', value: '+19%', delta: 19 },
]

/** Before/after — pre-AI baseline (FY 2024-25) vs current (FY 2025-26). */
const BEFORE_AFTER = [
  { metric: 'Avg disposal days', before: 11.2, after: 7.8, unit: 'days', betterIsLower: true },
  { metric: 'RTI TAT', before: 26, after: 22.6, unit: 'days', betterIsLower: true },
  { metric: 'Grievance resolution', before: 76, after: 87, unit: '%', betterIsLower: false },
  { metric: 'DPDP score', before: 80, after: 89, unit: 'pts', betterIsLower: false },
  { metric: 'SLA compliance', before: 78, after: 86.4, unit: '%', betterIsLower: false },
]

/** Outcome areas — each maps to the scorecard tiles it explains. */
const OUTCOME_AREAS: { key: string; label: string; icon: JSX.Element; claim: string; tiles: number[] }[] = [
  { key: 'approvals', label: 'Faster approvals', icon: <Zap className="h-4 w-4" />, claim: 'File disposal 23% faster — 11.2 → 7.8 days average.', tiles: [1] },
  { key: 'service', label: 'Better citizen service', icon: <HeartHandshake className="h-4 w-4" />, claim: 'Citizen satisfaction up 11%; service delivery up 14%.', tiles: [3, 8] },
  { key: 'backlog', label: 'Reduced backlog', icon: <Layers className="h-4 w-4" />, claim: 'Pending files down 28% across 13 departments.', tiles: [1, 2] },
  { key: 'compliance', label: 'Better compliance', icon: <ShieldCheck className="h-4 w-4" />, claim: 'DPDP score +9 pts; SLA compliance +8.6 pts.', tiles: [2, 7] },
  { key: 'risk', label: 'Reduced risk', icon: <ShieldAlert className="h-4 w-4" />, claim: 'Security and compliance incidents down 31% YoY.', tiles: [6] },
  { key: 'transparency', label: 'Improved transparency', icon: <Eye className="h-4 w-4" />, claim: 'RTI TAT down 3.4 days; proactive disclosures up 2.1x.', tiles: [4] },
  { key: 'cost', label: 'Lower administrative cost', icon: <IndianRupee className="h-4 w-4" />, claim: '₹64 Cr saved this year — printing, courier, rework.', tiles: [4, 5] },
  { key: 'productivity', label: 'Higher officer productivity', icon: <TrendingUp className="h-4 w-4" />, claim: '41,200 officer-hours saved monthly; productivity +19%.', tiles: [0, 9] },
]

/** Citizen service outcome matrix — TAT / SLA / satisfaction per service. */
const SERVICE_MATRIX = [
  { service: 'Income certificate', tatBefore: 12, tatAfter: 6.5, sla: 94, slaDelta: 9, csat: 4.3, csatDelta: 0.5 },
  { service: '7/12 extract', tatBefore: 9, tatAfter: 4.2, sla: 92, slaDelta: 11, csat: 4.2, csatDelta: 0.6 },
  { service: 'Ration card', tatBefore: 21, tatAfter: 14.8, sla: 87, slaDelta: 7, csat: 3.9, csatDelta: 0.4 },
  { service: 'Pension disbursal', tatBefore: 18, tatAfter: 12.1, sla: 89, slaDelta: 8, csat: 4.0, csatDelta: 0.3 },
  { service: 'Building permission', tatBefore: 60, tatAfter: 44, sla: 81, slaDelta: 6, csat: 3.7, csatDelta: 0.4 },
]

/** Monthly officer-hours saved — Aug to Jul, rising to 41,200/month. */
const HOURS_TREND = [
  { m: 'Aug', hrs: 16400 }, { m: 'Sep', hrs: 18900 }, { m: 'Oct', hrs: 21300 },
  { m: 'Nov', hrs: 23600 }, { m: 'Dec', hrs: 25800 }, { m: 'Jan', hrs: 28100 },
  { m: 'Feb', hrs: 30400 }, { m: 'Mar', hrs: 32600 }, { m: 'Apr', hrs: 34900 },
  { m: 'May', hrs: 37200 }, { m: 'Jun', hrs: 39400 }, { m: 'Jul', hrs: 41200 },
]

/** Monthly cost/time savings in ₹ Cr — sums to the ₹64 Cr annual figure. */
const SAVINGS_TREND = [
  { m: 'Aug', cr: 3.2 }, { m: 'Sep', cr: 3.6 }, { m: 'Oct', cr: 4.1 },
  { m: 'Nov', cr: 4.4 }, { m: 'Dec', cr: 4.8 }, { m: 'Jan', cr: 5.2 },
  { m: 'Feb', cr: 5.5 }, { m: 'Mar', cr: 5.9 }, { m: 'Apr', cr: 6.3 },
  { m: 'May', cr: 6.6 }, { m: 'Jun', cr: 7.0 }, { m: 'Jul', cr: 7.4 },
]

const FORECAST_ITEMS = [
  { label: 'Avg disposal days', value: '-0.9 days', note: '7.8 → 6.9 projected by Oct 2026' },
  { label: 'SLA compliance', value: '+2.1 pts', note: '86.4% → 88.5% if RTI backlog is cleared' },
  { label: 'Additional savings', value: '₹18 Cr', note: 'Incremental over the next quarter' },
]

const FORECAST_ASSUMPTIONS = [
  'AI adoption holds at or above the current 76% weekly-active officer rate.',
  'RTI backlog clearance drive completes in Revenue and Urban Development.',
  'No major policy or election-period workload spike in the quarter.',
]

const RECOMMENDATIONS: Recommendation[] = [
  { text: 'AI drafting created the largest measured outcome (34% of time saved).', confidence: 90, action: 'View attribution' },
  { text: 'Next best reform: extend AI file summarisation to district collectorates.', confidence: 87, action: 'Plan rollout' },
  { text: '90-day forecast: +2.1 SLA pts if RTI backlog cleared.', confidence: 85, action: 'Open forecast' },
  { text: 'Low-performing workflow identified: procurement approval — recommend process redesign.', confidence: 84, action: 'Start redesign' },
]

const RISK_ALERTS: RiskAlert[] = [
  { title: 'Outcome data coverage gap — 3 departments report activity metrics only, not outcome metrics.', severity: 'Medium', owner: 'Planning AI Officer', due: '30 days' },
  { title: 'Attribution caution — parallel e-office rollout overlaps the AI window; treat single-cause claims as directional.', severity: 'Medium', owner: 'Chief Data Officer', due: 'Ongoing' },
]

type Period = '3M' | '6M' | '12M'
const PERIOD_MONTHS: Record<Period, number> = { '3M': 3, '6M': 6, '12M': 12 }

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function OutcomeIntelligence() {
  const [period, setPeriod] = useState<Period>('12M')
  const [area, setArea] = useState<string | null>(null)

  const months = PERIOD_MONTHS[period]
  const hoursData = useMemo(() => HOURS_TREND.slice(-months), [months])
  const savingsData = useMemo(() => SAVINGS_TREND.slice(-months), [months])
  const periodSavings = useMemo(() => savingsData.reduce((s, d) => s + d.cr, 0), [savingsData])

  const highlighted = area ? OUTCOME_AREAS.find((a) => a.key === area)?.tiles ?? [] : []
  const topDepts = useMemo(() => [...AI_DEPARTMENTS].sort((a, b) => b.score - a.score).slice(0, 5), [])

  const periodSelector = (
    <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-0.5">
      {(['3M', '6M', '12M'] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={cn(
            'rounded-md px-2.5 py-1 text-[11px] font-semibold transition',
            period === p ? 'bg-brand-gradient text-white shadow-glow' : 'text-ink-600 hover:bg-ink-50',
          )}
        >
          {p}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <IntelligencePageHeader
        title="Outcome Intelligence"
        subtitle="Moves beyond activity tracking to measure real public outcomes — time saved, cost reduced, services improved, risk lowered."
        icon={<Target className="h-5 w-5" />}
        confidence={85}
      />

      {/* Outcome scorecard */}
      <Card>
        <CardHeader
          title="Outcome scorecard"
          subtitle="Measured administrative outcomes · FY 2025-26 vs pre-AI baseline"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source="Demo" />
              {area && (
                <button className="chip border border-ink-200 bg-ink-100 text-ink-700 hover:bg-ink-200/60" onClick={() => setArea(null)}>
                  Clear highlight
                </button>
              )}
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SCORECARD.map((m, i) => {
            const hot = highlighted.includes(i)
            return (
              <div
                key={m.label}
                className={cn(
                  'group relative overflow-hidden rounded-xl border p-3.5 transition-all duration-300',
                  hot
                    ? 'border-brand-300 bg-brand-soft shadow-glow ring-1 ring-brand-300'
                    : 'border-ink-100 bg-white hover:border-brand-200 hover:shadow-sm',
                  area && !hot && 'opacity-45',
                )}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-brand-gradient opacity-[0.07] blur-xl transition-opacity group-hover:opacity-20"
                />
                <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">{m.label}</div>
                <div className="mt-1.5 text-xl font-semibold leading-none text-ink-900">{m.value}</div>
                <div className="mt-2"><TrendBadge delta={m.delta} /></div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Outcome areas strip */}
      <Card className="mt-6">
        <CardHeader
          title="Outcome areas"
          subtitle="Select an area to highlight the scorecard tiles it drives"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {OUTCOME_AREAS.map((a) => {
            const active = area === a.key
            return (
              <button
                key={a.key}
                onClick={() => setArea(active ? null : a.key)}
                onMouseEnter={() => setArea(a.key)}
                className={cn(
                  'rounded-xl border p-3 text-left transition',
                  active
                    ? 'border-brand-400 bg-brand-soft shadow-glow'
                    : 'border-ink-100 bg-white hover:border-brand-200 hover:bg-brand-50/40',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', active ? 'bg-brand-gradient text-white' : 'bg-brand-soft text-brand-600 ring-1 ring-brand-100')}>
                    {a.icon}
                  </span>
                  <span className="text-sm font-semibold text-ink-800">{a.label}</span>
                </div>
                <p className="mt-2 text-xs leading-snug text-ink-600">{a.claim}</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Before/after + department ranking */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Before vs after AI deployment"
          subtitle="Pre-AI baseline (FY 2024-25) vs current (FY 2025-26) · days for TAT metrics, % / points for the rest"
          height={300}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BEFORE_AFTER} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={2}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <ReTooltip
                cursor={{ fill: 'rgba(11,87,208,0.04)' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number, name: string, item: any) => [`${v} ${item?.payload?.unit ?? ''}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="before" name="Before" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={26} />
              <Bar dataKey="after" name="After" fill="#0B57D0" radius={[4, 4, 0, 0]} maxBarSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Department outcome ranking"
            subtitle="Top 5 by composite outcome score"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-3">
            {topDepts.map((d, i) => (
              <li key={d.code} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-soft text-xs font-bold text-brand-700">{i + 1}</span>
                  <span className="font-semibold text-ink-800">{d.name}</span>
                  <span className="ml-auto text-sm font-semibold text-ink-900">{d.score}/100</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${d.score}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-ink-600">
                  {d.code === 'HFW' && 'Fastest disposal in the state (5.8 days) with 91% grievance resolution — the outcome benchmark.'}
                  {d.code === 'FIN' && 'Concurrence TAT cut by a third; audit-para pendency at a 5-year low.'}
                  {d.code === 'IND' && 'Single-window clearances 89% within SLA — investor service outcomes improving.'}
                  {d.code === 'WCD' && 'Welfare benefit processing 90% resolved — highest citizen-confirmation rate.'}
                  {d.code === 'HOME' && 'Case-file movement 7.1 days average; escalations down 22% YoY.'}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Citizen service outcome matrix */}
      <Card className="mt-6">
        <CardHeader
          title="Citizen service outcome matrix"
          subtitle="Key services × TAT / SLA / satisfaction · improved values highlighted"
          right={<SourceBadge source="Demo" />}
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                {['Service', 'TAT (days)', 'SLA compliance', 'Citizen satisfaction'].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SERVICE_MATRIX.map((s) => (
                <tr key={s.service} className="hover:bg-ink-50/40">
                  <td className="table-td font-medium text-ink-800">{s.service}</td>
                  <td className="table-td">
                    <span className="text-ink-400 line-through">{s.tatBefore}</span>
                    <span className="mx-1.5 text-ink-400">→</span>
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">{s.tatAfter}</span>
                  </td>
                  <td className="table-td">
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">{s.sla}%</span>
                    <span className="ml-1.5 text-xs text-emerald-600">▲ {s.slaDelta} pts</span>
                  </td>
                  <td className="table-td">
                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700">{s.csat} / 5</span>
                    <span className="ml-1.5 text-xs text-emerald-600">▲ {s.csatDelta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trends with period selector */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Officer-hours saved per month"
          subtitle={`AI-assisted drafting, summarisation and routing · ${period} view`}
          right={periodSelector}
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hoursData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gOutcomeHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
              <ReTooltip
                cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v.toLocaleString('en-IN')} hrs`, 'Hours saved']}
              />
              <Area type="monotone" dataKey="hrs" name="Hours saved" stroke="#0B57D0" strokeWidth={2} fill="url(#gOutcomeHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Cost & time savings — ₹ Cr per month"
          subtitle={`Printing, courier, rework and overtime avoided · ₹${periodSavings.toFixed(1)} Cr in the ${period} window`}
          right={periodSelector}
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={savingsData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <ReTooltip
                cursor={{ fill: 'rgba(11,87,208,0.04)' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`₹${v} Cr`, 'Saved']}
              />
              <Bar dataKey="cr" name="₹ Cr saved" fill="#0B57D0" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 90-day forecast */}
      <Card className="mt-6 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-brand-gradient opacity-[0.07] blur-2xl" />
        <CardHeader
          title={
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Sparkles className="h-3.5 w-3.5" /></span>
              90-day outcome forecast
            </span>
          }
          subtitle="AI projection of next-quarter gains · Aug–Oct 2026"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <TierBadge score={85} />
              <SourceBadge source="Demo" />
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FORECAST_ITEMS.map((f) => (
            <div key={f.label} className="rounded-xl border border-brand-100 bg-brand-50/40 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">{f.label}</div>
              <div className="mt-1.5 text-2xl font-semibold leading-none text-brand-700">{f.value}</div>
              <div className="mt-1.5 text-xs text-ink-600">{f.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/50 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-700">
            <CalendarClock className="h-3.5 w-3.5 text-ink-500" /> Forecast assumptions
          </div>
          <ul className="space-y-1 text-xs text-ink-600">
            {FORECAST_ASSUMPTIONS.map((a) => (
              <li key={a} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-400" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* AI recommendations + risk alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AIRecommendationPanel recommendations={RECOMMENDATIONS} />
        <RiskAlertPanel alerts={RISK_ALERTS} />
      </div>
    </div>
  )
}
