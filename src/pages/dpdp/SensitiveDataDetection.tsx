import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge, ClassificationBadge } from '@/components/ui/Badges'
import { EyeOff, IndianRupee, HeartPulse, KeyRound, ShieldAlert } from 'lucide-react'

const detections = [
  { cat: 'PII — Name + DOB', count: 128420, mask: 'Rajesh M** (DOB 07-***-1971)', risk: 'Medium' as const },
  { cat: 'Aadhaar-like identifier', count: 42210, mask: 'XXXX XXXX 4218', risk: 'High' as const },
  { cat: 'PAN', count: 18420, mask: 'ABCPXXXXX7Q', risk: 'High' as const },
  { cat: 'Bank account / IFSC', count: 22140, mask: 'IFSC SBIN0*****218', risk: 'Medium' as const },
  { cat: 'Health record (ICD10)', count: 8910, mask: 'ICD10 · E11.**', risk: 'High' as const },
  { cat: 'Confidential Govt File No.', count: 5210, mask: 'DIT/AI/2026/07/***', risk: 'Medium' as const },
]

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
        <CardHeader title="Detection categories" subtitle="Values shown are MASKED — never full identifiers" right={<SourceBadge source="Demo" />} />
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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader title="Recommended redactions" right={<ShieldAlert className="h-4 w-4 text-amber-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>• Auto-mask Aadhaar patterns on ingest</li>
            <li>• Route bank account fields via HSM tokenisation</li>
            <li>• Never emit PAN in AI output</li>
            <li>• Suppress ICD10 in non-health workflows</li>
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
