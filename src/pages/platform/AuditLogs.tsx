import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Download, ClipboardList } from 'lucide-react'

interface Log {
  ts: string
  officer: string
  role: string
  dept: string
  action: string
  module: string
  ip: string
  device: string
  risk: 'Low' | 'Medium' | 'High'
  status: 'Approved' | 'Blocked' | 'Under Review'
}
const LOGS: Log[] = [
  { ts: '2026-07-07 09:32:14', officer: 'IAS-2011-MH-0182', role: 'Principal Secretary', dept: 'DIT', action: 'Opened session', module: 'AI Workspace', ip: '10.14.22.18', device: 'macOS · managed', risk: 'Low', status: 'Approved' },
  { ts: '2026-07-07 09:34:02', officer: 'IAS-2011-MH-0182', role: 'Principal Secretary', dept: 'DIT', action: 'Prompt sent · summarise GR', module: 'AI Workspace', ip: '10.14.22.18', device: 'macOS · managed', risk: 'Low', status: 'Approved' },
  { ts: '2026-07-07 09:35:41', officer: 'MPSC-2020-1281', role: 'Section Officer', dept: 'REV', action: 'Bulk download attempt', module: 'DMS', ip: '10.44.101.19', device: 'Windows · managed', risk: 'Medium', status: 'Under Review' },
  { ts: '2026-07-07 09:22:11', officer: 'IAS-2019-MH-0410', role: 'Department Officer', dept: 'HOME', action: 'Uploaded external RTI PDF', module: 'PDF Intelligence', ip: '10.14.44.72', device: 'Windows · managed', risk: 'High', status: 'Blocked' },
  { ts: '2026-07-06 22:11:02', officer: 'IAS-2011-MH-0182', role: 'Principal Secretary', dept: 'DIT', action: 'Session terminated (geo-anomaly)', module: 'Zero Trust', ip: '86.36.192.44', device: 'iPad · BYOD', risk: 'High', status: 'Blocked' },
  { ts: '2026-07-06 18:04:22', officer: 'MPSC-2019-2440', role: 'Department Officer', dept: 'GAD', action: 'Approved note draft', module: 'Governance', ip: '10.14.14.11', device: 'macOS · managed', risk: 'Low', status: 'Approved' },
  { ts: '2026-07-06 13:18:31', officer: 'MPSC-2018-1102', role: 'Section Officer', dept: 'FIN', action: 'Excel upload with PII', module: 'Excel Analysis', ip: '10.14.55.14', device: 'Windows · managed', risk: 'Medium', status: 'Approved' },
]

export function AuditLogs() {
  const columns: Column<Log>[] = [
    { key: 'ts', header: 'Timestamp', sortable: true },
    { key: 'officer', header: 'Officer' },
    { key: 'role', header: 'Role' },
    { key: 'dept', header: 'Dept' },
    { key: 'action', header: 'Action' },
    { key: 'module', header: 'Module' },
    { key: 'ip', header: 'IP / Device', render: (r) => <span className="text-xs text-ink-600">{r.ip} · {r.device}</span> },
    { key: 'risk', header: 'Risk', render: (r) => <RiskBadge level={r.risk} /> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ]
  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="Immutable, append-only audit trail. Every action in MAII is logged and searchable."
        breadcrumb={['Platform Admin', 'Audit Logs']}
        source="Demo"
        actions={<>
          <SourceBadge source="Demo" />
          <button className="btn-outline"><Download className="h-4 w-4"/> Export CSV</button>
          <button className="btn-primary"><ClipboardList className="h-4 w-4"/> Filter & report</button>
        </>}
      />
      <DataTable columns={columns} rows={LOGS} searchKeys={['officer', 'action', 'module']} />
    </div>
  )
}
