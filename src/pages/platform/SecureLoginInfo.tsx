import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { Link } from 'react-router-dom'
import { ShieldCheck, KeyRound, Fingerprint, ClipboardList, Server, Lock } from 'lucide-react'
import { ROLES } from '@/data/departments'

export function SecureLoginInfo() {
  return (
    <div>
      <PageHeader
        title="Secure Login"
        description="Government-grade officer sign-in — MFA, RBAC, audit logging, encryption and on-prem readiness."
        breadcrumb={['Platform Admin', 'Secure Login']}
        source="Demo"
        actions={<Link to="/login" className="btn-primary">Go to sign-in</Link>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { icon: ShieldCheck, t: 'Zero Trust', d: 'Continuous verification of device, user, location and session risk.' },
          { icon: KeyRound, t: 'MFA · NIC', d: '6-digit TOTP via NIC MFA. Fallback via SMS DLT.' },
          { icon: Fingerprint, t: 'RBAC · Least privilege', d: 'Roles bound to ministry-level restrictions and file-classification limits.' },
          { icon: ClipboardList, t: 'Audit logging', d: 'Immutable append-only log for every action, decision and API call.' },
          { icon: Lock, t: 'Encryption', d: 'AES-256 at rest, TLS 1.3 in transit, HSM-backed key management.' },
          { icon: Server, t: 'On-Prem ready', d: 'Deployable on MeghRaj / State Data Centre, with air-gapped option.' },
        ].map((f) => (
          <Card key={f.t}>
            <div className="flex items-center gap-2 text-brand-500"><f.icon className="h-4 w-4" /><span className="section-title text-ink-800">{f.t}</span></div>
            <p className="mt-2 text-sm text-ink-700">{f.d}</p>
            <div className="mt-2"><StatusBadge status="Approved" /></div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader title="Supported officer roles" right={<SourceBadge source="Demo" />} />
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => <span key={r} className="chip border border-ink-200 bg-white text-ink-700">{r}</span>)}
        </div>
      </Card>
    </div>
  )
}
