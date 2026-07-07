import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import {
  ShieldAlert, ShieldCheck, Radar, Radio, Users, Lock, Fingerprint, Cpu, Activity, AlertTriangle,
} from 'lucide-react'
import { SourceBadge, SeverityBadge, StatusBadge } from '@/components/ui/Badges'
import {
  SIEM_FEED, ESCALATION_MATRIX, MITRE_TACTICS, MITRE_COVERAGE, WEEKLY_THREATS,
} from '@/data/securitySamples'
import { CoverageCell } from './_components/HeatCell'

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

const SEV_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const

export function SecurityOps() {
  const [feedSev, setFeedSev] = useState<(typeof SEV_FILTERS)[number]>('All')
  const feed = useMemo(
    () => (feedSev === 'All' ? SIEM_FEED : SIEM_FEED.filter((e) => e.sev === feedSev)),
    [feedSev],
  )
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

      {/* Live SIEM feed + threat charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader
            title="Live SIEM feed"
            subtitle="Rolling events · dept-wide"
            right={<div className="flex items-center gap-2">
              <select className="input h-8 w-auto py-1 text-xs" value={feedSev} onChange={(e) => setFeedSev(e.target.value as any)} aria-label="Filter feed by severity">
                {SEV_FILTERS.map((s) => <option key={s}>{s === 'All' ? 'All severities' : s}</option>)}
              </select>
              <span className="chip border bg-emerald-50 text-emerald-700 border-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/> Streaming</span>
            </div>}
          />
          <ul className="space-y-1.5 text-sm">
            {feed.map((e) => (
              <li key={e.t + e.msg} className="flex items-start gap-2 rounded-md border border-ink-100 px-2.5 py-1.5">
                <span className="mt-0.5 shrink-0 rounded bg-ink-50 px-1.5 py-0.5 font-mono text-[10px] text-ink-600">{e.t}</span>
                <span className="mt-0.5 shrink-0 rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand-700">{e.src}</span>
                <span className="min-w-0 flex-1 truncate text-ink-800">{e.msg}</span>
                <SeverityBadge level={e.sev} />
              </li>
            ))}
            {feed.length === 0 && (
              <li className="rounded-md border border-dashed border-ink-200 px-3 py-4 text-center text-xs text-ink-500">
                No {feedSev.toLowerCase()} events in the current window.
              </li>
            )}
          </ul>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Threats over time" subtitle="Rolling 24h" source="Demo">
            <ResponsiveContainer>
              <AreaChart data={thr}>
                <defs><linearGradient id="g0" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0B57D0" stopOpacity={0.5}/><stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02}/></linearGradient></defs>
                <CartesianGrid vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#0B57D0" fill="url(#g0)" />
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
        </div>
      </div>

      {/* Weekly threats vs blocks + UBA */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Weekly threats vs blocks" subtitle="7-day rolling" source="Demo">
          <ResponsiveContainer>
            <BarChart data={WEEKLY_THREATS}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="threats" name="Threats" fill="#0B57D0" radius={[6,6,0,0]} />
              <Bar dataKey="blocks"  name="Blocks"  fill="#4285F4" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User behaviour anomalies" source="Demo">
          <ResponsiveContainer>
            <BarChart data={uba}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="s" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#4285F4" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="API security events" source="Demo">
          <ResponsiveContainer>
            <BarChart data={api}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#0B57D0" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* MITRE coverage heatmap + Escalation matrix + prompt distribution */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader
            title="MITRE ATT&CK — tactic coverage"
            subtitle="Illustrative mapping · 0 = none, 4 = strong"
            right={<SourceBadge source="Demo" />}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {MITRE_TACTICS.map((tac, i) => (
              <CoverageCell key={tac} label={tac} level={MITRE_COVERAGE[i] ?? 0} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
            <span>Levels:</span>
            {[0,1,2,3,4].map((l) => (
              <span key={l} className="inline-flex items-center gap-1">
                <span className={`inline-block h-3 w-3 rounded-sm ${l===0?'bg-ink-100':l===1?'bg-brand-100':l===2?'bg-brand-200':l===3?'bg-brand-300':'bg-brand-gradient'}`}/> {l}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Incident escalation matrix"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><AlertTriangle className="h-3 w-3" /> SLA</span>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>{['Sev', 'Description', 'Ack', 'Contain', 'Owner'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {ESCALATION_MATRIX.map((r) => (
                  <tr key={r.sev}>
                    <td className="table-td font-semibold text-ink-800">{r.sev}</td>
                    <td className="table-td text-ink-700">{r.desc}</td>
                    <td className="table-td">{r.ack}</td>
                    <td className="table-td">{r.contain}</td>
                    <td className="table-td text-ink-700">{r.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Prompt injection attempts" source="Demo">
          <ResponsiveContainer>
            <BarChart data={prm}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="v" fill="#062868" radius={[6,6,0,0]} />
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
        <Card>
          <CardHeader title="Posture summary" right={<StatusBadge status="Approved" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li className="flex items-center gap-2"><Activity className="h-4 w-4 text-brand-600" /> 24×7 AI SOC staffing · 5 analysts on rotation</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Prompt-FW, DLP, WAF, EDR, ZTNA integrated</li>
            <li className="flex items-center gap-2"><Cpu className="h-4 w-4 text-brand-600" /> Model attestation + drift gating enabled</li>
            <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand-600" /> AES-256 at rest, TLS 1.3 in transit, mTLS internal</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
