import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { ShieldCheck, Cookie, EyeOff, Target, Timer, Layers, Route, Waves } from 'lucide-react'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { DPDP_HEATMAP } from '@/data/mockData'

const RISKS = [
  { id: 'PR-118', title: 'Purpose drift on beneficiary data', dept: 'WCD', sev: 'High' as const, sla: '7d' },
  { id: 'PR-117', title: 'Missing retention policy — health', dept: 'HFW', sev: 'Medium' as const, sla: '14d' },
  { id: 'PR-116', title: 'Consent artifact incomplete', dept: 'REV', sev: 'Medium' as const, sla: '10d' },
  { id: 'PR-115', title: 'DPO sign-off pending on new AI use', dept: 'DIT', sev: 'Low' as const, sla: '30d' },
]

const PIA = [
  { name: 'PMAY-U 2.0 verification', dept: 'UDD', status: 'Approved' },
  { name: 'MahaDBT beneficiary matching', dept: 'PLN', status: 'Under Review' },
  { name: 'Aaple Sarkar AI concierge', dept: 'GAD', status: 'Approved' },
  { name: 'e-HRMS transfer optimiser', dept: 'GAD', status: 'Under Review' },
]

export function DPDPIntelligence() {
  return (
    <div>
      <PageHeader
        title="DPDP Intelligence"
        description="Command dashboard for Digital Personal Data Protection compliance — consent, purpose, retention, lineage, classification and privacy risk."
        breadcrumb={['DPDP & Data Governance', 'DPDP Intelligence']}
        source="Public-source linked"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="DPDP Compliance Score" value="87 / 100" icon={<ShieldCheck className="h-5 w-5" />} delta={2.1} source="Public-source linked" confidence={88} />
        <MetricCard label="Consent coverage" value="82%" icon={<Cookie className="h-5 w-5" />} delta={4.3} source="Demo" confidence={86} />
        <MetricCard label="Sensitive data records" value="24.6 L" icon={<EyeOff className="h-5 w-5" />} delta={0} source="Department API required" confidence={72} />
        <MetricCard label="Purpose violations" value={6} icon={<Target className="h-5 w-5" />} delta={-33} source="Demo" confidence={88} />
        <MetricCard label="Retention violations" value={3} icon={<Timer className="h-5 w-5" />} delta={-50} source="Demo" confidence={90} />
        <MetricCard label="Privacy risks (open)" value={14} icon={<Waves className="h-5 w-5" />} delta={-12} source="Demo" confidence={86} />
        <MetricCard label="Data lineage coverage" value="76%" icon={<Route className="h-5 w-5" />} delta={5} source="Demo" confidence={82} />
        <MetricCard label="Data classification coverage" value="88%" icon={<Layers className="h-5 w-5" />} delta={2} source="Demo" confidence={84} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard title="Compliance heatmap" subtitle="Dimension × Department" source="Public-source linked">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="text-ink-500">
                  <th className="p-1 text-left font-medium">Dept</th>
                  {['Consent', 'Retention', 'Purpose', 'Lineage', 'Class'].map((h) => <th key={h} className="p-1 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {DPDP_HEATMAP.map((r) => (
                  <tr key={r.dept}>
                    <td className="p-1 font-medium text-ink-800">{r.dept}</td>
                    {(['consent','retention','purpose','lineage','class'] as const).map((k) => {
                      const v = r[k]
                      const cls = v >= 90 ? 'bg-emerald-500' : v >= 80 ? 'bg-emerald-400' : v >= 70 ? 'bg-amber-400' : 'bg-red-400'
                      return (
                        <td key={k} className="p-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-16 rounded ${cls}`} />
                            <span className="text-ink-700">{v}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <Card>
          <CardHeader title="Privacy Impact Assessments" right={<StatusBadge status="Approved" />} />
          <ul className="space-y-2 text-sm">
            {PIA.map((p) => (
              <li key={p.name} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                <div className="min-w-0">
                  <div className="font-medium text-ink-800">{p.name}</div>
                  <div className="text-xs text-ink-500">{p.dept}</div>
                </div>
                <StatusBadge status={p.status as any} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Privacy risk register" right={<SourceBadge source="Demo" />} />
        <ul className="space-y-2">
          {RISKS.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
              <div>
                <div className="text-sm font-medium text-ink-800">{r.title}</div>
                <div className="text-xs text-ink-500">{r.id} · {r.dept} · SLA {r.sla}</div>
              </div>
              <RiskBadge level={r.sev} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
