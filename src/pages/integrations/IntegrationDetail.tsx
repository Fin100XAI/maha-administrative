import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import { ExternalLink, Wifi, Lock, ClipboardCheck, User, ChevronLeft } from 'lucide-react'

export function IntegrationDetail() {
  const { slug } = useParams<{ slug: string }>()
  const i = INTEGRATIONS.find((x) => x.slug === slug)
  if (!i) {
    return (
      <div className="text-sm text-ink-600">
        <PageHeader title="Integration not found" description="This connector is not in the registry." breadcrumb={['Integrations']} />
        <Link to="/integrations" className="btn-outline"><ChevronLeft className="h-4 w-4" /> Back to integrations</Link>
      </div>
    )
  }
  return (
    <div>
      <PageHeader
        title={i.name}
        description={i.description}
        breadcrumb={['Integrations', i.name]}
        source={i.status === 'Connected' ? 'Live' : i.status === 'Public-source linked' ? 'Public-source linked' : 'Department API required'}
        actions={<>
          <Link to="/integrations" className="btn-outline"><ChevronLeft className="h-4 w-4" /> All integrations</Link>
          {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="btn-primary">Open portal <ExternalLink className="h-4 w-4" /></a>}
        </>}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Connector configuration" right={<StatusBadge status={i.status} />} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info k="Category" v={i.category} />
              <Info k="Access type" v={i.accessType} />
              <Info k="Data owner" v={i.dataOwner} />
              <Info k="Last sync" v={i.lastSync} />
              <Info k="Security" v={i.securityStatus} />
              <Info k="API health" v={i.apiHealth ? `${i.apiHealth}%` : '—'} />
            </dl>
          </Card>

          <Card>
            <CardHeader title="Required approvals" />
            <ul className="space-y-2 text-sm">
              {i.requiredApprovals.map((a) => (
                <li key={a} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">✔ {a}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Data flow (illustrative)" />
            <ol className="space-y-2 text-sm">
              <li>1. Officer initiates workflow in MAII</li>
              <li>2. MAII API Gateway signs the request with department consent header</li>
              <li>3. Connector calls the source system with mTLS + JWT</li>
              <li>4. Response is DLP-scanned, classified, and returned</li>
              <li>5. Audit log written with hash of request/response</li>
            </ol>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Readiness score" />
            <div className="mt-1 text-4xl font-semibold text-ink-900">{i.connectorReadiness}%</div>
            <div className="mt-2 h-2 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${i.connectorReadiness}%` }} /></div>
            <div className="mt-2 text-xs text-ink-500">Composite score across API access, security review and MoU status.</div>
          </Card>
          <Card>
            <CardHeader title="Public-source status" />
            <div className="flex flex-col gap-2 text-sm">
              <SourceBadge source={i.status === 'Connected' ? 'Live' : i.status === 'Public-source linked' ? 'Public-source linked' : 'Department API required'} />
              {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{i.url}</a>}
            </div>
          </Card>
          <Card>
            <CardHeader title="Next steps" />
            <ul className="space-y-2 text-sm text-ink-700">
              <li className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand-500" /> Sign MoU with data owner</li>
              <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand-500" /> Complete VAPT & DPO review</li>
              <li className="flex items-center gap-2"><Wifi className="h-4 w-4 text-brand-500" /> Register connector in API Gateway</li>
              <li className="flex items-center gap-2"><User className="h-4 w-4 text-brand-500" /> Nominate integration owner</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-ink-500">{k}</div>
      <div className="font-medium text-ink-800">{v}</div>
    </div>
  )
}
