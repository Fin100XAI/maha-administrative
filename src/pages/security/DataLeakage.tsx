import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { EyeOff, Radio, KeyRound, Download, ShieldAlert } from 'lucide-react'
import { DLP_ROWS, DLP_POLICIES, REDACTION_VOLUME, EXFIL_CHANNELS, DLPRow } from '@/data/securitySamples'

export function DataLeakage() {
  const columns: Column<DLPRow>[] = [
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

      {/* DLP policies + redaction volume + exfil channels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="DLP policies"
            subtitle="8 active · 24h hits"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2">
            {DLP_POLICIES.map((p) => (
              <li key={p.p} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-ink-800">{p.p}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <SeverityBadge level={p.sev} />
                  <span className="font-semibold text-brand-600">{p.hits}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard title="Redaction volume" subtitle="Last 7 days" source="Demo">
          <ResponsiveContainer>
            <BarChart data={REDACTION_VOLUME}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="redact" name="Redacted" fill="#D81B60" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Top exfil channels"
            subtitle="Share of blocked attempts"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><ShieldAlert className="h-3 w-3" /> Ranked</span>}
          />
          <ul className="space-y-2 text-sm">
            {EXFIL_CHANNELS.map((c, i) => (
              <li key={c.ch}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-ink-800">#{i + 1} · {c.ch}</span>
                  <span className="font-medium text-ink-700">{c.share}%</span>
                </div>
                <div className="h-2 w-full rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${c.share * 2.5}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <DataTable columns={columns} rows={DLP_ROWS} searchKeys={['officer', 'dept', 'type']} actions={<><SourceBadge source="Demo" /></>} />
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
