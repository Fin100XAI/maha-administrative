import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from 'recharts'
import { Sparkles, Boxes, ClipboardCheck, AlertTriangle, Eye, Bug, Cpu, GaugeCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge, SeverityBadge } from '@/components/ui/Badges'

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
    </div>
  )
}
