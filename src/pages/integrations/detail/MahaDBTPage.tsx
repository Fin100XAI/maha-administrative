import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
} from 'recharts'
import {
  ChevronLeft, ExternalLink, Landmark, ArrowRightLeft, Banknote, Smartphone,
  ShieldCheck, Fingerprint, CheckCircle2, Clock3, IndianRupee, Filter,
} from 'lucide-react'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

const dbt = INTEGRATIONS.find((x) => x.slug === 'mahadbt')!

/* ------------------------------------------------------------------ */
/* Data — public figures illustrative, demo where marked               */
/* ------------------------------------------------------------------ */

const FLOW_NODES = [
  { icon: Landmark, title: 'State Treasury', sub: 'BEAMS budget release', amount: '₹4,530 Cr sanctioned' },
  { icon: ArrowRightLeft, title: 'MahaDBT 2.0', sub: 'Eligibility check · dedup', amount: '2.04 Cr claims validated' },
  { icon: Banknote, title: 'Aadhaar-linked bank a/c', sub: 'APBS via NPCI mapper', amount: '₹4,218 Cr credited' },
  { icon: Smartphone, title: 'Beneficiary confirmation', sub: 'SMS + portal receipt', amount: '96.4% acknowledged' },
]

const FLOW_EDGE_LABELS = ['₹4,530 Cr', '₹4,218 Cr', '1.84 Cr credits']

const SCHEMES: { name: string; dept: string; beneficiaries: string; disbursed: number; sanctioned: number; status: 'On track' | 'Delayed' | 'Under review' }[] = [
  { name: 'Post-Matric Scholarship', dept: 'Social Justice', beneficiaries: '14.2 L students', disbursed: 1120, sanctioned: 1480, status: 'On track' },
  { name: 'PM-KISAN state top-up', dept: 'Agriculture', beneficiaries: '91.8 L farmers', disbursed: 1684, sanctioned: 1836, status: 'On track' },
  { name: 'Sanjay Gandhi Niradhar Anudan', dept: 'Social Justice', beneficiaries: '18.6 L pensioners', disbursed: 742, sanctioned: 818, status: 'On track' },
  { name: 'Farm machinery subsidy (Krishi Yantrikikaran)', dept: 'Agriculture', beneficiaries: '2.1 L farmers', disbursed: 289, sanctioned: 504, status: 'Delayed' },
  { name: 'Tribal research fellowship', dept: 'Tribal Development', beneficiaries: '8,400 scholars', disbursed: 96, sanctioned: 128, status: 'On track' },
  { name: "Girls' hostel maintenance grant", dept: 'OBC Welfare', beneficiaries: '1.2 L residents', disbursed: 58, sanctioned: 112, status: 'Under review' },
]

const FUNNEL = [
  { stage: 'Registered', value: 2.41, drop: null as number | null },
  { stage: 'e-KYC verified', value: 2.12, drop: 12.0 },
  { stage: 'Approved', value: 1.96, drop: 7.5 },
  { stage: 'Payment initiated', value: 1.88, drop: 4.1 },
  { stage: 'Credited', value: 1.84, drop: 2.1 },
]
const FUNNEL_BLUES = ['#0B57D0', '#3068D6', '#5583E0', '#7FA2E9', '#A7C0F1']

const DISTRICTS = [
  { name: 'Nagpur', pct: 94 }, { name: 'Pune', pct: 91 }, { name: 'Nashik', pct: 88 },
  { name: 'Amravati', pct: 86 }, { name: 'Chh. Sambhajinagar', pct: 84 }, { name: 'Kolhapur', pct: 82 },
  { name: 'Solapur', pct: 79 }, { name: 'Thane', pct: 77 }, { name: 'Nanded', pct: 72 },
  { name: 'Gadchiroli', pct: 64 },
]

const SEASONALITY = [
  { m: 'Apr', cr: 210 }, { m: 'May', cr: 236 }, { m: 'Jun', cr: 388 }, { m: 'Jul', cr: 512 },
  { m: 'Aug', cr: 468 }, { m: 'Sep', cr: 342 }, { m: 'Oct', cr: 296 }, { m: 'Nov', cr: 421 },
  { m: 'Dec', cr: 458 }, { m: 'Jan', cr: 380 }, { m: 'Feb', cr: 289 }, { m: 'Mar', cr: 218 },
]

const SCHEME_STATUS_CLS: Record<string, string> = {
  'On track': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Delayed: 'border-amber-200 bg-amber-50 text-amber-700',
  'Under review': 'border-sky-200 bg-sky-50 text-sky-700',
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function ReadinessRing({ value }: { value: number }) {
  const R = 52
  const C = 2 * Math.PI * R
  return (
    <div className="relative h-[132px] w-[132px]">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={R} fill="none" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-semibold leading-none text-white">{value}%</div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/70">Readiness</div>
        </div>
      </div>
    </div>
  )
}

function HealthMeter({ label, value, target, hint }: { label: string; value: number; target: number; hint: string }) {
  const healthy = value >= target
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-800">
          <Fingerprint className="h-3.5 w-3.5 text-brand-600" /> {label}
        </span>
        <span className={cn('chip border', healthy ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700')}>
          {healthy ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
          {healthy ? 'Healthy' : 'Watch'}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-xl font-semibold text-ink-900">{value}%</span>
        <span className="text-[11px] text-ink-500">target ≥ {target}%</span>
      </div>
      <div className="relative mt-2 h-2.5 rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${value}%` }} />
        <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded bg-ink-400" style={{ left: `${target}%` }} title={`Target ${target}%`} />
      </div>
      <p className="mt-2 text-[11px] text-ink-500">{hint}</p>
    </div>
  )
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 self-center">
      <span className="whitespace-nowrap rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">{label}</span>
      <svg viewBox="0 0 96 12" className="h-3 w-full" aria-hidden>
        <line x1="2" y1="6" x2="82" y2="6" stroke="#0B57D0" strokeWidth="1.5" strokeDasharray="5 4" />
        <path d="M82 1 L94 6 L82 11 Z" fill="#0B57D0" />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function MahaDBTPage() {
  return (
    <div className="space-y-6">
      {/* ---------------- Hero: funds-flow exchange banner ---------------- */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-glow">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <Link to="/integrations" className="inline-flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white hover:underline">
              <ChevronLeft className="h-3.5 w-3.5" /> All integrations
            </Link>
            <h1 className="mt-2 text-xl font-semibold sm:text-2xl">{dbt.name} — Funds-Flow Exchange</h1>
            <p className="mt-1 text-sm text-white/75">{dbt.description} Category: {dbt.category} · Data owner: {dbt.dataOwner} Department.</p>
            <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="h-6 w-6 translate-y-0.5 text-white/80" />
                  <span className="text-4xl font-semibold tabular-nums leading-none sm:text-5xl">4,218 Cr</span>
                </div>
                <div className="mt-1.5 text-xs font-medium text-white/70">disbursed FY 2026-27 · public data, illustrative</div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/80">
                <span><span className="font-semibold text-white">92</span> schemes live</span>
                <span><span className="font-semibold text-white">1.84 Cr</span> beneficiaries credited</span>
                <span><span className="font-semibold text-white">₹312 Cr</span> leakage prevented</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={dbt.status} className="!border-white/40 !bg-white/15 !text-white" />
              <span className="chip border border-white/30 bg-white/10 text-white/90">Readiness {dbt.connectorReadiness}%</span>
              {dbt.url && (
                <a href={dbt.url} target="_blank" rel="noreferrer" className="header-btn-outline !px-3 !py-1.5 !text-xs">
                  Open MahaDBT portal <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center lg:pr-2">
            <ReadinessRing value={dbt.connectorReadiness} />
          </div>
        </div>
      </div>

      {/* ---------------- Signature: funds flow diagram ---------------- */}
      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Funds flow — treasury to beneficiary</h2>
            <p className="mt-0.5 text-xs text-ink-500">Aadhaar Payment Bridge (APBS) route for FY 2026-27 disbursals.</p>
          </div>
          <SourceBadge source="Public-source linked" />
        </div>
        <div className="max-w-full overflow-x-auto pb-2">
          <div className="flex min-w-[880px] items-stretch gap-0">
            {FLOW_NODES.map((n, idx) => (
              <div key={n.title} className="contents">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col justify-between rounded-xl border p-3.5',
                    idx === 1 ? 'border-brand-200 bg-brand-soft ring-1 ring-brand-100' : 'border-ink-100 bg-white',
                  )}
                >
                  <div>
                    <span className={cn('grid h-9 w-9 place-items-center rounded-lg', idx === 1 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-brand-soft text-brand-600 ring-1 ring-brand-100')}>
                      <n.icon className="h-[18px] w-[18px]" />
                    </span>
                    <div className="mt-2 text-sm font-semibold text-ink-900">{n.title}</div>
                    <div className="text-[11px] text-ink-500">{n.sub}</div>
                  </div>
                  <div className="mt-3 rounded-lg bg-ink-50 px-2 py-1 text-[11px] font-semibold text-ink-700">{n.amount}</div>
                </motion.div>
                {idx < FLOW_NODES.length - 1 && <FlowArrow label={FLOW_EDGE_LABELS[idx]} />}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            <span className="font-semibold">DBT savings —</span> ₹312 Cr leakage prevented this FY through Aadhaar-based deduplication and removal of ghost beneficiaries, versus the pre-DBT manual disbursal baseline.
          </span>
        </div>
      </div>

      {/* -------- Scheme board + beneficiary funnel -------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Scheme disbursal board */}
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink-900">Scheme disbursal board</h2>
              <p className="mt-0.5 text-xs text-ink-500">Disbursed vs sanctioned, FY 2026-27 — six highest-outlay MahaDBT schemes.</p>
            </div>
            <SourceBadge source="Demo" />
          </div>
          <ul className="space-y-3">
            {SCHEMES.map((s, idx) => {
              const pct = Math.round((s.disbursed / s.sanctioned) * 100)
              return (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-ink-100 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-ink-900">{s.name}</span>
                      <span className="ml-2 text-[11px] text-ink-500">{s.dept} · {s.beneficiaries}</span>
                    </div>
                    <span className={cn('chip border', SCHEME_STATUS_CLS[s.status])}>{s.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-ink-100">
                      <div
                        className={cn('h-full rounded-full', pct >= 75 ? 'bg-brand-gradient' : pct >= 60 ? 'bg-amber-500' : 'bg-amber-400')}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-ink-700">
                      ₹{s.disbursed.toLocaleString('en-IN')} / ₹{s.sanctioned.toLocaleString('en-IN')} Cr · {pct}%
                    </span>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* Beneficiary funnel */}
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink-900">Beneficiary funnel</h2>
              <p className="mt-0.5 text-xs text-ink-500">FY 2026-27 pipeline, in crore beneficiaries.</p>
            </div>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100"><Filter className="h-4 w-4" /></span>
          </div>
          <ul className="space-y-3.5">
            {FUNNEL.map((f, idx) => {
              const width = (f.value / FUNNEL[0].value) * 100
              return (
                <li key={f.stage}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-medium text-ink-700">{f.stage}</span>
                    <span className="tabular-nums text-ink-500">
                      <span className="font-semibold text-ink-800">{f.value.toFixed(2)} Cr</span>
                      {f.drop != null && <span className="ml-2 rounded bg-red-50 px-1 py-0.5 font-semibold text-red-600 ring-1 ring-red-100">−{f.drop.toFixed(1)}%</span>}
                    </span>
                  </div>
                  <div className="h-4 rounded-md bg-ink-50 ring-1 ring-inset ring-ink-100">
                    <motion.div
                      className="h-full rounded-md"
                      style={{ backgroundColor: FUNNEL_BLUES[idx] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-[11px] text-ink-500">
            Largest drop-off is at e-KYC — 29 lakh registrants pending biometric or OTP verification, concentrated in tribal talukas.
          </p>
        </div>
      </div>

      {/* -------- Seasonality + district heat-strip + health -------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Seasonality */}
        <div className="card p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink-900">Disbursal seasonality — FY 2026-27</h2>
              <p className="mt-0.5 text-xs text-ink-500">Monthly credits in ₹ crore. Shaded bands mark kharif and rabi input-subsidy peaks.</p>
            </div>
            <SourceBadge source="Demo" />
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEASONALITY} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#EEF2F7" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                  formatter={(v: number) => [`₹${v} Cr`, 'Disbursed']}
                />
                <ReferenceArea x1="Jun" x2="Aug" fill="#0B57D0" fillOpacity={0.06} label={{ value: 'Kharif peak', position: 'insideTop', fontSize: 10, fill: '#0B57D0', fontWeight: 600 }} />
                <ReferenceArea x1="Nov" x2="Jan" fill="#0B57D0" fillOpacity={0.06} label={{ value: 'Rabi peak', position: 'insideTop', fontSize: 10, fill: '#0B57D0', fontWeight: 600 }} />
                <Line type="monotone" dataKey="cr" stroke="#0B57D0" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* District heat-strip */}
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-ink-900">District disbursal heat-strip</h2>
              <SourceBadge source="Demo" />
            </div>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.map((d) => {
                const alpha = Math.min(1, Math.max(0.12, (d.pct - 58) / 38))
                const dark = alpha > 0.55
                return (
                  <span
                    key={d.name}
                    title={`${d.name} — ${d.pct}% of sanctioned amount disbursed`}
                    className={cn('rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ring-1 ring-inset', dark ? 'text-white ring-transparent' : 'text-ink-800 ring-brand-100')}
                    style={{ backgroundColor: `rgba(11, 87, 208, ${alpha.toFixed(2)})` }}
                  >
                    {d.name} · {d.pct}%
                  </span>
                )
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-ink-500">
              <span>Low</span>
              <span className="h-2 w-24 rounded-full bg-gradient-to-r from-brand-50 to-brand-700" />
              <span>High · % of sanctioned amount disbursed</span>
            </div>
          </div>

          {/* Health meters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <HealthMeter label="Aadhaar seeding" value={97.2} target={95} hint="Active beneficiaries whose bank account is Aadhaar-seeded." />
            <HealthMeter label="NPCI mapper sync" value={94.6} target={95} hint="Accounts resolving on the NPCI mapper; failures retried nightly." />
          </div>

          {/* Connector readiness */}
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-ink-900">Connector readiness</h2>
              <StatusBadge status={dbt.status} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-ink-900">{dbt.connectorReadiness}%</span>
              <span className="text-xs text-ink-500">composite score</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${dbt.connectorReadiness}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {dbt.requiredApprovals.map((a) => (
                <li key={a} className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
                  <span className="text-ink-700">{a}</span>
                  <span className="chip border border-amber-200 bg-amber-50 text-amber-700"><Clock3 className="h-3 w-3" /> Pending</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <span className="text-ink-700">Access type</span>
                <span className="text-xs font-medium text-ink-600">{dbt.accessType}</span>
              </li>
              <li className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <span className="text-ink-700">Last sync</span>
                <span className="text-xs font-medium text-ink-600">Not connected — figures on this page are public-portal derived</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
