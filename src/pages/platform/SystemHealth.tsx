import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { Activity, Cpu, HardDrive, Server, HeartPulse, Wifi, Archive } from 'lucide-react'

const trace = [
  { t: '00', api: 62, model: 480 }, { t: '02', api: 58, model: 470 }, { t: '04', api: 54, model: 460 },
  { t: '06', api: 88, model: 520 }, { t: '08', api: 110, model: 580 }, { t: '10', api: 132, model: 640 },
  { t: '12', api: 128, model: 620 }, { t: '14', api: 118, model: 600 }, { t: '16', api: 96, model: 560 },
  { t: '18', api: 82, model: 520 }, { t: '20', api: 74, model: 500 }, { t: '22', api: 66, model: 490 },
]

const integ = [
  { name: 'e-Office', v: 92 },
  { name: 'RTI', v: 88 },
  { name: 'DMS', v: 98 },
  { name: 'Email/SMS', v: 99 },
  { name: 'API Gateway', v: 99 },
]

export function SystemHealth() {
  return (
    <div>
      <PageHeader
        title="System Health"
        description="Uptime, latency, queues, resource usage, integration and backup status for the MAII platform."
        breadcrumb={['Platform Admin', 'System Health']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Application uptime (30d)" value="99.987%" icon={<HeartPulse className="h-5 w-5" />} delta={0.02} source="Demo" confidence={98} />
        <MetricCard label="API p95 latency" value="620ms" icon={<Activity className="h-5 w-5" />} delta={-8} source="Demo" confidence={92} />
        <MetricCard label="Model p95 latency" value="720ms" icon={<Cpu className="h-5 w-5" />} delta={-4} source="Demo" confidence={90} />
        <MetricCard label="Queue depth" value="14" icon={<Server className="h-5 w-5" />} delta={-22} source="Demo" confidence={90} />
        <MetricCard label="Storage used" value="72%" icon={<HardDrive className="h-5 w-5" />} delta={3} source="Demo" confidence={94} />
        <MetricCard label="CPU / Mem" value="42% / 58%" icon={<Cpu className="h-5 w-5" />} delta={0} source="Demo" confidence={94} />
        <MetricCard label="Error rate" value="0.28%" icon={<Wifi className="h-5 w-5" />} delta={-14} source="Demo" confidence={92} />
        <MetricCard label="Backup status" value="Green" icon={<Archive className="h-5 w-5" />} delta={0} source="Demo" confidence={98} status={<StatusBadge status="Approved" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard title="Latency across the day" subtitle="API vs Model latency (ms)" source="Demo">
          <ResponsiveContainer>
            <LineChart data={trace}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line dataKey="api" stroke="#D81B60" strokeWidth={2.5} />
              <Line dataKey="model" stroke="#4A148C" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Integration health" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2 text-sm">
            {integ.map((i) => (
              <li key={i.name}>
                <div className="mb-1 flex justify-between"><span className="text-ink-800">{i.name}</span><span className="font-medium">{i.v}%</span></div>
                <div className="h-1.5 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${i.v}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
