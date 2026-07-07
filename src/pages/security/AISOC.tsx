import { useMemo, useState } from 'react'
import { Radar, ShieldAlert, Bug, Radio, Cpu, Globe, ClipboardList } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { SOC_ROSTER, ACTIVE_PLAYBOOK_RUNS, THREAT_GEO, SOC_DECISIONS } from '@/data/securitySamples'

const FEED = [
  { t: '09:24', title: 'Prompt injection blocked · sig #PI-217', dept: 'HOME', sev: 'High' as const, action: 'Sandboxed' },
  { t: '09:18', title: 'Model drift alarm · Gemma-2-9B', dept: 'FIELD', sev: 'Low' as const, action: 'Retrain queued' },
  { t: '09:05', title: 'Rate-limit trip · officer IAS-2019-MH-0410', dept: 'REV', sev: 'Medium' as const, action: 'Slow-mode' },
  { t: '08:41', title: 'DLP redaction · PAN exposure', dept: 'FIN', sev: 'Medium' as const, action: 'Auto-redacted' },
  { t: '08:22', title: 'Geo-anomaly login · Nagpur→Muscat', dept: 'DIT', sev: 'Critical' as const, action: 'Session terminated' },
  { t: '07:58', title: 'Data exfil attempt · Aadhaar-shaped string', dept: 'WCD', sev: 'High' as const, action: 'Blocked' },
]

const PLAYBOOKS = [
  { name: 'Prompt injection', steps: 4, sla: '1h' },
  { name: 'Data leakage', steps: 5, sla: '2h' },
  { name: 'Model drift', steps: 3, sla: '24h' },
  { name: 'Zero-day model abuse', steps: 6, sla: '30m' },
]

const SEV_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const

export function AISOC() {
  const [feedSev, setFeedSev] = useState<(typeof SEV_FILTERS)[number]>('All')
  const feed = useMemo(
    () => (feedSev === 'All' ? FEED : FEED.filter((f) => f.sev === feedSev)),
    [feedSev],
  )
  return (
    <div>
      <PageHeader
        title="AI SOC"
        description="24×7 AI Security Operations Centre. Live feed of AI-specific alerts, response playbooks and threat intel."
        breadcrumb={['Security & AI SOC', 'AI SOC']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Open alerts" value={17} icon={<ShieldAlert className="h-5 w-5" />} delta={-12} source="Demo" confidence={92} />
        <MetricCard label="Blocked events (24h)" value={214} icon={<Radar className="h-5 w-5" />} delta={8} source="Demo" confidence={92} />
        <MetricCard label="Playbooks" value={PLAYBOOKS.length} icon={<Bug className="h-5 w-5" />} delta={0} source="Demo" confidence={100} />
        <MetricCard label="Mean time to contain" value="7m 42s" icon={<Cpu className="h-5 w-5" />} delta={-14} source="Demo" confidence={90} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader
            title="Live SOC feed"
            subtitle="Rolling 24h · high-priority first"
            right={<div className="flex items-center gap-2">
              <select className="input h-8 w-auto py-1 text-xs" value={feedSev} onChange={(e) => setFeedSev(e.target.value as any)} aria-label="Filter feed by severity">
                {SEV_FILTERS.map((s) => <option key={s}>{s === 'All' ? 'All severities' : s}</option>)}
              </select>
              <StatusBadge status="Active" />
            </div>}
          />
          <ul className="space-y-2">
            {feed.map((f) => (
              <li key={f.t + f.title} className="flex items-center gap-3 rounded-lg border border-ink-100 p-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600"><Radar className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-800 truncate">{f.title}</div>
                  <div className="text-xs text-ink-500">{f.t} · {f.dept} · action: {f.action}</div>
                </div>
                <SeverityBadge level={f.sev} />
              </li>
            ))}
            {feed.length === 0 && (
              <li className="rounded-lg border border-dashed border-ink-200 p-4 text-center text-xs text-ink-500">
                No {feedSev.toLowerCase()} alerts in the current window.
              </li>
            )}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Response playbooks" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {PLAYBOOKS.map((p) => (
              <li key={p.name} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-ink-800 truncate">{p.name}</div>
                  <div className="text-xs text-ink-500">{p.steps} steps · SLA {p.sla}</div>
                </div>
                <button className="btn-outline">Run</button>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button className="btn-primary w-full"><Radio className="h-4 w-4"/> Trigger tabletop drill</button>
          </div>
        </Card>
      </div>

      {/* Roster + Active playbook runs */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader title="SOC analyst on-duty roster" subtitle="Shift + coverage" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {SOC_ROSTER.map((a) => (
              <li key={a.name} className="flex items-center gap-3 rounded-md border border-ink-100 p-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                  {a.init}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-800 truncate">{a.name} · <span className="text-ink-500 font-normal">{a.role}</span></div>
                  <div className="text-xs text-ink-500 truncate">{a.shift} · covers {a.cover}</div>
                </div>
                <StatusBadge status="Active" />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Active playbook runs" right={<StatusBadge status="Investigating" />} />
          <ul className="space-y-3">
            {ACTIVE_PLAYBOOK_RUNS.map((r) => {
              const pct = Math.round((r.step / r.total) * 100)
              return (
                <li key={r.name} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink-800 truncate">{r.name}</div>
                      <div className="text-xs text-ink-500">Step {r.step} of {r.total} · SLA {r.sla}</div>
                    </div>
                    <span className={`chip border ${r.status === 'At risk' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      {/* Threat geo + SOC decisions */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Threat-source geo distribution"
            subtitle="Top 6 origins · 24h"
            right={<span className="chip border bg-sky-50 text-sky-700 border-sky-200"><Globe className="h-3 w-3" /> External</span>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>{['Origin', 'Hits', 'Blocked', 'Block %'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {THREAT_GEO.map((g) => (
                  <tr key={g.origin}>
                    <td className="table-td font-medium text-ink-800">{g.origin}</td>
                    <td className="table-td">{g.hits}</td>
                    <td className="table-td">{g.block}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded bg-ink-100">
                          <div className="h-full rounded bg-brand-gradient" style={{ width: `${(g.block / g.hits) * 100}%` }} />
                        </div>
                        <span className="text-xs">{Math.round((g.block / g.hits) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent SOC decisions"
            subtitle="Audit trail — last 5"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><ClipboardList className="h-3 w-3" /> Audit</span>}
          />
          <ul className="space-y-2 text-sm">
            {SOC_DECISIONS.map((d) => (
              <li key={d.t + d.act} className="flex items-start gap-2 rounded-md border border-ink-100 px-3 py-2">
                <span className="mt-0.5 shrink-0 rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[10px] text-ink-600">{d.t}</span>
                <span className="mt-0.5 shrink-0 rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">{d.by}</span>
                <span className="min-w-0 flex-1 text-ink-800">{d.act}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
