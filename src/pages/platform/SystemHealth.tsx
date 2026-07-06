import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import {
  Activity,
  Cpu,
  HardDrive,
  Server,
  HeartPulse,
  Wifi,
  Archive,
  Target,
  Zap,
  Layers,
} from 'lucide-react'
import { SERVICE_BOARD, SLO_TRACK, QUEUE_TREND, AUTOSCALE_EVENTS } from '@/data/platformSamples'

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

const STATE_STYLES: Record<string, { dot: string; text: string; badge: string }> = {
  Green: { dot: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 border-emerald-200' },
  Amber: { dot: 'bg-amber-500',   text: 'text-amber-700',   badge: 'bg-amber-50 border-amber-200' },
  Red:   { dot: 'bg-red-500',     text: 'text-red-700',     badge: 'bg-red-50 border-red-200' },
}

export function SystemHealth() {
  return (
    <div>
      <PageHeader
        title="System Health"
        description="Uptime, latency, queues, resource usage, integration and backup status for the MAII platform."
        breadcrumb={['Platform Admin', 'System Health']}
        source="Demo"
        eyebrow="Live posture"
        icon={<HeartPulse className="h-5 w-5" />}
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

      {/* Component-level board */}
      <Card className="mt-6">
        <CardHeader
          title="Component-level status board"
          subtitle="12 core services · green / amber / red."
          right={<div className="flex items-center gap-2"><Layers className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SERVICE_BOARD.map((s, idx) => {
            const st = STATE_STYLES[s.state]
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={'rounded-xl border p-3 ' + st.badge}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={'h-2 w-2 rounded-full ' + st.dot} />
                    <span className="truncate font-medium text-ink-900">{s.name}</span>
                  </div>
                  <span className={'text-xs font-semibold ' + st.text}>{s.state}</span>
                </div>
                <div className="mt-1 truncate text-xs text-ink-600" title={s.note}>{s.note}</div>
              </motion.div>
            )
          })}
        </div>
      </Card>

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

      {/* SLO tracker + Autoscale log */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.1fr]">
        <Card>
          <CardHeader
            title="SLO tracker · ~30-day burn"
            subtitle="Observed vs target · error-budget burn %."
            right={<div className="flex items-center gap-2"><Target className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {SLO_TRACK.map((s) => {
              const hot = s.burnPct >= 60
              const warm = s.burnPct >= 30
              return (
                <li key={s.name} className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-ink-800">{s.name}</span>
                    <span className="text-xs text-ink-500">Target {s.target}% · Obs {s.observed}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="h-2 flex-1 rounded bg-ink-100">
                      <div
                        className={'h-full rounded ' + (hot ? 'bg-red-500' : warm ? 'bg-amber-500' : 'bg-emerald-500')}
                        style={{ width: `${s.burnPct}%` }}
                      />
                    </div>
                    <span className={'w-14 shrink-0 text-right font-medium ' + (hot ? 'text-red-700' : warm ? 'text-amber-700' : 'text-emerald-700')}>
                      {s.burnPct}% burn
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Auto-scaling events"
            subtitle="Last 8 scale actions across services."
            right={<div className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ol className="space-y-2 text-sm">
            {AUTOSCALE_EVENTS.map((e) => (
              <li key={e.ts + e.service} className="rounded-md border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-ink-500">{e.ts}</span>
                  <span className={
                    'chip border ' + (e.action === 'Scale-out'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200')
                  }>{e.action}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-xs text-ink-800">{e.service}</span>
                  <span className="text-ink-600">·</span>
                  <span className="truncate text-ink-700" title={e.reason}>{e.reason}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Queue backlog trend */}
      <div className="mt-6">
      <ChartCard
        title="Queue-backlog trend"
        subtitle="Backlog depth per queue over the last 24 hours."
        source="Demo"
        height={280}
      >
        <ResponsiveContainer>
          <AreaChart data={QUEUE_TREND}>
            <CartesianGrid vertical={false} stroke="#eef2f7" />
            <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="ingest" name="Ingest" stackId="1" stroke="#D81B60" fill="#D81B60" fillOpacity={0.3} />
            <Area type="monotone" dataKey="dlp"    name="DLP"    stackId="1" stroke="#4A148C" fill="#4A148C" fillOpacity={0.3} />
            <Area type="monotone" dataKey="embed"  name="Embed"  stackId="1" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.3} />
            <Area type="monotone" dataKey="audit"  name="Audit"  stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </div>
  )
}
