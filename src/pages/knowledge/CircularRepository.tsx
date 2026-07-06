import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'

export function CircularRepository() {
  const items = KNOWLEDGE.filter((k) => k.type === 'Circular')
  return (
    <div>
      <PageHeader
        title="Circular Repository"
        description="Departmental circulars — routing, deadlines, and action points auto-parsed by MAII."
        breadcrumb={['Knowledge Brain', 'Circular Repository']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
      </div>
    </div>
  )
}
