import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  ChevronLeft, ExternalLink, Scale, Timer, FileText, Bot, ShieldCheck,
  CheckCircle2, CircleDashed, Landmark, Gavel, BookOpenCheck, AlertTriangle,
} from 'lucide-react'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'

/* ------------------------------------------------------------------ */
/* Demo data — RTI Act, 2005 statutory-deadline control room           */
/* ------------------------------------------------------------------ */

const SPOTLIGHT = {
  reg: 'MAHAD/R/2026/61180',
  subject: 'Land acquisition award — NH-61 stretch (Revenue Dept.)',
  day: 18,
}

const LIFECYCLE = [
  { day: 'Day 0', title: 'Application received', detail: 'Filed online with ₹10 fee · Revenue Department', section: 'Sec 6(1)', state: 'done' as const },
  { day: 'Day 4', title: 'Transferred to Collectorate', detail: 'Subject matter held by another public authority', section: 'Sec 6(3)', state: 'done' as const },
  { day: 'Day 5', title: 'PIO assigned', detail: 'Central Public Information Officer designated', section: 'Sec 5(1)', state: 'done' as const },
  { day: 'Day 6–15', title: 'Information gathering', detail: 'Records section — award files & measurement sheets', section: 'Sec 5(4)', state: 'done' as const },
  { day: 'Day 16', title: 'Reply drafted (AI-assisted)', detail: 'Draft generated from record extracts · bilingual', section: 'Sec 7(1)', state: 'done' as const, ai: true },
  { day: 'Day 18', title: 'CPIO approval pending', detail: 'Statutory reply due by Day 30 · 12 days remaining', section: 'Sec 7(1)', state: 'active' as const },
]

const DEADLINE_BOARD = [
  { reg: 'MAHAD/R/2026/60912', subject: 'Tender scrutiny records — Ward 4 road works', dept: 'PWD', day: 27 },
  { reg: 'MAHAD/R/2026/60968', subject: 'Sanjay Gandhi Niradhar beneficiary list', dept: 'Social Justice', day: 24 },
  { reg: 'MAHAD/R/2026/61021', subject: 'Building permission file notings — TP-9', dept: 'Urban Dev', day: 22 },
  { reg: 'MAHAD/R/2026/61180', subject: 'Land acquisition award — NH-61 stretch', dept: 'Revenue', day: 18 },
  { reg: 'MAHAD/R/2026/61294', subject: 'CCTV procurement order copies', dept: 'Home', day: 11 },
  { reg: 'MAHAD/R/2026/61377', subject: 'Teacher transfer policy circular 2026', dept: 'School Edu', day: 5 },
]

const APPEAL_FUNNEL = [
  { label: 'Replies issued (12 mo)', value: 1482, pct: 100 },
  { label: 'First appeals filed · Sec 19(1)', value: 92, pct: 46 },
  { label: 'Disposed by First Appellate Authority', value: 74, pct: 36 },
  { label: 'Remanded to PIO for fresh reply', value: 18, pct: 20 },
]

const EXEMPTIONS = [
  { section: '8(1)(j)', label: 'Personal information / privacy', pct: 41 },
  { section: '8(1)(d)', label: 'Commercial confidence', pct: 22 },
  { section: '8(1)(e)', label: 'Fiduciary relationship', pct: 14 },
  { section: '8(1)(a)', label: 'Security & sovereignty', pct: 9 },
  { section: '8(1)(g)', label: 'Safety of source / informant', pct: 8 },
  { section: '24', label: 'Exempted organisations', pct: 6 },
]

const INFLOW_DISPOSAL = [
  { m: 'Feb', inflow: 412, disposal: 388 },
  { m: 'Mar', inflow: 438, disposal: 421 },
  { m: 'Apr', inflow: 395, disposal: 402 },
  { m: 'May', inflow: 461, disposal: 439 },
  { m: 'Jun', inflow: 447, disposal: 451 },
  { m: 'Jul', inflow: 469, disposal: 442 },
]

const SECTION4 = [
  { item: '4(1)(b)(i) — Organisation, functions & duties', done: true },
  { item: '4(1)(b)(x) — Officer directory & monthly remuneration', done: true },
  { item: '4(1)(b)(xi) — Budget allocation & expenditure reports', done: true },
  { item: '4(1)(b)(xii) — Subsidy programmes & beneficiaries', done: false },
  { item: '4(1)(b)(xvi) — PIO / FAA names & contact details', done: true },
  { item: '4(1)(a) — Records catalogue & digitisation index', done: false },
]

/* ------------------------------------------------------------------ */
/* 30-day statutory clock (SVG)                                        */
/* ------------------------------------------------------------------ */

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start)
  const e = polar(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

function zoneColor(dayIdx: number, elapsed: boolean) {
  if (dayIdx >= 27) return elapsed ? '#DC2626' : '#FECACA'
  if (dayIdx >= 21) return elapsed ? '#D97706' : '#FDE68A'
  return elapsed ? '#0B57D0' : '#D9E5F8'
}

function StatutoryClock({ day }: { day: number }) {
  const needleTip = polar(100, 100, 62, day * 12)
  return (
    <svg viewBox="0 0 200 200" className="h-48 w-48 sm:h-56 sm:w-56" role="img" aria-label={`Statutory clock: day ${day} of 30`}>
      {Array.from({ length: 30 }, (_, i) => (
        <path
          key={i}
          d={arcPath(100, 100, 82, i * 12 + 1.6, (i + 1) * 12 - 1.6)}
          stroke={zoneColor(i, i < day)}
          strokeWidth={i < day ? 11 : 8}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {/* needle at current day */}
      <line x1={100} y1={100} x2={needleTip.x} y2={needleTip.y} stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
      <circle cx={100} cy={100} r={4} fill="#0f172a" />
      <text x={100} y={84} textAnchor="middle" fill="#64748b" fontSize={9} letterSpacing={2}>
        RTI SEC 7(1)
      </text>
      <text x={100} y={112} textAnchor="middle" fill="#0f172a" fontSize={28} fontWeight={700}>
        Day {day}
      </text>
      <text x={100} y={130} textAnchor="middle" fill="#64748b" fontSize={10}>
        of 30 · {30 - day} days left
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Countdown pill                                                      */
/* ------------------------------------------------------------------ */

function CountdownPill({ left }: { left: number }) {
  const cls =
    left <= 3
      ? 'border-red-200 bg-red-50 text-red-700'
      : left <= 9
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      <Timer className="h-3 w-3" />
      {left} day{left === 1 ? '' : 's'} left
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function RTIPage() {
  const rti = INTEGRATIONS.find((x) => x.slug === 'rti')!
  const sortedBoard = [...DEADLINE_BOARD].sort((a, b) => b.day - a.day)

  return (
    <div className="space-y-6">
      {/* ---------------- Hero: split statutory band ---------------- */}
      <div className="card overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr]">
          {/* Left — brand gradient */}
          <div className="relative bg-brand-gradient p-6 text-white sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(at 80% 10%, rgba(255,255,255,0.35) 0, transparent 50%)' }}
            />
            <div className="relative">
              <Link to="/integrations" className="inline-flex items-center gap-1 text-xs font-medium text-white/70 transition hover:text-white">
                <ChevronLeft className="h-3.5 w-3.5" /> All integrations
              </Link>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <Scale className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{rti.name}</h1>
                  <p className="text-sm text-white/75">Statutory deadline control room · RTI Act, 2005</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
                Every request runs on the Section 7(1) 30-day clock. MAII watches each open
                application, drafts replies for CPIO review and flags files entering the
                amber and red zones before the statute does.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <SourceBadge source="Public-source linked" className="!border-white/30 !bg-white/10 !text-white" />
                <span className="chip border border-white/30 bg-white/10 text-white">
                  <Landmark className="h-3 w-3" /> Data owner · {rti.dataOwner}
                </span>
                <a href={rti.url} target="_blank" rel="noreferrer" className="chip border border-white/30 bg-white/10 text-white transition hover:bg-white/20">
                  rtionline.gov.in <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-4 text-xs">
                <div>
                  <div className="text-white/60">API health</div>
                  <div className="text-base font-semibold">{rti.apiHealth}%</div>
                </div>
                <div>
                  <div className="text-white/60">Connector readiness</div>
                  <div className="text-base font-semibold">{rti.connectorReadiness}%</div>
                </div>
                <div>
                  <div className="text-white/60">Last sync</div>
                  <div className="text-base font-semibold">{rti.lastSync.split(' ')[1]} IST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — the 30-day clock */}
          <div className="flex flex-col items-center justify-center gap-2 bg-white p-6">
            <StatutoryClock day={SPOTLIGHT.day} />
            <div className="text-center">
              <div className="text-xs font-semibold text-ink-800">Tracking {SPOTLIGHT.reg}</div>
              <div className="mt-0.5 text-[11px] text-ink-500">{SPOTLIGHT.subject}</div>
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-medium text-ink-500">
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-500" /> Day 1–21 on track</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Amber after day 21</span>
              <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Red after day 27</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Rail + deadline board ---------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.5fr]">
        {/* Lifecycle rail */}
        <div className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-ink-900">Application lifecycle rail</h3>
            <SourceBadge source="Demo" />
          </div>
          <p className="mb-4 text-xs text-ink-500">{SPOTLIGHT.reg} — live statutory trail with section references</p>
          <ol className="relative ml-2 border-l-2 border-ink-100">
            {LIFECYCLE.map((n, i) => (
              <motion.li
                key={n.title}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative pb-5 pl-5 last:pb-0"
              >
                <span
                  className={
                    'absolute -left-[9px] top-0.5 grid h-4 w-4 place-items-center rounded-full ring-4 ring-white ' +
                    (n.state === 'done' ? 'bg-brand-500' : 'animate-pulse-slow bg-amber-500')
                  }
                >
                  {n.state === 'done'
                    ? <CheckCircle2 className="h-3 w-3 text-white" />
                    : <CircleDashed className="h-3 w-3 text-white" />}
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink-600">{n.day}</span>
                  <span className="text-sm font-semibold text-ink-900">{n.title}</span>
                  {n.ai && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                      <Bot className="h-2.5 w-2.5" /> AI draft
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-ink-500">{n.detail}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-ink-100 bg-white px-1.5 py-0.5 text-[10px] font-medium text-ink-600">
                  <BookOpenCheck className="h-3 w-3 text-brand-500" /> RTI Act {n.section}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Deadline board */}
        <div className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-ink-900">Statutory deadline board</h3>
            <SourceBadge source="Demo" />
          </div>
          <p className="mb-4 text-xs text-ink-500">6 open applications · sorted by days remaining on the Section 7(1) clock</p>
          <ul className="space-y-2.5">
            {sortedBoard.map((r) => {
              const left = 30 - r.day
              const barColor = left <= 3 ? 'bg-red-500' : left <= 9 ? 'bg-amber-500' : 'bg-brand-500'
              return (
                <li key={r.reg} className="rounded-xl border border-ink-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/30">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800" title={r.subject}>{r.subject}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-500">
                        <span className="font-mono">{r.reg}</span>
                        <span>·</span>
                        <span>{r.dept}</span>
                        <span>·</span>
                        <span>Day {r.day} of 30</span>
                      </div>
                    </div>
                    <CountdownPill left={left} />
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${(r.day / 30) * 100}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            A missed deadline exposes the CPIO to a penalty of ₹250/day (max ₹25,000) under Section 20(1).
          </div>
        </div>
      </div>

      {/* ---------------- Trend + exemptions ---------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-ink-900">Monthly inflow vs disposal</h3>
            <SourceBadge source="Demo" />
          </div>
          <p className="mb-3 text-xs text-ink-500">Applications received against replies issued · last 6 months</p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INFLOW_DISPOSAL} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[350, 500]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 8px 24px -12px rgba(15,23,42,0.15)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
                <Line type="monotone" name="Inflow" dataKey="inflow" stroke="#0B57D0" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" name="Disposal" dataKey="disposal" stroke="#2A8C42" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exemption usage */}
        <div className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-ink-900">Exemptions invoked</h3>
            <SourceBadge source="Demo" />
          </div>
          <p className="mb-3 text-xs text-ink-500">Share of denials by RTI Act section · 12 months</p>
          <ul className="space-y-2.5">
            {EXEMPTIONS.map((e) => (
              <li key={e.section} className="flex items-center gap-2 text-xs">
                <span className="w-14 shrink-0 rounded bg-ink-50 px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold text-ink-700">
                  {e.section}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-baseline justify-between gap-2">
                    <span className="truncate text-ink-600">{e.label}</span>
                    <span className="font-semibold text-ink-800">{e.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${e.pct}%`, opacity: 0.45 + e.pct / 80 }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-[11px] text-ink-600">
            Section 8(1)(j) privacy is the most-cited ground — every AI draft citing it is routed for legal review.
          </div>
        </div>
      </div>

      {/* ---------------- Appeals + AI drafting + Section 4 ---------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* First-appeal funnel */}
        <div className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
              <Gavel className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-semibold text-ink-900">First-appeal funnel</h3>
          </div>
          <p className="mb-4 text-xs text-ink-500">Section 19(1) — appeals against PIO replies</p>
          <div className="space-y-2.5">
            {APPEAL_FUNNEL.map((s, i) => (
              <div key={s.label}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="text-ink-600">{s.label}</span>
                  <span className="font-semibold text-ink-900">{s.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="mx-auto h-2.5 overflow-hidden rounded-full bg-ink-100" style={{ width: `${s.pct}%`, minWidth: '18%' }}>
                  <div className="h-full rounded-full bg-brand-gradient" style={{ opacity: 1 - i * 0.16 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-ink-50 px-3 py-2 text-[11px] text-ink-600">
            Appeal rate 6.2% of replies — below the 8% state benchmark.
          </div>
        </div>

        {/* AI drafting stats */}
        <div className="card relative overflow-hidden p-4 sm:p-5">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gradient opacity-10 blur-2xl" />
          <div className="mb-1 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-semibold text-ink-900">AI reply drafting</h3>
          </div>
          <p className="mb-4 text-xs text-ink-500">MAII drafts, the CPIO decides — always.</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="text-2xl font-semibold text-ink-900">64%</div>
              <div className="mt-0.5 text-[11px] text-ink-500">replies AI-drafted</div>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
              <div className="text-2xl font-semibold text-emerald-700">100%</div>
              <div className="mt-0.5 text-[11px] text-emerald-700/80">CPIO-reviewed</div>
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="text-2xl font-semibold text-ink-900">3.4<span className="text-sm font-medium text-ink-500"> min</span></div>
              <div className="mt-0.5 text-[11px] text-ink-500">median draft time</div>
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <div className="text-2xl font-semibold text-ink-900">0</div>
              <div className="mt-0.5 text-[11px] text-ink-500">auto-sent without approval</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Drafts cite source records · Marathi + English output
          </div>
        </div>

        {/* Section 4 checklist */}
        <div className="card p-4 sm:p-5 md:col-span-2 xl:col-span-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-ink-900">Section 4 proactive disclosure</h3>
            <StatusBadge status="Open" />
          </div>
          <p className="mb-4 text-xs text-ink-500">Suo-motu publication obligations · 4 of 6 items live</p>
          <ul className="space-y-2">
            {SECTION4.map((s) => (
              <li key={s.item} className="flex items-start gap-2 rounded-lg border border-ink-100 px-3 py-2 text-xs">
                {s.done
                  ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  : <CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />}
                <span className={s.done ? 'text-ink-700' : 'text-ink-500'}>{s.item}</span>
                <span className={`ml-auto shrink-0 text-[10px] font-semibold ${s.done ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {s.done ? 'Published' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
