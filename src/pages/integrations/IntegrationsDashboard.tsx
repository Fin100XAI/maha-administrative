import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { SourceBadge, RiskBadge, StatusBadge } from '@/components/ui/Badges'
import { IntegrationCard } from '@/components/panels/IntegrationCard'
import { INTEGRATIONS } from '@/data/integrations'
import {
  CONNECTOR_ROADMAP,
  CONNECTOR_ERRORS,
  CONNECTOR_TRAFFIC_7D,
  CONNECTOR_SLA,
} from '@/data/platformSamples'
import { Network, Wifi, ShieldCheck, Clock, Route, AlertOctagon, Activity, Gauge } from 'lucide-react'

const CATEGORIES = ['All', 'Workflow', 'Citizen', 'HR', 'Welfare', 'Communication', 'Storage', 'Platform'] as const
type Cat = typeof CATEGORIES[number]

const STAGE_ORDER: Record<string, number> = {
  Discovery: 0,
  MoU: 1,
  Build: 2,
  VAPT: 3,
  Pilot: 4,
  Live: 5,
}
const STAGE_COLORS: Record<string, string> = {
  Discovery: 'bg-ink-100 text-ink-700',
  MoU: 'bg-brand-50 text-brand-700',
  Build: 'bg-sky-50 text-sky-700',
  VAPT: 'bg-amber-50 text-amber-700',
  Pilot: 'bg-orange-50 text-orange-700',
  Live: 'bg-emerald-50 text-emerald-700',
}

export function IntegrationsDashboard() {
  const [cat, setCat] = useState<Cat>('All')

  const filtered = useMemo(
    () => (cat === 'All' ? INTEGRATIONS : INTEGRATIONS.filter((i) => i.category === cat)),
    [cat],
  )
  const connected = INTEGRATIONS.filter((i) => i.status === 'Connected').length
  const pending = INTEGRATIONS.filter((i) => /pending|required|development/.test(i.status)).length

  return (
    <div>
      <PageHeader
        title="Integrations Dashboard"
        description="Connectors to Government of Maharashtra systems and infrastructure. Data-source status is honest — nothing pretends to be live."
        breadcrumb={['Integrations', 'Dashboard']}
        source="Public-source linked"
        eyebrow="Connector estate"
        icon={<Network className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Total connectors" value={INTEGRATIONS.length} icon={<Network className="h-5 w-5" />} delta={0} source="Public-source linked" confidence={94} />
        <MetricCard label="Connected" value={connected} icon={<Wifi className="h-5 w-5" />} delta={12} source="Public-source linked" confidence={92} />
        <MetricCard label="Pending / required" value={pending} icon={<Clock className="h-5 w-5" />} delta={-8} source="Public-source linked" confidence={90} />
        <MetricCard label="Avg. security rating" value="A" icon={<ShieldCheck className="h-5 w-5" />} delta={0} source="Public-source linked" confidence={90} />
      </div>

      {/* Category filter chip strip */}
      <Card className="mt-6">
        <CardHeader
          title="Filter by category"
          subtitle="Narrow the estate to a single connector family."
          right={<SourceBadge source="Public-source linked" />}
        />
        <div className="-mx-1 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const count = c === 'All' ? INTEGRATIONS.length : INTEGRATIONS.filter((i) => i.category === c).length
            const active = c === cat
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={
                  'chip border transition-all ' +
                  (active
                    ? 'bg-brand-gradient text-white border-transparent shadow'
                    : 'bg-white text-ink-700 border-ink-200 hover:border-brand-300 hover:text-brand-700')
                }
              >
                {c}
                <span className={'ml-1 rounded-full px-1.5 py-0.5 text-[10px] ' + (active ? 'bg-white/25' : 'bg-ink-100 text-ink-600')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Connector grid (filtered) */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((i, idx) => (
          <motion.div
            key={i.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.25 }}
          >
            <IntegrationCard i={i} />
          </motion.div>
        ))}
      </div>

      {/* Roadmap + Error log */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Connector readiness roadmap"
            subtitle="ETA and stage per connector — Discovery → MoU → Build → VAPT → Pilot → Live."
            right={<div className="flex items-center gap-2"><Route className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {[...CONNECTOR_ROADMAP].sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage]).map((r) => {
              const pct = ((STAGE_ORDER[r.stage] + 1) / 6) * 100
              return (
                <li key={r.slug} className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="truncate font-medium text-ink-800">{r.name}</span>
                      <span className={'chip border-transparent ' + STAGE_COLORS[r.stage]}>{r.stage}</span>
                    </div>
                    <span className="text-xs text-ink-500">ETA · {r.eta}</span>
                  </div>
                  <div className="h-1.5 rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Connection error log"
            subtitle="Last 8 events across the connector estate."
            right={<div className="flex items-center gap-2"><AlertOctagon className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {CONNECTOR_ERRORS.map((e) => (
              <li key={e.ts + e.connector} className="rounded-md border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-ink-500">{e.ts}</span>
                  <RiskBadge level={e.severity} />
                </div>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-medium text-ink-800">{e.connector}</span>
                  <span className="text-ink-700">·</span>
                  <span className="truncate text-ink-700" title={e.error}>{e.error}</span>
                </div>
                <div className="mt-1 text-xs text-ink-500">Action taken: {e.action}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Traffic + SLA */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard
          title="Traffic between connectors"
          subtitle="7-day per-connector API calls."
          source="Demo"
          right={<Activity className="h-4 w-4 text-brand-500" />}
        >
          <ResponsiveContainer>
            <LineChart data={CONNECTOR_TRAFFIC_7D}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="gateway" name="API Gateway" stroke="#0B57D0" strokeWidth={2.5} dot={false} />
              <Line dataKey="sms"     name="SMS"          stroke="#4285F4" strokeWidth={2} dot={false} />
              <Line dataKey="email"   name="Email"        stroke="#EA4335" strokeWidth={2} dot={false} />
              <Line dataKey="dms"     name="DMS"          stroke="#FBBC05" strokeWidth={2} dot={false} />
              <Line dataKey="eOffice" name="e-Office"     stroke="#34A853" strokeWidth={2} dot={false} />
              <Line dataKey="rti"     name="RTI"          stroke="#062868" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Per-connector uptime SLA"
            subtitle="Observed vs contracted uptime, last 30 days."
            right={<div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {CONNECTOR_SLA.map((s) => {
              const hit = s.observed >= s.slaTarget
              return (
                <li key={s.slug} className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="truncate font-medium text-ink-800">{s.name}</span>
                    <StatusBadge status={hit ? 'Approved' : 'Under Review'} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ink-600">
                    <span>Target {s.slaTarget}%</span>
                    <span className={hit ? 'text-emerald-700' : 'text-amber-700'}>Observed {s.observed}%</span>
                    <span className="ml-auto text-ink-500">{s.incidents30d} incidents</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-ink-100">
                    <div
                      className={'h-full rounded ' + (hit ? 'bg-emerald-500' : 'bg-amber-500')}
                      style={{ width: `${Math.min(s.observed, 100)}%` }}
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
