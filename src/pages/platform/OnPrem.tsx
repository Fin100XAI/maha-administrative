import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { Server, ShieldCheck, Database, Cpu, HardDrive, Radar, Archive, Wifi, Network } from 'lucide-react'

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
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {nodes.map((n) => (
          <Card key={n.t}>
            <div className="flex items-center gap-2 text-brand-500"><n.icon className="h-4 w-4" /><span className="section-title text-ink-800">{n.t}</span></div>
            <p className="mt-2 text-sm text-ink-700">{n.d}</p>
          </Card>
        ))}
      </div>

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
