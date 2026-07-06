import { Fragment } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

const HEAT = [
  { dept: 'HFW', sensitivity: 'High', volume: 'High' },
  { dept: 'HOME', sensitivity: 'High', volume: 'High' },
  { dept: 'REV', sensitivity: 'Medium', volume: 'High' },
  { dept: 'WCD', sensitivity: 'High', volume: 'Medium' },
  { dept: 'FIN', sensitivity: 'Medium', volume: 'Medium' },
  { dept: 'DIT', sensitivity: 'Low', volume: 'High' },
]

const PIA = [
  { name: 'PMAY-U 2.0 verification', dept: 'UDD', officer: 'K. Kore · DDO', risk: 'Medium' as const, mitigation: 'Consent artifact + retention alignment', status: 'Approved' as const },
  { name: 'Health record intelligence', dept: 'HFW', officer: 'S. Kadam · DPO', risk: 'High' as const, mitigation: 'On-prem model only + DPO review', status: 'Under Review' as const },
  { name: 'e-HRMS transfer optimiser', dept: 'GAD', officer: 'A. Deshmukh · US', risk: 'Medium' as const, mitigation: 'Purpose limitation prompt + audit', status: 'Under Review' as const },
]

export function PrivacyRisk() {
  return (
    <div>
      <PageHeader
        title="Privacy Risk"
        description="Privacy risk heatmap, impact assessments and mitigation status per use case."
        breadcrumb={['DPDP', 'Privacy Risk']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Privacy risk heatmap" subtitle="Sensitivity × Volume" right={<SourceBadge source="Demo" />} />
          <div className="overflow-x-auto">
            <div className="grid min-w-[420px] grid-cols-4 gap-2 text-xs">
              <div />
              {['Low', 'Medium', 'High'].map((c) => (
                <div key={`col-${c}`} className="text-center font-medium text-ink-500">
                  {c} volume
                </div>
              ))}
              {['Low', 'Medium', 'High'].map((row) => (
                <Fragment key={`row-${row}`}>
                  <div className="flex items-center font-medium text-ink-500">{row} sens.</div>
                  {['Low', 'Medium', 'High'].map((col) => {
                    const inCell = HEAT.filter((h) => h.sensitivity === row && h.volume === col)
                    const cls = row === 'High' && col === 'High'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : row === 'High' || col === 'High'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    return (
                      <div key={`${row}-${col}`} className={`flex min-h-[68px] flex-col rounded-lg border p-2 ${cls}`}>
                        <div className="text-[10px] uppercase tracking-wider opacity-80">count {inCell.length}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {inCell.map((h) => (
                            <span key={h.dept} className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium">
                              {h.dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Privacy Impact Assessments" />
          <ul className="space-y-2">
            {PIA.map((p) => (
              <li key={p.name} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{p.name}</div>
                    <div className="text-xs text-ink-500">{p.dept} · Responsible officer: {p.officer}</div>
                    <div className="mt-1 text-xs text-ink-700"><b>Mitigation:</b> {p.mitigation}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge level={p.risk} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
