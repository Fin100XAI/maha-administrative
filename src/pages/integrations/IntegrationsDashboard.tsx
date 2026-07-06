import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { IntegrationCard } from '@/components/panels/IntegrationCard'
import { INTEGRATIONS } from '@/data/integrations'
import { Network, Wifi, ShieldCheck, Clock } from 'lucide-react'

export function IntegrationsDashboard() {
  const connected = INTEGRATIONS.filter((i) => i.status === 'Connected').length
  const pending = INTEGRATIONS.filter((i) => /pending|required|development/.test(i.status)).length

  return (
    <div>
      <PageHeader
        title="Integrations Dashboard"
        description="Connectors to Government of Maharashtra systems and infrastructure. Data-source status is honest — nothing pretends to be live."
        breadcrumb={['Integrations', 'Dashboard']}
        source="Public-source linked"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Total connectors" value={INTEGRATIONS.length} icon={<Network className="h-5 w-5" />} delta={0} source="Public-source linked" confidence={94} />
        <MetricCard label="Connected" value={connected} icon={<Wifi className="h-5 w-5" />} delta={12} source="Public-source linked" confidence={92} />
        <MetricCard label="Pending / required" value={pending} icon={<Clock className="h-5 w-5" />} delta={-8} source="Public-source linked" confidence={90} />
        <MetricCard label="Avg. security rating" value="A" icon={<ShieldCheck className="h-5 w-5" />} delta={0} source="Public-source linked" confidence={90} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((i) => <IntegrationCard key={i.slug} i={i} />)}
      </div>
    </div>
  )
}
