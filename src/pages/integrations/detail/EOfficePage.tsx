import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import {
  ChevronLeft,
  ExternalLink,
  Inbox,
  ScanLine,
  User,
  FileSignature,
  Stamp,
  Send,
  Flag,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Landmark,
  Route,
} from 'lucide-react'

const eoffice = INTEGRATIONS.find((x) => x.slug === 'e-office')!

/* ---------------------------------------------------------------- */
/* Demo data — file-movement operations room                         */
/* ---------------------------------------------------------------- */

const PIPELINE = [
  { key: 'dak', label: 'Dak receipt', hint: 'Inward tapal', count: 214, icon: Inbox },
  { key: 'diarise', label: 'Diarisation', hint: 'Registered today', count: 186, icon: ScanLine },
  { key: 'desk', label: 'Desk', hint: 'With dealing hand', count: 128, icon: User },
  { key: 'note', label: 'Note-sheet', hint: 'Under drafting', count: 74, icon: FileSignature },
  { key: 'approval', label: 'Approval', hint: 'With approving authority', count: 41, icon: Stamp },
  { key: 'issue', label: 'Issue', hint: 'Despatched', count: 33, icon: Send },
] as const

const DAK_QUEUE = [
  { id: 'DAK/2026/09121', subject: 'Transfer proposal — Dy. Collector cadre, Konkan division', from: 'Revenue & Forest Dept', priority: 'Immediate', age: '2h' },
  { id: 'DAK/2026/09118', subject: 'Assembly starred question — LAQ 4471, monsoon session', from: 'Vidhan Bhavan', priority: 'Immediate', age: '3h' },
  { id: 'DAK/2026/09102', subject: 'GR draft — revised DA rates for state employees, Jul 2026', from: 'Finance Dept (Mantralaya)', priority: 'Urgent', age: '6h' },
  { id: 'DAK/2026/09087', subject: 'RTI first appeal — record of Zilla Parishad works, Nashik', from: 'SIC Maharashtra', priority: 'Urgent', age: '1d' },
  { id: 'DAK/2026/09054', subject: 'Court matter — WP 2214/2026, Bombay High Court compliance', from: 'Law & Judiciary Dept', priority: 'Immediate', age: '1d' },
  { id: 'DAK/2026/09031', subject: 'Nomination of nodal officers — Maha-IT digitisation drive', from: 'DIT (GoM)', priority: 'Routine', age: '2d' },
] as const

const DISPOSAL_TREND = [
  { week: 'W14', disposed: 182 },
  { week: 'W15', disposed: 196 },
  { week: 'W16', disposed: 174 },
  { week: 'W17', disposed: 210 },
  { week: 'W18', disposed: 205 },
  { week: 'W19', disposed: 228 },
  { week: 'W20', disposed: 219 },
  { week: 'W21', disposed: 241 },
  { week: 'W22', disposed: 236 },
  { week: 'W23', disposed: 252 },
  { week: 'W24', disposed: 247 },
  { week: 'W25', disposed: 263 },
]

const CHECKLIST = [
  { item: 'GAD approval', detail: 'Administrative sanction from General Administration Dept', done: true },
  { item: 'DIT security review', detail: 'VAPT + connector security audit by Directorate of IT', done: false },
  { item: 'mTLS handshake verified', detail: 'Mutual TLS certificate exchange with NIC gateway', done: true },
  { item: 'NIC API onboarding', detail: 'e-Office EFTS API credentials for Mantralaya instance', done: false },
] as const

const ENDPOINTS = [
  { method: 'GET', path: '/efts/v1/files/{fileNo}/movements' },
  { method: 'GET', path: '/efts/v1/dak/inbox' },
  { method: 'POST', path: '/efts/v1/notesheets/draft' },
  { method: 'GET', path: '/efts/v1/files/pendency' },
] as const

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

export function EOfficePage() {
  const totalInPipeline = PIPELINE.reduce((s, p) => s + p.count, 0)

  return (
    <div className="space-y-6">
      <Hero />

      {/* Signature visual — the live file pipeline */}
      <section className="card p-4 sm:p-5">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-brand-500" />
            <h2 className="text-base font-semibold text-ink-900">Live file movement — Mantralaya instance</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Streaming
            </span>
            <SourceBadge source="Demo" />
          </div>
        </div>
        <p className="mb-5 text-xs text-ink-500">
          {totalInPipeline.toLocaleString('en-IN')} files in motion across six stages · Dak receipt to issue
        </p>
        <FilePipeline />
      </section>

      {/* Note-sheet + Dak queue */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <NoteSheetPreview />
        <DakQueue />
      </div>

      {/* Trend + sync + checklist */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader
            title="File disposal trend"
            subtitle="Files disposed per week · last 12 weeks"
            right={<SourceBadge source="Demo" />}
          />
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DISPOSAL_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="eofficeDisposal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={46} />
                <Tooltip
                  cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  formatter={(v: number) => [`${v} files`, 'Disposed']}
                />
                <Area type="monotone" dataKey="disposed" stroke="#0B57D0" strokeWidth={2} fill="url(#eofficeDisposal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <SyncPanel />
        <ReadinessChecklist />
      </div>

      <EndpointStrip />
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Hero                                                              */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-glow">
      {/* soft radial texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(at 85% 15%, rgba(255,255,255,0.22) 0px, transparent 45%), radial-gradient(at 15% 90%, rgba(66,133,244,0.35) 0px, transparent 50%)',
        }}
      />
      <div className="relative p-5 sm:p-7">
        <Link
          to="/integrations"
          className="inline-flex items-center gap-1 text-xs font-medium text-white/80 transition hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Integrations
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            {/* NIC mark */}
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-2xl font-black text-brand-700 shadow-lg ring-4 ring-white/20">
              N
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                NIC · Workflow connector
              </div>
              <h1 className="mt-0.5 text-2xl font-semibold leading-tight sm:text-3xl">{eoffice.name}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/80">{eoffice.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip border border-white/25 bg-white/10 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" /> {eoffice.status}
                </span>
                <span className="chip border border-white/25 bg-white/10 text-white">
                  <Landmark className="h-3 w-3" /> Data owner · {eoffice.dataOwner}
                </span>
                <span className="chip border border-white/25 bg-white/10 text-white">
                  <Lock className="h-3 w-3" /> {eoffice.securityStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ReadinessRing value={eoffice.connectorReadiness} />
            <a
              href={eoffice.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              Open portal <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReadinessRing({ value }: { value: number }) {
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <text x="32" y="32" transform="rotate(90 32 32)" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="15" fontWeight="700">
          {value}
        </text>
      </svg>
      <div className="text-xs leading-tight text-white/80">
        Connector<br />readiness <span className="font-semibold text-white">{value}%</span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* File pipeline                                                     */
/* ---------------------------------------------------------------- */

function FilePipeline() {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <div className="relative min-w-[860px]">
        {/* track */}
        <div className="absolute left-[7%] right-[7%] top-[30px] h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />
        {/* travelling pulse dot */}
        <motion.span
          aria-hidden
          className="absolute top-[26px] z-10 h-2.5 w-2.5 rounded-full bg-brand-500 shadow-[0_0_0_5px_rgba(11,87,208,0.15)]"
          initial={{ left: '7%' }}
          animate={{ left: ['7%', '92%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative grid grid-cols-6">
          {PIPELINE.map((stage, idx) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex flex-col items-center px-2 text-center"
              >
                <div className="relative z-[5] grid h-[60px] w-[60px] place-items-center rounded-2xl border border-brand-200 bg-white shadow-card">
                  <Icon className="h-5 w-5 text-brand-600" />
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl ring-2 ring-brand-400/40"
                    animate={{ opacity: [0.15, 0.6, 0.15] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.4 }}
                  />
                </div>
                <div className="mt-2.5 text-2xl font-semibold tabular-nums text-ink-900">{stage.count}</div>
                <div className="text-xs font-semibold text-ink-800">{stage.label}</div>
                <div className="mt-0.5 text-[11px] text-ink-500">{stage.hint}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Note-sheet preview                                                */
/* ---------------------------------------------------------------- */

function NoteSheetPreview() {
  return (
    <Card className="p-0 sm:p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <FileSignature className="h-4 w-4 text-brand-500" />
          <h3 className="text-base font-semibold text-ink-900">Note-sheet preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip border border-brand-200 bg-brand-50 text-brand-700">
            <ShieldCheck className="h-3 w-3" /> AI draft — officer review required
          </span>
        </div>
      </div>

      {/* the sheet */}
      <div className="p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-lg border border-ink-200 bg-[#fdfcf7] shadow-inner">
          {/* ruled left margin */}
          <div aria-hidden className="absolute inset-y-0 left-10 w-px bg-red-300 sm:left-14" />
          <div className="px-4 py-5 pl-14 font-serif text-[13px] leading-relaxed text-ink-800 sm:px-6 sm:pl-20">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-ink-300 pb-2 text-[12px]">
              <span className="font-semibold">File No. GAD/EST-2026/O&amp;M/0412</span>
              <span>Note # 14</span>
            </div>
            <div className="mt-3 text-center text-[12px] font-semibold uppercase tracking-wide">
              Government of Maharashtra · General Administration Department
            </div>
            <div className="mt-1 text-center text-[12px] italic">
              Subject: Digitisation of legacy service books — Mantralaya establishment
            </div>
            <ol className="mt-4 list-decimal space-y-2.5 pl-4">
              <li>
                Reference is invited to the Dak at S.No. 3/c received from DIT dated 04.07.2026 regarding
                digitisation of legacy service books of Mantralaya establishment under the Maha-IT drive.
              </li>
              <li>
                As per GR No. मातंसं-2026/प्र.क्र.88/39, scanning and metadata capture of 12,400 service
                books is to be completed by 30.09.2026. Vendor empanelment is already in place.
              </li>
              <li>
                It is proposed that approval may kindly be accorded to commence Phase-I (4,200 books,
                floors 1–3, Main Building) with weekly progress reporting to the Under Secretary (O&amp;M).
              </li>
            </ol>
            <p className="mt-3">Submitted for kind approval please.</p>
            <div className="mt-6 flex items-end justify-between">
              <div className="text-[11px] text-ink-500">Drafted via MAII connector · 07.07.2026</div>
              <div className="text-right">
                <div className="font-['cursive'] text-lg text-brand-800">A. R. Deshmukh</div>
                <div className="text-[12px] font-semibold">(A. R. Deshmukh)</div>
                <div className="text-[11px]">Under Secretary (O&amp;M), GAD</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <Clock className="h-3.5 w-3.5" /> Draft generated 08:19 · pending desk officer verification before movement to Approval stage
        </div>
      </div>
    </Card>
  )
}

/* ---------------------------------------------------------------- */
/* Dak queue                                                         */
/* ---------------------------------------------------------------- */

function priorityStyle(p: string) {
  if (p === 'Immediate') return 'border-red-200 bg-red-50 text-red-700'
  if (p === 'Urgent') return 'border-amber-200 bg-amber-50 text-amber-700'
  return 'border-ink-200 bg-ink-100 text-ink-600'
}

function DakQueue() {
  return (
    <Card>
      <CardHeader
        title="Dak / receipt queue"
        subtitle="Inward tapal awaiting diarisation & marking"
        right={<SourceBadge source="Demo" />}
      />
      <ul className="divide-y divide-ink-100">
        {DAK_QUEUE.map((d, idx) => (
          <motion.li
            key={d.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start justify-between gap-3 py-2.5"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-ink-500">{d.id}</span>
                <span className={'chip border text-[10px] ' + priorityStyle(d.priority)}>
                  <Flag className="h-2.5 w-2.5" /> {d.priority}
                </span>
              </div>
              <div className="mt-0.5 truncate text-sm font-medium text-ink-800" title={d.subject}>{d.subject}</div>
              <div className="text-xs text-ink-500">{d.from}</div>
            </div>
            <div className="shrink-0 text-right text-xs text-ink-500">
              <div className="font-semibold text-ink-700">{d.age}</div>
              <div>in queue</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </Card>
  )
}

/* ---------------------------------------------------------------- */
/* Sync + checklist + endpoints                                      */
/* ---------------------------------------------------------------- */

function SyncPanel() {
  return (
    <Card>
      <CardHeader title="Sync status" right={<RefreshCw className="h-4 w-4 text-brand-500" />} />
      <dl className="space-y-3 text-sm">
        <SyncRow k="Last sync" v={eoffice.lastSync} icon={<Clock className="h-4 w-4 text-brand-500" />} />
        <SyncRow k="Transport security" v={eoffice.securityStatus} icon={<Lock className="h-4 w-4 text-brand-500" />} />
        <SyncRow k="Data owner" v={`${eoffice.dataOwner} — General Administration Dept`} icon={<Landmark className="h-4 w-4 text-brand-500" />} />
        <SyncRow k="API health" v={`${eoffice.apiHealth}% · public-source polling`} icon={<ShieldCheck className="h-4 w-4 text-brand-500" />} />
      </dl>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-700">Pending approvals</div>
        <ul className="mt-1.5 space-y-1 text-sm text-amber-800">
          {eoffice.requiredApprovals.map((a) => (
            <li key={a} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {a}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function SyncRow({ k, v, icon }: { k: string; v: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <dt className="text-xs text-ink-500">{k}</dt>
        <dd className="font-medium text-ink-800">{v}</dd>
      </div>
    </div>
  )
}

function ReadinessChecklist() {
  const done = CHECKLIST.filter((c) => c.done).length
  return (
    <Card>
      <CardHeader
        title="Integration readiness"
        subtitle={`${done} of ${CHECKLIST.length} gates cleared · composite ${eoffice.connectorReadiness}%`}
      />
      <ul className="space-y-2.5">
        {CHECKLIST.map((c) => (
          <li key={c.item} className="flex items-start gap-2.5 rounded-lg border border-ink-100 px-3 py-2">
            {c.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-800">
                {c.item}
                {!c.done && <span className="chip border border-amber-200 bg-amber-50 text-[10px] text-amber-700">Pending</span>}
              </div>
              <div className="text-xs text-ink-500">{c.detail}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${eoffice.connectorReadiness}%` }} />
      </div>
    </Card>
  )
}

function EndpointStrip() {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
          NIC e-Office EFTS API — target endpoints
        </div>
        <SourceBadge source="Department API required" />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {ENDPOINTS.map((e) => (
          <div key={e.path} className="flex items-center gap-2 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2">
            <span
              className={
                'rounded px-1.5 py-0.5 text-[10px] font-bold ' +
                (e.method === 'GET' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700')
              }
            >
              {e.method}
            </span>
            <code className="truncate font-mono text-[11px] text-ink-700" title={e.path}>{e.path}</code>
          </div>
        ))}
      </div>
    </section>
  )
}
