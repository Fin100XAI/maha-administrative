import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { ShieldCheck, Cookie, EyeOff, Target, Timer, Layers, Route, Waves, CheckCircle2, CircleDashed, XCircle, UserRound, BadgeCheck, PhoneCall } from 'lucide-react'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { DPDP_HEATMAP } from '@/data/mockData'
import { DPDP_OBLIGATIONS, DPDP_QUARTERLY_SCORE, FIDUCIARY_REG, DPO_ROSTER } from '@/data/dpdpSamples'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'

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

function ObligationIcon({ status }: { status: 'Compliant' | 'In progress' | 'Gap' }) {
  if (status === 'Compliant') return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
  if (status === 'In progress') return <CircleDashed className="h-4 w-4 shrink-0 text-amber-500" />
  return <XCircle className="h-4 w-4 shrink-0 text-red-500" />
}

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
        <ChartCard title="Compliance heatmap" subtitle="Dimension x Department" source="Public-source linked">
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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_1fr]">
        <Card>
          <CardHeader
            title="DPDP obligations coverage"
            subtitle="Sections 4-13 of the DPDP Act, 2023"
            right={<SourceBadge source="Public-source linked" />}
          />
          <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {DPDP_OBLIGATIONS.map((o) => (
              <li key={o.id} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start gap-2">
                  <ObligationIcon status={o.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium text-ink-800">
                        <span className="text-ink-500">{o.section} </span>{o.title}
                      </div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-ink-500">Owner: {o.owner} - {o.evidence}</div>
                  </div>
                  <span className={`chip border text-[10px] shrink-0 ${
                    o.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    o.status === 'In progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <ChartCard title="Compliance score trend" subtitle="Composite DPDP score by quarter" source="Demo" height={220}>
          <ResponsiveContainer>
            <AreaChart data={DPDP_QUARTERLY_SCORE} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="dpdpScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="q" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fill="url(#dpdpScoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.2fr]">
        <Card>
          <CardHeader
            title="Data Fiduciary registration"
            subtitle="Active status with Data Protection Board"
            right={<StatusBadge status="Active" />}
          />
          <div className="rounded-xl border border-brand-100 bg-brand-soft/40 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-brand-100">
                <BadgeCheck className="h-5 w-5 text-brand-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink-900">{FIDUCIARY_REG.entity}</div>
                <div className="mt-0.5 text-xs text-ink-500">Fiduciary ID: <span className="font-mono">{FIDUCIARY_REG.fiduciaryId}</span></div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><dt className="text-ink-500">Significant Fiduciary</dt><dd className="mt-0.5 font-medium text-ink-800">{FIDUCIARY_REG.significantFlag ? 'Yes (u/s 10)' : 'No'}</dd></div>
              <div><dt className="text-ink-500">Registered on</dt><dd className="mt-0.5 font-medium text-ink-800">{FIDUCIARY_REG.registrationDate}</dd></div>
              <div><dt className="text-ink-500">Renewal due</dt><dd className="mt-0.5 font-medium text-ink-800">{FIDUCIARY_REG.renewalDate}</dd></div>
              <div><dt className="text-ink-500">Associated depts</dt><dd className="mt-0.5 font-medium text-ink-800">{FIDUCIARY_REG.associatedDepts}</dd></div>
              <div className="col-span-2"><dt className="text-ink-500">Nominated DPO</dt><dd className="mt-0.5 font-medium text-ink-800">{FIDUCIARY_REG.dpo}</dd></div>
              <div className="col-span-2"><dt className="text-ink-500">Grievance channel</dt><dd className="mt-0.5 font-mono text-ink-800 truncate">{FIDUCIARY_REG.grievanceContact}</dd></div>
            </dl>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="DPO on-call rotation"
            subtitle="7-day roster with masked contact"
            right={<PhoneCall className="h-4 w-4 text-brand-500" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-xs">
              <thead>
                <tr className="text-ink-500">
                  {['DPO', 'Department', 'Shift', 'Email (masked)', 'Phone'].map((h) => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DPO_ROSTER.map((d) => (
                  <tr key={d.name} className="hover:bg-ink-50/40">
                    <td className="table-td">
                      <div className="flex items-center gap-2 font-medium text-ink-800">
                        <UserRound className="h-3.5 w-3.5 text-brand-500" />
                        {d.name}
                      </div>
                    </td>
                    <td className="table-td">{d.dept}</td>
                    <td className="table-td">{d.shift}</td>
                    <td className="table-td font-mono">{d.contact}</td>
                    <td className="table-td font-mono">{d.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Privacy risk register" right={<SourceBadge source="Demo" />} />
        <ul className="space-y-2">
          {RISKS.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
              <div>
                <div className="text-sm font-medium text-ink-800">{r.title}</div>
                <div className="text-xs text-ink-500">{r.id} - {r.dept} - SLA {r.sla}</div>
              </div>
              <RiskBadge level={r.sev} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
