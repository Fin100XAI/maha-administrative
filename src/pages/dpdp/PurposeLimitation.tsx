import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Target, Boxes, CheckCircle2, XCircle, BookOpen } from 'lucide-react'
import { PURPOSE_DRIFT, PURPOSE_DATA_MAP, PURPOSE_CONSENT_MATRIX, VIOLATION_PLAYBOOK } from '@/data/dpdpSamples'
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend } from 'recharts'

const PURPOSES = [
  { p: 'PMAY-U 2.0 verification', use: 'Beneficiary shortlist, disbursement', by: 'UDD + MahaDBT', status: 'Approved', risk: 'Low' as const },
  { p: 'Crop-loss appeals', use: 'Draft appeal, publish decisions', by: 'AGR + DDoR', status: 'Approved', risk: 'Low' as const },
  { p: 'e-HRMS transfer optimiser', use: 'Recommend transfers', by: 'GAD + DIT', status: 'Under Review', risk: 'Medium' as const },
  { p: 'Aaple Sarkar concierge', use: 'Citizen G2C assistant', by: 'GAD', status: 'Approved', risk: 'Low' as const },
  { p: 'Vaccination reminders', use: 'SMS + Aaple Sarkar', by: 'HFW', status: 'Approved', risk: 'Low' as const },
  { p: 'Health record intelligence', use: 'Clinical decision support', by: 'HFW', status: 'Under Review', risk: 'High' as const },
]

const VIOLATIONS = [
  { p: 'Beneficiary records used for advertising', dept: 'WCD', sev: 'High' as const, action: 'Blocked; DPO notified' },
  { p: 'Transfer data queried for personal search', dept: 'GAD', sev: 'Medium' as const, action: 'Alert to officer' },
]

const CONSENT_COLS: { key: 'schemeMatch' | 'communications' | 'analytics' | 'thirdParty'; label: string }[] = [
  { key: 'schemeMatch',    label: 'Scheme match' },
  { key: 'communications', label: 'Communications' },
  { key: 'analytics',      label: 'Analytics' },
  { key: 'thirdParty',     label: 'Third party' },
]

export function PurposeLimitation() {
  return (
    <div>
      <PageHeader
        title="Purpose Limitation"
        description="Registered purposes for personal data, actual usage, and detected violations."
        breadcrumb={['DPDP', 'Purpose Limitation']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader title="Registered purposes" right={<SourceBadge source="Demo" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>{['Purpose', 'Used for', 'Owner', 'Risk', 'Status'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr></thead>
              <tbody>
                {PURPOSES.map((p) => (
                  <tr key={p.p}>
                    <td className="table-td font-medium text-ink-800">{p.p}</td>
                    <td className="table-td">{p.use}</td>
                    <td className="table-td">{p.by}</td>
                    <td className="table-td"><RiskBadge level={p.risk} /></td>
                    <td className="table-td"><StatusBadge status={p.status as any} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Detected violations" right={<Target className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm">
              {VIOLATIONS.map((v) => (
                <li key={v.p} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-ink-800">{v.p}</div>
                      <div className="text-xs text-ink-500">{v.dept} - action: {v.action}</div>
                    </div>
                    <RiskBadge level={v.sev} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Approvals" />
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Health record intelligence</span><StatusBadge status="Under Review" /></li>
              <li className="flex justify-between"><span>e-HRMS transfer optimiser</span><StatusBadge status="Under Review" /></li>
              <li className="flex justify-between"><span>Aaple Sarkar concierge</span><StatusBadge status="Approved" /></li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <ChartCard title="Purpose-drift detection" subtitle="Registered vs actual queries per month" source="Demo" height={260}>
          <ResponsiveContainer>
            <ComposedChart data={PURPOSE_DRIFT} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="registered" fill="#a855f7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" fill="#ec4899" radius={[6, 6, 0, 0]} />
              <Line type="monotone" dataKey="drift" stroke="#f59e0b" strokeWidth={2} dot />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Per-purpose data map"
            subtitle="Datasets flowing through each registered purpose"
            right={<Boxes className="h-4 w-4 text-brand-500" />}
          />
          <ul className="space-y-2">
            {PURPOSE_DATA_MAP.map((r) => (
              <li key={r.purpose} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="text-sm font-medium text-ink-800 truncate">{r.purpose}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {r.datasets.map((d) => (
                    <span key={d} className="chip border bg-brand-soft text-brand-700 border-brand-100 text-[10px]">{d}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Consent-purpose match matrix"
          subtitle="Which consent categories cover each registered purpose"
          right={<SourceBadge source="Demo" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr>
                <th className="table-th">Purpose</th>
                {CONSENT_COLS.map((c) => <th key={c.key} className="table-th text-center">{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {PURPOSE_CONSENT_MATRIX.map((r) => (
                <tr key={r.purpose} className="hover:bg-ink-50/40">
                  <td className="table-td font-medium text-ink-800">{r.purpose}</td>
                  {CONSENT_COLS.map((c) => (
                    <td key={c.key} className="table-td text-center">
                      {r.consented.includes(c.key)
                        ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />
                        : <XCircle className="mx-auto h-4 w-4 text-ink-300" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-md border border-dashed border-ink-200 px-3 py-2 text-xs text-ink-500">
          Any red-cross combination requires a fresh consent notice before the purpose can be executed.
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader
          title="Violation resolution playbook"
          subtitle="Six-step SOP triggered by any purpose-drift alert"
          right={<BookOpen className="h-4 w-4 text-brand-500" />}
        />
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {VIOLATION_PLAYBOOK.map((s) => (
            <li key={s.step} className="rounded-xl border border-ink-100 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-brand-700">{s.step}</span>
                {s.title}
              </div>
              <p className="mt-2 text-sm text-ink-700">{s.detail}</p>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
