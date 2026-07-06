import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

interface Risk {
  id: string
  useCase: string
  department: string
  type: string
  severity: 'Low' | 'Medium' | 'High'
  probability: number
  mitigation: string
  owner: string
  status: 'Open' | 'Under Review' | 'Approved' | 'Closed'
  reviewDate: string
}

const RISKS: Risk[] = [
  { id: 'RISK-001', useCase: 'Marathi legal drafting', department: 'GAD', type: 'Hallucination', severity: 'Medium', probability: 22, mitigation: 'HITL mandatory + citation validator', owner: 'AI Gov Officer', status: 'Approved', reviewDate: '2026-08-01' },
  { id: 'RISK-002', useCase: 'FIR summarisation', department: 'HOME', type: 'Data Leakage', severity: 'High', probability: 34, mitigation: 'On-prem model only + PII redaction + DPO review', owner: 'DPO', status: 'Under Review', reviewDate: '2026-07-15' },
  { id: 'RISK-003', useCase: 'Beneficiary shortlisting', department: 'WCD', type: 'Bias', severity: 'High', probability: 28, mitigation: 'Fairness eval quarterly + reviewer panel', owner: 'AI Gov Officer', status: 'Open', reviewDate: '2026-07-25' },
  { id: 'RISK-004', useCase: 'External PDF upload', department: 'ALL', type: 'Prompt Injection', severity: 'Medium', probability: 41, mitigation: 'Sanitizer + isolated sandbox + rate limit', owner: 'AI SOC', status: 'Approved', reviewDate: '2026-08-10' },
  { id: 'RISK-005', useCase: 'Cabinet note distiller', department: 'GAD', type: 'Unauthorized Access', severity: 'Medium', probability: 12, mitigation: 'RBAC + audit + break-glass control', owner: 'IT Admin', status: 'Approved', reviewDate: '2026-08-05' },
  { id: 'RISK-006', useCase: 'Auto-approved disbursement', department: 'FIN', type: 'Wrong Recommendation', severity: 'High', probability: 18, mitigation: 'Never auto-approve > ₹5 Cr; HITL two reviewers', owner: 'CFO Cell', status: 'Approved', reviewDate: '2026-09-10' },
  { id: 'RISK-007', useCase: 'RTI reply drafts', department: 'ALL', type: 'Policy Non-Compliance', severity: 'Medium', probability: 20, mitigation: 'RTI Act 2005 policy prompt + reviewer', owner: 'AI Gov Officer', status: 'Approved', reviewDate: '2026-08-20' },
  { id: 'RISK-008', useCase: 'Consent draft AI', department: 'ALL', type: 'Privacy Violation', severity: 'Medium', probability: 14, mitigation: 'DPDP-aligned template + DPO sign-off', owner: 'DPO', status: 'Approved', reviewDate: '2026-08-01' },
  { id: 'RISK-009', useCase: 'Third-party plugin', department: 'ALL', type: 'Security Threat', severity: 'High', probability: 12, mitigation: 'Plugins disallowed except allow-list; VAPT before enable', owner: 'AI SOC', status: 'Under Review', reviewDate: '2026-07-15' },
]

export function RiskRegister() {
  const columns: Column<Risk>[] = [
    { key: 'id', header: 'Risk ID', sortable: true },
    { key: 'useCase', header: 'Use case', sortable: true },
    { key: 'department', header: 'Dept', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'severity', header: 'Severity', sortable: true, render: (r) => <RiskBadge level={r.severity} /> },
    { key: 'probability', header: 'Prob.', sortable: true, render: (r) => <span>{r.probability}%</span> },
    { key: 'mitigation', header: 'Mitigation' },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'reviewDate', header: 'Review', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="AI Risk Register"
        description="Enumerated AI risks per use case, with severity, probability, mitigation, owner and review cadence."
        breadcrumb={['Governance', 'Risk Register']}
        source="Demo"
      />
      <DataTable columns={columns} rows={RISKS} searchKeys={['useCase', 'department', 'type', 'owner']} actions={<>
        <SourceBadge source="Demo" />
        <button className="btn-primary">Add risk</button>
      </>} />
    </div>
  )
}
