import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'
import {
  ChevronLeft, MessageSquare, RadioTower, ShieldCheck, Smartphone, Timer,
  IndianRupee, Moon, BadgeCheck, ExternalLink, Signal, Ban, PhoneOff, FileWarning,
} from 'lucide-react'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Data — SMS Gateway pulse board (slug: 'sms')                        */
/* ------------------------------------------------------------------ */

const gw = INTEGRATIONS.find((x) => x.slug === 'sms')!

const PHONE_MESSAGES = [
  {
    id: 'otp',
    text: '482913 is your OTP for Aaple Sarkar login. Valid for 10 minutes. Do not share with anyone. - MAHGOV',
    caption: 'OTP · Transactional · DLT 1107162051234567891',
    time: '09:28',
  },
  {
    id: 'dbt',
    text: 'प्रिय लाभार्थी, MahaDBT अंतर्गत तुमच्या बँक खात्यात ₹2,500 जमा झाले आहेत. तपशील: mahadbt.maharashtra.gov.in - MAHGOV',
    caption: 'Scheme credit (Marathi) · Service-Implicit · DLT 1107162051234567892',
    time: '09:12',
  },
  {
    id: 'hearing',
    text: 'Reminder: Your hearing for case RTS/2026/48122 is on 10-Jul-2026, 11:00 AM at Collector Office, Pune. - MAHGOV',
    caption: 'Hearing reminder · Service-Implicit · DLT 1107162051234567893',
    time: '08:55',
  },
]

const DLT_TEMPLATES = [
  { id: '1107162051234567891', name: 'Aaple Sarkar login OTP', category: 'Transactional', lang: 'EN', usage: 412480, status: 'Approved' },
  { id: '1107162051234567892', name: 'MahaDBT scheme credit alert', category: 'Service-Implicit', lang: 'MR', usage: 238114, status: 'Approved' },
  { id: '1107162051234567893', name: 'RTS hearing reminder', category: 'Service-Implicit', lang: 'EN', usage: 96450, status: 'Approved' },
  { id: '1107162051234567894', name: 'Aaple Sarkar application status', category: 'Service-Implicit', lang: 'MR', usage: 187203, status: 'Approved' },
  { id: '1107162051234567895', name: 'GR publication alert', category: 'Service-Implicit', lang: 'EN', usage: 64882, status: 'Approved' },
  { id: '1107162051234567896', name: 'Payment confirmation', category: 'Transactional', lang: 'EN', usage: 201356, status: 'Approved' },
]

const DELIVERY_PULSE = [
  { h: '00', rate: 99.1 }, { h: '02', rate: 99.3 }, { h: '04', rate: 99.2 },
  { h: '06', rate: 98.9 }, { h: '08', rate: 98.4 }, { h: '10', rate: 98.1 },
  { h: '11', rate: 97.9 }, { h: '12', rate: 98.3 }, { h: '14', rate: 98.5 },
  { h: '16', rate: 98.2 }, { h: '18', rate: 98.8 }, { h: '20', rate: 99.0 },
  { h: '22', rate: 99.2 },
]

/* Categorical palette validated with the dataviz six-checks script (light surface):
   #0B57D0 · #0D9488 · #B45309 · #6D28D9 — all PASS (CVD ΔE ≥ 22, contrast ≥ 3:1). */
const CARRIERS = [
  { name: 'Jio', value: 38, color: '#0B57D0' },
  { name: 'Airtel', value: 31, color: '#0D9488' },
  { name: 'Vi', value: 19, color: '#B45309' },
  { name: 'BSNL', value: 12, color: '#6D28D9' },
]

const FAILURES = [
  { reason: 'DND registry block', icon: Ban, count: 5120 },
  { reason: 'Invalid / switched-off number', icon: PhoneOff, count: 3860 },
  { reason: 'Template mismatch (DLT scrub)', icon: FileWarning, count: 1240 },
]

const COST_TREND = [
  { m: 'Feb', volume: 0.98, cost: 11.76 },
  { m: 'Mar', volume: 1.04, cost: 12.48 },
  { m: 'Apr', volume: 1.11, cost: 13.32 },
  { m: 'May', volume: 1.02, cost: 12.24 },
  { m: 'Jun', volume: 1.16, cost: 13.92 },
  { m: 'Jul', volume: 1.2, cost: 14.4 },
]

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 24px -12px rgba(15,23,42,0.18)',
} as const

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function SMSPage() {
  const maxFail = Math.max(...FAILURES.map((f) => f.count))

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/integrations" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
        <ChevronLeft className="h-4 w-4" /> All integrations
      </Link>

      {/* ---------------- Hero: dark-ink pulse band ---------------- */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-ink-900 text-white shadow-glow"
      >
        {/* brand gradient edge + glow */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-brand-gradient" />
        <div aria-hidden className="pointer-events-none absolute -right-28 top-0 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-brand-700/30 blur-3xl" />

        <div className="relative flex flex-wrap items-center gap-x-10 gap-y-6 p-5 sm:p-7">
          <div className="min-w-[240px] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <RadioTower className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/60">DLT Message Pulse Board</div>
                <h1 className="text-xl font-semibold sm:text-2xl">{gw.name}</h1>
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm text-white/70">
              {gw.description} All citizen-facing SMS for Government of Maharashtra flows through this
              TRAI-DLT-scrubbed pipe under the MAHGOV sender header.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Connected
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium">
                <BadgeCheck className="h-3 w-3" /> DLT registered · Principal Entity: DIT GoM
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-medium">
                <Signal className="h-3 w-3" /> Header of record: MAHGOV
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <HeroFact k="API health" v={`${gw.apiHealth}%`} />
              <HeroFact k="Readiness" v={`${gw.connectorReadiness}%`} />
              <HeroFact k="Security" v={gw.securityStatus} />
              <HeroFact k="Last sync" v={gw.lastSync.split(' ')[1] ?? gw.lastSync} />
            </div>
          </div>

          {/* Animated pulse metric */}
          <div className="mx-auto flex shrink-0 flex-col items-center gap-3 sm:mx-0">
            <div className="relative grid h-44 w-44 place-items-center">
              <span aria-hidden className="absolute inset-0 rounded-full border border-brand-400/40" />
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-2 border-brand-400/50"
                animate={{ scale: [1, 1.22], opacity: [0.7, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-4 rounded-full border border-brand-300/40"
                animate={{ scale: [1, 1.18], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              />
              <div className="relative text-center">
                <div className="text-4xl font-semibold tabular-nums">1.2M</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">SMS this month</div>
              </div>
            </div>
            <div className="text-center text-[11px] text-white/60">98.7% delivered · ₹0.12 per SMS</div>
          </div>
        </div>
      </motion.section>

      {/* ---------------- Signature visual: phone mockup + DLT board ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* Phone mockup */}
        <section className="card flex flex-col items-center p-4 sm:p-5">
          <div className="mb-3 self-start">
            <h2 className="section-title">On the citizen&apos;s handset</h2>
            <p className="mt-0.5 text-xs text-ink-500">Sample MAHGOV messages as delivered.</p>
          </div>
          <div className="w-full max-w-[300px] rounded-[2.4rem] border-[10px] border-ink-900 bg-ink-900 shadow-glow">
            <div className="overflow-hidden rounded-[1.8rem] bg-ink-50">
              {/* notch + status bar */}
              <div className="relative bg-white pb-2 pt-2">
                <div className="mx-auto h-5 w-28 rounded-full bg-ink-900" />
                <div className="mt-2 flex items-center justify-between px-4 text-[10px] font-medium text-ink-500">
                  <span>09:29</span>
                  <span className="inline-flex items-center gap-1"><Signal className="h-3 w-3" /> 4G · 82%</span>
                </div>
                <div className="mt-1 border-b border-ink-100 px-4 pb-2 text-center text-xs font-semibold text-ink-800">
                  MAHGOV
                  <span className="ml-1 align-middle text-[9px] font-medium text-emerald-600">✓ Verified sender</span>
                </div>
              </div>
              {/* messages */}
              <div className="space-y-3 px-3 py-4">
                {PHONE_MESSAGES.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.15 }}
                  >
                    <div className="relative mr-8 rounded-2xl rounded-tl-sm border border-ink-200 bg-white p-2.5 text-[11px] leading-relaxed text-ink-800 shadow-sm">
                      {m.text}
                      <span className="mt-1 block text-right text-[9px] text-ink-400">{m.time}</span>
                    </div>
                    <div className="mt-1 px-1 text-[9px] font-medium text-ink-400">{m.caption}</div>
                  </motion.div>
                ))}
              </div>
              {/* home bar */}
              <div className="bg-white py-2">
                <div className="mx-auto h-1 w-24 rounded-full bg-ink-300" />
              </div>
            </div>
          </div>
        </section>

        {/* DLT template board */}
        <section className="card overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 p-4">
            <div>
              <h2 className="section-title">DLT template board</h2>
              <p className="mt-0.5 text-xs text-ink-500">Six templates registered on the TRAI DLT platform.</p>
            </div>
            <span className="chip border border-brand-200 bg-brand-50 text-brand-700">
              <MessageSquare className="h-3 w-3" /> Header: MAHGOV
            </span>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr>
                  <th className="table-th">Template ID</th>
                  <th className="table-th">Name</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Lang</th>
                  <th className="table-th text-right">Usage · 30d</th>
                  <th className="table-th">DLT status</th>
                </tr>
              </thead>
              <tbody>
                {DLT_TEMPLATES.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-50/40">
                    <td className="table-td font-mono text-[11px] text-ink-600">{t.id}</td>
                    <td className="table-td font-medium text-ink-800">{t.name}</td>
                    <td className="table-td">
                      <span className={cn('chip border',
                        t.category === 'Transactional'
                          ? 'border-brand-200 bg-brand-50 text-brand-700'
                          : 'border-ink-200 bg-ink-50 text-ink-600',
                      )}>{t.category}</span>
                    </td>
                    <td className="table-td text-xs font-semibold text-ink-600">{t.lang}</td>
                    <td className="table-td text-right tabular-nums">{t.usage.toLocaleString('en-IN')}</td>
                    <td className="table-td">
                      <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                        <BadgeCheck className="h-3 w-3" /> {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-ink-100 px-4 py-2 text-[11px] text-ink-500">
            Scrubbing: every send is matched against the registered template before handover to the telco.
          </div>
        </section>
      </div>

      {/* ---------------- Delivery pulse + carrier split + failures ---------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Delivery pulse line */}
        <section className="card p-4 sm:p-5 xl:col-span-1">
          <h2 className="section-title">Delivery pulse · 24h</h2>
          <p className="mt-0.5 text-xs text-ink-500">Per-hour delivery rate vs 98.7% monthly average.</p>
          <div className="mt-3 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DELIVERY_PULSE} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[97, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Delivery rate']} labelFormatter={(l) => `${l}:00 hrs`} />
                <ReferenceLine y={98.7} stroke="#94a3b8" strokeDasharray="6 4" label={{ value: 'avg 98.7%', position: 'insideTopRight', fill: '#64748b', fontSize: 10 }} />
                <Line type="monotone" dataKey="rate" stroke="#0B57D0" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Carrier split donut */}
        <section className="card p-4 sm:p-5 xl:col-span-1">
          <h2 className="section-title">Carrier split</h2>
          <p className="mt-0.5 text-xs text-ink-500">Terminating network share, this month.</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CARRIERS} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={2} strokeWidth={2} stroke="#ffffff">
                    {CARRIERS.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-xl font-semibold tabular-nums text-ink-900">4</div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">telcos</div>
                </div>
              </div>
            </div>
            <ul className="min-w-[120px] space-y-2 text-sm">
              {CARRIERS.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.color }} />
                  <span className="min-w-0 flex-1 text-ink-700">{c.name}</span>
                  <span className="font-semibold tabular-nums text-ink-900">{c.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Failure reasons */}
        <section className="card p-4 sm:p-5 xl:col-span-1">
          <h2 className="section-title">Failure reasons</h2>
          <p className="mt-0.5 text-xs text-ink-500">10,220 undelivered of ~1.2M sent (0.85%).</p>
          <div className="mt-4 space-y-4">
            {FAILURES.map((f) => (
              <div key={f.reason}>
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <f.icon className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1 font-medium text-ink-700">{f.reason}</span>
                  <span className="tabular-nums text-ink-500">{f.count.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(f.count / maxFail) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-[#B45309]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-ink-100 bg-ink-50/60 p-3 text-[11px] leading-relaxed text-ink-600">
            DND blocks apply only to promotional traffic — transactional OTPs are always delivered.
            Template-mismatch failures auto-open a ticket with the DLT registrar.
          </div>
        </section>
      </div>

      {/* ---------------- OTP performance + cost panel ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* OTP performance */}
        <section className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="section-title">OTP performance</h2>
            <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700"><Timer className="h-3 w-3" /> Within SLA</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">Latency from API accept to handset delivery.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <LatencyStat k="Median" v="4.2s" note="p50 delivery" emphasis />
            <LatencyStat k="p95" v="9.8s" note="worst 5%" />
            <LatencyStat k="Retry rate" v="1.6%" note="auto re-route" />
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[11px] text-ink-500">
              <span>0s</span><span>SLA target &lt; 15s</span>
            </div>
            <div className="relative h-2.5 rounded-full bg-ink-100">
              <div className="absolute inset-y-0 left-0 rounded-full bg-brand-gradient" style={{ width: `${(4.2 / 15) * 100}%` }} />
              <div className="absolute inset-y-0 w-0.5 bg-ink-400" style={{ left: `${(9.8 / 15) * 100}%` }} title="p95 9.8s" />
            </div>
            <div className="mt-1 flex gap-4 text-[10px] text-ink-500">
              <span className="inline-flex items-center gap-1"><span className="h-1.5 w-3 rounded-full bg-brand-gradient" /> median 4.2s</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-0.5 bg-ink-400" /> p95 9.8s</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-ink-100 bg-ink-50/60 p-3 text-[11px] leading-relaxed text-ink-600">
            OTP traffic rides a dedicated transactional lane with per-telco failover — if the primary
            route exceeds 8s, the retry fires on the next carrier automatically.
          </div>
        </section>

        {/* Cost panel */}
        <section className="card p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="section-title">Cost panel</h2>
            <span className="chip border border-ink-200 bg-ink-50 text-ink-600"><IndianRupee className="h-3 w-3" /> ₹0.12 per SMS</span>
          </div>
          <p className="mt-0.5 text-xs text-ink-500">₹0.12 × 1.2M sends = <span className="font-semibold text-ink-800">₹14.4 lakh</span> this month (Jul).</p>
          <div className="mt-3 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -14 }} barCategoryGap="28%">
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: 'rgba(11,87,208,0.05)' }}
                  formatter={(v: number, _n, item) => [`₹${v} lakh · ${item?.payload?.volume}M SMS`, 'Monthly spend']}
                />
                <Bar dataKey="cost" fill="#0B57D0" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 text-[11px] text-ink-500">Billed to DIT under the state DLT rate contract; per-department chargeback monthly.</div>
        </section>
      </div>

      {/* ---------------- Compliance strip ---------------- */}
      <section className="card flex flex-wrap items-center gap-x-8 gap-y-4 bg-gradient-to-r from-ink-900 to-brand-800 p-4 text-white sm:p-5">
        <ComplianceItem
          icon={<ShieldCheck className="h-4 w-4" />}
          k="TRAI DLT"
          v="Principal Entity: DIT GoM"
          sub="All headers & templates registered"
        />
        <ComplianceItem
          icon={<Smartphone className="h-4 w-4" />}
          k="Consent registry"
          v={<span className="inline-flex items-center gap-1">Digital consent ledger <ExternalLink className="h-3 w-3 opacity-70" /></span>}
          sub="Opt-ins verified before service-explicit sends"
        />
        <ComplianceItem
          icon={<Moon className="h-4 w-4" />}
          k="Quiet hours"
          v="21:00 – 09:00 hold"
          sub="Non-transactional SMS queued overnight"
        />
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Local pieces                                                        */
/* ------------------------------------------------------------------ */

function HeroFact({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{k}</div>
      <div className="mt-0.5 text-base font-semibold">{v}</div>
    </div>
  )
}

function LatencyStat({ k, v, note, emphasis }: { k: string; v: string; note: string; emphasis?: boolean }) {
  return (
    <div className={cn('rounded-xl border p-3 text-center', emphasis ? 'border-brand-200 bg-brand-50/60' : 'border-ink-100 bg-ink-50/50')}>
      <div className="label !text-[10px]">{k}</div>
      <div className={cn('mt-1 text-xl font-semibold tabular-nums', emphasis ? 'text-brand-700' : 'text-ink-900')}>{v}</div>
      <div className="text-[10px] text-ink-500">{note}</div>
    </div>
  )
}

function ComplianceItem({ icon, k, v, sub }: { icon: ReactNode; k: string; v: ReactNode; sub: string }) {
  return (
    <div className="flex min-w-[220px] flex-1 items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">{icon}</span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{k}</div>
        <div className="text-sm font-semibold">{v}</div>
        <div className="text-[11px] text-white/60">{sub}</div>
      </div>
    </div>
  )
}
