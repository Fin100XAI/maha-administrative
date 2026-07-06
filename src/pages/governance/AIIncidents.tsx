import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ChevronRight, ChevronDown, CalendarDays } from 'lucide-react'

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
  timeline?: { at: string; step: string }[]
  remediation?: string
}

const INCIDENTS: Incident[] = [
  { id: 'INC-4218', type: 'Prompt injection', severity: 'High', department: 'HOME', reportedBy: 'AI SOC', rootCause: 'Malicious RTI upload attempted to override system prompt', status: 'Investigating', sla: '4h', action: 'Sandbox isolation + prompt sanitizer patch', at: '2026-07-07 09:22', remediation: 'Patch v4.2 of prompt sanitizer deployed; upload allow-list tightened.', timeline: [
    { at: '09:22', step: 'Alert raised by AI SOC WAF rule' },
    { at: '09:24', step: 'Session isolated and killed' },
    { at: '09:40', step: 'Root cause identified: hidden instruction in PDF metadata' },
    { at: '10:15', step: 'Sanitizer patch drafted' },
    { at: '11:02', step: 'Awaiting sign-off from DIT Model Risk Cell' },
  ] },
  { id: 'INC-4211', type: 'Hallucination', severity: 'Medium', department: 'GAD', reportedBy: 'Human reviewer', rootCause: 'Model cited non-existent GR', status: 'Resolved', sla: '8h', action: 'Response suppressed; reviewer correction', at: '2026-07-06 18:04' },
  { id: 'INC-4206', type: 'Data leakage', severity: 'Medium', department: 'FIN', reportedBy: 'DLP scanner', rootCause: 'Excel upload with PAN column not classified', status: 'Resolved', sla: '4h', action: 'Auto-redaction + classification correction', at: '2026-07-06 13:18' },
  { id: 'INC-4201', type: 'Bias issue', severity: 'Low', department: 'WCD', reportedBy: 'MAII fairness eval', rootCause: 'Under-representation of rural sample', status: 'Open', sla: '24h', action: 'Retraining scheduled', at: '2026-07-06 08:45' },
  { id: 'INC-4198', type: 'Unauthorized access', severity: 'Critical', department: 'DIT', reportedBy: 'Zero Trust engine', rootCause: 'After-hours access from geo-anomaly IP', status: 'Closed', sla: '1h', action: 'Session terminated; user locked', at: '2026-07-05 22:11' },
  { id: 'INC-4194', type: 'System abuse', severity: 'Medium', department: 'ALL', reportedBy: 'Rate limiter', rootCause: 'Excessive prompt volume from single user', status: 'Closed', sla: '4h', action: 'Rate limit adjusted; user warned', at: '2026-07-05 14:30' },
  { id: 'INC-4190', type: 'Wrong AI output', severity: 'Medium', department: 'HFW', reportedBy: 'Reviewer', rootCause: 'Marathi advisory dropped required clause', status: 'Resolved', sla: '8h', action: 'Human correction; prompt tuned', at: '2026-07-04 11:22' },
]

/** 30-day heatmap seed (deterministic). */
const HEATMAP = Array.from({ length: 30 }).map((_, i) => {
  const d = 30 - i
  const v = [3, 1, 0, 2, 4, 1, 0, 2, 3, 1, 2, 5, 0, 1, 2, 3, 2, 1, 0, 4, 3, 2, 1, 2, 1, 0, 3, 2, 4, 1][i]
  return { day: `D-${d}`, count: v }
})

const TYPE_SEV = [
  { type: 'Prompt injection', Low: 1, Medium: 2, High: 3, Critical: 1 },
  { type: 'Hallucination', Low: 4, Medium: 5, High: 2, Critical: 0 },
  { type: 'Data leakage', Low: 2, Medium: 3, High: 2, Critical: 1 },
  { type: 'Bias', Low: 3, Medium: 2, High: 1, Critical: 0 },
  { type: 'Unauth. access', Low: 0, Medium: 1, High: 2, Critical: 2 },
  { type: 'Wrong output', Low: 4, Medium: 4, High: 1, Critical: 0 },
  { type: 'System abuse', Low: 2, Medium: 2, High: 0, Critical: 0 },
]

const SEV_COLOR: Record<string, string> = { Low: '#22c55e', Medium: '#f59e0b', High: '#ef4444', Critical: '#7f1d1d' }

function heatColor(v: number) {
  if (v === 0) return 'bg-ink-50'
  if (v === 1) return 'bg-brand-100'
  if (v === 2) return 'bg-brand-200'
  if (v === 3) return 'bg-brand-300'
  return 'bg-brand-400'
}

export function AIIncidents() {
  const [openId, setOpenId] = useState<string | null>('INC-4218')

  const columns: Column<Incident>[] = useMemo(() => [
    { key: 'expand', header: '', render: (r) => (
      <button className="btn-ghost !p-1.5" onClick={() => setOpenId(openId === r.id ? null : r.id)} title="Toggle details">
        {openId === r.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    )},
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
  ], [openId])

  const openIncident = INCIDENTS.find((i) => i.id === openId)

  return (
    <div>
      <PageHeader
        title="AI Incident Management"
        description="Every AI incident — wrong output, data leakage, prompt injection, hallucination, unauthorized access, bias, abuse."
        breadcrumb={['Governance', 'AI Incidents']}
        source="Demo"
      />

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="Incident timeline"
            subtitle="Volume per day — last 30 days"
            right={<div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-10 gap-1.5">
              {HEATMAP.map((h) => (
                <div
                  key={h.day}
                  className={`aspect-square rounded-md border border-ink-100 ${heatColor(h.count)}`}
                  title={`${h.day}: ${h.count} incident${h.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
            <span>Less</span>
            {['bg-ink-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-400'].map((c) => (
              <span key={c} className={`inline-block h-3 w-5 rounded ${c} border border-ink-100`} />
            ))}
            <span>More</span>
            <span className="ml-auto">Total: {HEATMAP.reduce((s, h) => s + h.count, 0)}</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Severity by type"
            subtitle="Stacked incidents per class"
            right={<SourceBadge source="Demo" />}
          />
          <div style={{ height: 280 }} className="w-full">
            <ResponsiveContainer>
              <BarChart data={TYPE_SEV}>
                <CartesianGrid vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="type" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Low" stackId="s" fill={SEV_COLOR.Low} />
                <Bar dataKey="Medium" stackId="s" fill={SEV_COLOR.Medium} />
                <Bar dataKey="High" stackId="s" fill={SEV_COLOR.High} />
                <Bar dataKey="Critical" stackId="s" fill={SEV_COLOR.Critical} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <DataTable columns={columns} rows={INCIDENTS} searchKeys={['type', 'department', 'rootCause']} actions={<><SourceBadge source="Demo" /><button className="btn-primary">Report incident</button></>} />

      {openIncident && (
        <Card className="mt-4">
          <CardHeader
            title={`${openIncident.id} · ${openIncident.type}`}
            subtitle={`${openIncident.department} · reported by ${openIncident.reportedBy} · ${openIncident.at}`}
            right={
              <div className="flex items-center gap-2">
                <SeverityBadge level={openIncident.severity} />
                <StatusBadge status={openIncident.status} />
                <button className="btn-outline !py-1" onClick={() => setOpenId(null)}>Close</button>
              </div>
            }
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Root cause</div>
              <div className="mt-1 text-sm text-ink-800">{openIncident.rootCause}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">Remediation</div>
              <div className="mt-1 text-sm text-ink-800">{openIncident.remediation ?? openIncident.action}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">SLA</div>
              <div className="mt-1 text-sm text-ink-800">{openIncident.sla}</div>
            </div>
          </div>
          {openIncident.timeline && (
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500">Timeline</div>
              <ol className="relative space-y-2 border-l border-ink-100 pl-4">
                {openIncident.timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1.5 grid h-3 w-3 rounded-full bg-white ring-2 ring-brand-400" />
                    <div className="text-xs text-ink-500">{t.at}</div>
                    <div className="text-sm text-ink-800">{t.step}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
