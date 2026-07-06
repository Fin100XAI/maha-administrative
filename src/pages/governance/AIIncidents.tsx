import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

interface Incident {
  id: string
  type: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  department: string
  reportedBy: string
  rootCause: string
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed'
  sla: string
  action: string
  at: string
}

const INCIDENTS: Incident[] = [
  { id: 'INC-4218', type: 'Prompt injection', severity: 'High', department: 'HOME', reportedBy: 'AI SOC', rootCause: 'Malicious RTI upload attempted to override system prompt', status: 'Investigating', sla: '4h', action: 'Sandbox isolation + prompt sanitizer patch', at: '2026-07-07 09:22' },
  { id: 'INC-4211', type: 'Hallucination', severity: 'Medium', department: 'GAD', reportedBy: 'Human reviewer', rootCause: 'Model cited non-existent GR', status: 'Resolved', sla: '8h', action: 'Response suppressed; reviewer correction', at: '2026-07-06 18:04' },
  { id: 'INC-4206', type: 'Data leakage', severity: 'Medium', department: 'FIN', reportedBy: 'DLP scanner', rootCause: 'Excel upload with PAN column not classified', status: 'Resolved', sla: '4h', action: 'Auto-redaction + classification correction', at: '2026-07-06 13:18' },
  { id: 'INC-4201', type: 'Bias issue', severity: 'Low', department: 'WCD', reportedBy: 'MAII fairness eval', rootCause: 'Under-representation of rural sample', status: 'Open', sla: '24h', action: 'Retraining scheduled', at: '2026-07-06 08:45' },
  { id: 'INC-4198', type: 'Unauthorized access', severity: 'Critical', department: 'DIT', reportedBy: 'Zero Trust engine', rootCause: 'After-hours access from geo-anomaly IP', status: 'Closed', sla: '1h', action: 'Session terminated; user locked', at: '2026-07-05 22:11' },
  { id: 'INC-4194', type: 'System abuse', severity: 'Medium', department: 'ALL', reportedBy: 'Rate limiter', rootCause: 'Excessive prompt volume from single user', status: 'Closed', sla: '4h', action: 'Rate limit adjusted; user warned', at: '2026-07-05 14:30' },
  { id: 'INC-4190', type: 'Wrong AI output', severity: 'Medium', department: 'HFW', reportedBy: 'Reviewer', rootCause: 'Marathi advisory dropped required clause', status: 'Resolved', sla: '8h', action: 'Human correction; prompt tuned', at: '2026-07-04 11:22' },
]

export function AIIncidents() {
  const columns: Column<Incident>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'severity', header: 'Severity', sortable: true, render: (r) => <SeverityBadge level={r.severity} /> },
    { key: 'department', header: 'Dept', sortable: true },
    { key: 'reportedBy', header: 'Reported by' },
    { key: 'rootCause', header: 'Root cause' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'sla', header: 'SLA' },
    { key: 'action', header: 'Action taken' },
    { key: 'at', header: 'At', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="AI Incident Management"
        description="Every AI incident — wrong output, data leakage, prompt injection, hallucination, unauthorized access, bias, abuse."
        breadcrumb={['Governance', 'AI Incidents']}
        source="Demo"
      />
      <DataTable columns={columns} rows={INCIDENTS} searchKeys={['type', 'department', 'rootCause']} actions={<><SourceBadge source="Demo" /><button className="btn-primary">Report incident</button></>} />
    </div>
  )
}
