import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  ChevronLeft, ChevronRight, Mail, Inbox, ScanSearch, Tag, Layers, Send,
  ShieldCheck, Lock, FileText, CalendarClock, FileCheck2, BellRing, ClipboardCheck,
  ChevronDown, ChevronUp, AlertTriangle,
} from 'lucide-react'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Data — Email Gateway relay console (slug: 'email')                  */
/* ------------------------------------------------------------------ */

const gw = INTEGRATIONS.find((x) => x.slug === 'email')!

const THROUGHPUT = [
  { t: '09:04', v: 512 }, { t: '09:06', v: 548 }, { t: '09:08', v: 501 },
  { t: '09:10', v: 596 }, { t: '09:12', v: 634 }, { t: '09:14', v: 618 },
  { t: '09:16', v: 671 }, { t: '09:18', v: 655 }, { t: '09:20', v: 702 },
  { t: '09:22', v: 688 }, { t: '09:24', v: 724 }, { t: '09:26', v: 741 },
  { t: '09:28', v: 733 },
]

interface Stage {
  id: string
  label: string
  icon: typeof Inbox
  count: string
  sub: string
  detail: string
  queueDepth?: number
  queueCap?: number
}

const PIPELINE: Stage[] = [
  { id: 'inbound', label: 'Inbound', icon: Inbox, count: '41,208', sub: 'accepted today', detail: 'SMTP + API ingest' },
  { id: 'dlp', label: 'DLP Scan', icon: ScanSearch, count: '41,208', sub: '12 flagged · 3 redacted', detail: 'PII & attachment rules' },
  { id: 'classify', label: 'Classification', icon: Tag, count: '41,196', sub: 'Public 62% · Internal 33% · Conf. 5%', detail: 'Auto-labelled' },
  { id: 'queue', label: 'Queue', icon: Layers, count: '214', sub: 'in queue · avg wait 1.8s', detail: 'Priority lanes', queueDepth: 214, queueCap: 5000 },
  { id: 'delivery', label: 'Delivery', icon: Send, count: '40,982', sub: 'relayed · 99.2% delivered', detail: 'TLS 1.3 outbound' },
]

const DELIVERABILITY = { rate: 99.2, bounce: 0.4, defer: 0.3, complaint: 0.1 }

const DMARC = [
  { name: 'Fully aligned (SPF + DKIM)', value: 96.4, color: '#0B57D0' },
  { name: 'Partial (single-factor pass)', value: 2.8, color: '#B45309' },
  { name: 'Failed / quarantined', value: 0.8, color: '#DC2626' },
]

const TEMPLATES = [
  {
    id: 'TPL-GR-01', name: 'GR Notification', icon: FileText, usage: 12480,
    subject: 'New Government Resolution published — {gr_number}',
    body: 'A new Government Resolution {gr_number} dated {date} has been published by {department}.\n\nTitle: {gr_title}\n\nView the GR on the official portal: gr.maharashtra.gov.in\n\n— Maharashtra Administrative Intelligence Interface (MAII)',
  },
  {
    id: 'TPL-MT-02', name: 'Meeting Invite', icon: CalendarClock, usage: 8912,
    subject: 'Meeting notice: {meeting_title} — {date}, {time}',
    body: 'You are requested to attend {meeting_title} chaired by {chair} on {date} at {time}, {venue}.\n\nAgenda note is attached. Kindly confirm attendance via e-Office.\n\n— General Administration Department, GoM',
  },
  {
    id: 'TPL-RTI-03', name: 'RTI Acknowledgment', icon: ClipboardCheck, usage: 6034,
    subject: 'RTI application {rti_id} received',
    body: 'Your RTI application {rti_id} dated {date} has been received by {pio_office}.\n\nA reply will be furnished within 30 days as per the RTI Act, 2005. Track status at rtionline.gov.in.\n\n— Public Information Officer',
  },
  {
    id: 'TPL-AP-04', name: 'Approval Notice', icon: FileCheck2, usage: 4519,
    subject: 'File {file_number} approved at {level}',
    body: 'File {file_number} — {file_subject} — has been approved by {approver} on {date}.\n\nNext action: {next_action}. The note-sheet is available in e-Office.\n\n— MAII Workflow Engine',
  },
  {
    id: 'TPL-ES-05', name: 'Escalation Alert', icon: BellRing, usage: 1873,
    subject: 'Escalation: {case_id} pending beyond SLA',
    body: 'Case {case_id} ({service}) has crossed its Right to Public Services SLA of {sla_days} days.\n\nPending with: {officer}, {office}. Escalated to: {escalation_officer}.\n\nImmediate action requested.\n\n— MAII Escalation Monitor',
  },
]

const DEPT_TRAFFIC = [
  { dept: 'Revenue & Forest', count: 9840 },
  { dept: 'General Administration', count: 8115 },
  { dept: 'Urban Development', count: 6892 },
  { dept: 'Home', count: 6244 },
  { dept: 'Rural Development', count: 5478 },
  { dept: 'Finance', count: 4639 },
]

const HOURLY = [
  { h: '00', v: 310 }, { h: '02', v: 190 }, { h: '04', v: 160 }, { h: '06', v: 420 },
  { h: '08', v: 1480 }, { h: '10', v: 3920 }, { h: '11', v: 4480 }, { h: '12', v: 3660 },
  { h: '13', v: 3120 }, { h: '14', v: 3890 }, { h: '15', v: 4210 }, { h: '16', v: 3810 },
  { h: '17', v: 2940 }, { h: '18', v: 1520 }, { h: '20', v: 690 }, { h: '22', v: 410 },
]

const RELAY_LOG = [
  { time: '09:28:41', dept: 'GAD', type: 'Meeting invite', dlp: 'Clear', status: 'Delivered' },
  { time: '09:28:12', dept: 'Revenue', type: 'GR notification', dlp: 'Clear', status: 'Delivered' },
  { time: '09:27:55', dept: 'Home', type: 'Approval notice', dlp: 'Redacted', status: 'Delivered' },
  { time: '09:27:31', dept: 'UDD', type: 'RTI acknowledgment', dlp: 'Clear', status: 'Delivered' },
  { time: '09:27:04', dept: 'Finance', type: 'Escalation alert', dlp: 'Quarantined', status: 'Held' },
  { time: '09:26:48', dept: 'RDD', type: 'GR notification', dlp: 'Clear', status: 'Queued' },
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

export function EmailPage() {
  const [openTpl, setOpenTpl] = useState<string | null>(null)
  const maxDept = Math.max(...DEPT_TRAFFIC.map((d) => d.count))

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/integrations" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
        <ChevronLeft className="h-4 w-4" /> All integrations
      </Link>

      {/* ---------------- Hero: relay console band ---------------- */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-glow"
      >
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Mail Relay Console</div>
                <h1 className="text-xl font-semibold sm:text-2xl">{gw.name}</h1>
              </div>
            </div>
            <p className="mt-3 max-w-md text-sm text-white/80">
              {gw.description} Sovereign outbound relay for all Government of Maharashtra departments — DLP-scanned, classified and audit-logged before delivery.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>
                Connected · relaying
              </span>
              {['TLS 1.3', 'SPF pass', 'DKIM signed', 'DMARC enforced'].map((c) => (
                <span key={c} className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium">
                  <ShieldCheck className="h-3 w-3" /> {c}
                </span>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <HeroFact k="API health" v={`${gw.apiHealth}%`} />
              <HeroFact k="Readiness" v={`${gw.connectorReadiness}%`} />
              <HeroFact k="Data owner" v={gw.dataOwner} />
              <HeroFact k="Last sync" v={gw.lastSync.split(' ')[1] ?? gw.lastSync} />
            </div>
          </div>

          {/* Live throughput chart embedded in the hero */}
          <div className="flex min-w-0 flex-col rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Relay throughput · msgs/min</div>
              <div className="text-lg font-semibold">733</div>
            </div>
            <div className="mt-2 h-36 w-full min-w-0 flex-1 sm:h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={THROUGHPUT} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="heroThroughput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.65)', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis hide domain={['dataMin - 60', 'dataMax + 40']} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#334155' }} formatter={(v: number) => [`${v} msgs/min`, 'Throughput']} />
                  <Area type="monotone" dataKey="v" stroke="#ffffff" strokeWidth={2} fill="url(#heroThroughput)" dot={false} activeDot={{ r: 4, fill: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[11px] text-white/60">Last 25 minutes · gom.gov.in relay cluster (Demo)</div>
          </div>
        </div>
      </motion.section>

      {/* ---------------- Signature visual: relay pipeline ---------------- */}
      <section className="card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="section-title">Relay pipeline</h2>
            <p className="mt-0.5 text-xs text-ink-500">Every message crosses five stages before leaving the government boundary.</p>
          </div>
          <span className="chip border border-ink-200 bg-ink-50 text-ink-600">Today · 07 Jul 2026</span>
        </div>
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <div className="flex min-w-[880px] items-stretch">
            {PIPELINE.map((s, i) => (
              <div key={s.id} className="flex flex-1 items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex-1 rounded-xl border border-ink-100 bg-gradient-to-b from-white to-ink-50/50 p-3.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                      <s.icon className="h-4 w-4" />
                    </span>
                    <div className="label !text-[10px]">{`Stage ${i + 1}`}</div>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink-900">{s.label}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums text-brand-700">{s.count}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-ink-500">{s.sub}</div>
                  {s.queueDepth != null && s.queueCap != null && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${(s.queueDepth / s.queueCap) * 100}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-ink-400">Queue depth {s.queueDepth} / {s.queueCap.toLocaleString('en-IN')}</div>
                    </div>
                  )}
                  <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-400">{s.detail}</div>
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <div className="flex w-7 shrink-0 items-center justify-center text-ink-300">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Deliverability + DMARC ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Deliverability dial */}
        <section className="card p-4 sm:p-5">
          <h2 className="section-title">Deliverability</h2>
          <p className="mt-0.5 text-xs text-ink-500">Rolling 30-day outcome of all relayed mail.</p>
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <DeliverabilityDial value={DELIVERABILITY.rate} />
            <div className="min-w-[200px] flex-1 space-y-3">
              <OutcomeBar label="Delivered" pct={DELIVERABILITY.rate} tone="ok" />
              <OutcomeBar label="Bounced" pct={DELIVERABILITY.bounce} tone="warn" />
              <OutcomeBar label="Deferred" pct={DELIVERABILITY.defer} tone="warn" />
              <OutcomeBar label="Complaints" pct={DELIVERABILITY.complaint} tone="bad" />
            </div>
          </div>
        </section>

        {/* DMARC alignment donut */}
        <section className="card p-4 sm:p-5">
          <h2 className="section-title">DMARC alignment</h2>
          <p className="mt-0.5 text-xs text-ink-500">Authentication outcome of outbound mail from gom.gov.in.</p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={DMARC} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={2} strokeWidth={2} stroke="#ffffff">
                    {DMARC.map((s) => <Cell key={s.name} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-2xl font-semibold tabular-nums text-ink-900">96.4%</div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">aligned</div>
                </div>
              </div>
            </div>
            <ul className="min-w-[180px] flex-1 space-y-2 text-sm">
              {DMARC.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
                  <span className="min-w-0 flex-1 text-ink-700">{s.name}</span>
                  <span className="font-semibold tabular-nums text-ink-900">{s.value}%</span>
                </li>
              ))}
              <li className="pt-1 text-[11px] text-ink-500">Policy: <span className="font-mono font-medium text-ink-700">p=reject</span> · rua reports to DIT SOC</li>
            </ul>
          </div>
        </section>
      </div>

      {/* ---------------- Template registry ---------------- */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="section-title">Official template registry</h2>
            <p className="mt-0.5 text-xs text-ink-500">Five approved mail templates — click a card to preview the rendered email.</p>
          </div>
          <span className="chip border border-brand-200 bg-brand-50 text-brand-700"><FileCheck2 className="h-3 w-3" /> DIT approved</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {TEMPLATES.map((t) => {
            const open = openTpl === t.id
            return (
              <div
                key={t.id}
                className={cn('card card-hover cursor-pointer p-4 transition', open && 'ring-2 ring-brand-300 sm:col-span-2 xl:col-span-5')}
                onClick={() => setOpenTpl(open ? null : t.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                    <t.icon className="h-4 w-4" />
                  </span>
                  {open ? <ChevronUp className="h-4 w-4 text-ink-400" /> : <ChevronDown className="h-4 w-4 text-ink-400" />}
                </div>
                <div className="mt-2 text-sm font-semibold text-ink-900">{t.name}</div>
                <div className="mt-0.5 font-mono text-[10px] text-ink-400">{t.id}</div>
                <div className="mt-2 text-xs text-ink-500"><span className="font-semibold tabular-nums text-ink-800">{t.usage.toLocaleString('en-IN')}</span> sends · 30 days</div>

                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 overflow-hidden rounded-xl border border-ink-200 bg-ink-50/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-ink-200 bg-white px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-600">
                      <div><span className="text-ink-400">From:</span> noreply@gom.gov.in</div>
                      <div><span className="text-ink-400">To:</span> {'{recipient}'}@{'{department}'}.maharashtra.gov.in</div>
                      <div className="font-semibold text-ink-800"><span className="font-normal text-ink-400">Subject:</span> {t.subject}</div>
                    </div>
                    <pre className="max-w-full overflow-x-auto whitespace-pre-wrap px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-700">{t.body}</pre>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------------- Traffic: departments + hourly ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <h2 className="section-title">Traffic by department</h2>
          <p className="mt-0.5 text-xs text-ink-500">Relayed messages today, top six departments.</p>
          <div className="mt-4 space-y-3">
            {DEPT_TRAFFIC.map((d) => (
              <div key={d.dept}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-medium text-ink-700">{d.dept}</span>
                  <span className="tabular-nums text-ink-500">{d.count.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / maxDept) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-brand-gradient"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-4 sm:p-5">
          <h2 className="section-title">Hourly volume · 24h</h2>
          <p className="mt-0.5 text-xs text-ink-500">Office-hours peak between 10:00 and 16:00.</p>
          <div className="mt-3 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="emailHourly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B57D0" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString('en-IN'), 'Messages']} labelFormatter={(l) => `${l}:00 hrs`} />
                <Area type="monotone" dataKey="v" stroke="#0B57D0" strokeWidth={2} fill="url(#emailHourly)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ---------------- Relay log ---------------- */}
      <section className="card overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 p-4">
          <div>
            <h2 className="section-title">Recent relay log</h2>
            <p className="mt-0.5 text-xs text-ink-500">Live tail of the last six relay events.</p>
          </div>
          <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Streaming
          </span>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="table-th">Time</th>
                <th className="table-th">From dept</th>
                <th className="table-th">Type</th>
                <th className="table-th">DLP verdict</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {RELAY_LOG.map((r) => (
                <tr key={r.time} className="hover:bg-ink-50/40">
                  <td className="table-td font-mono text-xs text-ink-600">{r.time}</td>
                  <td className="table-td font-medium text-ink-800">{r.dept}</td>
                  <td className="table-td">{r.type}</td>
                  <td className="table-td"><DlpChip verdict={r.dlp} /></td>
                  <td className="table-td">
                    <span className={cn('chip border',
                      r.status === 'Delivered' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                      r.status === 'Queued' && 'border-sky-200 bg-sky-50 text-sky-700',
                      r.status === 'Held' && 'border-amber-200 bg-amber-50 text-amber-700',
                    )}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- Security posture strip ---------------- */}
      <section className="card flex flex-wrap items-center gap-x-8 gap-y-4 bg-gradient-to-r from-brand-50/60 to-white p-4 sm:p-5">
        <PostureItem icon={<Lock className="h-4 w-4" />} k="Transport" v="TLS 1.3 enforced" sub={gw.securityStatus} />
        <PostureItem icon={<ScanSearch className="h-4 w-4" />} k="Attachments" v="Sandbox detonation" sub="All executables blocked" />
        <PostureItem icon={<AlertTriangle className="h-4 w-4" />} k="Phishing quarantine" v="34 held this month" sub="0 released without review" />
        <PostureItem icon={<ShieldCheck className="h-4 w-4" />} k="Approvals" v="Standing DIT authorisation" sub={`Required approvals: ${gw.requiredApprovals.join(', ')}`} />
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
      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60">{k}</div>
      <div className="mt-0.5 text-base font-semibold">{v}</div>
    </div>
  )
}

function DeliverabilityDial({ value }: { value: number }) {
  const r = 62
  const c = 2 * Math.PI * r
  const filled = (value / 100) * c
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <motion.circle
          cx="80" cy="80" r={r} fill="none" stroke="#0B57D0" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          initial={{ strokeDashoffset: filled }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-semibold tabular-nums text-ink-900">{value}%</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-ink-500">delivered</div>
        </div>
      </div>
    </div>
  )
}

function OutcomeBar({ label, pct, tone }: { label: string; pct: number; tone: 'ok' | 'warn' | 'bad' }) {
  const color = tone === 'ok' ? '#0B57D0' : tone === 'warn' ? '#B45309' : '#DC2626'
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="font-medium text-ink-700">{label}</span>
        <span className="tabular-nums text-ink-500">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 1.5)}%`, background: color }} />
      </div>
    </div>
  )
}

function DlpChip({ verdict }: { verdict: string }) {
  const cls =
    verdict === 'Clear' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
    verdict === 'Redacted' ? 'border-amber-200 bg-amber-50 text-amber-700' :
    'border-red-200 bg-red-50 text-red-700'
  return <span className={cn('chip border', cls)}><ScanSearch className="h-3 w-3" /> {verdict}</span>
}

function PostureItem({ icon, k, v, sub }: { icon: ReactNode; k: string; v: string; sub: string }) {
  return (
    <div className="flex min-w-[200px] items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">{icon}</span>
      <div>
        <div className="label !text-[10px]">{k}</div>
        <div className="text-sm font-semibold text-ink-900">{v}</div>
        <div className="text-[11px] text-ink-500">{sub}</div>
      </div>
    </div>
  )
}
