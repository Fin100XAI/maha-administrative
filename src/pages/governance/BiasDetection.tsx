import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, RadialBarChart, RadialBar } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Scale, Users, Eye, ClipboardCheck, CircleCheck } from 'lucide-react'

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

interface Run {
  id: string
  at: string
  suite: string
  demographic: 'Pass' | 'Fail'
  equalOpportunity: 'Pass' | 'Fail'
  calibration: 'Pass' | 'Fail'
  overall: 'Pass' | 'Fail' | 'Partial'
}
const RUNS: Run[] = [
  { id: 'BR-1042', at: '2026-07-07 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
  { id: 'BR-1041', at: '2026-07-06 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Fail', calibration: 'Pass', overall: 'Partial' },
  { id: 'BR-1040', at: '2026-07-05 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
  { id: 'BR-1039', at: '2026-07-04 07:00', suite: 'MR-Corpus v1', demographic: 'Fail', equalOpportunity: 'Fail', calibration: 'Pass', overall: 'Fail' },
  { id: 'BR-1038', at: '2026-07-03 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
  { id: 'BR-1037', at: '2026-07-02 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Fail', overall: 'Partial' },
  { id: 'BR-1036', at: '2026-07-01 07:00', suite: 'MR-Corpus v1', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
  { id: 'BR-1035', at: '2026-06-30 07:00', suite: 'Bharat-Bench v3', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
  { id: 'BR-1034', at: '2026-06-29 07:00', suite: 'Bharat-Bench v3', demographic: 'Fail', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Partial' },
  { id: 'BR-1033', at: '2026-06-28 07:00', suite: 'MR-Corpus v1', demographic: 'Pass', equalOpportunity: 'Pass', calibration: 'Pass', overall: 'Pass' },
]

const DEPT_FAIRNESS = [
  { d: 'GAD', v: 88 },
  { d: 'HOME', v: 76 },
  { d: 'HFW', v: 81 },
  { d: 'WCD', v: 62 },
  { d: 'FIN', v: 84 },
  { d: 'REV', v: 79 },
  { d: 'AGR', v: 83 },
  { d: 'UDD', v: 74 },
]

const MITIGATIONS = [
  { k: 'Re-sample rural ULB representation ×2', done: true },
  { k: 'Fine-tune with debiased Marathi corpus', done: true },
  { k: 'Adjust decoding temperature for MR outputs', done: false },
  { k: 'Add reviewer panel for High severity outputs', done: true },
  { k: 'Adopt equal-opportunity thresholding for WCD scheme', done: false },
  { k: 'Publish fairness card v2 for each model release', done: false },
]

function passChip(v: 'Pass' | 'Fail' | 'Partial') {
  const cls =
    v === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
    v === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
    'bg-red-50 text-red-700 border-red-200'
  return <span className={`chip border ${cls}`}>{v}</span>
}

export function BiasDetection() {
  const columns: Column<Run>[] = [
    { key: 'id', header: 'Run', sortable: true },
    { key: 'at', header: 'At', sortable: true },
    { key: 'suite', header: 'Suite', sortable: true },
    { key: 'demographic', header: 'Demographic parity', render: (r) => passChip(r.demographic) },
    { key: 'equalOpportunity', header: 'Equal opportunity', render: (r) => passChip(r.equalOpportunity) },
    { key: 'calibration', header: 'Calibration', render: (r) => passChip(r.calibration) },
    { key: 'overall', header: 'Overall', render: (r) => passChip(r.overall) },
  ]
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

      <div className="mt-6">
        <ChartCard title="Fairness by department" subtitle="Composite fairness score per department" source="Demo">
          <ResponsiveContainer>
            <BarChart data={DEPT_FAIRNESS}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#6A1B9A" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card className="min-w-0">
          <CardHeader title="Test suite runs" subtitle="Last 10 runs · per-fairness-metric pass/fail" right={<SourceBadge source="Demo" />} />
          <DataTable columns={columns} rows={RUNS} searchable={false} compact />
        </Card>

        <Card>
          <CardHeader title="Recommended mitigations" subtitle="Panel-approved" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {MITIGATIONS.map((m) => (
              <li
                key={m.k}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${m.done ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800' : 'border-ink-100 bg-white text-ink-700'}`}
              >
                <CircleCheck className={`h-4 w-4 shrink-0 ${m.done ? 'text-emerald-600' : 'text-ink-300'}`} />
                <span className="min-w-0 flex-1">{m.k}</span>
                <StatusBadge status={m.done ? 'Approved' : 'Under Review'} />
              </li>
            ))}
          </ul>
        </Card>
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
