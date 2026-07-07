import { useMemo, useState } from 'react'
import {
  GaugeCircle, SlidersHorizontal, RotateCcw, TrendingUp, TrendingDown,
  Building2, MapPin, Scale, Minus, Plus, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
} from 'recharts'
import { IntelligencePageHeader, AIRecommendationPanel, SeverityBadge } from '@/components/intelligence'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge } from '@/components/ui/Badges'
import {
  INDEX_SCORES, INDEX_TREND, AI_DEPARTMENTS, AI_DISTRICTS, RiskLevel,
} from '@/data/administrativeIntelligence'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Simulator model — simple, transparent, weight-driven                */
/* ------------------------------------------------------------------ */

type SubKey = typeof INDEX_SCORES.subs[number]['key']

interface Lever {
  id: 'sla' | 'rti' | 'ai' | 'dpdp'
  label: string
  unit: string
  max: number
  step: number
  /** sub-score key → points added per 1 unit of the lever */
  effects: Partial<Record<SubKey, number>>
  formula: string
}

const LEVERS: Lever[] = [
  {
    id: 'sla', label: 'SLA breach reduction', unit: '%', max: 40, step: 5,
    effects: { disposal: 0.2, governance: 0.1 },
    formula: '+0.20 pt Disposal, +0.10 pt Governance per 1%',
  },
  {
    id: 'rti', label: 'RTI backlog reduction', unit: '%', max: 40, step: 5,
    effects: { citizen: 0.12, governance: 0.05 },
    formula: '+0.12 pt Citizen Service, +0.05 pt Governance per 1%',
  },
  {
    id: 'ai', label: 'AI adoption increase', unit: 'pts', max: 15, step: 1,
    effects: { adoption: 1, performance: 0.5 },
    formula: '+1.00 pt AI Adoption, +0.50 pt Dept Performance per pt',
  },
  {
    id: 'dpdp', label: 'DPDP compliance increase', unit: 'pts', max: 10, step: 1,
    effects: { compliance: 1, risk: 0.5 },
    formula: '+1.00 pt Compliance & DPDP, +0.50 pt Risk Readiness per pt',
  },
]

const ZERO_LEVERS = { sla: 0, rti: 0, ai: 0, dpdp: 0 }

const weightedSum = (subs: { score: number; weight: number }[]) =>
  subs.reduce((acc, s) => acc + s.score * s.weight, 0)

const BASE_WEIGHTED = weightedSum(INDEX_SCORES.subs)

/* ------------------------------------------------------------------ */
/* Static content                                                      */
/* ------------------------------------------------------------------ */

const IMPROVED = [
  'Health approvals improved 9.4% — HFW disposal TAT down to 5.8 days',
  'AI drafting adoption up 6 pts in GAD and Mantralaya desks',
  'RTI TAT improved in Pune division — 2.1 days faster on average',
  'Audit para closure rate up 12% after Audit AI Officer rollout',
  'Zero Trust security score up 2 pts — AI SOC now at 94',
]

const DECLINED = [
  'UDD SLA breach trend rising — 8 active breaches, 545 pending files',
  'Court compliance orders ageing beyond 60 days in 2 benches',
  'Consent coverage gap in 3 departments (EDU, WR, RDD)',
  'Procurement TAT slipped 3.1 days against 45-day GFR window',
  'Repeat inspection violations flagged in Jalgaon and Nanded',
]

const RECOMMENDATIONS = [
  { text: 'Launch a 30-day SLA breach clearance drive in UDD and Revenue — projected +0.8 index pts via Disposal and Governance sub-scores.', confidence: 91, action: 'Create drive' },
  { text: 'Extend RTI AI Officer auto-drafting to Nashik and Nagpur divisions to cut backlog 15% before next quarter review.', confidence: 88, action: 'Assign officer' },
  { text: 'Close consent coverage gap in EDU, WR and RDD with a DPDP consent-refresh campaign — lifts Compliance & DPDP toward 92.', confidence: 90, action: 'Schedule audit' },
  { text: 'Escalate ageing court compliance orders to Law & Judiciary weekly review; assign Legal AI Officer for affidavit pre-drafts.', confidence: 86, action: 'Escalate' },
  { text: 'Replicate the Health department disposal playbook (5.8-day TAT) in Urban Development via a structured secondment.', confidence: 87, action: 'View playbook' },
]

/* ------------------------------------------------------------------ */
/* Circular score gauge (SVG, brand gradient stroke)                   */
/* ------------------------------------------------------------------ */

function ScoreGauge({ score }: { score: number }) {
  const size = 220
  const stroke = 16
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const filled = (score / 100) * c
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Administrative Intelligence Index ${score} out of 100`}>
        <defs>
          <linearGradient id="indexGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B57D0" />
            <stop offset="100%" stopColor="#062868" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8EEF9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#indexGaugeGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[44px] font-semibold leading-none text-ink-900">{score}</div>
        <div className="mt-1 text-xs font-medium text-ink-500">out of 100</div>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          <TrendingUp className="h-2.5 w-2.5" /> +1.0 vs Jun
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function IntelligenceIndex() {
  const [levers, setLevers] = useState<Record<Lever['id'], number>>(ZERO_LEVERS)

  const setLever = (id: Lever['id'], value: number, max: number) =>
    setLevers((l) => ({ ...l, [id]: Math.min(max, Math.max(0, value)) }))

  const simulation = useMemo(() => {
    const lift: Partial<Record<SubKey, number>> = {}
    for (const lever of LEVERS) {
      const v = levers[lever.id]
      if (v <= 0) continue
      for (const [key, per] of Object.entries(lever.effects)) {
        lift[key as SubKey] = (lift[key as SubKey] ?? 0) + v * (per ?? 0)
      }
    }
    const subs = INDEX_SCORES.subs.map((s) => {
      const simScore = Math.min(100, s.score + (lift[s.key] ?? 0))
      return { ...s, simScore, lift: simScore - s.score }
    })
    const delta = weightedSum(subs.map((s) => ({ score: s.simScore, weight: s.weight }))) - BASE_WEIGHTED
    return { subs, delta, simIndex: INDEX_SCORES.overall + delta }
  }, [levers])

  const touched = LEVERS.some((l) => levers[l.id] > 0)
  const impacted = simulation.subs.filter((s) => s.lift > 0)

  /* ---- Rankings ---- */
  const deptRows = useMemo(
    () => [...AI_DEPARTMENTS].sort((a, b) => b.score - a.score).map((d, i) => ({ ...d, rank: i + 1 })),
    [],
  )
  const districtRows = useMemo(
    () =>
      [...AI_DISTRICTS]
        .map((d) => ({ ...d, composite: Math.round((d.slaCompliance + d.inspectionScore + d.complianceScore) / 3) }))
        .sort((a, b) => b.composite - a.composite)
        .map((d, i) => ({ ...d, rank: i + 1 })),
    [],
  )

  type DeptRow = (typeof deptRows)[number]
  type DistrictRow = (typeof districtRows)[number]

  const deptColumns: Column<DeptRow>[] = [
    { key: 'rank', header: 'Rank', sortable: true, render: (r) => <RankChip rank={r.rank} /> },
    { key: 'name', header: 'Department', sortable: true, render: (r) => (
      <span className="font-medium text-ink-800">{r.name} <span className="text-xs text-ink-400">({r.code})</span></span>
    )},
    { key: 'score', header: 'Score', sortable: true, render: (r) => <ScoreBar value={r.score} /> },
    { key: 'sla', header: 'SLA %', sortable: true },
    { key: 'dpdp', header: 'DPDP %', sortable: true },
    { key: 'aiAdoption', header: 'AI Adoption %', sortable: true },
    { key: 'risk', header: 'Risk', render: (r) => <SeverityBadge level={r.risk as RiskLevel} /> },
  ]

  const districtColumns: Column<DistrictRow>[] = [
    { key: 'rank', header: 'Rank', sortable: true, render: (r) => <RankChip rank={r.rank} /> },
    { key: 'name', header: 'District', sortable: true, render: (r) => <span className="font-medium text-ink-800">{r.name}</span> },
    { key: 'slaCompliance', header: 'SLA Compliance %', sortable: true, render: (r) => <ScoreBar value={r.slaCompliance} /> },
    { key: 'inspectionScore', header: 'Inspection Score', sortable: true },
    { key: 'complianceScore', header: 'Compliance Score', sortable: true },
  ]

  /* ---- Contribution breakdown ---- */
  const contributions = INDEX_SCORES.subs.map((s) => ({ ...s, pts: s.score * s.weight }))
  const totalContribution = contributions.reduce((a, c) => a + c.pts, 0)

  return (
    <div>
      <IntelligencePageHeader
        title="Administrative Intelligence Index"
        subtitle="A single composite score for Maharashtra's administration — governance, productivity, compliance, citizen services, risk, AI adoption and security."
        icon={<GaugeCircle className="h-5 w-5" />}
        confidence={88}
      />

      {/* 1. Hero — gauge + weighted sub-scores */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <Card className="flex flex-col items-center justify-center">
          <div className="label mb-3 text-ink-500">Maharashtra Administrative Intelligence Score</div>
          <ScoreGauge score={INDEX_SCORES.overall} />
          <p className="mt-4 max-w-[280px] text-center text-xs leading-relaxed text-ink-500">
            Weighted composite of 9 sub-indices across GAD, line departments and district administration. Refreshed monthly.
          </p>
          <div className="mt-3"><SourceBadge source="Demo" /></div>
        </Card>

        <Card>
          <CardHeader
            title="Sub-score composition"
            subtitle="9 weighted sub-indices · weights sum to 100%"
            right={<SourceBadge source="Demo" />}
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
            {INDEX_SCORES.subs.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium text-ink-800">{s.label}</span>
                    <span className="shrink-0 rounded-md bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">w {Math.round(s.weight * 100)}%</span>
                  </span>
                  <span className="ml-2 shrink-0 text-sm font-semibold text-ink-900">{s.score}</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. Trend */}
      <div className="mt-6">
        <ChartCard
          title="Index trend — last 12 months"
          subtitle="Aug to Jul · +7 pts over the period"
          source="Demo"
          height={280}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INDEX_TREND} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gIndexTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 95]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <ReTooltip
                cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                formatter={(v: number) => [`${v} / 100`, 'Index']}
              />
              <Area type="monotone" dataKey="v" name="Index" stroke="#0B57D0" strokeWidth={2} fill="url(#gIndexTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 3. Improvement simulator */}
      <Card className="mt-6">
        <CardHeader
          title={
            <span className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><SlidersHorizontal className="h-3.5 w-3.5" /></span>
              Improvement simulator
            </span>
          }
          subtitle="Move the levers to see the projected index. Math is transparent — each lever lifts specific weighted sub-scores."
          right={
            <button
              onClick={() => setLevers(ZERO_LEVERS)}
              disabled={!touched}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition',
                touched
                  ? 'border-brand-200 bg-brand-soft text-brand-700 hover:bg-brand-100'
                  : 'cursor-not-allowed border-ink-100 bg-ink-50 text-ink-400',
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset to baseline
            </button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Levers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {LEVERS.map((lever) => (
              <div key={lever.id} className="rounded-xl border border-ink-100 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink-800">{lever.label}</span>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label={`Decrease ${lever.label}`}
                      onClick={() => setLever(lever.id, levers[lever.id] - lever.step, lever.max)}
                      className="grid h-6 w-6 place-items-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-14 text-center text-sm font-semibold tabular-nums text-brand-700">
                      {levers[lever.id]}{lever.unit === '%' ? '%' : ` ${lever.unit}`}
                    </span>
                    <button
                      aria-label={`Increase ${lever.label}`}
                      onClick={() => setLever(lever.id, levers[lever.id] + lever.step, lever.max)}
                      className="grid h-6 w-6 place-items-center rounded-md border border-ink-200 text-ink-600 transition hover:bg-ink-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={lever.max}
                  step={lever.step}
                  value={levers[lever.id]}
                  onChange={(e) => setLever(lever.id, Number(e.target.value), lever.max)}
                  aria-label={lever.label}
                  className="mt-3 w-full"
                  style={{ accentColor: '#0B57D0' }}
                />
                <div className="mt-2 text-[11px] leading-snug text-ink-500">{lever.formula}</div>
              </div>
            ))}
          </div>

          {/* Output */}
          <div className="flex flex-col rounded-2xl bg-brand-gradient p-5 text-white">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Simulated index</div>
            <div className="mt-2 flex flex-wrap items-baseline gap-2.5">
              <span className="text-4xl font-semibold leading-none tabular-nums">{simulation.simIndex.toFixed(1)}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  simulation.delta > 0 ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/10 text-white/70',
                )}
              >
                {simulation.delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                {simulation.delta > 0 ? '+' : ''}{simulation.delta.toFixed(1)} pts
              </span>
            </div>
            <div className="mt-1.5 text-xs text-white/70">Baseline {INDEX_SCORES.overall}.0 · sub-scores capped at 100</div>

            <div className="mt-4 border-t border-white/15 pt-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Sub-score impact</div>
              {impacted.length === 0 ? (
                <p className="mt-2 text-xs text-white/60">No levers applied yet — adjust a slider to project the impact.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {impacted.map((s) => (
                    <li key={s.key} className="flex items-center justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate text-white/85">{s.label} <span className="text-white/50">(w {Math.round(s.weight * 100)}%)</span></span>
                      <span className="shrink-0 font-semibold tabular-nums text-emerald-200">
                        {s.score} → {s.simScore.toFixed(1)} <span className="text-white/60">(+{(s.lift * s.weight).toFixed(2)} idx)</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-3 text-[10.5px] leading-snug text-white/50">
              Projection = baseline + Σ (sub-score lift × weight). Advisory only — human approval required before target-setting.
            </div>
          </div>
        </div>
      </Card>

      {/* 4. What changed this month */}
      <Card className="mt-6">
        <CardHeader
          title="What changed this month?"
          subtitle="Drivers behind the +1.0 pt movement from Jun (90) to Jul (91)"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <TrendingUp className="h-4 w-4" /> Top 5 reasons score improved
            </div>
            <ul className="space-y-1.5">
              {IMPROVED.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-700">
                  <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-3.5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-800">
              <TrendingDown className="h-4 w-4" /> Top 5 reasons score declined
            </div>
            <ul className="space-y-1.5">
              {DECLINED.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-700">
                  <ArrowDownRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* 6 + 7. Contribution breakdown + risk-adjusted score */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader
            title="Score contribution breakdown"
            subtitle={`Weight × score per sub-index · weighted total ${totalContribution.toFixed(1)} pts, indexed to headline ${INDEX_SCORES.overall}`}
            right={<SourceBadge source="Demo" />}
          />
          <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label="Contribution of each sub-index to the overall score">
            {contributions.map((c, i) => (
              <div
                key={c.key}
                title={`${c.label}: ${c.pts.toFixed(1)} pts`}
                className="h-full bg-brand-600 first:rounded-l-full last:rounded-r-full"
                style={{ width: `${(c.pts / totalContribution) * 100}%`, opacity: 1 - i * 0.09 }}
              />
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {contributions.map((c, i) => (
              <li key={c.key} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-brand-600" style={{ opacity: 1 - i * 0.09 }} />
                  <span className="truncate text-ink-700">{c.label}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-ink-500">
                  {Math.round(c.weight * 100)}% × {c.score} = <span className="font-semibold text-ink-800">{c.pts.toFixed(1)} pts</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-100"><Scale className="h-3.5 w-3.5" /></span>
            <span className="section-title text-ink-800">Risk-adjusted score</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="text-center">
              <div className="text-3xl font-semibold text-ink-900">{INDEX_SCORES.overall}</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-500">Overall</div>
            </div>
            <ArrowDownRight className="h-5 w-5 text-amber-500" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-amber-600">88.4</div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-500">Risk-adjusted</div>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            A −2.6 pt haircut for open exposure: 2 High-risk departments (Revenue, Urban Development),
            2 worsening SLA workflows (RTI response, audit compliance) and ageing court compliance orders.
            Clearing these restores the full headline score.
          </p>
          <div className="mt-auto pt-3"><SourceBadge source="Demo" /></div>
        </Card>
      </div>

      {/* 5. Rankings */}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <Building2 className="h-4 w-4 text-brand-600" />
          <span className="section-title text-ink-800">Department ranking</span>
          <span className="text-xs text-ink-500">· 13 departments, ranked by composite score</span>
        </div>
        <DataTable
          columns={deptColumns}
          rows={deptRows}
          searchKeys={['name', 'code']}
          actions={<SourceBadge source="Demo" />}
          compact
        />
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 px-1">
          <MapPin className="h-4 w-4 text-brand-600" />
          <span className="section-title text-ink-800">District ranking</span>
          <span className="text-xs text-ink-500">· top 15 districts, ranked by SLA + inspection + compliance composite</span>
        </div>
        <DataTable
          columns={districtColumns}
          rows={districtRows}
          searchKeys={['name']}
          actions={<SourceBadge source="Demo" />}
          compact
        />
      </div>

      {/* 8. AI interventions */}
      <div className="mt-6">
        <AIRecommendationPanel title="AI Suggested Interventions" recommendations={RECOMMENDATIONS} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function RankChip({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        'grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold',
        rank <= 3 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-ink-50 text-ink-600',
      )}
    >
      {rank}
    </span>
  )
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded bg-ink-100">
        <div className="h-full rounded bg-brand-gradient" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums">{value}</span>
    </div>
  )
}
