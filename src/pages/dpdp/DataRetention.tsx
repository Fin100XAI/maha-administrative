import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { StatusBadge, RiskBadge, SourceBadge } from '@/components/ui/Badges'
import { Timer, Archive, Trash2, ShieldCheck } from 'lucide-react'

interface Row {
  category: string
  policy: string
  expiring: number
  archived: number
  legalHold: boolean
  owner: string
  status: 'Approved' | 'Under Review'
}
const rows: Row[] = [
  { category: 'GR / Circular', policy: '10 years', expiring: 128, archived: 62410, legalHold: false, owner: 'GAD', status: 'Approved' },
  { category: 'Note sheets', policy: '7 years', expiring: 342, archived: 148230, legalHold: false, owner: 'All depts', status: 'Approved' },
  { category: 'RTI replies', policy: '10 years', expiring: 22, archived: 42180, legalHold: false, owner: 'ALL', status: 'Approved' },
  { category: 'Beneficiary records', policy: '5 years', expiring: 512, archived: 218420, legalHold: true, owner: 'MahaDBT', status: 'Under Review' },
  { category: 'Health records', policy: '15 years', expiring: 12, archived: 82140, legalHold: false, owner: 'HFW', status: 'Approved' },
  { category: 'Cabinet notes', policy: '25 years', expiring: 6, archived: 4210, legalHold: true, owner: 'GAD', status: 'Approved' },
]

export function DataRetention() {
  const columns: Column<Row>[] = [
    { key: 'category', header: 'Category', sortable: true },
    { key: 'policy', header: 'Retention', sortable: true },
    { key: 'expiring', header: 'Expiring (30d)', sortable: true },
    { key: 'archived', header: 'Archived', sortable: true },
    { key: 'legalHold', header: 'Legal hold', render: (r) => <StatusBadge status={r.legalHold ? 'Active' : 'Closed'} /> },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]
  return (
    <div>
      <PageHeader
        title="Data Retention"
        description="Retention policies, expiring data, legal holds and deletion approvals."
        breadcrumb={['DPDP', 'Data Retention']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Policies enforced" value={12} icon={<ShieldCheck className="h-5 w-5" />} delta={0} source="Demo" confidence={92} />
        <MetricCard label="Expiring in 30 days" value="1,022" icon={<Timer className="h-5 w-5" />} delta={0} source="Demo" confidence={88} />
        <MetricCard label="Archived (all-time)" value="5.58 L" icon={<Archive className="h-5 w-5" />} delta={5.1} source="Demo" confidence={90} />
        <MetricCard label="Retention violations" value={3} icon={<Trash2 className="h-5 w-5" />} delta={-50} source="Demo" confidence={90} />
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={rows} searchKeys={['category', 'owner']} actions={<><SourceBadge source="Demo" /></>} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Violations & required actions" />
        <ul className="space-y-2 text-sm">
          <li className="rounded-md border border-ink-100 px-3 py-2 flex items-center justify-between">
            <span>Beneficiary records retained 3 months beyond 5-year policy in Rural Development</span>
            <RiskBadge level="Medium" />
          </li>
          <li className="rounded-md border border-ink-100 px-3 py-2 flex items-center justify-between">
            <span>2 note sheets flagged for deletion but held by DPO decision — awaiting review</span>
            <RiskBadge level="Low" />
          </li>
        </ul>
      </Card>
    </div>
  )
}
