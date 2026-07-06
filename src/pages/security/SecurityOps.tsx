import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ShieldAlert, ShieldCheck, Radar, Radio, Users, Lock, Fingerprint, Cpu } from 'lucide-react'
import { SourceBadge, SeverityBadge, StatusBadge } from '@/components/ui/Badges'

const thr = [
  { t: '00:00', v: 12 }, { t: '02:00', v: 8 }, { t: '04:00', v: 14 }, { t: '06:00', v: 22 },
  { t: '08:00', v: 34 }, { t: '10:00', v: 41 }, { t: '12:00', v: 30 }, { t: '14:00', v: 28 },
  { t: '16:00', v: 18 }, { t: '18:00', v: 12 }, { t: '20:00', v: 22 }, { t: '22:00', v: 14 },
]

const sev = [
  { name: 'Critical', value: 3 }, { name: 'High', value: 12 }, { name: 'Medium', value: 28 }, { name: 'Low', value: 20 },
]

const uba = [
  { s: 'Login anomaly', v: 6 }, { s: 'Doc access spike', v: 4 }, { s: 'Bulk download', v: 2 }, { s: 'After-hours', v: 9 }, { s: 'Geo-anomaly', v: 3 },
]

const api = [
  { t: 'D-6', v: 2 }, { t: 'D-5', v: 5 }, { t: 'D-4', v: 3 }, { t: 'D-3', v: 8 }, { t: 'D-2', v: 6 }, { t: 'D-1', v: 4 }, { t: 'Today', v: 3 },
]

const prm = [
  { t: 'Direct', v: 12 }, { t: 'Encoded', v: 8 }, { t: 'Chained', v: 4 }, { t: 'Jailbreak', v: 6 },
]

const COLORS = ['#DC2626', '#EA580C', '#D97706', '#059669']

export function SecurityOps() {
  return (
    <div>
      <PageHeader
        title="Security Operations"
        description="Consolidated security posture for MAII — threats, prompt attacks, DLP, API abuse, user anomalies and Zero Trust score."
        breadcrumb={['Security & AI SOC', 'Security Operations']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active Threats" value={5} icon={<ShieldAlert className="h-5 w-5"/>} delta={-40} source="Demo" confidence={92} />
        <MetricCard label="Blocked Prompt Attacks (24h)" value={30} icon={<Radar className="h-5 w-5"/>} delta={22} source="Demo" confidence={90} />
        <MetricCard label="Data Leakage Attempts" value={7} icon={<Radio className="h-5 w-5"/>} delta={-18} source="Demo" confidence={88} />
        <MetricCard label="API Threats" value={3} icon={<Cpu className="h-5 w-5"/>} delta={-25} source="Demo" confidence={86} />
        <MetricCard label="Suspicious Users" value={4} icon={<Users className="h-5 w-5"/>} delta={0} source="Demo" confidence={82} />
        <MetricCard label="Privileged Access Events" value={62} icon={<Fingerprint className="h-5 w-5"/>} delta={8} source="Demo" confidence={90} />
        <MetricCard label="Encryption Status" value="AES-256" icon={<Lock className="h-5 w-5"/>} delta={0} source="Demo" confidence={98} status={<StatusBadge status="Approved" />} />
        <MetricCard label="Zero Trust Score" value="88/100" icon={<ShieldCheck className="h-5 w-5"/>} delta={2.4} source="Demo" confidence={92} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Threats over time" subtitle="Rolling 24h" source="Demo">
          <ResponsiveContainer>
            <AreaChart data={thr}>
              <defs><linearGradient id="g0" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#D81B60" stopOpacity={0.5}/><stop offset="100%" stopColor="#D81B60" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#D81B60" fill="url(#g0)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Severity distribution" source="Demo">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={sev} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {sev.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User behaviour anomalies" source="Demo">
          <ResponsiveContainer>
            <BarChart data={uba}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="s" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#6A1B9A" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="API security events" source="Demo">
          <ResponsiveContainer>
            <BarChart data={api}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#D81B60" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Prompt injection attempts" source="Demo">
          <ResponsiveContainer>
            <BarChart data={prm}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#4A148C" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card>
          <CardHeader title="Latest incidents" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2 text-sm">
            {[
              { t: 'Prompt injection via RTI upload', s: 'High' as const },
              { t: 'PII exposure in Excel upload', s: 'Medium' as const },
              { t: 'After-hours access — geo-anomaly', s: 'Critical' as const },
              { t: 'Excessive prompt volume', s: 'Medium' as const },
            ].map((i) => (
              <li key={i.t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                <span className="text-ink-800">{i.t}</span>
                <SeverityBadge level={i.s} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
