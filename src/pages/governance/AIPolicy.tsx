import { Scale, FileText, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'

const POLICIES = [
  { name: 'Acceptable-Use of AI', owner: 'DIT — AI Governance', version: 'v3.1', status: 'Approved', risk: 'Low', updated: '2026-06-20' },
  { name: 'Prompt Governance', owner: 'DIT — AI Governance', version: 'v2.4', status: 'Approved', risk: 'Low', updated: '2026-05-14' },
  { name: 'Model Risk', owner: 'DIT — Model Risk Cell', version: 'v1.8', status: 'Under Review', risk: 'Medium', updated: '2026-07-01' },
  { name: 'DPDP for AI', owner: 'DPO — GoM', version: 'v2.0', status: 'Approved', risk: 'Low', updated: '2026-06-11' },
  { name: 'Human-in-the-loop', owner: 'DIT — AI Governance', version: 'v1.5', status: 'Approved', risk: 'Low', updated: '2026-06-18' },
  { name: 'Third-party Model Use', owner: 'DIT — External Models', version: 'v1.2', status: 'Under Review', risk: 'Medium', updated: '2026-07-03' },
  { name: 'On-Prem Deployment', owner: 'DIT — Infrastructure', version: 'v2.1', status: 'Approved', risk: 'Low', updated: '2026-06-05' },
  { name: 'Incident Reporting', owner: 'AI SOC', version: 'v1.4', status: 'Approved', risk: 'Low', updated: '2026-06-22' },
]

export function AIPolicy() {
  return (
    <div>
      <PageHeader
        title="AI Policy"
        description="MAII policy library — Responsible AI, Model Risk, DPDP, HITL and third-party controls."
        breadcrumb={['Governance', 'AI Policy']}
        source="Public-source linked"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { l: 'Active Policies', v: POLICIES.length, i: <FileText className="h-5 w-5" /> },
          { l: 'Under Review', v: POLICIES.filter(p => p.status === 'Under Review').length, i: <Scale className="h-5 w-5" /> },
          { l: 'Coverage Score', v: '92%', i: <ShieldCheck className="h-5 w-5" /> },
          { l: 'Signatories', v: 6, i: <Users className="h-5 w-5" /> },
        ].map((c) => (
          <div key={c.l} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-ink-500">{c.l}</div>
              <div className="text-brand-500">{c.i}</div>
            </div>
            <div className="mt-1 text-2xl font-semibold text-ink-900">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {POLICIES.map((p) => (
          <Card key={p.name}>
            <CardHeader
              title={p.name}
              subtitle={`${p.owner} · ${p.version}`}
              right={<StatusBadge status={p.status as any} />}
            />
            <div className="text-sm text-ink-600">
              Governs the responsible operation of AI within the platform. Reviewed at least every 90 days. Enforced via automated policy gates.
            </div>
            <div className="mt-3 flex items-center gap-2">
              <RiskBadge level={p.risk as any} />
              <SourceBadge source="Public-source linked" />
              <span className="ml-auto text-xs text-ink-500">Updated {p.updated}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline flex-1">Read policy</button>
              <button className="btn-primary flex-1">Attestation</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
