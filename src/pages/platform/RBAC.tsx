import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { ShieldQuestion, Users } from 'lucide-react'

const ROLES = [
  'Chief Secretary', 'Principal Secretary', 'District Collector',
  'Municipal Commissioner', 'Department Officer', 'Section Officer',
  'IT Admin', 'AI Governance Officer', 'Security Officer', 'Data Protection Officer',
]

const MODULES = [
  'AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops',
  'Audit Logs', 'RBAC', 'Encryption', 'Integrations',
]

// permission grid
const grid: Record<string, string[]> = {
  'Chief Secretary': ['AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops', 'Audit Logs'],
  'Principal Secretary': ['AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops'],
  'District Collector': ['AI Workspace', 'Governance', 'DPDP'],
  'Municipal Commissioner': ['AI Workspace', 'Governance'],
  'Department Officer': ['AI Workspace', 'Governance'],
  'Section Officer': ['AI Workspace'],
  'IT Admin': ['RBAC', 'Encryption', 'Integrations', 'Audit Logs', 'Security Ops'],
  'AI Governance Officer': ['Governance', 'Model Registry', 'Prompt Registry', 'DPDP'],
  'Security Officer': ['Security Ops', 'Audit Logs', 'RBAC'],
  'Data Protection Officer': ['DPDP', 'Audit Logs', 'RBAC'],
}

export function RBAC() {
  return (
    <div>
      <PageHeader
        title="RBAC"
        description="Role-based access control matrix — least-privilege by default, with data-classification limits and approval authority."
        breadcrumb={['Platform Admin', 'RBAC']}
        source="Demo"
      />

      <Card>
        <CardHeader title="Role × Module matrix" right={<SourceBadge source="Demo" />} />
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="min-w-max text-xs">
            <thead>
              <tr>
                <th className="table-th sticky left-0 z-10 bg-ink-50/90 whitespace-nowrap">Role</th>
                {MODULES.map((m) => (
                  <th key={m} className="table-th whitespace-nowrap text-center">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r}>
                  <td className="table-td sticky left-0 z-10 bg-white whitespace-nowrap font-medium text-ink-800">
                    {r}
                  </td>
                  {MODULES.map((m) => (
                    <td key={m} className="table-td text-center">
                      {grid[r]?.includes(m)
                        ? <span className="text-emerald-600">●</span>
                        : <span className="text-ink-300">○</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Data access rules" right={<ShieldQuestion className="h-4 w-4 text-brand-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>• Classification-aware read/write</li>
            <li>• Break-glass with dual approval</li>
            <li>• Time-boxed elevation only</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Approval authority" right={<Users className="h-4 w-4 text-brand-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>• SO submits → US reviews → DS decides → PS/CS approves</li>
            <li>• DPO for privacy-sensitive AI use cases</li>
            <li>• AI Governance Officer for prompts/models</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Admin controls" />
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>User provisioning</span><StatusBadge status="Approved" /></li>
            <li className="flex justify-between"><span>Access reviews</span><StatusBadge status="Under Review" /></li>
            <li className="flex justify-between"><span>SoD violations</span><StatusBadge status="Resolved" /></li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
