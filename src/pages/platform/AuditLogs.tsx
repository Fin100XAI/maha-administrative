import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import {
  Download,
  ClipboardList,
  Link2,
  FileCheck2,
  AlertTriangle,
  Bookmark,
  ShieldCheck,
} from 'lucide-react'
import {
  HASH_CHAIN,
  COMPLIANCE_REPORTS,
  HIGH_RISK_ACTIONS,
  SAVED_QUERIES,
} from '@/data/platformSamples'

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
        eyebrow="Immutable trail"
        icon={<ClipboardList className="h-5 w-5" />}
        actions={<>
          <SourceBadge source="Demo" />
          <button className="btn-outline"><Download className="h-4 w-4"/> Export CSV</button>
          <button className="btn-primary"><ClipboardList className="h-4 w-4"/> Filter & report</button>
        </>}
      />

      <DataTable columns={columns} rows={LOGS} searchKeys={['officer', 'action', 'module']} />

      {/* Integrity + Compliance */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Log integrity · hash chain"
            subtitle="Each record is chained to the previous one — tampering breaks the chain."
            right={<div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /><StatusBadge status="Approved" /><SourceBadge source="Demo" /></div>}
          />
          <ol className="space-y-2 text-xs">
            {HASH_CHAIN.map((h) => (
              <li key={h.seq} className="rounded-md border border-ink-100 p-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-ink-500">#{h.seq.toLocaleString()}</span>
                  <span className="text-ink-500">{h.ts}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-ink-800">
                  <Link2 className="h-3 w-3 text-brand-500" />
                  <span className="truncate">prev {h.prev}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-ink-800">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span className="truncate">hash {h.hash}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-3 text-xs text-ink-500">Chain verified end-to-end. Anchor hash mirrored to WORM ledger every 5 minutes.</div>
        </Card>

        <Card>
          <CardHeader
            title="Compliance report generator"
            subtitle="One-click exports for auditors."
            right={<div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {COMPLIANCE_REPORTS.map((r) => (
              <li key={r.name} className="rounded-md border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink-800">{r.name}</span>
                  <button className="btn-outline text-xs"><Download className="h-3 w-3" /> Export</button>
                </div>
                <div className="mt-1 text-xs text-ink-600">{r.scope}</div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-ink-500">
                  <span>Last run · {r.lastRun}</span>
                  <span>Next due · {r.nextDue}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Risk distribution + Saved queries */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_1fr]">
        <ChartCard
          title="High-risk action distribution"
          subtitle="Last 30 days across the platform."
          source="Demo"
          right={<AlertTriangle className="h-4 w-4 text-brand-500" />}
        >
          <ResponsiveContainer>
            <BarChart data={HIGH_RISK_ACTIONS} layout="vertical" margin={{ left: 32 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="action" width={170} tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="count" fill="#4A148C" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Saved query library"
            subtitle="Auditor short-cuts across the log store."
            right={<div className="flex items-center gap-2"><Bookmark className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2 text-sm">
            {SAVED_QUERIES.map((q) => (
              <li key={q.name} className="rounded-md border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink-800">{q.name}</span>
                  <span className="chip border-ink-200 bg-white text-[10px] text-ink-600">{q.who}</span>
                </div>
                <div className="mt-1 text-xs text-ink-500">{q.description}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
