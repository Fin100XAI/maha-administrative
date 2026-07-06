import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from 'recharts'
import { Sparkles, Boxes, ClipboardCheck, AlertTriangle, Eye, Bug, Cpu, GaugeCircle, Flag, GitCommit, Users2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge, SeverityBadge } from '@/components/ui/Badges'
import { REVIEWERS } from '@/data/governanceSamples'

const perf = [
  { m: 'Jan', BharatGPT: 89, Sarvam: 87, Llama: 84 },
  { m: 'Feb', BharatGPT: 90, Sarvam: 88, Llama: 85 },
  { m: 'Mar', BharatGPT: 91, Sarvam: 89, Llama: 85 },
  { m: 'Apr', BharatGPT: 91, Sarvam: 89, Llama: 86 },
  { m: 'May', BharatGPT: 92, Sarvam: 89, Llama: 87 },
  { m: 'Jun', BharatGPT: 92, Sarvam: 90, Llama: 88 },
]

const risk = [
  { dept: 'Home', value: 24 }, { dept: 'Revenue', value: 22 }, { dept: 'UDD', value: 18 },
  { dept: 'Health', value: 14 }, { dept: 'DIT', value: 12 }, { dept: 'Finance', value: 10 },
]

const usage = [
  { d: 'D-6', v: 4200 }, { d: 'D-5', v: 4600 }, { d: 'D-4', v: 4900 }, { d: 'D-3', v: 5200 },
  { d: 'D-2', v: 5500 }, { d: 'D-1', v: 5800 }, { d: 'D-0', v: 6200 },
]

const sla = [
  { s: 'Reviewer assigned', v: 96 }, { s: 'First response', v: 88 }, { s: 'Decision', v: 74 }, { s: 'Publish', v: 82 },
]

const ROADMAP = [
  { q: 'Q3 2026', title: 'Bias Auditor v2', desc: 'Fairness eval for scheme shortlisting; on-prem RTX pod', status: 'In flight' },
  { q: 'Q3 2026', title: 'Prompt Registry v3', desc: 'Version diff, blame view, red-team probes gate', status: 'In flight' },
  { q: 'Q4 2026', title: 'Model Sovereign Council', desc: 'Federated fine-tune across 3 DCs; disaster failover', status: 'Planned' },
  { q: 'Q4 2026', title: 'DPDP Consent Ledger', desc: 'Immutable consent record for citizen AI touch-points', status: 'Planned' },
  { q: 'Q1 2027', title: 'AI Audit CMDB', desc: 'Regulator-ready evidence bundle export', status: 'Planned' },
  { q: 'Q1 2027', title: 'Multilingual RAG SLA', desc: '11 Indic languages, p95 < 800 ms', status: 'Backlog' },
]

const POLICY_CHANGES = [
  { at: '07 Jul 2026', policy: 'Model Risk', change: 'Canary requirement made mandatory before promote', by: 'DIT — Model Risk Cell' },
  { at: '03 Jul 2026', policy: 'Third-party Model Use', change: 'VAPT before enable — added to gate', by: 'AI SOC' },
  { at: '01 Jul 2026', policy: 'Incident Reporting', change: 'RCA SLA tightened from 96h to 72h', by: 'AI SOC' },
  { at: '20 Jun 2026', policy: 'Acceptable-Use of AI', change: 'Prompt-injection clause added (v3.1)', by: 'AI Gov Officer' },
]

export function AIGovernance() {
  return (
    <div>
      <PageHeader
        title="AI Governance Dashboard"
        description="Central command of models, prompts, risks, human reviews, incidents and drift — under DPDP and Responsible AI policy."
        breadcrumb={['Governance & Responsible AI', 'Dashboard']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard label="Registered Models" value={7} icon={<Boxes className="h-5 w-5" />} delta={16.6} source="Demo" confidence={92} />
        <MetricCard label="Active Prompts" value={214} icon={<Sparkles className="h-5 w-5" />} delta={8.2} source="Demo" confidence={90} />
        <MetricCard label="Approved Prompts" value={182} icon={<ClipboardCheck className="h-5 w-5" />} delta={12.4} source="Demo" confidence={88} />
        <MetricCard label="High-Risk Use Cases" value={11} icon={<AlertTriangle className="h-5 w-5" />} delta={-4.3} source="Demo" confidence={86} />
        <MetricCard label="Human Reviews Pending" value={148} icon={<Eye className="h-5 w-5" />} delta={-3.4} source="Demo" confidence={92} />
        <MetricCard label="Hallucination Alerts" value={9} icon={<Eye className="h-5 w-5" />} delta={-22} source="Demo" confidence={80} />
        <MetricCard label="Bias Alerts" value={3} icon={<GaugeCircle className="h-5 w-5" />} delta={-10} source="Demo" confidence={84} />
        <MetricCard label="AI Incidents (7d)" value={12} icon={<Bug className="h-5 w-5" />} delta={-25} source="Demo" confidence={90} />
        <MetricCard label="Compliance Score" value="87 / 100" icon={<GaugeCircle className="h-5 w-5" />} delta={2.1} source="Public-source linked" confidence={88} />
        <MetricCard label="Model Drift Status" value="Stable" icon={<Cpu className="h-5 w-5" />} delta={0} source="Demo" confidence={86} status={<StatusBadge status="Approved" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Model performance" subtitle="Accuracy trend, top 3 models">
          <ResponsiveContainer>
            <LineChart data={perf}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[80, 95]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="BharatGPT" stroke="#D81B60" strokeWidth={2.5} />
              <Line type="monotone" dataKey="Sarvam" stroke="#6A1B9A" strokeWidth={2.5} />
              <Line type="monotone" dataKey="Llama" stroke="#4A148C" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk by department" subtitle="Composite governance risk index">
          <ResponsiveContainer>
            <RadarChart data={risk}>
              <PolarGrid stroke="#eef2f7" />
              <PolarAngleAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar dataKey="value" stroke="#D81B60" fill="#D81B60" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prompt usage trend" subtitle="Daily prompt volume">
          <ResponsiveContainer>
            <BarChart data={usage}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" radius={[6,6,0,0]} fill="#D81B60" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Human approval SLA" subtitle="% within SLA per stage">
          <ResponsiveContainer>
            <BarChart data={sla} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="s" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" radius={[0,8,8,0]} fill="#6A1B9A" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Incident severity" subtitle="Last 7 days" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2 text-sm">
            {[
              { t: 'Prompt injection via RTI upload', s: 'High' as const, id: 'INC-4218' },
              { t: 'Hallucination flagged on note draft', s: 'Medium' as const, id: 'INC-4211' },
              { t: 'PII detected in Excel upload', s: 'Medium' as const, id: 'INC-4206' },
              { t: 'OCR model drift', s: 'Low' as const, id: 'INC-4201' },
            ].map((i) => (
              <li key={i.id} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm text-ink-800">{i.t}</div>
                  <div className="text-xs text-ink-500">{i.id}</div>
                </div>
                <SeverityBadge level={i.s} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Policy compliance" subtitle="Per-policy status" right={<StatusBadge status="Approved" />} />
          <ul className="space-y-2 text-sm">
            {[
              ['Acceptable-Use of AI', 'Approved'],
              ['Prompt Governance', 'Approved'],
              ['Model Risk', 'Under Review'],
              ['DPDP for AI', 'Approved'],
              ['Human-in-the-loop', 'Approved'],
            ].map(([p, s]) => (
              <li key={p} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                <span className="text-ink-700">{p}</span>
                <StatusBadge status={s as any} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2"><RiskBadge level="Low" /><SourceBadge source="Public-source linked" /></div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Governance roadmap"
            subtitle="Q3 2026 → Q1 2027"
            right={<div className="flex items-center gap-2"><Flag className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ol className="relative space-y-4 border-l border-ink-100 pl-6">
            {ROADMAP.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-brand-400">
                  <Flag className="h-3 w-3 text-brand-500" />
                </span>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{m.q}</div>
                <div className="text-sm font-semibold text-ink-800">{m.title}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-ink-500">{m.desc}</div>
                <div className="mt-1.5">
                  <StatusBadge status={m.status === 'In flight' ? 'Active' : m.status === 'Planned' ? 'Under Review' : 'Draft'} />
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <CardHeader
            title="Recent policy changes"
            subtitle="Last 30 days"
            right={<div className="flex items-center gap-2"><GitCommit className="h-4 w-4 text-brand-500" /><SourceBadge source="Public-source linked" /></div>}
          />
          <ul className="space-y-2 text-sm">
            {POLICY_CHANGES.map((c, i) => (
              <li key={i} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{c.policy}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-ink-600">{c.change}</div>
                    <div className="mt-1 truncate text-[11px] text-ink-500">by {c.by}</div>
                  </div>
                  <span className="shrink-0 text-[11px] text-ink-500">{c.at}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Reviewer workload"
            subtitle="Queue depth by reviewer"
            right={<div className="flex items-center gap-2"><Users2 className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2">
            {REVIEWERS.map((r) => {
              const load = Math.min(r.queue * 8, 100)
              return (
                <li key={r.name} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-semibold text-white">
                      {r.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800">{r.name}</div>
                      <div className="truncate text-[11px] text-ink-500">{r.role} · avg {r.avg}</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ink-700">{r.queue}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
