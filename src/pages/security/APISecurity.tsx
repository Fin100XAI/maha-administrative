import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge, RiskBadge, SeverityBadge } from '@/components/ui/Badges'
import { Cpu, ShieldAlert, Activity, KeyRound, Lock, ShieldCheck, Fingerprint, CheckCircle2, AlertCircle } from 'lucide-react'
import { OWASP_API_TOP10, RATELIMIT_HITS, ANOMALOUS_CALLERS } from '@/data/securitySamples'

const trace = [
  { m: 'D-6', calls: 1240, fail: 12 }, { m: 'D-5', calls: 1310, fail: 8 }, { m: 'D-4', calls: 1180, fail: 22 },
  { m: 'D-3', calls: 1425, fail: 6 }, { m: 'D-2', calls: 1510, fail: 14 }, { m: 'D-1', calls: 1682, fail: 9 }, { m: 'Today', calls: 1780, fail: 5 },
]

const endpoints = [
  { path: '/v1/workspace/chat', p95: 620, err: 0.8, status: 'Approved' },
  { path: '/v1/documents/parse', p95: 940, err: 1.2, status: 'Approved' },
  { path: '/v1/gr/analyze', p95: 720, err: 0.4, status: 'Approved' },
  { path: '/v1/integrations/mahadbt', p95: 1120, err: 3.1, status: 'Under Review' },
  { path: '/v1/integrations/aaple-sarkar', p95: 1240, err: 2.4, status: 'Under Review' },
]

export function APISecurity() {
  return (
    <div>
      <PageHeader
        title="API Security"
        description="API Gateway posture — throughput, failed auth, rate-limits, threats blocked and endpoint health."
        breadcrumb={['Security & AI SOC', 'API Security']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="API Gateway status" value="Healthy" icon={<Cpu className="h-5 w-5" />} delta={0} source="Demo" confidence={96} status={<StatusBadge status="Approved" />} />
        <MetricCard label="API calls (24h)" value="1.78 M" icon={<Activity className="h-5 w-5" />} delta={11.2} source="Demo" confidence={92} />
        <MetricCard label="Failed auth" value={62} icon={<KeyRound className="h-5 w-5" />} delta={-18} source="Demo" confidence={92} />
        <MetricCard label="Threats blocked" value={22} icon={<ShieldAlert className="h-5 w-5" />} delta={-8} source="Demo" confidence={92} />
      </div>

      {/* mTLS / JWT / WAF status tiles */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800"><Lock className="h-4 w-4 text-brand-600" /> mTLS</div>
            <StatusBadge status="Active" />
          </div>
          <div className="mt-1 text-xs text-ink-500">Cert rotation every 30 days · 4/4 mesh peers healthy</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800"><Fingerprint className="h-4 w-4 text-brand-600" /> JWT</div>
            <StatusBadge status="Active" />
          </div>
          <div className="mt-1 text-xs text-ink-500">RS256 · 15-min TTL · 3 kids rotated in last 24h</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-800"><ShieldCheck className="h-4 w-4 text-brand-600" /> WAF</div>
            <StatusBadge status="Active" />
          </div>
          <div className="mt-1 text-xs text-ink-500">OWASP CRS 3.3 · 214 rules · 22 blocks (24h)</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="API calls & failures" subtitle="7-day trend" source="Demo">
          <ResponsiveContainer>
            <LineChart data={trace}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="calls" stroke="#062868" strokeWidth={2.5} />
              <Line type="monotone" dataKey="fail" stroke="#0B57D0" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Endpoint health" right={<SourceBadge source="Demo" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Endpoint', 'p95', 'Error %', 'Status'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {endpoints.map((e) => (
                  <tr key={e.path}>
                    <td className="table-td font-mono text-xs">{e.path}</td>
                    <td className="table-td">{e.p95}ms</td>
                    <td className="table-td">{e.err}%</td>
                    <td className="table-td"><StatusBadge status={e.status as any} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* OWASP API Top-10 coverage + Rate-limit hits + Anomalous callers */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="OWASP API Top-10 coverage"
            subtitle="2023 edition · detection status"
            right={<SourceBadge source="Public-source linked" />}
          />
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {OWASP_API_TOP10.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 px-3 py-2 text-sm">
                <div className="min-w-0">
                  <div className="text-xs font-mono text-ink-500">{o.id}</div>
                  <div className="truncate font-medium text-ink-800">{o.name}</div>
                </div>
                {o.status === 'Covered'
                  ? <span className="chip border bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="h-3 w-3" /> Covered</span>
                  : <span className="chip border bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="h-3 w-3" /> Partial</span>}
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard title="Rate-limit hits" subtitle="Per endpoint · 24h" source="Demo">
          <ResponsiveContainer>
            <BarChart data={RATELIMIT_HITS} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="ep" tick={{ fill: '#64748b', fontSize: 10 }} width={180} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="hits" fill="#0B57D0" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Anomalous callers watchlist"
          subtitle="Elevated request rate, unusual pattern or auth"
          right={<span className="chip border bg-rose-50 text-rose-700 border-rose-200"><ShieldAlert className="h-3 w-3" /> Watchlist</span>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['Caller', 'Rate', 'Anomaly', 'Severity', 'Action'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {ANOMALOUS_CALLERS.map((c) => (
                <tr key={c.caller}>
                  <td className="table-td font-mono text-xs text-ink-800">{c.caller}</td>
                  <td className="table-td">{c.rate}</td>
                  <td className="table-td text-ink-700">{c.anomaly}</td>
                  <td className="table-td"><SeverityBadge level={c.sev} /></td>
                  <td className="table-td"><button className="btn-outline">Slow-mode</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Integration security snapshot" right={<RiskBadge level="Low" />} />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-3 text-sm">
          {[
            'mTLS enforced on inter-service calls',
            'Rate limiting: 100 rps / officer',
            'JWT + short-lived tokens',
            'Origin allow-list active',
            'DPDP purpose header required',
            'Request signing on integrations',
          ].map((s) => <li key={s} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">✓ {s}</li>)}
        </ul>
      </Card>
    </div>
  )
}
