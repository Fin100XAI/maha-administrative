import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader } from '@/components/ui/Card'
import { ClassificationBadge, SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import {
  ChevronLeft,
  Vault,
  Lock,
  ShieldCheck,
  Search,
  FolderOpen,
  Folder,
  FileText,
  ScanLine,
  Fingerprint,
  History,
  Scale,
  HardDrive,
  Clock,
  ArrowUpRight,
  Archive,
} from 'lucide-react'

const dms = INTEGRATIONS.find((x) => x.slug === 'dms')!

/* ---------------------------------------------------------------- */
/* Demo data — document vault                                        */
/* ---------------------------------------------------------------- */

interface Repo {
  key: string
  name: string
  marathi: string
  docs: number
  size: string
  retention: string
  classification: 'Public' | 'Internal' | 'Confidential' | 'Secret'
}

const REPOS: Repo[] = [
  { key: 'gr', name: 'Government Resolutions', marathi: 'शासन निर्णय', docs: 48213, size: '212 GB', retention: 'Permanent', classification: 'Public' },
  { key: 'circulars', name: 'Circulars', marathi: 'परिपत्रके', docs: 12480, size: '38 GB', retention: '10 years', classification: 'Public' },
  { key: 'notesheets', name: 'Note sheets', marathi: 'टिप्पणी', docs: 86114, size: '164 GB', retention: '25 years', classification: 'Confidential' },
  { key: 'rti', name: 'RTI replies', marathi: 'माहिती अधिकार', docs: 23907, size: '71 GB', retention: '5 years', classification: 'Internal' },
  { key: 'cabinet', name: 'Cabinet notes', marathi: 'मंत्रिमंडळ टिपणे', docs: 1642, size: '9 GB', retention: 'Permanent', classification: 'Secret' },
  { key: 'moms', name: 'Meeting MOMs', marathi: 'बैठक इतिवृत्त', docs: 9318, size: '17 GB', retention: '10 years', classification: 'Internal' },
]

const DOCS: Record<string, { name: string; dept: string; date: string; ver: string; size: string }[]> = {
  gr: [
    { name: 'GR-2026-URD-118.pdf', dept: 'Urban Development', date: '05 Jul 2026', ver: 'v1.3', size: '2.1 MB' },
    { name: 'GR-2026-FIN-092.pdf', dept: 'Finance', date: '02 Jul 2026', ver: 'v1.0', size: '1.4 MB' },
    { name: 'GR-2026-WRD-077.pdf', dept: 'Water Resources', date: '28 Jun 2026', ver: 'v1.1', size: '3.6 MB' },
    { name: 'GR-2026-SJD-064.pdf', dept: 'Social Justice', date: '24 Jun 2026', ver: 'v1.0', size: '1.9 MB' },
  ],
  circulars: [
    { name: 'CIR-GAD-2026-41.pdf', dept: 'GAD', date: '06 Jul 2026', ver: 'v1.0', size: '640 KB' },
    { name: 'CIR-DIT-2026-38.pdf', dept: 'DIT', date: '30 Jun 2026', ver: 'v1.2', size: '820 KB' },
    { name: 'CIR-FIN-2026-35.pdf', dept: 'Finance', date: '21 Jun 2026', ver: 'v1.0', size: '710 KB' },
  ],
  notesheets: [
    { name: 'NS-GAD-EST-0412-14.pdf', dept: 'GAD', date: '07 Jul 2026', ver: 'v2.1', size: '480 KB' },
    { name: 'NS-REV-LND-2281-07.pdf', dept: 'Revenue & Forest', date: '04 Jul 2026', ver: 'v1.4', size: '512 KB' },
    { name: 'NS-UDD-TP-1190-22.pdf', dept: 'Urban Development', date: '01 Jul 2026', ver: 'v3.0', size: '705 KB' },
  ],
  rti: [
    { name: 'RTI-2026-MH-88471-REPLY.pdf', dept: 'SIC Maharashtra', date: '05 Jul 2026', ver: 'v1.0', size: '1.1 MB' },
    { name: 'RTI-2026-MH-88102-REPLY.pdf', dept: 'Rural Development', date: '29 Jun 2026', ver: 'v1.0', size: '890 KB' },
    { name: 'RTI-2026-MH-87764-REPLY.pdf', dept: 'PWD', date: '22 Jun 2026', ver: 'v1.1', size: '2.3 MB' },
  ],
  cabinet: [
    { name: 'CAB-2026-034-NOTE.pdf', dept: 'Chief Secretariat', date: '03 Jul 2026', ver: 'v1.2', size: '4.4 MB' },
    { name: 'CAB-2026-031-NOTE.pdf', dept: 'Chief Secretariat', date: '19 Jun 2026', ver: 'v1.0', size: '3.1 MB' },
  ],
  moms: [
    { name: 'MOM-MAII-SC-2026-07.pdf', dept: 'DIT — MAII Steering', date: '06 Jul 2026', ver: 'v1.0', size: '310 KB' },
    { name: 'MOM-DBT-RC-2026-06.pdf', dept: 'Planning', date: '27 Jun 2026', ver: 'v1.1', size: '285 KB' },
    { name: 'MOM-EGOV-WG-2026-11.pdf', dept: 'GAD', date: '20 Jun 2026', ver: 'v1.0', size: '260 KB' },
  ],
}

const STORAGE_RINGS = [
  { label: 'Used', value: 61, hint: '511 GB of 840 GB provisioned', color: '#0B57D0' },
  { label: 'Encrypted', value: 100, hint: 'AES-256 at rest, all objects', color: '#2A8C42' },
  { label: 'Deduplicated', value: 18, hint: '92 GB reclaimed by dedupe', color: '#EA8600' },
] as const

const INGEST_FEED = [
  { at: '09:31', event: 'OCR complete — GR-2026-URD-118.pdf', kind: 'ocr' },
  { at: '09:27', event: 'Classification applied — NS-GAD-EST-0412-14.pdf → Confidential', kind: 'classify' },
  { at: '09:18', event: 'Bulk ingest — 84 scanned service-book pages (GAD digitisation)', kind: 'ingest' },
  { at: '09:04', event: 'SHA-256 sealed — CAB-2026-034-NOTE.pdf written to WORM tier', kind: 'seal' },
  { at: '08:52', event: 'Retention rule evaluated — 312 RTI replies past 5-year window flagged', kind: 'retention' },
  { at: '08:40', event: 'Version registered — NS-UDD-TP-1190-22.pdf v3.0 (delta 1.2%)', kind: 'version' },
] as const

const VERSION_TIMELINE = [
  { ver: 'v1.3', date: '05 Jul 2026 · 14:22', by: 'Desk Officer, UDD', note: 'Corrigendum merged — annexure B table replaced', current: true },
  { ver: 'v1.2', date: '04 Jul 2026 · 11:05', by: 'Under Secretary, UDD', note: 'Marathi translation attached and verified', current: false },
  { ver: 'v1.1', date: '03 Jul 2026 · 17:48', by: 'DMS OCR service', note: 'OCR layer regenerated at 300 dpi, searchable text', current: false },
  { ver: 'v1.0', date: '03 Jul 2026 · 16:10', by: 'Section Officer, UDD', note: 'Original signed GR ingested from e-Office', current: false },
]

const HASHES = [
  { doc: 'GR-2026-URD-118.pdf', hash: '9f4e0a7c1b2d…e881', tier: 'WORM' },
  { doc: 'CAB-2026-034-NOTE.pdf', hash: '3b81cd90aa47…12fe', tier: 'WORM' },
  { doc: 'NS-GAD-EST-0412-14.pdf', hash: 'c204f7d35e9a…77b3', tier: 'Hot' },
] as const

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

export function DMSPage() {
  const [query, setQuery] = useState('')
  const [openRepo, setOpenRepo] = useState<string | null>('gr')

  const q = query.trim().toLowerCase()

  const visibleRepos = useMemo(() => {
    if (!q) return REPOS
    return REPOS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.marathi.includes(q) ||
        (DOCS[r.key] ?? []).some((d) => d.name.toLowerCase().includes(q) || d.dept.toLowerCase().includes(q)),
    )
  }, [q])

  const activeRepo = visibleRepos.find((r) => r.key === openRepo) ?? null
  const activeDocs = useMemo(() => {
    if (!activeRepo) return []
    const list = DOCS[activeRepo.key] ?? []
    if (!q) return list
    return list.filter((d) => d.name.toLowerCase().includes(q) || d.dept.toLowerCase().includes(q))
  }, [activeRepo, q])

  return (
    <div className="space-y-6">
      <VaultHero />

      {/* Vault search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the vault — repository, document ID or department…"
          className="input h-12 w-full rounded-xl pl-11 text-sm shadow-card"
        />
        {q && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-500">
            {visibleRepos.length} repositor{visibleRepos.length === 1 ? 'y' : 'ies'}
          </div>
        )}
      </div>

      {/* Folder grid */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <Archive className="h-4 w-4 text-brand-500" /> Repositories
          </h2>
          <SourceBadge source="Live" />
        </div>
        {visibleRepos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/40 py-10 text-center text-sm text-ink-500">
            No repository or document matches “{query}”.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleRepos.map((r, idx) => (
              <FolderTile
                key={r.key}
                repo={r}
                index={idx}
                open={openRepo === r.key}
                onOpen={() => setOpenRepo(openRepo === r.key ? null : r.key)}
              />
            ))}
          </div>
        )}

        {/* Opened folder — document list */}
        <AnimatePresence mode="wait">
          {activeRepo && (
            <motion.div
              key={activeRepo.key + q}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="card mt-3 overflow-hidden p-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-800">
                  <FolderOpen className="h-4 w-4 text-brand-600" />
                  {activeRepo.name} <span className="font-normal text-ink-500">· {activeRepo.marathi}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ClassificationBadge level={activeRepo.classification} />
                  <span className="chip border border-ink-200 bg-white text-ink-600">
                    <Clock className="h-3 w-3" /> Retention: {activeRepo.retention}
                  </span>
                </div>
              </div>
              {activeDocs.length === 0 ? (
                <div className="p-6 text-center text-sm text-ink-500">No documents match “{query}” in this repository.</div>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {activeDocs.map((d) => (
                    <li key={d.name} className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-ink-50/40">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-4 w-4 shrink-0 text-brand-500" />
                        <div className="min-w-0">
                          <div className="truncate font-mono text-xs font-medium text-ink-800">{d.name}</div>
                          <div className="text-[11px] text-ink-500">{d.dept} · {d.date}</div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-[11px] text-ink-500">
                        <span className="chip border border-ink-200 bg-ink-50 text-ink-600">{d.ver}</span>
                        <span className="hidden sm:inline">{d.size}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-ink-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Storage rings + ingest feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Storage posture" subtitle="MAII vault — primary object store" right={<HardDrive className="h-4 w-4 text-brand-500" />} />
          <div className="grid grid-cols-3 gap-2">
            {STORAGE_RINGS.map((ring) => (
              <StorageRing key={ring.label} {...ring} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Ingest activity" subtitle="Pipeline events · today" right={<ScanLine className="h-4 w-4 text-brand-500" />} />
          <ul className="space-y-2">
            {INGEST_FEED.map((e, idx) => (
              <motion.li
                key={e.at + e.kind}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 rounded-lg border border-ink-100 px-3 py-2"
              >
                <span className="mt-0.5 shrink-0 font-mono text-[11px] text-ink-500">{e.at}</span>
                <span className="min-w-0 text-sm text-ink-700">{e.event}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Version timeline + retention & integrity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Version history"
            subtitle={<span className="font-mono">GR-2026-URD-118.pdf</span>}
            right={<History className="h-4 w-4 text-brand-500" />}
          />
          <ol className="relative space-y-4 border-l-2 border-ink-100 pl-5">
            {VERSION_TIMELINE.map((v) => (
              <li key={v.ver} className="relative">
                <span
                  className={
                    'absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full ring-4 ring-white ' +
                    (v.current ? 'bg-brand-500' : 'bg-ink-300')
                  }
                />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={'text-sm font-semibold ' + (v.current ? 'text-brand-700' : 'text-ink-800')}>{v.ver}</span>
                  {v.current && <span className="chip border border-brand-200 bg-brand-50 text-[10px] text-brand-700">Current</span>}
                  <span className="text-[11px] text-ink-500">{v.date}</span>
                </div>
                <div className="text-xs text-ink-600">{v.note}</div>
                <div className="text-[11px] text-ink-500">by {v.by}</div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Retention & legal hold" right={<Scale className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2">
                <span className="text-ink-700">Active retention policies</span>
                <span className="font-semibold text-ink-900">6</span>
              </li>
              <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <span className="text-ink-700">Documents under legal hold</span>
                <span className="chip border border-rose-200 bg-rose-50 text-rose-700">
                  <Lock className="h-3 w-3" /> 128 · WP 2214/2026 (Bombay HC)
                </span>
              </li>
              <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
                <span className="text-ink-700">Pending disposal review</span>
                <span className="chip border border-amber-200 bg-amber-50 text-amber-700">312 RTI replies</span>
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader
              title="Integrity"
              subtitle="Content-addressed seals · SHA-256"
              right={
                <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-3 w-3" /> WORM storage
                </span>
              }
            />
            <ul className="space-y-1.5">
              {HASHES.map((h) => (
                <li key={h.doc} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-ink-50/60 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Fingerprint className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                    <span className="truncate font-mono text-[11px] text-ink-700">{h.doc}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <code className="font-mono text-[11px] text-ink-500">{h.hash}</code>
                    <span className="chip border border-ink-200 bg-white text-[10px] text-ink-600">{h.tier}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Hero — ink-toned vault band                                       */
/* ---------------------------------------------------------------- */

function VaultHero() {
  const total = REPOS.reduce((s, r) => s + r.docs, 0)
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 text-white shadow-card">
      {/* vault-door concentric rings */}
      <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -right-10 -top-14 h-64 w-64 opacity-[0.12]">
        {[90, 70, 50, 30].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="white" strokeWidth="1.5" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={100 + 30 * Math.cos(a)} y1={100 + 30 * Math.sin(a)}
              x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)}
              stroke="white" strokeWidth="1.5"
            />
          )
        })}
      </svg>

      <div className="relative p-5 sm:p-7">
        <Link to="/integrations" className="inline-flex items-center gap-1 text-xs font-medium text-white/70 transition hover:text-white">
          <ChevronLeft className="h-3.5 w-3.5" /> Integrations
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur">
              <Vault className="h-7 w-7 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                Storage connector · DIT
              </div>
              <h1 className="mt-0.5 text-2xl font-semibold leading-tight sm:text-3xl">{dms.name}</h1>
              <p className="mt-1 max-w-xl text-sm text-white/70">
                {dms.description} {total.toLocaleString('en-IN')} sealed records across 6 repositories.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip border border-emerald-300/40 bg-emerald-400/15 text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {dms.status}
                </span>
                <span className="chip border border-white/20 bg-white/10 text-white">
                  <Lock className="h-3 w-3" /> AES-256 at rest
                </span>
                <span className="chip border border-white/20 bg-white/10 text-white">
                  <ShieldCheck className="h-3 w-3" /> mTLS in transit
                </span>
                <span className="chip border border-white/20 bg-white/10 text-white">
                  <Clock className="h-3 w-3" /> Last sync {dms.lastSync}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
              <circle cx="32" cy="32" r={26} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
              <motion.circle
                cx="32" cy="32" r={26} fill="none" stroke="#5BB974" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - dms.connectorReadiness / 100) }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
              <text x="32" y="32" transform="rotate(90 32 32)" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="15" fontWeight="700">
                {dms.connectorReadiness}
              </text>
            </svg>
            <div className="text-xs leading-tight text-white/70">
              Connector<br />readiness <span className="font-semibold text-white">{dms.connectorReadiness}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */
/* Folder tile                                                       */
/* ---------------------------------------------------------------- */

const CLASS_DOT: Record<Repo['classification'], string> = {
  Public: 'bg-emerald-500',
  Internal: 'bg-sky-500',
  Confidential: 'bg-amber-500',
  Secret: 'bg-rose-500',
}

function FolderTile({ repo, index, open, onOpen }: { repo: Repo; index: number; open: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={
        'card card-hover group relative overflow-hidden p-4 text-left transition-all ' +
        (open ? 'ring-2 ring-brand-400' : '')
      }
      aria-expanded={open}
    >
      {/* folder tab */}
      <div aria-hidden className="absolute left-4 top-0 h-1.5 w-12 rounded-b bg-brand-200 group-hover:bg-brand-300" />
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-600 ring-1 ring-brand-100">
          {open ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />}
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-ink-500" title={`Classification: ${repo.classification}`}>
          <span className={'h-2 w-2 rounded-full ' + CLASS_DOT[repo.classification]} />
          {repo.classification}
        </span>
      </div>
      <div className="mt-3 text-sm font-semibold text-ink-900">{repo.name}</div>
      <div className="text-xs text-ink-500">{repo.marathi}</div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-600">
        <span><span className="font-semibold tabular-nums text-ink-900">{repo.docs.toLocaleString('en-IN')}</span> docs</span>
        <span>{repo.size}</span>
        <span className="chip border border-ink-200 bg-ink-50 text-[10px] text-ink-600">
          <Clock className="h-2.5 w-2.5" /> {repo.retention}
        </span>
      </div>
    </motion.button>
  )
}

/* ---------------------------------------------------------------- */
/* Storage donut ring                                                */
/* ---------------------------------------------------------------- */

function StorageRing({ label, value, hint, color }: { label: string; value: number; hint: string; color: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1.5 py-2 text-center">
      <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90" role="img" aria-label={`${label}: ${value}%`}>
        <circle cx="44" cy="44" r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
        <motion.circle
          cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <text x="44" y="44" transform="rotate(90 44 44)" textAnchor="middle" dominantBaseline="central" fill="#0f172a" fontSize="17" fontWeight="700">
          {value}%
        </text>
      </svg>
      <div className="text-xs font-semibold text-ink-800">{label}</div>
      <div className="text-[11px] leading-snug text-ink-500">{hint}</div>
    </div>
  )
}
