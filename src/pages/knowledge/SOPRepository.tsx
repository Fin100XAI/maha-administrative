import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'

export function SOPRepository() {
  const items = KNOWLEDGE.filter((k) => k.type === 'SOP' || k.type === 'Policy')
  return (
    <div>
      <PageHeader
        title="SOP Repository"
        description="Standard Operating Procedures across departments — MAII-verified and versioned."
        breadcrumb={['Knowledge Brain', 'SOP Repository']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
      </div>
    </div>
  )
}
