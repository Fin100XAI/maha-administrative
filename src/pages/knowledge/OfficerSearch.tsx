import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User2, Building2, MapPin, Network, Share2, Copy, X, ShieldCheck, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ChipStrip } from './_components/ChipStrip'
import {
  OFFICERS_EXT,
  RECENTLY_VIEWED_OFFICERS,
  ServiceType,
  Region,
  OfficerRow,
} from '@/data/knowledgeSamples'

const DEPTS = ['All', ...Array.from(new Set(OFFICERS_EXT.map((o) => o.dept)))]
const ROLES = ['All', ...Array.from(new Set(OFFICERS_EXT.map((o) => o.role)))]
const SERVICES: ('All' | ServiceType)[] = ['All', 'IAS', 'MPSC', 'IPS', 'IFS', 'Contract']
const REGIONS: ('All' | Region)[] = ['All', 'Konkan', 'Vidarbha', 'Marathwada', 'Western Maharashtra', 'North Maharashtra']

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2)
}

function maskService(id: string) {
  // Mask trailing 4 characters to avoid exposing full identifier.
  return id.replace(/(\d{4})$/, '••••')
}

function OfficerCard({ o, onShare }: { o: OfficerRow; onShare: (o: OfficerRow) => void }) {
  return (
    <div className="card card-hover">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-gradient text-sm font-semibold text-white">
          {initials(o.name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink-900" title={o.name}>{o.name}</div>
          <div className="truncate text-xs text-ink-500" title={o.role}>{o.role}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
            <Building2 className="h-3 w-3" /> {o.dept} · {o.posting}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
            <User2 className="h-3 w-3" /> {maskService(o.service)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-ink-500">
            <MapPin className="h-3 w-3" /> {o.region}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="chip border border-brand-100 bg-brand-soft text-brand-700">{o.serviceType}</span>
        <StatusBadge status="Active" />
        <SourceBadge source="Department API required" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="btn-outline !px-2 text-xs">Profile</button>
        <button className="btn-primary !px-2 text-xs" onClick={() => onShare(o)}>
          <Share2 className="h-3.5 w-3.5" /> Share access
        </button>
      </div>
    </div>
  )
}

function OrgChartMini({ head }: { head: OfficerRow }) {
  const level2 = OFFICERS_EXT.filter((o) => o.reportsTo === head.name)
  const level3Map = level2.map((l2) => ({
    parent: l2,
    children: OFFICERS_EXT.filter((o) => o.reportsTo === l2.name).slice(0, 2),
  }))
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 720 300" className="h-[280px] w-full min-w-[640px]">
        <defs>
          <linearGradient id="org-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B57D0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#062868" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Head node */}
        <g transform="translate(360,30)">
          <rect x={-90} y={-20} width={180} height={44} rx={12} fill="#EEF3FC" stroke="#0B57D0" strokeWidth={1.6} />
          <text x={0} y={-3} textAnchor="middle" fontSize="10" fontWeight="700" fill="#0B57D0" className="uppercase tracking-wider">Level 1</text>
          <text x={0} y={12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#0f172a">{head.name}</text>
        </g>

        {level2.slice(0, 4).map((l2, i) => {
          const total = Math.min(level2.length, 4)
          const step = 720 / (total + 1)
          const x = step * (i + 1)
          const y = 130
          const kids = level3Map[i]?.children ?? []
          return (
            <g key={l2.name}>
              <line x1={360} y1={54} x2={x} y2={y - 22} stroke="url(#org-line)" strokeWidth={1.4} />
              <g transform={`translate(${x},${y})`}>
                <rect x={-80} y={-20} width={160} height={40} rx={10} fill="#EBF2FE" stroke="#4285F4" strokeWidth={1.3} />
                <text x={0} y={-4} textAnchor="middle" fontSize="9" fontWeight="700" fill="#4285F4" className="uppercase tracking-wider">Level 2</text>
                <text x={0} y={10} textAnchor="middle" fontSize="10" fill="#0f172a">
                  {l2.name.length > 22 ? l2.name.slice(0, 22) + '…' : l2.name}
                </text>
              </g>
              {kids.map((c, j) => {
                const cx = x + (j === 0 ? -55 : 55)
                const cy = 230
                return (
                  <g key={c.name}>
                    <line x1={x} y1={y + 20} x2={cx} y2={cy - 18} stroke="url(#org-line)" strokeWidth={1.2} />
                    <g transform={`translate(${cx},${cy})`}>
                      <rect x={-72} y={-18} width={144} height={36} rx={8} fill="#E8EEF9" stroke="#062868" strokeWidth={1.2} />
                      <text x={0} y={-3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#062868" className="uppercase tracking-wider">Level 3</text>
                      <text x={0} y={10} textAnchor="middle" fontSize="9" fill="#0f172a">
                        {c.name.length > 22 ? c.name.slice(0, 22) + '…' : c.name}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function OfficerSearch() {
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [role, setRole] = useState('All')
  const [service, setService] = useState<'All' | ServiceType>('All')
  const [region, setRegion] = useState<'All' | Region>('All')
  const [shareTarget, setShareTarget] = useState<OfficerRow | null>(null)

  const filtered = useMemo(() =>
    OFFICERS_EXT.filter((o) =>
      (dept === 'All' || o.dept === dept) &&
      (role === 'All' || o.role === role) &&
      (service === 'All' || o.serviceType === service) &&
      (region === 'All' || o.region === region) &&
      (q.trim() === '' || (o.name + o.role + o.dept + o.posting + o.service).toLowerCase().includes(q.toLowerCase())),
    ), [q, dept, role, service, region])

  // The "top" officer we show the org chart for = first visible with reports.
  const topWithReports = useMemo(
    () => filtered.find((o) => OFFICERS_EXT.some((x) => x.reportsTo === o.name)) ?? OFFICERS_EXT[0],
    [filtered],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<User2 className="h-5 w-5" />}
        title="Officer Knowledge Search"
        description="Search the officer directory — role, department, posting, service ID. Public directory data from GoM sources."
        breadcrumb={['Knowledge Brain', 'Officer Search']}
        source="Department API required"
      />

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search by name, role, department, service ID…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div>
            <label className="label">Department</label>
            <select className="input mt-1" value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Region</label>
            <select className="input mt-1" value={region} onChange={(e) => setRegion(e.target.value as 'All' | Region)}>
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Service</label>
            <div className="mt-1">
              <ChipStrip
                options={SERVICES.map((s) => ({ value: s, label: s }))}
                value={service}
                onChange={(v) => setService(v as 'All' | ServiceType)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Recently viewed strip */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Clock className="h-3.5 w-3.5" /> Recently viewed
          </div>
          {RECENTLY_VIEWED_OFFICERS.map((name) => (
            <button
              key={name}
              onClick={() => setQ(name)}
              className="chip border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600"
            >
              <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-gradient text-[9px] font-semibold text-white">
                {initials(name)}
              </span>
              {name}
            </button>
          ))}
          <SourceBadge source="Demo" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((o) => (
            <OfficerCard key={o.service} o={o} onShare={setShareTarget} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">
              No officers matched — broaden filters or clear the search.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Org chart preview */}
          <Card>
            <CardHeader
              title="Org chart preview"
              subtitle={`Reporting tree seeded from ${topWithReports.name}`}
              right={<Network className="h-4 w-4 text-brand-500" />}
            />
            <OrgChartMini head={topWithReports} />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#0B57D0' }} /> L1 · Head</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#4285F4' }} /> L2 · Direct reports</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#062868' }} /> L3 · Downstream</span>
              <SourceBadge source="Department API required" />
            </div>
          </Card>

          {/* Share MAII access preview */}
          <Card className="bg-brand-soft">
            <CardHeader
              title="Share MAII access"
              subtitle="Preview of the invite payload the officer will receive"
              right={<Share2 className="h-4 w-4 text-brand-500" />}
            />
            {shareTarget ? (
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-brand-100 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">Invitee</div>
                      <div className="font-semibold text-ink-900">{shareTarget.name}</div>
                      <div className="text-xs text-ink-500">{shareTarget.role} · {shareTarget.dept}</div>
                    </div>
                    <button onClick={() => setShareTarget(null)} className="text-ink-400 hover:text-ink-700"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-ink-100 bg-white p-2 text-xs">
                    <div className="label">Access level</div>
                    <div className="mt-0.5 font-medium text-ink-800">Departmental — Read + Draft</div>
                  </div>
                  <div className="rounded-md border border-ink-100 bg-white p-2 text-xs">
                    <div className="label">Valid until</div>
                    <div className="mt-0.5 font-medium text-ink-800">2026-12-31</div>
                  </div>
                  <div className="rounded-md border border-ink-100 bg-white p-2 text-xs">
                    <div className="label">Classification cap</div>
                    <div className="mt-0.5 font-medium text-ink-800">Confidential</div>
                  </div>
                  <div className="rounded-md border border-ink-100 bg-white p-2 text-xs">
                    <div className="label">MFA</div>
                    <div className="mt-0.5 font-medium text-ink-800">Required</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-brand-100 bg-white px-3 py-2 text-xs text-ink-700">
                  <span className="min-w-0 truncate">https://maii.gov.in/invite/{shareTarget.service.slice(-6)}</span>
                  <button className="ml-auto text-brand-600 hover:text-brand-700" aria-label="Copy link"><Copy className="h-3.5 w-3.5" /></button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="Under Review" />
                  <span className="chip border border-ink-200 bg-white text-ink-600">
                    <ShieldCheck className="h-3 w-3" /> DPO co-sign required
                  </span>
                </div>
                <button className="btn-primary w-full !py-2 text-xs">Send secure invite</button>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-brand-200 bg-white/60 p-4 text-center text-xs text-ink-500">
                Pick an officer card and hit <span className="font-semibold text-ink-700">Share access</span> to preview the invite payload.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Simple modal-style overlay hint (in-flow, no portal) */}
      <AnimatePresence>
        {shareTarget && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-none fixed bottom-6 right-6 z-30 hidden xl:block"
          >
            <div className="pointer-events-auto rounded-xl border border-brand-100 bg-white/95 px-4 py-2 text-xs text-ink-700 shadow-glow backdrop-blur">
              Invite preview updated for <span className="font-semibold text-brand-700">{shareTarget.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
