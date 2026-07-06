import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Target } from 'lucide-react'

const PURPOSES = [
  { p: 'PMAY-U 2.0 verification', use: 'Beneficiary shortlist, disbursement', by: 'UDD + MahaDBT', status: 'Approved', risk: 'Low' as const },
  { p: 'Crop-loss appeals', use: 'Draft appeal, publish decisions', by: 'AGR + DDoR', status: 'Approved', risk: 'Low' as const },
  { p: 'e-HRMS transfer optimiser', use: 'Recommend transfers', by: 'GAD + DIT', status: 'Under Review', risk: 'Medium' as const },
  { p: 'Aaple Sarkar concierge', use: 'Citizen G2C assistant', by: 'GAD', status: 'Approved', risk: 'Low' as const },
  { p: 'Vaccination reminders', use: 'SMS + Aaple Sarkar', by: 'HFW', status: 'Approved', risk: 'Low' as const },
  { p: 'Health record intelligence', use: 'Clinical decision support', by: 'HFW', status: 'Under Review', risk: 'High' as const },
]

const VIOLATIONS = [
  { p: 'Beneficiary records used for advertising', dept: 'WCD', sev: 'High' as const, action: 'Blocked; DPO notified' },
  { p: 'Transfer data queried for personal search', dept: 'GAD', sev: 'Medium' as const, action: 'Alert to officer' },
]

export function PurposeLimitation() {
  return (
    <div>
      <PageHeader
        title="Purpose Limitation"
        description="Registered purposes for personal data, actual usage, and detected violations."
        breadcrumb={['DPDP', 'Purpose Limitation']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader title="Registered purposes" right={<SourceBadge source="Demo" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Purpose', 'Used for', 'Owner', 'Risk', 'Status'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {PURPOSES.map((p) => (
                  <tr key={p.p}>
                    <td className="table-td font-medium text-ink-800">{p.p}</td>
                    <td className="table-td">{p.use}</td>
                    <td className="table-td">{p.by}</td>
                    <td className="table-td"><RiskBadge level={p.risk} /></td>
                    <td className="table-td"><StatusBadge status={p.status as any} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Detected violations" right={<Target className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm">
              {VIOLATIONS.map((v) => (
                <li key={v.p} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-ink-800">{v.p}</div>
                      <div className="text-xs text-ink-500">{v.dept} · action: {v.action}</div>
                    </div>
                    <RiskBadge level={v.sev} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Approvals" />
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Health record intelligence</span><StatusBadge status="Under Review" /></li>
              <li className="flex justify-between"><span>e-HRMS transfer optimiser</span><StatusBadge status="Under Review" /></li>
              <li className="flex justify-between"><span>Aaple Sarkar concierge</span><StatusBadge status="Approved" /></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
