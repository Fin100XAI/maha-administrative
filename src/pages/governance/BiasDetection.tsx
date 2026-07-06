import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, RadialBarChart, RadialBar } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Scale, Users, Eye, ClipboardCheck } from 'lucide-react'

const cov = [
  { g: 'District coverage', v: 92 },
  { g: 'Gender balance', v: 71 },
  { g: 'Caste representation', v: 68 },
  { g: 'Age spread', v: 74 },
  { g: 'Rural/Urban', v: 84 },
]

const alerts = [
  { title: 'Marathi vs English response length disparity', dept: 'GAD', delta: '+38%', severity: 'Medium' as const, action: 'Adjust decoding params + retrain' },
  { title: 'Beneficiary shortlist favours urban ULBs', dept: 'WCD', delta: '+22%', severity: 'High' as const, action: 'Retrain with rural-weighted sampling' },
  { title: 'Female vs male name — sentiment drift', dept: 'HFW', delta: '+7%', severity: 'Medium' as const, action: 'Debias fine-tune + fairness eval' },
]

export function BiasDetection() {
  return (
    <div>
      <PageHeader
        title="Bias Detection"
        description="Fairness testing, dataset coverage and department-wise bias alerts."
        breadcrumb={['Governance', 'Bias Detection']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Fairness score" value="82 / 100" icon={<Scale className="h-5 w-5" />} delta={2.1} source="Demo" confidence={86} />
        <MetricCard label="Datasets under test" value={18} icon={<Users className="h-5 w-5" />} delta={5.5} source="Demo" confidence={90} />
        <MetricCard label="Open bias alerts" value={3} icon={<Eye className="h-5 w-5" />} delta={-1} source="Demo" confidence={88} />
        <MetricCard label="Human review coverage" value="94%" icon={<ClipboardCheck className="h-5 w-5" />} delta={3.2} source="Demo" confidence={90} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Dataset coverage" subtitle="Dimension-wise coverage percentage" source="Demo">
          <ResponsiveContainer>
            <BarChart data={cov} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="g" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" radius={[0,8,8,0]} fill="#D81B60" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fairness score" subtitle="Overall composite" source="Demo">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ v: 82, fill: '#D81B60' }]} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="v" cornerRadius={30} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mt-6">
        <CardHeader title="Bias alerts" right={<SourceBadge source="Demo" />} />
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.title} className="flex flex-col gap-2 rounded-xl border border-ink-100 p-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink-800">{a.title}</div>
                <div className="text-xs text-ink-500">{a.dept} · delta {a.delta}</div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={a.severity} />
                <StatusBadge status="Under Review" />
                <button className="btn-outline">Recommend fix</button>
                <button className="btn-primary">Mitigate</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-md border border-brand-200 bg-brand-soft p-3 text-xs text-ink-700">
          <b>Mitigation recommendations:</b> re-sample under-represented categories; adjust decoding temperature for Marathi; enable reviewer panel for high-severity alerts.
        </div>
      </Card>
    </div>
  )
}
