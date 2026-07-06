import { Eye, GitCompare, ClipboardCheck, Undo2, XOctagon } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { MODELS, ModelEntry } from '@/data/models'

export function ModelRegistry() {
  const columns: Column<ModelEntry>[] = [
    { key: 'name', header: 'Model', sortable: true, render: (r) => (
      <div className="min-w-0">
        <div className="font-medium text-ink-900">{r.name}</div>
        <div className="text-xs text-ink-500">{r.provider} · v{r.version}</div>
      </div>
    )},
    { key: 'hosting', header: 'Hosting', sortable: true, render: (r) => (
      <span className="chip border border-ink-200 bg-ink-50 text-ink-700">{r.hosting}</span>
    )},
    { key: 'approvedFor', header: 'Approved for', render: (r) => (
      <div className="flex flex-wrap gap-1">{r.approvedFor.map((c) => <span key={c} className="chip border border-ink-200 bg-white text-ink-600">{c}</span>)}</div>
    )},
    { key: 'riskClass', header: 'Risk', sortable: true, render: (r) => <RiskBadge level={r.riskClass} /> },
    { key: 'accuracy', header: 'Accuracy', sortable: true, render: (r) => <span>{r.accuracy}%</span> },
    { key: 'latencyMs', header: 'Latency', sortable: true, render: (r) => <span>{r.latencyMs}ms</span> },
    { key: 'lastEvaluation', header: 'Last eval', sortable: true },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: () => (
      <div className="flex items-center gap-1">
        <button className="btn-ghost !p-1.5" title="View"><Eye className="h-4 w-4" /></button>
        <button className="btn-ghost !p-1.5" title="Compare"><GitCompare className="h-4 w-4" /></button>
        <button className="btn-ghost !p-1.5" title="Approve"><ClipboardCheck className="h-4 w-4 text-emerald-600" /></button>
        <button className="btn-ghost !p-1.5" title="Rollback"><Undo2 className="h-4 w-4 text-amber-600" /></button>
        <button className="btn-ghost !p-1.5" title="Retire"><XOctagon className="h-4 w-4 text-red-500" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader
        title="Model Registry"
        description="All AI models approved, pending, retired or rolled-back for MAII. Governance authority: DIT Model Risk Committee."
        breadcrumb={['Governance', 'Model Registry']}
        source="Demo"
      />
      <DataTable
        columns={columns}
        rows={MODELS}
        searchKeys={['name', 'provider', 'owner', 'status']}
        actions={<>
          <SourceBadge source="Demo" />
          <button className="btn-outline">Compare selected</button>
          <button className="btn-primary">Register new model</button>
        </>}
      />
    </div>
  )
}
