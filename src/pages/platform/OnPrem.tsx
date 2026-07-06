import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import {
  Server,
  ShieldCheck,
  Database,
  Cpu,
  HardDrive,
  Radar,
  Archive,
  Wifi,
  Network,
  Gauge,
  GitFork,
  Boxes,
  CalendarClock,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import { CAPACITY, TOPOLOGY, AIRGAP_CHECKLIST, DC_INCIDENTS_90D } from '@/data/platformSamples'

const nodes = [
  { icon: Server, t: 'Government Data Centre', d: 'MeghRaj / SDC Mumbai · dual-site DR' },
  { icon: Cpu, t: 'Kubernetes cluster', d: 'GPU-enabled · Isolated namespace per department' },
  { icon: Radar, t: 'Private LLM gateway', d: 'Model routing · classification-aware' },
  { icon: Database, t: 'Vector DB', d: 'HNSW · encrypted · per-dept collections' },
  { icon: HardDrive, t: 'Document store', d: 'Immutable object storage · versioned' },
  { icon: Network, t: 'API Gateway', d: 'mTLS · JWT · WAF' },
  { icon: ShieldCheck, t: 'Audit log store', d: 'WORM-mode · off-cluster replica' },
  { icon: Wifi, t: 'SIEM integration', d: 'MITRE-mapped · streams to state SOC' },
  { icon: Archive, t: 'Backup & DR', d: 'RPO 15 min · RTO 1 hr · quarterly drill' },
  { icon: Server, t: 'High availability', d: 'Multi-AZ · leader election · zero-downtime rollout' },
  { icon: Server, t: 'Air-gapped mode', d: 'Optional · certified for confidential + secret workloads' },
]

const READY = [
  ['Infrastructure ready', 'Approved'],
  ['Security review', 'Approved'],
  ['VAPT', 'Under Review'],
  ['Data migration', 'Approved'],
  ['Identity integration', 'Approved'],
  ['Model deployment', 'Approved'],
  ['Monitoring', 'Approved'],
  ['DR drill', 'Under Review'],
]

export function OnPrem() {
  return (
    <div>
      <PageHeader
        title="On-Prem Deployment"
        description="Architecture and readiness for on-prem MAII deployment on Government Data Centres."
        breadcrumb={['Platform Admin', 'On-Prem']}
        source="Demo"
        eyebrow="Sovereign infra"
        icon={<Server className="h-5 w-5" />}
      />

      {/* Live capacity dashboard */}
      <Card>
        <CardHeader
          title="Live capacity dashboard"
          subtitle="Current cluster utilisation across compute, memory, storage, GPU and network."
          right={<div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CAPACITY.map((c) => {
            const pct = Math.min(100, Math.round((c.used / c.total) * 100))
            const risk = pct >= 85 ? 'text-red-700' : pct >= 70 ? 'text-amber-700' : 'text-emerald-700'
            return (
              <div key={c.name} className="rounded-xl border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink-800">{c.name}</span>
                  <span className={'text-xs font-semibold ' + risk}>{pct}%</span>
                </div>
                <div className="mt-2 h-2 rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 text-xs text-ink-500">
                  {c.used} / {c.total} {c.unit}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {nodes.map((n) => (
          <Card key={n.t}>
            <div className="flex items-center gap-2 text-brand-500"><n.icon className="h-4 w-4" /><span className="section-title text-ink-800">{n.t}</span></div>
            <p className="mt-2 text-sm text-ink-700">{n.d}</p>
          </Card>
        ))}
      </div>

      {/* Topology + Airgap */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_1fr]">
        <Card>
          <CardHeader
            title="Deployment topology"
            subtitle="Nodes / GPUs / role per plane."
            right={<div className="flex items-center gap-2"><GitFork className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {TOPOLOGY.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative rounded-xl border border-ink-100 p-3"
              >
                <div className="absolute -top-2 left-3 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  {t.name}
                </div>
                <div className="mt-2 flex items-center gap-2 text-brand-500">
                  <Boxes className="h-4 w-4" />
                  <span className="font-medium text-ink-800">{t.role}</span>
                </div>
                <dl className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between"><dt className="text-ink-500">Nodes</dt><dd className="font-medium text-ink-800">{t.nodes}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">GPUs</dt><dd className="font-medium text-ink-800">{t.gpus}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-500">Site</dt><dd className="text-ink-700 truncate max-w-[8rem]" title={t.site}>{t.site}</dd></div>
                </dl>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Air-gap readiness"
            subtitle="10-item checklist for a fully-disconnected deployment."
            right={<div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2 text-sm">
            {AIRGAP_CHECKLIST.map((a) => (
              <li key={a.item} className="flex items-start gap-2 rounded-md border border-ink-100 px-3 py-2">
                {a.ok
                  ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                <span className={a.ok ? 'text-ink-800' : 'text-ink-700'}>{a.item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-ink-500">
            {AIRGAP_CHECKLIST.filter((x) => x.ok).length} of {AIRGAP_CHECKLIST.length} items ready
          </div>
        </Card>
      </div>

      {/* DC reliability history */}
      <Card className="mt-6">
        <CardHeader
          title="Data-centre reliability · last 90 days"
          subtitle="Incidents and planned maintenance windows."
          right={<div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="table-th">Date</th>
                <th className="table-th">Event</th>
                <th className="table-th">Impact</th>
                <th className="table-th text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {DC_INCIDENTS_90D.map((i) => (
                <tr key={i.date + i.kind} className="hover:bg-ink-50/40">
                  <td className="table-td">{i.date}</td>
                  <td className="table-td font-medium text-ink-800">{i.kind}</td>
                  <td className="table-td text-ink-700">{i.impact}</td>
                  <td className="table-td text-right">{i.durationMin} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Readiness checklist" right={<SourceBadge source="Demo" />} />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">
          {READY.map(([t, s]) => (
            <li key={t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
              <span className="text-ink-700">{t}</span>
              <StatusBadge status={s as any} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
