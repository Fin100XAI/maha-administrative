import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import {
  Fingerprint, Smartphone, Globe, KeyRound, ClipboardCheck, UserCheck, MapPin, Activity, Lock, ArrowRight, ShieldX,
} from 'lucide-react'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ResponsiveContainer, RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { ZT_PIPELINE, DEVICE_POSTURE, SESSION_RISK_HIST, POLICY_DENIALS } from '@/data/securitySamples'

const dimensions = [
  { d: 'Device trust', v: 92 },
  { d: 'User trust', v: 88 },
  { d: 'Location anomaly', v: 84 },
  { d: 'MFA status', v: 96 },
  { d: 'Least privilege', v: 82 },
  { d: 'Session risk', v: 78 },
  { d: 'Privileged access', v: 90 },
]

const PIPE_ICONS = [UserCheck, Smartphone, MapPin, Activity, Lock]

export function ZeroTrust() {
  return (
    <div>
      <PageHeader
        title="Zero Trust"
        description="Continuous verification across devices, users, locations, sessions and privileged operations."
        breadcrumb={['Security & AI SOC', 'Zero Trust']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Device trust" value="92%" icon={<Smartphone className="h-5 w-5" />} delta={2.4} source="Demo" confidence={92} />
        <MetricCard label="MFA coverage" value="96%" icon={<KeyRound className="h-5 w-5" />} delta={1.2} source="Demo" confidence={94} />
        <MetricCard label="Location anomalies (24h)" value={3} icon={<Globe className="h-5 w-5" />} delta={-25} source="Demo" confidence={90} />
        <MetricCard label="Session risk (median)" value="Low" icon={<Fingerprint className="h-5 w-5" />} delta={0} source="Demo" confidence={92} />
      </div>

      {/* Continuous verification pipeline */}
      <Card className="mt-6">
        <CardHeader
          title="Continuous verification pipeline"
          subtitle="Every request re-validated across all 5 stages"
          right={<SourceBadge source="Demo" />}
        />
        <div className="flex flex-wrap items-stretch gap-3">
          {ZT_PIPELINE.map((s, i) => {
            const Icon = PIPE_ICONS[i] ?? UserCheck
            return (
              <div key={s.k} className="flex flex-1 min-w-[140px] items-center gap-2">
                <div className="flex-1 rounded-xl border border-ink-100 bg-brand-soft/40 p-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-brand-600" />
                    <span className="text-sm font-semibold text-ink-800">{s.k}</span>
                  </div>
                  <div className="mt-1 text-xs text-ink-500">{s.desc}</div>
                </div>
                {i < ZT_PIPELINE.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-ink-300" />}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader title="Zero Trust dimensions" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-3 text-sm">
            {dimensions.map((d) => (
              <li key={d.d}>
                <div className="mb-1 flex justify-between">
                  <span className="text-ink-800">{d.d}</span>
                  <span className="font-medium text-ink-800">{d.v}%</span>
                </div>
                <div className="h-2 w-full rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${d.v}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard title="Zero Trust Score" subtitle="Composite index" source="Demo">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ v: 88, fill: '#0B57D0' }]} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="v" cornerRadius={30} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Device posture grid + session risk histogram */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader
            title="Device posture"
            subtitle="Managed + BYOD devices"
            right={<SourceBadge source="Demo" />}
          />
          <div className="grid grid-cols-3 gap-3">
            {DEVICE_POSTURE.map((d) => {
              const tone =
                d.tone === 'ok'   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                d.tone === 'warn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    'bg-red-50 text-red-700 border-red-200'
              return (
                <div key={d.s} className={`rounded-xl border p-3 ${tone}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{d.s}</div>
                  <div className="mt-1 text-2xl font-semibold">{d.count.toLocaleString()}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-ink-500">Warning = missing patches or non-managed profile; Blocked = failed attestation.</div>
        </Card>

        <ChartCard title="Session risk score histogram" subtitle="10-bucket distribution · 24h" source="Demo">
          <ResponsiveContainer>
            <BarChart data={SESSION_RISK_HIST}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="bucket" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="n" name="Sessions" fill="#4285F4" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mt-6">
        <CardHeader title="Privileged access — active sessions" right={<StatusBadge status="Under Review" />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr>
              {['Officer', 'Role', 'Dept', 'Device', 'Location', 'Session risk', 'Actions'].map((h) => <th key={h} className="table-th">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                { o: 'Rajesh Mahajan', r: 'Principal Secretary', d: 'DIT', dev: 'Managed laptop · Windows', l: 'Mumbai', s: 'Low' as const },
                { o: 'Nitin Kareer', r: 'Chief Secretary', d: 'GAD', dev: 'Managed laptop · macOS', l: 'Mumbai', s: 'Low' as const },
                { o: 'Ashutosh Salil', r: 'Municipal Commissioner', d: 'UDD', dev: 'Managed tablet · iPadOS', l: 'Nashik', s: 'Medium' as const },
                { o: 'Praveen Darade', r: 'District Collector', d: 'REV', dev: 'BYOD · Android', l: 'Aurangabad', s: 'Medium' as const },
              ].map((r) => (
                <tr key={r.o}>
                  <td className="table-td font-medium text-ink-800">{r.o}</td>
                  <td className="table-td">{r.r}</td>
                  <td className="table-td">{r.d}</td>
                  <td className="table-td">{r.dev}</td>
                  <td className="table-td">{r.l}</td>
                  <td className="table-td"><RiskBadge level={r.s} /></td>
                  <td className="table-td"><button className="btn-outline"><ClipboardCheck className="h-4 w-4" /> Verify</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent policy denials */}
      <Card className="mt-6">
        <CardHeader
          title="Recent policy denials"
          subtitle="Access requests that failed conditional-access checks"
          right={<span className="chip border bg-red-50 text-red-700 border-red-200"><ShieldX className="h-3 w-3" /> Denied</span>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['Time', 'Subject', 'Policy', 'Reason'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {POLICY_DENIALS.map((d) => (
                <tr key={d.t + d.who}>
                  <td className="table-td font-mono text-xs">{d.t}</td>
                  <td className="table-td font-medium text-ink-800">{d.who}</td>
                  <td className="table-td text-ink-700">{d.policy}</td>
                  <td className="table-td text-ink-700">{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
