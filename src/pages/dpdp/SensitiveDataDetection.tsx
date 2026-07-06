import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { RiskBadge, SourceBadge, StatusBadge, ClassificationBadge } from '@/components/ui/Badges'
import { EyeOff, IndianRupee, HeartPulse, KeyRound, ShieldAlert, Sliders, Search, ScanEye } from 'lucide-react'
import { DETECTION_ENGINES, DEPT_PII_TREND, MASK_LIBRARY, FP_REVIEW_QUEUE } from '@/data/dpdpSamples'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend } from 'recharts'

const detections = [
  { cat: 'PII - Name + DOB',            count: 128420, mask: 'Rajesh M** (DOB 07-***-1971)', risk: 'Medium' as const },
  { cat: 'Aadhaar-like identifier',      count: 42210,  mask: 'XXXX XXXX 4218',              risk: 'High' as const },
  { cat: 'PAN',                          count: 18420,  mask: 'ABCPXXXXX7Q',                 risk: 'High' as const },
  { cat: 'Bank account / IFSC',          count: 22140,  mask: 'IFSC SBIN0*****218',           risk: 'Medium' as const },
  { cat: 'Health record (ICD10)',        count: 8910,   mask: 'ICD10 - E11.**',                risk: 'High' as const },
  { cat: 'Confidential Govt File No.',   count: 5210,   mask: 'DIT/AI/2026/07/***',           risk: 'Medium' as const },
]

const DEPT_KEYS = ['HFW', 'HOME', 'REV', 'UDD', 'GAD'] as const
const DEPT_COLORS: Record<(typeof DEPT_KEYS)[number], string> = {
  HFW: '#ec4899', HOME: '#a855f7', REV: '#8b5cf6', UDD: '#f59e0b', GAD: '#10b981',
}

export function SensitiveDataDetection() {
  return (
    <div>
      <PageHeader
        title="Sensitive Data Detection"
        description="Detected PII, financial and health data with masked previews. Full values never displayed."
        breadcrumb={['DPDP', 'Sensitive Data']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="PII records (30d)" value="2.24 L" icon={<EyeOff className="h-5 w-5" />} delta={-4.2} source="Demo" confidence={82} />
        <MetricCard label="Financial data" value="62 K" icon={<IndianRupee className="h-5 w-5" />} delta={-8} source="Demo" confidence={84} />
        <MetricCard label="Health data" value="8.9 K" icon={<HeartPulse className="h-5 w-5" />} delta={-2.4} source="Demo" confidence={86} />
        <MetricCard label="Secret exposure" value={4} icon={<KeyRound className="h-5 w-5" />} delta={-50} source="Demo" confidence={90} />
      </div>

      <Card className="mt-6">
        <CardHeader title="Detection categories" subtitle="Values shown are MASKED - never full identifiers" right={<SourceBadge source="Demo" />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr>{['Category', 'Count', 'Masked preview', 'Risk', 'Recommendation', 'Status'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr></thead>
            <tbody>
              {detections.map((d) => (
                <tr key={d.cat}>
                  <td className="table-td font-medium text-ink-800">{d.cat}</td>
                  <td className="table-td">{d.count.toLocaleString()}</td>
                  <td className="table-td font-mono text-xs">{d.mask}</td>
                  <td className="table-td"><RiskBadge level={d.risk} /></td>
                  <td className="table-td">Redact on read + limit access to DPO</td>
                  <td className="table-td"><StatusBadge status="Active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.1fr]">
        <Card>
          <CardHeader
            title="Detection engines"
            subtitle="Six detectors with sensitivity thresholds"
            right={<div className="flex items-center gap-2"><Sliders className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3">
            {DETECTION_ENGINES.map((e) => (
              <li key={e.id} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{e.name}</div>
                    <div className="truncate text-xs text-ink-500">{e.mode}</div>
                  </div>
                  <span className={`chip border text-[10px] ${e.enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-ink-100 text-ink-600 border-ink-200'}`}>
                    {e.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded bg-ink-100">
                      <div className="h-full rounded bg-gradient-to-r from-pink-500 to-brand-600" style={{ width: `${e.sensitivity}%` }} />
                    </div>
                  </div>
                  <span className="w-14 shrink-0 text-right text-xs font-mono text-ink-700">{e.sensitivity}%</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard title="PII volume trend by department" subtitle="Records (in thousands) per month" source="Demo" height={280}>
          <ResponsiveContainer>
            <LineChart data={DEPT_PII_TREND} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {DEPT_KEYS.map((k) => (
                <Line key={k} type="monotone" dataKey={k} stroke={DEPT_COLORS[k]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Mask preview library"
            subtitle="Standard masking patterns - full identifiers never emitted"
            right={<ScanEye className="h-4 w-4 text-brand-500" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr>{['Kind', 'Raw type', 'Masked output', 'Rule'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {MASK_LIBRARY.map((m) => (
                  <tr key={m.kind} className="hover:bg-ink-50/40">
                    <td className="table-td font-medium text-ink-800">{m.kind}</td>
                    <td className="table-td text-ink-500">{m.raw}</td>
                    <td className="table-td font-mono text-xs">{m.masked}</td>
                    <td className="table-td text-xs">{m.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 rounded-md border border-dashed border-ink-200 px-3 py-2 text-xs text-ink-500">
            Masking is applied at read-time. Raw values remain encrypted at rest with HSM-backed tokenisation.
          </div>
        </Card>

        <Card>
          <CardHeader
            title="False-positive review queue"
            subtitle="Detections flagged by officers for DPO adjudication"
            right={<div className="flex items-center gap-2"><Search className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2">
            {FP_REVIEW_QUEUE.map((f) => (
              <li key={f.id} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">
                      {f.field} <span className="text-ink-500">- {f.dept}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-ink-500">
                      Flagged as <span className="font-mono">{f.flaggedAs}</span> - Sample: <span className="font-mono">{f.sampleMasked}</span>
                    </div>
                  </div>
                  <span className={`chip border text-[10px] shrink-0 ${
                    f.verdict === 'False +' ? 'bg-red-50 text-red-700 border-red-200' :
                    f.verdict === 'Confirm' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>{f.verdict}</span>
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-400">{f.id}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader title="Recommended redactions" right={<ShieldAlert className="h-4 w-4 text-amber-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>- Auto-mask Aadhaar patterns on ingest</li>
            <li>- Route bank account fields via HSM tokenisation</li>
            <li>- Never emit PAN in AI output</li>
            <li>- Suppress ICD10 in non-health workflows</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Risk score" />
          <div className="mt-1 text-3xl font-semibold text-ink-900">64<span className="text-sm text-ink-400">/100</span></div>
          <div className="text-xs text-ink-500">Composite privacy exposure risk</div>
        </Card>
        <Card>
          <CardHeader title="Data classification" />
          <div className="mt-2 flex flex-wrap gap-2">
            <ClassificationBadge level="Confidential" />
            <ClassificationBadge level="Secret" />
            <ClassificationBadge level="Internal" />
          </div>
          <div className="mt-2 text-xs text-ink-500">Highest classification applied to detected records.</div>
        </Card>
      </div>
    </div>
  )
}
