import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  ChevronLeft, ExternalLink, Ticket, Star, MapPin, ArrowRight, Gavel,
  ShieldCheck, ClipboardCheck, UserCheck, FileSignature, Send, SearchCheck,
  Stamp, Building2, AlertTriangle, CircleDashed,
} from 'lucide-react'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'

/* ------------------------------------------------------------------ */
/* Demo data — Maharashtra Right to Public Services (RTS) Act, 2015    */
/* ------------------------------------------------------------------ */

interface Service {
  name: string
  marathi: string
  slaDays: number
  tatDays: number
  onTime: number
  dailyVol: number
  officer: string
}

const SERVICES: Service[] = [
  { name: 'Income Certificate', marathi: 'उत्पन्न दाखला', slaDays: 15, tatDays: 9.2, onTime: 96, dailyVol: 1240, officer: 'Tahsildar' },
  { name: 'Domicile Certificate', marathi: 'अधिवास प्रमाणपत्र', slaDays: 15, tatDays: 12.8, onTime: 88, dailyVol: 860, officer: 'Sub-Divisional Officer' },
  { name: '7/12 Extract', marathi: 'सातबारा उतारा', slaDays: 3, tatDays: 0.4, onTime: 99, dailyVol: 4310, officer: 'Talathi' },
  { name: 'Senior Citizen Certificate', marathi: 'ज्येष्ठ नागरिक दाखला', slaDays: 7, tatDays: 5.1, onTime: 93, dailyVol: 210, officer: 'Tahsildar' },
  { name: 'Birth Certificate', marathi: 'जन्म दाखला', slaDays: 5, tatDays: 6.3, onTime: 71, dailyVol: 980, officer: 'Registrar (Gram Sevak / Ward)' },
  { name: 'Caste Certificate', marathi: 'जात प्रमाणपत्र', slaDays: 45, tatDays: 32.0, onTime: 90, dailyVol: 720, officer: 'Sub-Divisional Officer' },
  { name: 'Non-Creamy Layer', marathi: 'उन्नत गटात मोडत नसल्याचे', slaDays: 21, tatDays: 19.4, onTime: 82, dailyVol: 640, officer: 'Deputy Collector' },
  { name: 'Solvency Certificate', marathi: 'ऐपत दाखला', slaDays: 21, tatDays: 16.0, onTime: 91, dailyVol: 95, officer: 'Tahsildar' },
]

const DISTRICTS = [
  { name: 'Mumbai City', pct: 94 },
  { name: 'Mumbai Suburban', pct: 92 },
  { name: 'Pune', pct: 91 },
  { name: 'Ratnagiri', pct: 90 },
  { name: 'Nagpur', pct: 89 },
  { name: 'Satara', pct: 87 },
  { name: 'Nashik', pct: 86 },
  { name: 'Thane', pct: 85 },
  { name: 'Sangli', pct: 83 },
  { name: 'Chh. Sambhajinagar', pct: 82 },
  { name: 'Solapur', pct: 79 },
  { name: 'Kolhapur', pct: 78 },
  { name: 'Amravati', pct: 74 },
  { name: 'Nanded', pct: 71 },
]

const JOURNEY = [
  { step: 'Apply', detail: 'Portal / Seva Kendra with e-KYC', hours: 0.4, icon: Send },
  { step: 'Scrutiny', detail: 'Clerk verifies documents', hours: 26, icon: SearchCheck },
  { step: 'Designated Officer', detail: 'Decision under RTS Act', hours: 58, icon: Stamp },
  { step: 'Digitally signed certificate', detail: 'DSC applied, QR verifiable', hours: 6, icon: FileSignature },
  { step: 'Delivery', detail: 'DigiLocker / download / Seva Kendra', hours: 2, icon: UserCheck },
]

const WEEKLY_VOLUME = [
  { w: 'W1', apps: 58.2 },
  { w: 'W2', apps: 60.1 },
  { w: 'W3', apps: 59.4 },
  { w: 'W4', apps: 62.3 },
  { w: 'W5', apps: 64.8 },
  { w: 'W6', apps: 63.5 },
  { w: 'W7', apps: 66.9 },
  { w: 'W8', apps: 68.4 },
]

/* ------------------------------------------------------------------ */
/* SLA health helpers                                                  */
/* ------------------------------------------------------------------ */

type Health = 'good' | 'watch' | 'breach'

function slaHealth(s: Service): Health {
  const ratio = s.tatDays / s.slaDays
  if (ratio > 1) return 'breach'
  if (ratio > 0.75) return 'watch'
  return 'good'
}

const HEALTH_EDGE: Record<Health, string> = {
  good: 'border-t-emerald-500',
  watch: 'border-t-amber-500',
  breach: 'border-t-red-500',
}

const HEALTH_BAR: Record<Health, string> = {
  good: 'bg-emerald-500',
  watch: 'bg-amber-500',
  breach: 'bg-red-500',
}

function districtDot(pct: number) {
  if (pct >= 85) return 'bg-emerald-500'
  if (pct >= 75) return 'bg-amber-500'
  return 'bg-red-500'
}

/* ------------------------------------------------------------------ */
/* Readiness ring (hero)                                               */
/* ------------------------------------------------------------------ */

function ReadinessRing({ pct }: { pct: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28" role="img" aria-label={`Connector readiness ${pct}%`}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={8} />
      <circle
        cx={50} cy={50} r={r} fill="none" stroke="#FCC934" strokeWidth={8} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 50 50)"
      />
      <text x={50} y={48} textAnchor="middle" fill="#fff" fontSize={20} fontWeight={700}>{pct}%</text>
      <text x={50} y={64} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={8} letterSpacing={1}>READINESS</text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function AapleSarkarPage() {
  const aaple = INTEGRATIONS.find((x) => x.slug === 'aaple-sarkar')!

  return (
    <div className="space-y-6">
      {/* ---------------- Hero: service counter band ---------------- */}
      <div className="card relative overflow-hidden bg-brand-gradient p-6 text-white sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{ backgroundImage: 'radial-gradient(at 15% 0%, rgba(255,255,255,0.3) 0, transparent 45%), radial-gradient(at 95% 90%, rgba(252,201,52,0.25) 0, transparent 45%)' }}
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link to="/integrations" className="inline-flex items-center gap-1 text-xs font-medium text-white/70 transition hover:text-white">
              <ChevronLeft className="h-3.5 w-3.5" /> All integrations
            </Link>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Ticket className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{aaple.name}</h1>
                <p className="text-sm font-medium text-white/85">आपले सरकार — सेवा हमी</p>
              </div>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
              Maharashtra's Right to Public Services counter — notified services with statutory
              delivery guarantees, designated officers and an appeal ladder that ends at the
              RTS Commission.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={aaple.status} className="!border-white/30 !bg-white/10 !text-white" />
              <span className="chip border border-white/30 bg-white/10 text-white">
                <Building2 className="h-3 w-3" /> Data owner · {aaple.dataOwner}
              </span>
              <a href={aaple.url} target="_blank" rel="noreferrer" className="chip border border-white/30 bg-white/10 text-white transition hover:bg-white/20">
                aaplesarkar.mahaonline.gov.in <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <ReadinessRing pct={aaple.connectorReadiness} />
            <div className="text-center text-[11px] text-white/70">
              {aaple.requiredApprovals.join(' · ')} pending
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Service catalog ---------------- */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <h3 className="text-base font-semibold text-ink-900">Notified service catalog</h3>
            <p className="text-xs text-ink-500">8 RTS-notified services · statutory SLA vs live turnaround · Demo data until DIT grants API access</p>
          </div>
          <SourceBadge source="Demo" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => {
            const h = slaHealth(s)
            const meter = Math.min((s.tatDays / s.slaDays) * 100, 100)
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`card card-hover border-t-4 p-4 ${HEALTH_EDGE[h]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-900">{s.name}</div>
                    <div className="truncate text-[11px] text-ink-500">{s.marathi}</div>
                  </div>
                  {h === 'breach' && <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />}
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">RTS SLA</div>
                    <div className="text-lg font-semibold leading-tight text-ink-900">{s.slaDays}<span className="text-xs font-medium text-ink-500"> days</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">Live TAT</div>
                    <div className={`text-lg font-semibold leading-tight ${h === 'breach' ? 'text-red-600' : 'text-ink-900'}`}>
                      {s.tatDays}<span className="text-xs font-medium text-ink-500"> days</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${HEALTH_BAR[h]}`} style={{ width: `${meter}%` }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-ink-500">
                    <span>{s.onTime}% within SLA</span>
                    <span>{s.dailyVol.toLocaleString('en-IN')}/day</span>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 border-t border-ink-100 pt-2 text-[11px] text-ink-600">
                  <Stamp className="h-3 w-3 shrink-0 text-brand-500" />
                  <span className="truncate">Designated officer · {s.officer}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ---------------- District delivery strip ---------------- */}
      <div className="card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-500" />
            <h3 className="text-base font-semibold text-ink-900">District service-delivery compliance</h3>
          </div>
          <SourceBadge source="Demo" />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {DISTRICTS.map((d) => (
            <span
              key={d.name}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700"
            >
              <span className={`h-2 w-2 rounded-full ${districtDot(d.pct)}`} />
              {d.name}
              <span className="font-semibold text-ink-900">{d.pct}%</span>
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium text-ink-500">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ≥85% within SLA</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> 75–84%</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> below 75%</span>
        </div>
      </div>

      {/* ---------------- Application journey stepper ---------------- */}
      <div className="card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-ink-900">Citizen application journey</h3>
            <p className="text-xs text-ink-500">Median hours per stage · ~92h door-to-certificate across notified services</p>
          </div>
          <SourceBadge source="Demo" />
        </div>
        <div className="-mx-1 flex items-stretch gap-0 overflow-x-auto px-1 pb-1">
          {JOURNEY.map((j, i) => {
            const Icon = j.icon
            return (
              <div key={j.step} className="flex shrink-0 items-center">
                <div className="w-44 rounded-xl border border-ink-100 bg-white p-3 transition hover:border-brand-200 hover:bg-brand-50/30">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-lg font-semibold text-ink-900">{j.hours}<span className="text-[11px] font-medium text-ink-500">h</span></span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-ink-800">{i + 1}. {j.step}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-ink-500">{j.detail}</div>
                </div>
                {i < JOURNEY.length - 1 && (
                  <ArrowRight className="mx-1.5 h-4 w-4 shrink-0 text-ink-300" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ---------------- Trend + satisfaction / RTS Act + readiness ---------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Volume trend */}
          <div className="card p-4 sm:p-5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-ink-900">Statewide application volume</h3>
              <SourceBadge source="Demo" />
            </div>
            <p className="mb-3 text-xs text-ink-500">Thousands of applications per week · last 8 weeks</p>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_VOLUME} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aapleVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[50, 75]} tickFormatter={(v) => `${v}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 8px 24px -12px rgba(15,23,42,0.15)' }}
                    formatter={(v: number) => [`${v}k applications`, 'Volume']}
                  />
                  <Area type="monotone" dataKey="apps" stroke="#0B57D0" strokeWidth={2} fill="url(#aapleVol)" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Citizen satisfaction */}
          <div className="card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-ink-900">Citizen satisfaction</h3>
              <SourceBadge source="Demo" />
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <div className="text-4xl font-semibold text-ink-900">4.2<span className="text-lg font-medium text-ink-500">/5</span></div>
                <div className="mt-1 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= 4 ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="min-w-[180px] flex-1 space-y-1.5">
                {[
                  { l: 'Ease of applying', v: 88 },
                  { l: 'Delivery speed', v: 79 },
                  { l: 'Certificate accuracy', v: 92 },
                ].map((m) => (
                  <div key={m.l} className="flex items-center gap-2 text-[11px]">
                    <span className="w-32 shrink-0 text-ink-500">{m.l}</span>
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${m.v}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right font-semibold text-ink-800">{m.v}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-ink-500">Post-delivery SMS survey · 61,204 responses in the last quarter.</div>
          </div>
        </div>

        <div className="space-y-6">
          {/* RTS Act panel */}
          <div className="card p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                <Gavel className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-base font-semibold text-ink-900">RTS Act, 2015 — appeal ladder</h3>
            </div>
            <ol className="space-y-0">
              {[
                { t: 'Designated Officer', d: 'Must deliver within the notified SLA', tag: 'Service level' },
                { t: 'First Appellate Officer', d: 'Appeal within 30 days of refusal or delay', tag: 'Sec 5' },
                { t: 'Second Appeal — Maharashtra RTS Commission', d: 'Commissioner may direct delivery & impose penalty', tag: 'Sec 6' },
              ].map((s, i, arr) => (
                <li key={s.t} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < arr.length - 1 && <span className="absolute left-[11px] top-6 h-full w-0.5 bg-ink-100" />}
                  <span className="relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-ink-900">{s.t}</span>
                      <span className="rounded bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-600">{s.tag}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-ink-500">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Defaulting officers face a penalty of ₹500–₹5,000 per case under Section 10, plus disciplinary action.
            </div>
          </div>

          {/* Connector readiness */}
          <div className="card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-ink-900">Connector readiness</h3>
              <StatusBadge status={aaple.status} />
            </div>
            <div className="mb-3">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-ink-500">Composite score</span>
                <span className="text-2xl font-semibold text-ink-900">{aaple.connectorReadiness}%</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${aaple.connectorReadiness}%` }} />
              </div>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <CircleDashed className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="flex-1 text-ink-700">DIT approval — department API access</span>
                <span className="font-semibold text-amber-600">Pending</span>
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <CircleDashed className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span className="flex-1 text-ink-700">DPO review — citizen data under DPDP</span>
                <span className="font-semibold text-amber-600">Pending</span>
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <ClipboardCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="flex-1 text-ink-700">Connector spec & field mapping drafted</span>
                <span className="font-semibold text-emerald-600">Done</span>
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="flex-1 text-ink-700">Gateway slot reserved · mTLS profile</span>
                <span className="font-semibold text-emerald-600">Done</span>
              </li>
            </ul>
            <div className="mt-3 text-[11px] text-ink-500">
              Access type — {aaple.accessType} · last sync {aaple.lastSync} · live metrics activate once {aaple.dataOwner} grants access.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
