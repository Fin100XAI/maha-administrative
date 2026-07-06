import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Cookie, XCircle, Clock, Users } from 'lucide-react'

interface Row {
  id: string
  purpose: string
  principal: string
  dept: string
  status: 'Active' | 'Withdrawn' | 'Expired' | 'Under Review'
  granted: string
  expires: string
}

const rows: Row[] = [
  { id: 'CN-8241', purpose: 'PMAY-U 2.0 eligibility verification', principal: 'Citizen · household', dept: 'UDD', status: 'Active', granted: '2026-03-14', expires: '2027-03-13' },
  { id: 'CN-8240', purpose: 'MahaDBT scheme onboarding', principal: 'Citizen · individual', dept: 'PLN', status: 'Active', granted: '2026-03-12', expires: '2027-03-11' },
  { id: 'CN-8239', purpose: 'e-HRMS transfer optimiser', principal: 'Employee · officer', dept: 'GAD', status: 'Under Review', granted: '2026-05-01', expires: '2026-11-01' },
  { id: 'CN-8238', purpose: 'RTI reply drafting', principal: 'Citizen · applicant', dept: 'ALL', status: 'Active', granted: '2026-06-04', expires: '2027-06-03' },
  { id: 'CN-8237', purpose: 'Vaccination reminder', principal: 'Citizen · household', dept: 'HFW', status: 'Withdrawn', granted: '2025-11-14', expires: '2026-11-14' },
  { id: 'CN-8236', purpose: 'Crop-loss appeal drafting', principal: 'Citizen · farmer', dept: 'AGR', status: 'Expired', granted: '2025-05-14', expires: '2026-05-14' },
]

export function ConsentDashboard() {
  const columns: Column<Row>[] = [
    { key: 'id', header: 'Consent ID', sortable: true },
    { key: 'purpose', header: 'Purpose' },
    { key: 'principal', header: 'Data principal' },
    { key: 'dept', header: 'Dept owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status as any} /> },
    { key: 'granted', header: 'Granted', sortable: true },
    { key: 'expires', header: 'Expires', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="Consent Dashboard"
        description="DPDP-aligned consent records, withdrawal requests, expiry, and principal categorisation."
        breadcrumb={['DPDP', 'Consent Dashboard']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Active consents" value="1.24 L" icon={<Cookie className="h-5 w-5" />} delta={5.2} source="Demo" confidence={86} />
        <MetricCard label="Withdrawn (24h)" value={42} icon={<XCircle className="h-5 w-5" />} delta={-8} source="Demo" confidence={90} />
        <MetricCard label="Expiring in 30 days" value={318} icon={<Clock className="h-5 w-5" />} delta={0} source="Demo" confidence={86} />
        <MetricCard label="Distinct principals" value="4.62 L" icon={<Users className="h-5 w-5" />} delta={4.2} source="Demo" confidence={80} />
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={rows} searchKeys={['purpose', 'principal', 'dept']} actions={<><SourceBadge source="Demo" /><button className="btn-primary">Create consent template</button></>} />
      </div>
    </div>
  )
}
