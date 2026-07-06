import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { RiskBadge, SourceBadge, StatusBadge, ConfidenceBadge } from '@/components/ui/Badges'
import { Eye, Quote, AlertTriangle, ClipboardCheck } from 'lucide-react'

const dist = [
  { c: '50-59', v: 4 }, { c: '60-69', v: 18 }, { c: '70-79', v: 62 },
  { c: '80-89', v: 148 }, { c: '90-100', v: 220 },
]

const HALL = [
  { id: 'H-1042', title: 'Note draft cited GR-2019-URD-098 which does not exist', dept: 'UDD', by: 'MAII Fact-Checker', sev: 'High' as const, status: 'Investigating' as const },
  { id: 'H-1039', title: 'RTI reply referenced Section 7 instead of Section 6(1)', dept: 'GAD', by: 'Human reviewer', sev: 'Medium' as const, status: 'Resolved' as const },
  { id: 'H-1035', title: 'Cabinet note distiller invented budget figure', dept: 'FIN', by: 'MAII Fact-Checker', sev: 'High' as const, status: 'Resolved' as const },
  { id: 'H-1031', title: 'Marathi advisory dropped mandatory clause', dept: 'HFW', by: 'Human reviewer', sev: 'Medium' as const, status: 'Resolved' as const },
]

export function HallucinationMonitoring() {
  return (
    <div>
      <PageHeader
        title="Hallucination Monitoring"
        description="Detect unsupported claims, missing citations, and human-verified corrections."
        breadcrumb={['Governance', 'Hallucination Monitoring']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Unsupported claim alerts" value={9} icon={<AlertTriangle className="h-5 w-5" />} delta={-18} source="Demo" confidence={86} />
        <MetricCard label="Missing citation alerts" value={12} icon={<Quote className="h-5 w-5" />} delta={-11} source="Demo" confidence={82} />
        <MetricCard label="Fact-check auto-pass" value="88%" icon={<ClipboardCheck className="h-5 w-5" />} delta={2.4} source="Demo" confidence={90} />
        <MetricCard label="High-risk responses (24h)" value={3} icon={<Eye className="h-5 w-5" />} delta={-33} source="Demo" confidence={88} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Confidence score distribution" subtitle="Across 452 AI responses (last 24h)" source="Demo">
          <ResponsiveContainer>
            <AreaChart data={dist}>
              <defs>
                <linearGradient id="gConf" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#D81B60" stopOpacity={0.5}/><stop offset="100%" stopColor="#D81B60" stopOpacity={0.02}/></linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="c" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#D81B60" fill="url(#gConf)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Human correction log" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {HALL.map((h) => (
              <li key={h.id} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{h.title}</div>
                    <div className="text-xs text-ink-500">{h.id} · {h.dept} · reported by {h.by}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <RiskBadge level={h.sev} />
                    <StatusBadge status={h.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Recent high-risk response" subtitle="Blocked before display" right={<div className="flex gap-2"><ConfidenceBadge score={54} /><RiskBadge level="High" /></div>} />
        <div className="rounded-md border border-red-200 bg-red-50 p-3 font-mono text-xs text-red-800">
          "As per GR-2019-URD-098, the pilot fund of ₹47 Cr was released to 12 ULBs..." — SOURCE NOT FOUND
        </div>
        <div className="mt-2 text-sm text-ink-700">The reference GR-2019-URD-098 does not exist in the public repository. Response was suppressed and routed to human reviewer.</div>
      </Card>
    </div>
  )
}
