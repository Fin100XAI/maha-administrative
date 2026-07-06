import { Radar, ShieldAlert, Bug, Radio, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

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

export function AISOC() {
  return (
    <div>
      <PageHeader
        title="AI SOC"
        description="24×7 AI Security Operations Centre. Live feed of AI-specific alerts, response playbooks and threat intel."
        breadcrumb={['Security & AI SOC', 'AI SOC']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Open alerts" value={17} icon={<ShieldAlert className="h-5 w-5" />} delta={-12} source="Demo" confidence={92} />
        <MetricCard label="Blocked events (24h)" value={214} icon={<Radar className="h-5 w-5" />} delta={8} source="Demo" confidence={92} />
        <MetricCard label="Playbooks" value={PLAYBOOKS.length} icon={<Bug className="h-5 w-5" />} delta={0} source="Demo" confidence={100} />
        <MetricCard label="Mean time to contain" value="7m 42s" icon={<Cpu className="h-5 w-5" />} delta={-14} source="Demo" confidence={90} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader title="Live SOC feed" subtitle="Rolling 24h · high-priority first" right={<StatusBadge status="Active" />} />
          <ul className="space-y-2">
            {FEED.map((f) => (
              <li key={f.t + f.title} className="flex items-center gap-3 rounded-lg border border-ink-100 p-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600"><Radar className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-800">{f.title}</div>
                  <div className="text-xs text-ink-500">{f.t} · {f.dept} · action: {f.action}</div>
                </div>
                <SeverityBadge level={f.sev} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Response playbooks" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {PLAYBOOKS.map((p) => (
              <li key={p.name} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2 text-sm">
                <div>
                  <div className="font-medium text-ink-800">{p.name}</div>
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
    </div>
  )
}
