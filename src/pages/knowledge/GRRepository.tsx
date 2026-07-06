import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'

export function GRRepository() {
  const grs = KNOWLEDGE.filter((k) => k.type === 'GR')
  return (
    <div>
      <PageHeader
        title="GR Repository"
        description="Government Resolutions issued by GoM departments — public-source linked to gr.maharashtra.gov.in."
        breadcrumb={['Knowledge Brain', 'GR Repository']}
        source="Public-source linked"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grs.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
      </div>
    </div>
  )
}
