import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { Fingerprint, Smartphone, Globe, KeyRound, ShieldCheck, ClipboardCheck } from 'lucide-react'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'

const dimensions = [
  { d: 'Device trust', v: 92 },
  { d: 'User trust', v: 88 },
  { d: 'Location anomaly', v: 84 },
  { d: 'MFA status', v: 96 },
  { d: 'Least privilege', v: 82 },
  { d: 'Session risk', v: 78 },
  { d: 'Privileged access', v: 90 },
]

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
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ v: 88, fill: '#D81B60' }]} startAngle={90} endAngle={-270}>
              <RadialBar background dataKey="v" cornerRadius={30} />
            </RadialBarChart>
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
    </div>
  )
}
