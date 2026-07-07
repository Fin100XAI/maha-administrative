import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { RiskBadge, SourceBadge, StatusBadge, ConfidenceBadge } from '@/components/ui/Badges'
import { Eye, Quote, AlertTriangle, ClipboardCheck, ArrowRight, Inbox, Search, BookMarked, UserCheck } from 'lucide-react'

const dist = [
  { c: '50-59', v: 4 }, { c: '60-69', v: 18 }, { c: '70-79', v: 62 },
  { c: '80-89', v: 148 }, { c: '90-100', v: 220 },
]

const HALL = [
  { id: 'H-1042', title: 'Note draft cited GR-2019-URD-098 which does not exist', dept: 'UDD', by: 'MAII Fact-Checker', sev: 'High' as const, status: 'Investigating' as const },
  { id: 'H-1039', title: 'RTI reply referenced Section 7 instead of Section 6(1)', dept: 'GAD', by: 'Human reviewer', sev: 'Medium' as const, status: 'Resolved' as const },
  { id: 'H-1035', title: 'Cabinet note distiller invented budget figure', dept: 'FIN', by: 'MAII Fact-Checker', sev: 'High' as const, status: 'Resolved' as const },
  { id: 'H-1031', title: 'Marathi advisory dropped mandatory clause', dept: 'HFW', by: 'Human reviewer', sev: 'Medium' as const, status: 'Resolved' as const },
  { id: 'H-1028', title: 'Scheme chatbot fabricated helpline number', dept: 'WCD', by: 'MAII Fact-Checker', sev: 'High' as const, status: 'Resolved' as const },
  { id: 'H-1024', title: 'Vendor invoice extracted wrong GSTIN', dept: 'FIN', by: 'DLP scanner', sev: 'Medium' as const, status: 'Resolved' as const },
  { id: 'H-1021', title: 'Court digest cited overturned precedent', dept: 'LAW', by: 'Human reviewer', sev: 'High' as const, status: 'Investigating' as const },
  { id: 'H-1017', title: 'Panchayat resolution mis-stated attendance', dept: 'RDD', by: 'Human reviewer', sev: 'Low' as const, status: 'Resolved' as const },
  { id: 'H-1013', title: 'Marathi vs English mismatch on GR clause', dept: 'GAD', by: 'MAII Fact-Checker', sev: 'Medium' as const, status: 'Resolved' as const },
  { id: 'H-1009', title: 'Grievance triage fabricated tehsil name', dept: 'REV', by: 'Human reviewer', sev: 'Medium' as const, status: 'Resolved' as const },
]

const PIPELINE = [
  { name: 'Ingress', desc: 'AI output arrives with metadata', icon: Inbox, pass: '100%' },
  { name: 'Retrieval check', desc: 'Claims matched to top-k sources', icon: Search, pass: '96%' },
  { name: 'Citation check', desc: 'Sources verified against public GRs', icon: BookMarked, pass: '92%' },
  { name: 'Human review', desc: 'HITL for high-risk / low-conf.', icon: UserCheck, pass: '100%' },
]

const TOPICS = [
  { t: 'Government Resolution numbers', n: 42 },
  { t: 'Budget figures / financial claims', n: 31 },
  { t: 'Section / clause references (Acts)', n: 24 },
  { t: 'Helpline & contact numbers', n: 18 },
  { t: 'Historical dates', n: 12 },
  { t: 'Named officials / designations', n: 9 },
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

      <Card className="mt-6">
        <CardHeader
          title="Fact-check pipeline"
          subtitle="Every AI output flows through these gates before human sees it"
          right={<SourceBadge source="Demo" />}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {PIPELINE.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.name} className="relative min-w-0 rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600"><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-800">{s.name}</div>
                    <div className="truncate text-[11px] text-ink-500">{s.desc}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-ink-500">Pass rate</span>
                  <span className="text-sm font-semibold text-emerald-700">{s.pass}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="pointer-events-none absolute right-[-14px] top-1/2 hidden h-5 w-5 -translate-y-1/2 text-ink-300 md:block" />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Confidence score distribution" subtitle="Across 452 AI responses (last 24h)" source="Demo">
          <ResponsiveContainer>
            <AreaChart data={dist}>
              <defs>
                <linearGradient id="gConf" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0B57D0" stopOpacity={0.5}/><stop offset="100%" stopColor="#0B57D0" stopOpacity={0.02}/></linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="c" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#0B57D0" fill="url(#gConf)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader title="Top hallucinated topics" subtitle="Last 30 days" right={<SourceBadge source="Demo" />} />
          <ul className="space-y-2">
            {TOPICS.map((t) => {
              const max = TOPICS[0].n
              const w = (t.n / max) * 100
              return (
                <li key={t.t} className="min-w-0">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate text-ink-700">{t.t}</span>
                    <span className="shrink-0 font-semibold text-ink-900">{t.n}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${w}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Human correction log" right={<SourceBadge source="Demo" />} />
        <ul className="space-y-2">
          {HALL.map((h) => (
            <li key={h.id} className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-medium text-ink-800">{h.title}</div>
                  <div className="truncate text-xs text-ink-500">{h.id} · {h.dept} · reported by {h.by}</div>
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
