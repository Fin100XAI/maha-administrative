import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Card, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { ShieldAlert, Ban, ClipboardCheck, Filter } from 'lucide-react'
import { PROMPT_ROWS, INGRESS_CHANNELS, PI_SIGNATURES, SANITISER_POLICIES, PIRow } from '@/data/securitySamples'

const SEV_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const
const ACTION_FILTERS = ['All', 'Blocked', 'Sanitized', 'Under Review'] as const

export function PromptInjection() {
  const [sev, setSev] = useState<(typeof SEV_FILTERS)[number]>('All')
  const [action, setAction] = useState<(typeof ACTION_FILTERS)[number]>('All')
  const rows = useMemo(
    () => PROMPT_ROWS.filter((r) =>
      (sev === 'All' || r.severity === sev) && (action === 'All' || r.action === action),
    ),
    [sev, action],
  )
  const columns: Column<PIRow>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'pattern', header: 'Pattern' },
    { key: 'origin', header: 'Origin' },
    { key: 'dept', header: 'Dept' },
    { key: 'risk', header: 'Risk', sortable: true, render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.risk}%` }} /></div>
        <span className="text-xs font-medium">{r.risk}</span>
      </div>
    )},
    { key: 'severity', header: 'Severity', render: (r) => <SeverityBadge level={r.severity} /> },
    { key: 'action', header: 'Action', render: (r) => <StatusBadge status={r.action as any} /> },
    { key: 'policy', header: 'Policy' },
    { key: 'at', header: 'At', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="Prompt Injection Detection"
        description="Detect and block malicious prompts, jailbreak attempts, and hidden-instruction attacks."
        breadcrumb={['Security & AI SOC', 'Prompt Injection']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Blocked (24h)" value={94} icon={<Ban className="h-5 w-5"/>} delta={12} source="Demo" confidence={94} />
        <MetricCard label="Sanitized" value={38} icon={<Filter className="h-5 w-5"/>} delta={4} source="Demo" confidence={90} />
        <MetricCard label="High-risk patterns" value={7} icon={<ShieldAlert className="h-5 w-5"/>} delta={-14} source="Demo" confidence={92} />
        <MetricCard label="Policy hits" value={132} icon={<ClipboardCheck className="h-5 w-5"/>} delta={8} source="Demo" confidence={92} />
      </div>

      {/* Attack surface map */}
      <Card className="mt-6">
        <CardHeader
          title="Attack surface map"
          subtitle="Ingress channels · block-rate = blocked / (blocked + passed unsafe)"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INGRESS_CHANNELS.map((c) => (
            <div key={c.ch} className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-ink-800">{c.ch}</div>
                <span className="chip border bg-emerald-50 text-emerald-700 border-emerald-200">{c.rate.toFixed(2)}%</span>
              </div>
              <div className="mt-1 text-xs text-ink-500">{c.traffic.toLocaleString()} req · {c.blocked} blocked</div>
              <div className="mt-2 h-1.5 w-full rounded bg-ink-100">
                <div className="h-full rounded bg-brand-gradient" style={{ width: `${c.rate}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={rows}
          searchKeys={['pattern', 'origin', 'dept']}
          emptyText="No detections match the selected filters."
          actions={<>
            <select className="input h-9 w-auto py-1.5 text-xs" value={sev} onChange={(e) => setSev(e.target.value as any)} aria-label="Filter by severity">
              {SEV_FILTERS.map((s) => <option key={s}>{s === 'All' ? 'All severities' : s}</option>)}
            </select>
            <select className="input h-9 w-auto py-1.5 text-xs" value={action} onChange={(e) => setAction(e.target.value as any)} aria-label="Filter by action">
              {ACTION_FILTERS.map((a) => <option key={a}>{a === 'All' ? 'All actions' : a}</option>)}
            </select>
            <SourceBadge source="Demo" />
          </>}
        />
      </div>

      {/* Signature library + Sanitiser policies */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Signature library"
            subtitle="10 known patterns · detection method"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><Filter className="h-3 w-3" /> Curated</span>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Sig', 'Name', 'Detection', 'Hits'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {PI_SIGNATURES.map((s) => (
                  <tr key={s.sig}>
                    <td className="table-td font-mono text-xs text-ink-600">{s.sig}</td>
                    <td className="table-td text-ink-800">{s.name}</td>
                    <td className="table-td text-ink-700">{s.method}</td>
                    <td className="table-td font-medium">{s.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Sanitiser policy"
            subtitle="Pass vs block counts · 24h"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-2">
            {SANITISER_POLICIES.map((p) => {
              const total = p.pass + p.block
              const passPct = (p.pass / total) * 100
              return (
                <li key={p.p} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="min-w-0 truncate font-medium text-ink-800">{p.p}</span>
                    <span className="ml-2 shrink-0 text-xs text-ink-500">{p.pass.toLocaleString()} pass · {p.block} block</span>
                  </div>
                  <div className="mt-2 flex h-2 w-full overflow-hidden rounded bg-red-100">
                    <div className="h-full bg-brand-gradient" style={{ width: `${passPct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Policy violations — reasons" />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">
          {[
            'Attempts to override system prompt',
            'Encoded payloads (Base64/URL) in user input',
            'Hidden HTML/markup instructions in uploads',
            'Excessive tool calls loop (denial of tools)',
            'Explicit role-play jailbreaks (DAN / etc.)',
            'Chained tool abuse through file browser',
          ].map((r) => (
            <li key={r} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">{r}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
