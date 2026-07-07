import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  BarChart, Bar, Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { Activity, LogIn, Download, Moon, Users } from 'lucide-react'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { PEER_COMPARISON, RISKY_PATTERNS, INVESTIGATIONS, UBA_HEATMAP } from '@/data/securitySamples'
import { HourCell } from './_components/HeatCell'

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
              <defs><linearGradient id="gU" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#062868" stopOpacity={0.45}/><stop offset="100%" stopColor="#062868" stopOpacity={0.02}/></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="h" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#062868" fill="url(#gU)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Officer risk scores" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {risky.map((r) => (
              <li key={r.o} className="rounded-md border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800 truncate">{r.o}</div>
                    <div className="text-xs text-ink-500 truncate">{r.dept} · {r.reason}</div>
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

      {/* Peer group comparison + Risky patterns catalog */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard
          title="Peer group comparison"
          subtitle="Officer vs peer-department baseline · 24h"
          source="Demo"
        >
          <ResponsiveContainer>
            <BarChart data={PEER_COMPARISON}>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="officer" name="Officer" fill="#0B57D0" radius={[6,6,0,0]} />
              <Bar dataKey="peer"    name="Peer baseline" fill="#94a3b8" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Risky patterns detected"
            subtitle="Catalog · count & severity"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><Users className="h-3 w-3" /> Catalog</span>}
          />
          <ul className="space-y-2">
            {RISKY_PATTERNS.map((p) => (
              <li key={p.p} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-ink-800">{p.p}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <SeverityBadge level={p.sev} />
                  <span className="font-semibold text-brand-600">{p.count}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Investigations table */}
      <Card className="mt-6">
        <CardHeader
          title="Investigations"
          subtitle="Open & closed cases · assigned analyst"
          right={<StatusBadge status="Open" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['Case', 'Target', 'Pattern', 'Status', 'Analyst'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {INVESTIGATIONS.map((i) => (
                <tr key={i.id}>
                  <td className="table-td font-mono text-xs">{i.id}</td>
                  <td className="table-td font-medium text-ink-800">{i.target}</td>
                  <td className="table-td text-ink-700">{i.pattern}</td>
                  <td className="table-td"><StatusBadge status={i.status} /></td>
                  <td className="table-td">
                    <span className="inline-flex items-center gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-[10px] font-semibold text-white">{i.analyst}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Per-hour heatmap */}
      <Card className="mt-6">
        <CardHeader
          title="Per-hour activity heatmap"
          subtitle="Prompt volume · 7 days × 24 hours"
          right={<SourceBadge source="Demo" />}
        />
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="mb-1 grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-0.5 text-[10px] text-ink-500">
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-center">{h.toString().padStart(2, '0')}</div>
              ))}
            </div>
            {UBA_HEATMAP.map((row) => (
              <div key={row.day} className="mb-0.5 grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-0.5">
                <div className="flex items-center text-[11px] font-medium text-ink-700">{row.day}</div>
                {row.row.map((v, i) => <HourCell key={i} v={v} />)}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-[11px] text-ink-500">Colour intensity ∝ activity volume; cells outside 08–18 window flag as after-hours.</div>
      </Card>
    </div>
  )
}
