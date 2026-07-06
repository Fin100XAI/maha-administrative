import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { EyeOff, Radio, KeyRound, Download } from 'lucide-react'

interface Row {
  id: string
  when: string
  officer: string
  dept: string
  type: string
  channel: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  action: string
}
const rows: Row[] = [
  { id: 'DLP-3021', when: '2026-07-07 09:11', officer: 'IAS-2016-MH-0184', dept: 'FIN', type: 'PAN pattern', channel: 'Excel upload', severity: 'Medium', action: 'Auto-redacted' },
  { id: 'DLP-3020', when: '2026-07-07 08:44', officer: 'IAS-2019-MH-0410', dept: 'HOME', type: 'Aadhaar pattern', channel: 'PDF upload', severity: 'High', action: 'Blocked' },
  { id: 'DLP-3019', when: '2026-07-07 07:12', officer: 'IAS-2010-MH-0082', dept: 'HFW', type: 'Health record', channel: 'Chat prompt', severity: 'High', action: 'Redacted, alert raised' },
  { id: 'DLP-3018', when: '2026-07-06 22:08', officer: 'MPSC-2020-1281', dept: 'REV', type: 'Bank IFSC', channel: 'CSV upload', severity: 'Low', action: 'Redacted' },
  { id: 'DLP-3017', when: '2026-07-06 18:44', officer: 'IAS-2011-MH-0182', dept: 'DIT', type: 'Confidential API key', channel: 'Code snippet', severity: 'Critical', action: 'Blocked; key rotated' },
]
export function DataLeakage() {
  const columns: Column<Row>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'when', header: 'When', sortable: true },
    { key: 'officer', header: 'Officer' },
    { key: 'dept', header: 'Dept' },
    { key: 'type', header: 'Type' },
    { key: 'channel', header: 'Channel' },
    { key: 'severity', header: 'Severity', render: (r) => <SeverityBadge level={r.severity} /> },
    { key: 'action', header: 'Action' },
  ]
  return (
    <div>
      <PageHeader
        title="Data Leakage Monitoring"
        description="Detect PII, sensitive access, external sharing, redaction and secret exposure across the AI stack."
        breadcrumb={['Security & AI SOC', 'Data Leakage']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="PII detected (24h)" value={38} icon={<EyeOff className="h-5 w-5" />} delta={-8} source="Demo" confidence={92} />
        <MetricCard label="Sensitive file access" value={112} icon={<Radio className="h-5 w-5" />} delta={4} source="Demo" confidence={90} />
        <MetricCard label="Secret detections" value={4} icon={<KeyRound className="h-5 w-5" />} delta={-25} source="Demo" confidence={92} />
        <MetricCard label="Data export events" value={62} icon={<Download className="h-5 w-5" />} delta={-6} source="Demo" confidence={90} />
      </div>
      <div className="mt-6">
        <DataTable columns={columns} rows={rows} searchKeys={['officer', 'dept', 'type']} actions={<><SourceBadge source="Demo" /></>} />
      </div>

      <Card className="mt-6">
        <CardHeader title="External sharing attempts" right={<StatusBadge status="Blocked" />} />
        <ul className="space-y-2 text-sm">
          {[
            'Attempt to email Excel with PAN column outside gom.gov.in — blocked (2026-07-06 21:14).',
            'Attempt to upload FIR to public cloud storage — blocked (2026-07-06 20:02).',
            'Attempt to paste Aadhaar into external chat — sanitized (2026-07-05 15:44).',
          ].map((s) => (
            <li key={s} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">{s}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
