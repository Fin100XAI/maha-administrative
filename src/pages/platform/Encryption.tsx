import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { Lock, KeyRound, ShieldCheck, Database, Archive, FileText, HardDrive } from 'lucide-react'

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
    </div>
  )
}
