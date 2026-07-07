import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import {
  ChevronLeft, ExternalLink, CheckCircle2, Clock3, Circle, BookOpen,
  ArrowLeftRight, ListOrdered, CalendarCheck, Hourglass, BarChart3, FileText,
  ShieldCheck, Landmark, Stamp,
} from 'lucide-react'
import { StatusBadge, SourceBadge, ClassificationBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

const ehrms = INTEGRATIONS.find((x) => x.slug === 'e-hrms')!

/* ------------------------------------------------------------------ */
/* Demo data — clearly labelled, pre-connection                        */
/* ------------------------------------------------------------------ */

type MilestoneState = 'done' | 'active' | 'pending'

const ROADMAP: { title: string; detail: string; owner: string; eta: string; state: MilestoneState }[] = [
  { title: 'NIC MoU signature', detail: 'Data-sharing MoU between GAD (GoM) and NIC e-HRMS division executed.', owner: 'Secretary, GAD', eta: 'Completed · 12 May 2026', state: 'done' },
  { title: 'API credentials', detail: 'Client ID + sandbox keys issued on the NIC API exchange for MAII.', owner: 'NIC HRMS cell, Delhi', eta: 'Completed · 24 Jun 2026', state: 'done' },
  { title: 'Sandbox integration', detail: 'Employee-master and service-book endpoints wired into MAII staging.', owner: 'MAII Platform team', eta: 'ETA · 18 Aug 2026', state: 'active' },
  { title: 'VAPT audit', detail: 'CERT-In empanelled vendor tests the connector end-to-end.', owner: 'DIT Security (CISO)', eta: 'ETA · Sep 2026', state: 'pending' },
  { title: 'DPO sign-off', detail: 'DPDP purpose-limitation and field-minimisation review of the data contract.', owner: 'Data Protection Officer, GAD', eta: 'ETA · Oct 2026', state: 'pending' },
  { title: 'Production go-live', detail: 'Connector registered on the MAII API Gateway with mTLS + JWT.', owner: 'MAII + NIC joint cell', eta: 'Target · Q4 2026', state: 'pending' },
]

const SERVICE_BOOK_ROWS = [
  { sr: '01', date: '04 Jul 2016', event: 'Appointment', office: 'Asst. Section Officer · GAD, Mantralaya', pay: 'Level 7 · ₹44,900' },
  { sr: '02', date: '01 Jul 2018', event: 'Annual increment', office: 'GAD, Mantralaya', pay: 'Level 7 · ₹47,600' },
  { sr: '03', date: '15 Jun 2020', event: 'Transfer', office: 'Section Officer · Collectorate, Pune', pay: 'Level 7 · ₹50,500' },
  { sr: '04', date: '01 Jul 2022', event: 'Annual increment', office: 'Collectorate, Pune', pay: 'Level 7 · ₹53,600' },
  { sr: '05', date: '02 May 2024', event: 'Transfer (promotion)', office: 'Dy. Collector (Sel. Gr.) · Nashik Division', pay: 'Level 8 · ₹56,100' },
]

const UNLOCKS = [
  { icon: ArrowLeftRight, title: 'Transfer list automation', impact: 'General transfer cycle: ~3 weeks → 2 days', note: 'Draft lists from tenure + request data, rule-checked before GAD review.' },
  { icon: ListOrdered, title: 'Seniority checks', impact: '100% rule-cited seniority lists', note: 'MCS Rules citations attached to every position in the list.' },
  { icon: CalendarCheck, title: 'Leave balance in Officer Workspace', impact: '~40,000 lookups/yr self-served', note: 'EL/HPL balances inline — no PDF requests to establishment branch.' },
  { icon: Hourglass, title: 'Retirement pipeline', impact: '18-month pension paper lead time', note: 'Auto-flag superannuations; Form 6 preparation starts early.' },
  { icon: BarChart3, title: 'Vacancy analytics', impact: 'Live sanctioned-vs-filled by cadre', note: 'Feeds recruitment planning and MPSC requisition drafts.' },
  { icon: FileText, title: 'Service-record summaries', impact: 'Full service-book brief in <5 s', note: 'One-page summary for DPC, inquiry and NOC workflows.' },
]

const DATA_CONTRACT = [
  { entity: 'Employee master', fields: 42, pii: 'Confidential', note: 'Identity, cadre, date of birth — no Aadhaar number stored' },
  { entity: 'Postings & transfers', fields: 18, pii: 'Internal', note: 'Office, designation, tenure history' },
  { entity: 'Leave ledger', fields: 12, pii: 'Internal', note: 'EL/HPL/CL balances and sanction trail' },
  { entity: 'Payroll reference', fields: 9, pii: 'Confidential', note: 'Pay level + increment date only; no bank details' },
  { entity: 'Training records', fields: 11, pii: 'Internal', note: 'YASHADA / LBSNAA courses, completion status' },
]

const CADRES = [
  { cadre: 'Dy. Collector', sanctioned: 540, filled: 461 },
  { cadre: 'Tahsildar', sanctioned: 358, filled: 312 },
  { cadre: 'Naib Tahsildar', sanctioned: 1240, filled: 1004 },
  { cadre: 'Section Officer', sanctioned: 2180, filled: 1892 },
  { cadre: 'Clerk-Typist', sanctioned: 6420, filled: 5169 },
]

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function ReadinessArc({ value }: { value: number }) {
  // semicircle of radius 70 → arc length = PI * 70
  const LEN = Math.PI * 70
  const off = LEN * (1 - value / 100)
  return (
    <div className="relative mx-auto w-[190px]">
      <svg viewBox="0 0 180 100" className="w-full">
        <path d="M 20 92 A 70 70 0 0 1 160 92" fill="none" stroke="#E8EDF6" strokeWidth="13" strokeLinecap="round" />
        <motion.path
          d="M 20 92 A 70 70 0 0 1 160 92"
          fill="none"
          stroke="url(#ehrmsArc)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={LEN}
          initial={{ strokeDashoffset: LEN }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ehrmsArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B57D0" />
            <stop offset="100%" stopColor="#062868" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="text-3xl font-semibold leading-none text-ink-900">{value}%</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">Connector readiness</div>
      </div>
    </div>
  )
}

function MilestoneDot({ state }: { state: MilestoneState }) {
  if (state === 'done') {
    return (
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-amber-300 bg-amber-50 text-amber-600">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber-200/60" />
        <Clock3 className="relative h-4 w-4" />
      </span>
    )
  }
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 bg-white text-ink-300">
      <Circle className="h-3 w-3" />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function EHRMSPage() {
  const doneCount = ROADMAP.filter((m) => m.state === 'done').length
  return (
    <div className="space-y-6">
      {/* ---------------- Hero: split title / readiness arc ---------------- */}
      <div className="card relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-gradient opacity-[0.06] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 to-amber-200" />
        <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <Link to="/integrations" className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
              <ChevronLeft className="h-3.5 w-3.5" /> All integrations
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                <BookOpen className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-ink-900 sm:text-2xl">{ehrms.name} — Service-Book Onboarding Room</h1>
                <p className="mt-0.5 text-sm text-ink-500">{ehrms.description} Pre-connection view — nothing on this page is live employee data.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={ehrms.status} />
              <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                <Landmark className="h-3 w-3" /> NIC MoU · signed 12 May 2026
              </span>
              <span className="chip border border-ink-200 bg-ink-50 text-ink-600">Data owner · {ehrms.dataOwner}</span>
              {ehrms.url && (
                <a href={ehrms.url} target="_blank" rel="noreferrer" className="chip border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100">
                  ehrms.gov.in <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-ink-100 bg-ink-50/40 p-4">
            <ReadinessArc value={ehrms.connectorReadiness} />
            <span className="chip border border-brand-200 bg-white text-brand-700">Go-live plan · Q4 2026</span>
          </div>
        </div>
      </div>

      {/* -------- Roadmap (signature) + Service book preview -------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Connection roadmap */}
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink-900">Connection roadmap</h2>
              <p className="mt-0.5 text-xs text-ink-500">{doneCount} of {ROADMAP.length} milestones complete — sandbox integration underway</p>
            </div>
            <SourceBadge source="Department API required" />
          </div>
          <ol>
            {ROADMAP.map((m, idx) => (
              <motion.li
                key={m.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative flex gap-3 pb-5 last:pb-0"
              >
                {idx < ROADMAP.length - 1 && (
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-4 top-9 bottom-1 w-px -translate-x-1/2',
                      m.state === 'done' ? 'bg-emerald-300' : 'border-l border-dashed border-ink-300',
                    )}
                  />
                )}
                <MilestoneDot state={m.state} />
                <div className={cn('min-w-0 flex-1 rounded-xl border px-3 py-2.5', m.state === 'active' ? 'border-amber-200 bg-amber-50/50' : 'border-ink-100 bg-white')}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <span className="text-sm font-semibold text-ink-900">{idx + 1}. {m.title}</span>
                    <span className={cn('text-[11px] font-medium', m.state === 'done' ? 'text-emerald-600' : m.state === 'active' ? 'text-amber-700' : 'text-ink-500')}>{m.eta}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-600">{m.detail}</p>
                  <div className="mt-1.5 text-[11px] font-medium text-ink-500">Owner · {m.owner}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Service book register preview + cadre chart */}
        <div className="space-y-6">
          <div className="card overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-ink-900">Service book — register preview</h2>
                <p className="mt-0.5 text-xs text-ink-500">How a synced service book will render in MAII. Fictional officer, sandbox schema.</p>
              </div>
              <SourceBadge source="Demo" />
            </div>
            <div className="relative m-4 overflow-hidden rounded-lg border-2 border-double border-amber-300/70 bg-[#FDFAF1] sm:m-5">
              {/* Watermark */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center">
                <span className="-rotate-12 whitespace-nowrap text-3xl font-bold uppercase tracking-[0.35em] text-amber-900/10 sm:text-4xl">Sandbox Preview</span>
              </div>
              <div className="border-b border-amber-200/80 px-4 py-3 text-center">
                <div className="font-serif text-[13px] font-semibold tracking-wide text-amber-950">सेवा पुस्तक · SERVICE BOOK</div>
                <div className="mt-0.5 text-[11px] text-amber-900/70">Government of Maharashtra · General Administration Department</div>
                <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-amber-950/80">
                  <span><span className="font-semibold">Employee ID:</span> MH-REV-2016-0457</span>
                  <span><span className="font-semibold">Cadre:</span> Deputy Collector (MCS)</span>
                  <span className="inline-flex items-center gap-1 rounded border border-red-300 bg-red-50 px-1.5 py-0.5 font-semibold text-red-700"><Stamp className="h-3 w-3" /> SANDBOX</span>
                </div>
              </div>
              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[560px] text-[12px]">
                  <thead>
                    <tr className="border-b border-amber-200/80 text-left text-[10px] uppercase tracking-wider text-amber-900/60">
                      <th className="px-3 py-2 font-semibold">Sr.</th>
                      <th className="px-3 py-2 font-semibold">Date</th>
                      <th className="px-3 py-2 font-semibold">Event</th>
                      <th className="px-3 py-2 font-semibold">Office / posting</th>
                      <th className="px-3 py-2 font-semibold">Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICE_BOOK_ROWS.map((r) => (
                      <tr key={r.sr} className="border-b border-dashed border-amber-200/70 text-amber-950/90 last:border-0">
                        <td className="px-3 py-2 font-mono text-[11px]">{r.sr}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.date}</td>
                        <td className="px-3 py-2 font-medium">{r.event}</td>
                        <td className="px-3 py-2">{r.office}</td>
                        <td className="whitespace-nowrap px-3 py-2">{r.pay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cadre snapshot */}
          <div className="card p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-ink-900">Cadre snapshot — sanctioned vs filled</h2>
                <p className="mt-0.5 text-xs text-ink-500">Illustrative strength for five cadres; live figures arrive with the connector.</p>
              </div>
              <SourceBadge source="Demo" />
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CADRES} margin={{ top: 4, right: 8, left: -8, bottom: 0 }} barGap={3}>
                  <CartesianGrid vertical={false} stroke="#EEF2F7" />
                  <XAxis dataKey="cadre" tick={{ fontSize: 10.5, fill: '#64748B' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(11,87,208,0.05)' }}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(v: number, name: string) => [v.toLocaleString('en-IN'), name === 'sanctioned' ? 'Sanctioned' : 'Filled']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === 'sanctioned' ? 'Sanctioned' : 'Filled')} />
                  <Bar dataKey="sanctioned" fill="#0B57D0" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="filled" fill="#0D9488" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- What it unlocks ---------------- */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="section-title text-ink-800">What connecting e-HRMS unlocks for MAII</h2>
          <SourceBadge source="Demo" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {UNLOCKS.map((u, idx) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card card-hover p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100">
                  <u.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-900">{u.title}</div>
                  <div className="mt-1 inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">{u.impact}</div>
                  <p className="mt-1.5 text-xs text-ink-500">{u.note}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---------------- Data contract ---------------- */}
      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-ink-900">Data contract — five entities to sync</h2>
            <p className="mt-0.5 text-xs text-ink-500">Field-minimised scope agreed under the NIC MoU; awaiting DPO sign-off.</p>
          </div>
          <SourceBadge source="Department API required" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {DATA_CONTRACT.map((d) => (
            <div key={d.entity} className="rounded-xl border border-ink-100 bg-ink-50/30 p-3">
              <div className="text-sm font-semibold text-ink-900">{d.entity}</div>
              <div className="mt-1 text-xs text-ink-500">{d.fields} fields</div>
              <div className="mt-2"><ClassificationBadge level={d.pii} /></div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-500">{d.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-xs text-sky-900">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
          <span>
            <span className="font-semibold">DPDP Act 2023 note —</span> sync is purpose-limited to establishment workflows; Aadhaar numbers, bank details and medical records are excluded at the contract level. All reads are consent-headered, DLP-scanned and audit-logged.
          </span>
        </div>
      </div>
    </div>
  )
}
