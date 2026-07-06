import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

interface Row {
  name: string
  department: string
  version: string
  risk: 'Low' | 'Medium' | 'High'
  createdBy: string
  approvedBy: string
  status: 'Draft' | 'Approved' | 'Deprecated' | 'Needs Review'
  updated: string
}

const rows: Row[] = [
  { name: 'GR 5-bullet summariser', department: 'GAD', version: 'v3', risk: 'Low', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-28' },
  { name: 'Marathi citizen advisory', department: 'GAD', version: 'v2', risk: 'Medium', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-24' },
  { name: 'RTI Section 6 reply', department: 'All', version: 'v1', risk: 'Medium', createdBy: 'V. Patil', approvedBy: '—', status: 'Needs Review', updated: '2026-07-03' },
  { name: 'Crop-loss appeal draft', department: 'AGR', version: 'v2', risk: 'Medium', createdBy: 'S. Jadhav', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-14' },
  { name: 'FIR sensitive redaction', department: 'HOME', version: 'v1', risk: 'High', createdBy: 'K. Rao', approvedBy: '—', status: 'Needs Review', updated: '2026-07-02' },
  { name: 'Welfare shortlist explain', department: 'WCD', version: 'v1', risk: 'High', createdBy: 'S. Mahale', approvedBy: '—', status: 'Deprecated', updated: '2026-04-11' },
  { name: 'e-Office file movement note', department: 'All', version: 'v4', risk: 'Low', createdBy: 'A. Deshmukh', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-30' },
  { name: 'Cabinet note distiller', department: 'GAD', version: 'v3', risk: 'Medium', createdBy: 'V. Patil', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-19' },
]

export function PromptRegistry() {
  const columns: Column<Row>[] = [
    { key: 'name', header: 'Prompt', sortable: true },
    { key: 'department', header: 'Dept', sortable: true },
    { key: 'version', header: 'Version', sortable: true },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => <RiskBadge level={r.risk} /> },
    { key: 'createdBy', header: 'Created by' },
    { key: 'approvedBy', header: 'Approved by' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'updated', header: 'Last updated', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="Prompt Registry"
        description="All prompts in the platform — versioned, department-scoped, risk-classified."
        breadcrumb={['Governance', 'Prompt Registry']}
        source="Demo"
      />
      <DataTable columns={columns} rows={rows} searchKeys={['name', 'department', 'createdBy', 'approvedBy']} actions={<>
        <SourceBadge source="Demo" /><button className="btn-primary">Register prompt</button>
      </>} />
    </div>
  )
}
