import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import {
  ChevronLeft, ShieldCheck, KeyRound, Gauge, Activity, Terminal, Play,
  ChevronDown, ChevronRight, Lock, Timer, ArrowUpDown, ShieldAlert, HeartPulse,
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Demo data — MAII edge gateway (gateway.maii.mah.gov.in)             */
/* ------------------------------------------------------------------ */

const GW = INTEGRATIONS.find((i) => i.slug === 'api-gateway')!

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

interface GatewayRoute {
  method: 'GET' | 'POST'
  path: string
  upstream: string
  p50: number
  p95: number
  p99: number
  rps: number
  errPct: number
  limit: string
  scope: string
  breakdown: { code: string; count: number }[]
  retry: string
}

const ROUTES: GatewayRoute[] = [
  {
    method: 'GET', path: '/v1/health', upstream: 'router (self)', p50: 8, p95: 24, p99: 40,
    rps: 0.5, errPct: 0.0, limit: 'unlimited', scope: 'public',
    breakdown: [{ code: '401', count: 0 }, { code: '403', count: 0 }, { code: '429', count: 0 }, { code: '5xx', count: 0 }],
    retry: 'No retry — liveness probe, fail fast.',
  },
  {
    method: 'POST', path: '/v1/officer/session', upstream: 'auth-svc', p50: 120, p95: 340, p99: 520,
    rps: 9.8, errPct: 0.12, limit: '60/min · officer', scope: 'officer.session',
    breakdown: [{ code: '401', count: 84 }, { code: '403', count: 12 }, { code: '429', count: 6 }, { code: '5xx', count: 2 }],
    retry: 'No retry on 401/403 · 429 retried once after Retry-After.',
  },
  {
    method: 'GET', path: '/v1/officer/{id}', upstream: 'auth-svc', p50: 88, p95: 210, p99: 330,
    rps: 7.2, errPct: 0.08, limit: '120/min · officer', scope: 'officer.read',
    breakdown: [{ code: '401', count: 22 }, { code: '403', count: 18 }, { code: '429', count: 4 }, { code: '5xx', count: 1 }],
    retry: '2 retries · exponential back-off with jitter (100ms base).',
  },
  {
    method: 'GET', path: '/v1/documents/{id}', upstream: 'dms-connector', p50: 110, p95: 260, p99: 410,
    rps: 14.9, errPct: 0.06, limit: '240/min · officer', scope: 'dms.read',
    breakdown: [{ code: '401', count: 14 }, { code: '403', count: 31 }, { code: '429', count: 9 }, { code: '5xx', count: 3 }],
    retry: '2 retries · exponential back-off · idempotent GET.',
  },
  {
    method: 'POST', path: '/v1/documents/upload', upstream: 'dms-connector', p50: 640, p95: 1820, p99: 2600,
    rps: 2.5, errPct: 0.42, limit: '20/min · officer', scope: 'dms.write',
    breakdown: [{ code: '401', count: 6 }, { code: '403', count: 9 }, { code: '429', count: 21 }, { code: '5xx', count: 11 }],
    retry: 'Chunk-level retry ×3 · resumable upload · DLP scan before ack.',
  },
  {
    method: 'POST', path: '/v1/notify/email', upstream: 'email-connector', p50: 90, p95: 240, p99: 380,
    rps: 22.1, errPct: 0.05, limit: '600/min · service', scope: 'notify.email',
    breakdown: [{ code: '401', count: 3 }, { code: '403', count: 2 }, { code: '429', count: 18 }, { code: '5xx', count: 4 }],
    retry: 'Queued relay · 3 retries over 15 min · DLQ after that.',
  },
  {
    method: 'POST', path: '/v1/notify/sms', upstream: 'sms-connector', p50: 70, p95: 190, p99: 300,
    rps: 28.4, errPct: 0.09, limit: '900/min · service', scope: 'notify.sms',
    breakdown: [{ code: '401', count: 2 }, { code: '403', count: 41 }, { code: '429', count: 12 }, { code: '5xx', count: 6 }],
    retry: 'DLT template validated pre-send · 2 retries · alert DIT on 403.',
  },
  {
    method: 'GET', path: '/v1/eoffice/files/{fileNo}', upstream: 'eoffice-connector', p50: 210, p95: 480, p99: 720,
    rps: 18.3, errPct: 0.31, limit: '180/min · officer', scope: 'eoffice.read',
    breakdown: [{ code: '401', count: 8 }, { code: '403', count: 15 }, { code: '429', count: 96 }, { code: '5xx', count: 12 }],
    retry: 'NIC gateway 429-aware · back-off + retry queue (max 3).',
  },
]

/* Latency percentiles over 24h — deterministic sinusoid + office-hours bump. */
const LATENCY_24H = Array.from({ length: 24 }, (_, h) => {
  const office = h >= 9 && h <= 18 ? 1 : h >= 6 && h < 9 ? 0.6 : 0.25
  const wave = Math.sin((h / 24) * Math.PI * 2 - 1.2) * 8
  const p50 = Math.round(58 + office * 26 + wave)
  const p95 = Math.round(150 + office * 92 + wave * 2.4 + (h === 12 ? 38 : 0))
  const p99 = Math.round(240 + office * 170 + wave * 3.6 + (h === 12 ? 90 : 0))
  return { hour: `${String(h).padStart(2, '0')}:00`, p50, p95, p99 }
})

const WAF_RULES = [
  { rule: 'SQL injection (SQLi)', blocked: 412 },
  { rule: 'Cross-site scripting (XSS)', blocked: 268 },
  { rule: 'IP reputation / TOR', blocked: 240 },
  { rule: 'Prompt-injection passthrough', blocked: 191 },
  { rule: 'Rate-abuse (burst)', blocked: 131 },
]
const WAF_TOTAL = WAF_RULES.reduce((s, r) => s + r.blocked, 0) // 1,242

const WAF_EVENTS: { ts: string; rule: string; detail: string; sev: 'High' | 'Medium' | 'Low' }[] = [
  { ts: '09:31:42', rule: 'SQLI', detail: 'UNION SELECT in q= · GET /v1/documents/search · src 103.194.x.x', sev: 'High' },
  { ts: '09:27:05', rule: 'PROMPT-INJ', detail: 'ignore-previous pattern in upload metadata · POST /v1/documents/upload', sev: 'Medium' },
  { ts: '09:14:58', rule: 'XSS', detail: 'script tag payload in note field · POST /v1/eoffice/notes', sev: 'Medium' },
  { ts: '08:52:11', rule: 'IP-REP', detail: 'TOR exit node blocked pre-auth · 45 requests dropped', sev: 'High' },
  { ts: '08:41:36', rule: 'RATE', detail: 'External tier exceeded 5 rps ×3 · key ext_0042 throttled 60s', sev: 'Low' },
]

const RATE_TIERS = [
  { consumer: 'Officer UI', limit: 100, used: 78, note: 'Mantralaya + district offices' },
  { consumer: 'AI Copilot', limit: 40, used: 31, note: 'Note-drafting & summarisation' },
  { consumer: 'Batch jobs', limit: 20, used: 12, note: 'Nightly sync · reports' },
  { consumer: 'External partners', limit: 5, used: 2, note: 'Aaple Sarkar bridge (pilot)' },
]

const MTLS_CERTS: { upstream: string; days: number }[] = [
  { upstream: 'audit-ledger', days: 14 },
  { upstream: 'gateway (edge)', days: 61 },
  { upstream: 'e-Office client', days: 89 },
  { upstream: 'DMS', days: 132 },
  { upstream: 'Email / SMS', days: 214 },
]

const TRY_RESPONSES: Record<string, object> = {
  '/v1/health': { status: 'ok', region: 'SDC Mumbai', node: 'edge-gw-03', version: 'v1.6.0' },
  '/v1/officer/session': {
    sessionId: 'sess_01HP6X7Q…', expiresIn: 3600,
    policies: ['dpdp.v2', 'classification.confidential'],
    audit: { logged: true, immutable: true },
  },
  '/v1/officer/{id}': {
    officerId: 'IAS-2011-MH-0182', department: 'DIT', role: 'Principal Secretary',
    posting: 'Mantralaya, Mumbai', mfa: 'TOTP',
  },
  '/v1/documents/{id}': {
    docId: 'DMS-2026-88412', classification: 'Internal', pages: 14,
    hash: 'sha256:9d4c…c1ee', dlp: 'clean',
  },
  '/v1/documents/upload': { uploadId: 'up_7f1c…', chunks: 4, dlpScan: 'queued', eta: '8s' },
  '/v1/notify/email': { messageId: 'em_88f2…', relay: 'gom.gov.in', spf: 'aligned', queued: true },
  '/v1/notify/sms': { messageId: 'sm_4410…', dltTemplate: 'MAHGOV-1207', queued: true },
  '/v1/eoffice/files/{fileNo}': {
    fileNo: 'GAD-0616/CR-84/2026', subject: 'Monsoon preparedness — Konkan division',
    currentDesk: 'DS (GAD-16)', pendency: '2 days',
  },
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                    */
/* ------------------------------------------------------------------ */

function Led({ color = 'emerald', label }: { color?: 'emerald' | 'amber' | 'red'; label: string }) {
  const dot = { emerald: 'bg-emerald-400', amber: 'bg-amber-400', red: 'bg-red-400' }[color]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className="relative flex h-2 w-2">
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', dot)} />
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dot)} />
      </span>
      {label}
    </span>
  )
}

function MethodChip({ method }: { method: 'GET' | 'POST' }) {
  return (
    <span
      className={cn(
        'inline-flex w-12 justify-center rounded border px-1 py-0.5 text-[10px] font-bold',
        method === 'GET'
          ? 'border-sky-200 bg-sky-50 text-sky-700'
          : 'border-amber-200 bg-amber-50 text-amber-700',
      )}
      style={{ fontFamily: MONO }}
    >
      {method}
    </span>
  )
}

function ScopeChip({ scope }: { scope: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700"
      style={{ fontFamily: MONO }}
    >
      <Lock className="h-2.5 w-2.5" /> {scope}
    </span>
  )
}

function SevDot({ sev }: { sev: 'High' | 'Medium' | 'Low' }) {
  const c = { High: 'bg-red-400', Medium: 'bg-amber-400', Low: 'bg-emerald-400' }[sev]
  return <span className={cn('mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full', c)} />
}

/* ------------------------------------------------------------------ */
/* Hero — console band with live rps ticker                            */
/* ------------------------------------------------------------------ */

function useRpsTicker() {
  const [samples, setSamples] = useState<number[]>(() =>
    Array.from({ length: 40 }, (_, i) => 123 + Math.sin(i / 4) * 9 + ((i * 13) % 7) - 3),
  )
  useEffect(() => {
    const id = window.setInterval(() => {
      setSamples((s) => {
        const t = Date.now() / 4000
        const next = 123 + Math.sin(t) * 9 + (Math.random() * 10 - 5)
        return [...s.slice(1), next]
      })
    }, 1400)
    return () => window.clearInterval(id)
  }, [])
  return samples
}

function Sparkline({ samples }: { samples: number[] }) {
  const w = 148
  const h = 36
  const min = Math.min(...samples)
  const max = Math.max(...samples)
  const pts = samples
    .map((v, i) => {
      const x = (i / (samples.length - 1)) * w
      const y = h - 4 - ((v - min) / Math.max(1, max - min)) * (h - 8)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <polyline points={pts} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function ConsoleHero() {
  const samples = useRpsTicker()
  const rps = samples[samples.length - 1]
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-brand-gradient text-white shadow-glow">
      {/* grid + scanline texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)' }}
      />
      <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Link to="/integrations" className="inline-flex items-center gap-1 hover:text-white">
              <ChevronLeft className="h-3.5 w-3.5" /> Integrations
            </Link>
            <span>/</span>
            <span style={{ fontFamily: MONO }}>gateway.maii.mah.gov.in</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">API Gateway</h1>
          <p className="mt-1 max-w-xl text-sm text-white/80">
            MAII edge gateway — authentication, rate-limiting and WAF for every connector call across Maharashtra state services.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> {GW.securityStatus}
            </span>
            <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 backdrop-blur">
              <Led color="emerald" label={GW.status} />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              <HeartPulse className="h-3.5 w-3.5" /> Uptime 99.98% · 30d
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-xs backdrop-blur">
              Owner {GW.dataOwner} · last sync {GW.lastSync}
            </span>
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Live throughput</div>
              <div className="mt-1 flex items-baseline gap-1.5" style={{ fontFamily: MONO }}>
                <span className="text-3xl font-semibold tabular-nums">{rps.toFixed(1)}</span>
                <span className="text-xs text-white/70">req/s</span>
              </div>
            </div>
            <Sparkline samples={samples} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-white/60" style={{ fontFamily: MONO }}>
            <span>edge-gw · 6 nodes · SDC Mumbai + Nagpur</span>
            <span className="text-emerald-300">▲ healthy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Traffic topology — SVG map                                          */
/* ------------------------------------------------------------------ */

function TopologyMap() {
  const node = (x: number, y: number, w: number, h: number, title: string, sub: string, accent = '#0B57D0') => (
    <g key={title}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#ffffff" stroke="#e2e8f0" />
      <rect x={x} y={y + 6} width={4} height={h - 12} rx={2} fill={accent} opacity={0.85} />
      <text x={x + 14} y={y + h / 2 - 4} fontSize={12} fontWeight={600} fill="#0f172a">{title}</text>
      <text x={x + 14} y={y + h / 2 + 13} fontSize={9.5} fill="#64748b" style={{ fontFamily: MONO }}>{sub}</text>
    </g>
  )
  const edgeLabel = (x: number, y: number, label: string, muted = false) => (
    <text x={x} y={y} fontSize={9.5} fill={muted ? '#94a3b8' : '#475569'} textAnchor="middle" style={{ fontFamily: MONO }}>
      {label}
    </text>
  )
  const stageY = 168
  const stageH = 84
  const midY = stageY + stageH / 2
  const upstreams: { name: string; sub: string; rps: string; dashed?: boolean }[] = [
    { name: 'e-Office', sub: 'NIC · mTLS', rps: '18.3 rps' },
    { name: 'MahaDBT', sub: 'sandbox · pending', rps: '0.4 rps', dashed: true },
    { name: 'DMS', sub: 'AES-256 · mTLS', rps: '17.4 rps' },
    { name: 'Email Gateway', sub: 'gom.gov.in relay', rps: '22.1 rps' },
    { name: 'SMS Gateway', sub: 'DLT registered', rps: '28.4 rps' },
    { name: 'Internal services', sub: 'llm-serve · audit', rps: '33.4 rps' },
  ]
  const clients = [
    { name: 'Officer UI', sub: '78 rps', y: 44 },
    { name: 'AI Copilot', sub: '31 rps', y: 158 },
    { name: 'Batch jobs', sub: '12 rps · +ext 2', y: 272 },
  ]
  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-base font-semibold text-ink-900">Traffic topology</h3>
          <p className="mt-0.5 text-xs text-ink-500">Live request path — clients through WAF, AuthN and rate-limiter to upstream connectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Led color="emerald" label="All stages healthy" />
          <SourceBadge source="Demo" />
        </div>
      </div>
      <div className="max-w-full overflow-x-auto p-2 sm:p-4">
        <svg viewBox="0 0 1180 400" className="min-w-[980px]" role="img" aria-label="Gateway traffic topology from clients to upstream connectors">
          <defs>
            <marker id="gw-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* client → WAF edges */}
          {clients.map((c) => (
            <path
              key={c.name}
              d={`M 180 ${c.y + 34} C 220 ${c.y + 34}, 214 ${midY}, 248 ${midY}`}
              fill="none" stroke="#cbd5e1" strokeWidth={1.6} markerEnd="url(#gw-arrow)"
            />
          ))}
          {edgeLabel(214, 96, '78')}
          {edgeLabel(214, 200, '31')}
          {edgeLabel(214, 296, '14')}

          {/* stage edges */}
          <path d={`M 384 ${midY} L 424 ${midY}`} fill="none" stroke="#cbd5e1" strokeWidth={1.8} markerEnd="url(#gw-arrow)" />
          {edgeLabel(405, midY - 8, '123 rps')}
          <path d={`M 560 ${midY} L 600 ${midY}`} fill="none" stroke="#cbd5e1" strokeWidth={1.8} markerEnd="url(#gw-arrow)" />
          {edgeLabel(581, midY - 8, '121 rps')}
          <path d={`M 736 ${midY} L 776 ${midY}`} fill="none" stroke="#cbd5e1" strokeWidth={1.8} markerEnd="url(#gw-arrow)" />
          {edgeLabel(757, midY - 8, '120 rps')}

          {/* router → upstream edges */}
          {upstreams.map((u, i) => {
            const uy = 22 + i * 60 + 21
            return (
              <g key={u.name}>
                <path
                  d={`M 908 ${midY} C 940 ${midY}, 930 ${uy}, 958 ${uy}`}
                  fill="none" stroke="#cbd5e1" strokeWidth={1.4}
                  strokeDasharray={u.dashed ? '4 4' : undefined}
                  markerEnd="url(#gw-arrow)"
                />
                {edgeLabel(933, uy - 8, u.rps, u.dashed)}
              </g>
            )
          })}

          {/* client nodes */}
          {clients.map((c) => node(30, c.y, 150, 68, c.name, c.sub, '#5482D5'))}

          {/* pipeline stages */}
          {node(252, stageY, 132, stageH, 'WAF', 'OWASP CRS + AI rules', '#EA4335')}
          {node(428, stageY, 132, stageH, 'AuthN', 'JWT · aud=maii-gw', '#0B57D0')}
          {node(604, stageY, 132, stageH, 'Rate limiter', 'token bucket · tiers', '#F5A623')}
          {node(780, stageY, 128, stageH, 'Router', 'path → upstream', '#062868')}

          {/* WAF blocked badge */}
          <g>
            <rect x={252} y={stageY - 28} width={132} height={20} rx={10} fill="#FEF2F2" stroke="#FECACA" />
            <text x={318} y={stageY - 14} fontSize={9.5} fontWeight={700} fill="#B91C1C" textAnchor="middle" style={{ fontFamily: MONO }}>
              {WAF_TOTAL.toLocaleString()} blocked · 24h
            </text>
          </g>

          {/* upstream nodes */}
          {upstreams.map((u, i) => node(958, 22 + i * 60, 196, 42, u.name, u.sub, u.dashed ? '#94a3b8' : '#34A853'))}
        </svg>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Route table — mono, sortable, expandable                            */
/* ------------------------------------------------------------------ */

type SortKey = 'p95' | 'rps' | 'errPct'

function RouteTable() {
  const [open, setOpen] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [dir, setDir] = useState<'asc' | 'desc'>('desc')

  const rows = useMemo(() => {
    if (!sortKey) return ROUTES
    const m = dir === 'asc' ? 1 : -1
    return [...ROUTES].sort((a, b) => (a[sortKey] - b[sortKey]) * m)
  }, [sortKey, dir])

  const sortTh = (key: SortKey, label: string) => (
    <th
      className="table-th cursor-pointer select-none text-right"
      onClick={() => {
        if (sortKey === key) setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        else { setSortKey(key); setDir('desc') }
      }}
    >
      <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className="h-3 w-3 text-ink-400" /></span>
    </th>
  )

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-base font-semibold text-ink-900">Route table</h3>
          <p className="mt-0.5 text-xs text-ink-500">Peak-hour throughput and latency per published route. Click a row for the error breakdown and retry policy.</p>
        </div>
        <SourceBadge source="Demo" />
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[880px]" style={{ fontFamily: MONO }}>
          <thead>
            <tr>
              <th className="table-th w-8" />
              <th className="table-th">Route</th>
              <th className="table-th">Upstream</th>
              <th className="table-th text-right">p50</th>
              {sortTh('p95', 'p95')}
              <th className="table-th text-right">p99</th>
              {sortTh('rps', 'rps')}
              {sortTh('errPct', 'err %')}
              <th className="table-th">Rate-limit</th>
              <th className="table-th">Scope</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <RowGroup key={r.path} r={r} isOpen={open === r.path} onToggle={() => setOpen(open === r.path ? null : r.path)} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-ink-100 px-4 py-2 text-xs text-ink-500">
        8 routes published · OpenAPI 3.1 contract enforced at the edge
      </div>
    </Card>
  )
}

function RowGroup({ r, isOpen, onToggle }: { r: GatewayRoute; isOpen: boolean; onToggle: () => void }) {
  const total4xx5xx = r.breakdown.reduce((s, b) => s + b.count, 0)
  return (
    <>
      <tr className={cn('cursor-pointer hover:bg-ink-50/40', isOpen && 'bg-brand-50/40')} onClick={onToggle}>
        <td className="table-td py-2 pl-4 pr-0 text-ink-400">
          {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </td>
        <td className="table-td whitespace-nowrap py-2 text-xs text-ink-800">
          <span className="inline-flex items-center gap-2">
            <MethodChip method={r.method} /> {r.path}
          </span>
        </td>
        <td className="table-td py-2 text-xs text-ink-600">{r.upstream}</td>
        <td className="table-td py-2 text-right text-xs tabular-nums text-ink-600">{r.p50}ms</td>
        <td className="table-td py-2 text-right text-xs tabular-nums text-ink-800">{r.p95}ms</td>
        <td className="table-td py-2 text-right text-xs tabular-nums text-ink-600">{r.p99}ms</td>
        <td className="table-td py-2 text-right text-xs tabular-nums text-ink-800">{r.rps.toFixed(1)}</td>
        <td className={cn('table-td py-2 text-right text-xs tabular-nums', r.errPct > 0.3 ? 'text-red-700' : r.errPct > 0.1 ? 'text-amber-700' : 'text-emerald-700')}>
          {r.errPct.toFixed(2)}
        </td>
        <td className="table-td whitespace-nowrap py-2 text-xs text-ink-600">{r.limit}</td>
        <td className="table-td py-2"><ScopeChip scope={r.scope} /></td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={10} className="border-b border-ink-100 bg-ink-50/60 px-4 py-3">
            <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
              <div>
                <div className="label mb-1.5">4xx / 5xx · 24h ({total4xx5xx})</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.breakdown.map((b) => (
                    <span
                      key={b.code}
                      className={cn(
                        'rounded border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                        b.code === '5xx' ? 'border-red-200 bg-red-50 text-red-700'
                          : b.code === '429' ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-ink-200 bg-white text-ink-600',
                      )}
                      style={{ fontFamily: MONO }}
                    >
                      {b.code} · {b.count}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="label mb-1.5">Retry policy</div>
                <div className="text-xs text-ink-700" style={{ fontFamily: MONO }}>{r.retry}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* SLO / error budget                                                  */
/* ------------------------------------------------------------------ */

function SloCard() {
  const budgetMin = 43.2 // 0.1% of 30 days
  const usedMin = 8.6
  const usedPct = Math.round((usedMin / budgetMin) * 100) // 20%
  return (
    <Card>
      <CardHeader
        title="SLO & error budget"
        subtitle="Availability objective · rolling 30 days"
        right={<SourceBadge source="Demo" />}
      />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="label">SLO target</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-ink-900">99.9%</div>
        </div>
        <div>
          <div className="label">Observed</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-emerald-700">99.98%</div>
        </div>
        <div>
          <div className="label">Burn rate</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-ink-900">0.4×</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-ink-500">
          <span>Budget consumed — {usedMin.toFixed(1)} of {budgetMin.toFixed(1)} min</span>
          <span className="font-semibold tabular-nums text-ink-700">{usedPct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${usedPct}%` }} />
        </div>
        <div className="mt-2 text-xs text-ink-500">
          {(budgetMin - usedMin).toFixed(1)} min of downtime budget remaining this window. Burn rate below 1× — no paging alert.
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-ink-100 bg-ink-50/50 px-3 py-2 text-xs text-ink-600">
        Alert policy: burn rate &gt; 2× over 1h pages DIT on-call · &gt; 1× over 6h opens a ticket with the platform cell.
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* WAF panel                                                           */
/* ------------------------------------------------------------------ */

function WafPanel() {
  const max = Math.max(...WAF_RULES.map((r) => r.blocked))
  return (
    <Card>
      <CardHeader
        title="Web application firewall"
        subtitle={`${WAF_TOTAL.toLocaleString()} requests blocked in 24h · OWASP CRS + MAII AI rules`}
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <ShieldAlert className="h-3.5 w-3.5" /> Blocking mode
          </span>
        }
      />
      <div className="space-y-2.5">
        {WAF_RULES.map((r) => (
          <div key={r.rule}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink-700">{r.rule}</span>
              <span className="font-semibold tabular-nums text-ink-800" style={{ fontFamily: MONO }}>{r.blocked}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${(r.blocked / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="label mb-2 mt-5">Last 5 blocked events</div>
      <div className="overflow-hidden rounded-lg bg-ink-900 p-3">
        <ul className="space-y-1.5 text-[11px] leading-relaxed text-ink-200" style={{ fontFamily: MONO }}>
          {WAF_EVENTS.map((e) => (
            <li key={e.ts} className="flex items-start gap-2">
              <SevDot sev={e.sev} />
              <span className="shrink-0 text-ink-400">{e.ts}</span>
              <span className="shrink-0 font-semibold text-red-300">[{e.rule}]</span>
              <span className="min-w-0 break-words">{e.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Auth & keys                                                         */
/* ------------------------------------------------------------------ */

function AuthKeysCard() {
  return (
    <Card>
      <CardHeader
        title="Auth & key management"
        subtitle="JWT issuance, signing-key rotation and mTLS certificates"
        right={<SourceBadge source="Demo" />}
      />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="label">Tokens issued · 24h</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-ink-900">41,200</div>
        </div>
        <div>
          <div className="label">Active sessions</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-ink-900">1,920</div>
        </div>
        <div>
          <div className="label">Rejected JWTs · 24h</div>
          <div className="mt-1 text-xl font-semibold tabular-nums text-amber-700">139</div>
        </div>
      </div>

      <div className="label mb-2 mt-5">JWT signing-key rotation · jwt/gateway</div>
      <ol className="relative space-y-2.5 border-l border-ink-100 pl-4 text-xs">
        <li className="relative">
          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-amber-400" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-semibold text-ink-800">Next rotation due</span>
            <span className="text-amber-700" style={{ fontFamily: MONO }}>2026-07-11 · in 4 days</span>
          </div>
          <div className="text-ink-500">Dual-approval by DIT · zero-downtime JWKS rollover</div>
        </li>
        <li className="relative">
          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-emerald-400" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-semibold text-ink-800">kid maii-2026-06 activated</span>
            <span className="text-ink-500" style={{ fontFamily: MONO }}>2026-06-11</span>
          </div>
          <div className="text-ink-500">ECDSA P-384 · signed on HSM-A · SDC Mumbai</div>
        </li>
        <li className="relative">
          <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-ink-300" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="font-semibold text-ink-700">kid maii-2026-05 retired</span>
            <span className="text-ink-500" style={{ fontFamily: MONO }}>2026-06-13 · after 48h grace</span>
          </div>
        </li>
      </ol>

      <div className="label mb-2 mt-5">mTLS certificate expiry per upstream</div>
      <div className="flex flex-wrap gap-1.5">
        {MTLS_CERTS.map((c) => (
          <span
            key={c.upstream}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums',
              c.days <= 30 ? 'border-red-200 bg-red-50 text-red-700'
                : c.days <= 90 ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700',
            )}
          >
            <KeyRound className="h-3 w-3" /> {c.upstream} · {c.days}d
          </span>
        ))}
      </div>
      <div className="mt-2 text-xs text-ink-500">
        audit-ledger cert renewal raised with NIC CA — tracked on the certificate watchlist.
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Rate-limit tiers                                                    */
/* ------------------------------------------------------------------ */

function RateLimitGrid() {
  return (
    <Card>
      <CardHeader
        title="Rate-limit policy"
        subtitle="Token-bucket tiers per consumer · live usage"
        right={<div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
      />
      <div className="space-y-3.5">
        {RATE_TIERS.map((t) => {
          const pct = Math.round((t.used / t.limit) * 100)
          const hot = pct >= 80
          return (
            <div key={t.consumer}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
                <span className="font-semibold text-ink-800">{t.consumer}</span>
                <span className="tabular-nums text-ink-600" style={{ fontFamily: MONO }}>
                  {t.used} / {t.limit} rps
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                <div
                  className={cn('h-full rounded-full', hot ? 'bg-amber-400' : 'bg-brand-gradient')}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-0.5 flex items-center justify-between text-[11px] text-ink-500">
                <span>{t.note}</span>
                <span className={cn('font-medium tabular-nums', hot ? 'text-amber-700' : 'text-ink-500')}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 rounded-lg border border-ink-100 bg-ink-50/50 px-3 py-2 text-xs text-ink-600">
        429 responses carry <span style={{ fontFamily: MONO }}>Retry-After</span> · burst allowance 2× for 10s · limits enforced per API key + officer identity.
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Try-it console                                                      */
/* ------------------------------------------------------------------ */

function TryItConsole() {
  const [idx, setIdx] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'sending' | 'done'>('idle')
  const [latency, setLatency] = useState(0)
  const route = ROUTES[idx]

  const send = () => {
    setPhase('sending')
    const ms = Math.round(route.p50 * (0.9 + Math.random() * 0.5))
    window.setTimeout(() => {
      setLatency(ms)
      setPhase('done')
    }, 650)
  }

  const body = TRY_RESPONSES[route.path] ?? { ok: true }

  return (
    <Card>
      <CardHeader
        title="Try it — request console"
        subtitle="Sandboxed against the demo upstream · consent header attached automatically"
        right={<div className="flex items-center gap-2"><Terminal className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          className="input sm:flex-1"
          style={{ fontFamily: MONO }}
          value={idx}
          onChange={(e) => { setIdx(Number(e.target.value)); setPhase('idle') }}
        >
          {ROUTES.map((r, i) => (
            <option key={r.path} value={i}>{r.method} {r.path}</option>
          ))}
        </select>
        <button className="btn-primary shrink-0" onClick={send} disabled={phase === 'sending'}>
          <Play className="h-4 w-4" /> {phase === 'sending' ? 'Sending…' : 'Send'}
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg bg-ink-900">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2 text-[11px]" style={{ fontFamily: MONO }}>
          <span className="min-w-0 break-all text-ink-400">{route.method} https://gateway.maii.mah.gov.in{route.path}</span>
          {phase === 'done' && (
            <span className="ml-auto flex shrink-0 items-center gap-2">
              <span className="rounded border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 font-semibold text-emerald-300">200 OK</span>
              <span className="inline-flex items-center gap-1 text-ink-300"><Timer className="h-3 w-3" /> {latency}ms</span>
            </span>
          )}
        </div>
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap p-3 text-[11px] leading-relaxed text-emerald-200" style={{ fontFamily: MONO }}>
          {phase === 'idle' && '// Select a route and press Send.\n// X-Consent-Header: dept=DIT; purpose=connector-test'}
          {phase === 'sending' && '… TLS 1.3 handshake · JWT verified · routing'}
          {phase === 'done' && JSON.stringify(
            { requestId: 'req_7f1c…9a2b', auditHash: 'sha256:9d4c…c1ee', data: body },
            null, 2,
          )}
        </pre>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function APIGatewayPage() {
  return (
    <div>
      <ConsoleHero />

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <TopologyMap />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <RouteTable />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_1fr]">
          <ChartCard
            title="Latency percentiles · 24h"
            subtitle="Edge-to-upstream round trip across all routes"
            height={280}
            right={
              <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
                <Activity className="h-3.5 w-3.5 text-brand-500" /> p95 target &lt; 500ms
              </span>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LATENCY_24H} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} unit="ms" />
                <Tooltip
                  formatter={(v: number | string) => [`${v}ms`]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="p50" name="p50" stroke="#5482D5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95" name="p95" stroke="#0A47AA" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p99" name="p99" stroke="#031A45" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <SloCard />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <WafPanel />
          <AuthKeysCard />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RateLimitGrid />
          <TryItConsole />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-ink-100 bg-white px-4 py-3 text-xs text-ink-600">
          <Link to="/integrations" className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline">
            <ChevronLeft className="h-3.5 w-3.5" /> All integrations
          </Link>
          <span className="text-ink-300">·</span>
          <Link to="/api-security" className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline">
            <ShieldCheck className="h-3.5 w-3.5" /> API Security policies
          </Link>
          <span className="text-ink-300">·</span>
          <Link to="/system-health" className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline">
            <HeartPulse className="h-3.5 w-3.5" /> System health
          </Link>
          <span className="ml-auto text-ink-400">
            Connector readiness {GW.connectorReadiness}% · API health {GW.apiHealth}% · owner {GW.dataOwner}
          </span>
        </div>
      </div>
    </div>
  )
}
