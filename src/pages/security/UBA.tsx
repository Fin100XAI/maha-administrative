import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Activity, LogIn, Download, Moon } from 'lucide-react'
import { SeverityBadge, SourceBadge } from '@/components/ui/Badges'

const heat = [
  { h: '00', v: 4 }, { h: '02', v: 3 }, { h: '04', v: 5 }, { h: '06', v: 12 },
  { h: '08', v: 68 }, { h: '10', v: 92 }, { h: '12', v: 74 }, { h: '14', v: 88 },
  { h: '16', v: 66 }, { h: '18', v: 34 }, { h: '20', v: 22 }, { h: '22', v: 10 },
]

const risky = [
  { o: 'MPSC-2020-1281', dept: 'REV', score: 68, sev: 'Medium' as const, reason: 'Bulk file downloads after 22:00' },
  { o: 'IAS-2019-MH-0410', dept: 'HOME', score: 74, sev: 'High' as const, reason: 'Geo-anomaly + 3 failed MFA' },
  { o: 'IAS-2010-MH-0082', dept: 'HFW', score: 41, sev: 'Low' as const, reason: 'Unusual print volume' },
  { o: 'MPSC-2017-0721', dept: 'AGR', score: 55, sev: 'Medium' as const, reason: 'Weekend document access' },
]

export function UBA() {
  return (
    <div>
      <PageHeader
        title="User Behaviour Analytics"
        description="Detect abnormal officer activity — login anomalies, document access spikes, bulk downloads, after-hours access."
        breadcrumb={['Security & AI SOC', 'UBA']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Login anomalies" value={6} icon={<LogIn className="h-5 w-5" />} delta={-25} source="Demo" confidence={92} />
        <MetricCard label="Document access spikes" value={4} icon={<Activity className="h-5 w-5" />} delta={-20} source="Demo" confidence={90} />
        <MetricCard label="Bulk download risk" value={2} icon={<Download className="h-5 w-5" />} delta={-40} source="Demo" confidence={88} />
        <MetricCard label="After-hours access" value={9} icon={<Moon className="h-5 w-5" />} delta={-12} source="Demo" confidence={90} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard title="Activity distribution across day" subtitle="Normal window highlighted 08–18h" source="Demo">
          <ResponsiveContainer>
            <AreaChart data={heat}>
              <defs><linearGradient id="gU" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4A148C" stopOpacity={0.45}/><stop offset="100%" stopColor="#4A148C" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#4A148C" fill="url(#gU)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Officer risk scores" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {risky.map((r) => (
              <li key={r.o} className="rounded-md border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink-800">{r.o}</div>
                    <div className="text-xs text-ink-500">{r.dept} · {r.reason}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge level={r.sev} />
                    <span className="text-lg font-semibold text-brand-600">{r.score}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
