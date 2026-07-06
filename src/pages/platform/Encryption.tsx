import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Database,
  Archive,
  FileText,
  HardDrive,
  CalendarClock,
  Thermometer,
  Cpu,
  ScrollText,
} from 'lucide-react'
import { KEY_ROTATIONS, ALGO_INVENTORY, HSM_CLUSTER, CERT_WATCHLIST } from '@/data/platformSamples'

const layers = [
  { icon: HardDrive, t: 'Encryption at rest', d: 'AES-256 XTS on all volumes · KMS-managed keys', status: 'Approved' },
  { icon: ShieldCheck, t: 'Encryption in transit', d: 'TLS 1.3 · mTLS for inter-service · HSTS · perfect forward secrecy', status: 'Approved' },
  { icon: KeyRound, t: 'Key management', d: 'FIPS 140-3 · rotation every 90 days · dual custody', status: 'Approved' },
  { icon: Lock, t: 'HSM readiness', d: 'Cloud HSM active; on-prem HSM commissioning in progress', status: 'Under Review' },
  { icon: FileText, t: 'Certificate status', d: 'Wildcard *.maii.mah.gov.in expires 2027-03-14 · auto-renew via ACME', status: 'Approved' },
  { icon: Database, t: 'Database encryption', d: 'TDE + column-level for PII; separate KEK per department', status: 'Approved' },
  { icon: FileText, t: 'Document encryption', d: 'Per-file DEK · sealed under user + department + KMS key', status: 'Approved' },
  { icon: Archive, t: 'Backup encryption', d: 'AES-256 · offline S3 vault · quarterly restore drill', status: 'Approved' },
]

export function Encryption() {
  return (
    <div>
      <PageHeader
        title="Encryption"
        description="Encryption posture across data at rest, in transit, keys, HSM, database, documents and backups."
        breadcrumb={['Platform Admin', 'Encryption']}
        source="Demo"
        eyebrow="Crypto posture"
        icon={<Lock className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {layers.map((l) => (
          <Card key={l.t}>
            <div className="flex items-center gap-2 text-brand-500"><l.icon className="h-4 w-4" /><span className="section-title text-ink-800">{l.t}</span></div>
            <p className="mt-2 text-sm text-ink-700">{l.d}</p>
            <div className="mt-2 flex items-center gap-2"><StatusBadge status={l.status as any} /><SourceBadge source="Demo" /></div>
          </Card>
        ))}
      </div>

      {/* Key rotation + Algorithm inventory */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Key rotation calendar"
            subtitle="Upcoming and recent rotations."
            right={<div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {KEY_ROTATIONS.map((k, idx) => (
              <motion.li
                key={k.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-md border border-ink-100 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-800">{k.key}</span>
                  <span className="text-xs text-ink-500">Owner · {k.owner}</span>
                </div>
                <div className="mt-1 text-xs text-ink-600">{k.scope}</div>
                <div className="mt-1 flex flex-wrap gap-x-4 text-[11px]">
                  <span className="text-ink-500">Last · <span className="text-ink-700">{k.last}</span></span>
                  <span className="text-ink-500">Next · <span className="text-brand-700">{k.next}</span></span>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Algorithm inventory"
            subtitle="What's in production, at what share."
            right={<div className="flex items-center gap-2"><ScrollText className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {ALGO_INVENTORY.map((a) => (
              <li key={a.algo} className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="font-medium text-ink-800">{a.algo}</span>
                    <StatusBadge status={a.approved ? 'Approved' : 'Under Review'} />
                  </div>
                  <span className="text-xs text-ink-500">{a.share}%</span>
                </div>
                <div className="text-xs text-ink-600">{a.usage}</div>
                <div className="mt-1 h-1.5 rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${a.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* HSM cluster + Cert watchlist */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.2fr]">
        <Card>
          <CardHeader
            title="HSM cluster status"
            subtitle="Two-node active/standby cluster."
            right={<div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {HSM_CLUSTER.map((h) => (
              <div key={h.id} className="rounded-xl border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-ink-800">{h.id}</span>
                  <StatusBadge status={h.status === 'Active' ? 'Active' : 'Draft'} />
                </div>
                <div className="mt-0.5 text-xs text-ink-500">{h.site}</div>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><dt className="text-ink-500">Utilisation</dt><dd className="font-medium text-ink-800">{h.utilPct}%</dd></div>
                  <div className="h-1.5 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${h.utilPct}%` }} /></div>
                  <div className="flex items-center justify-between pt-1">
                    <dt className="flex items-center gap-1 text-ink-500"><Thermometer className="h-3 w-3" /> Temperature</dt>
                    <dd className="font-medium text-ink-800">{h.tempC} °C</dd>
                  </div>
                  <div className="flex justify-between"><dt className="text-ink-500">Firmware</dt><dd className="font-mono text-ink-800">{h.firmware}</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Certificate expiry watchlist"
            subtitle="Certs expiring within one year."
            right={<div className="flex items-center gap-2"><FileText className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
                  <th className="table-th">CN</th>
                  <th className="table-th">Issuer</th>
                  <th className="table-th">Expires in</th>
                  <th className="table-th">Risk</th>
                </tr>
              </thead>
              <tbody>
                {CERT_WATCHLIST.map((c) => (
                  <tr key={c.cn} className="hover:bg-ink-50/40">
                    <td className="table-td font-mono text-xs text-ink-800">{c.cn}</td>
                    <td className="table-td text-ink-700">{c.issuer}</td>
                    <td className="table-td">{c.expiresIn}</td>
                    <td className="table-td"><RiskBadge level={c.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
