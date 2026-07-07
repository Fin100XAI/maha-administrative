import { Fragment } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ShieldPlus, Radar, CalendarClock, Users } from 'lucide-react'
import { PET_ADOPTION, STRIDE_GRID, DPIA_SCHEDULE, DPR_SUMMARY } from '@/data/dpdpSamples'

const HEAT = [
  { dept: 'HFW', sensitivity: 'High', volume: 'High' },
  { dept: 'HOME', sensitivity: 'High', volume: 'High' },
  { dept: 'REV', sensitivity: 'Medium', volume: 'High' },
  { dept: 'WCD', sensitivity: 'High', volume: 'Medium' },
  { dept: 'FIN', sensitivity: 'Medium', volume: 'Medium' },
  { dept: 'DIT', sensitivity: 'Low', volume: 'High' },
]

const PIA = [
  { name: 'PMAY-U 2.0 verification', dept: 'UDD', officer: 'K. Kore - DDO', risk: 'Medium' as const, mitigation: 'Consent artifact + retention alignment', status: 'Approved' as const },
  { name: 'Health record intelligence', dept: 'HFW', officer: 'S. Kadam - DPO', risk: 'High' as const, mitigation: 'On-prem model only + DPO review', status: 'Under Review' as const },
  { name: 'e-HRMS transfer optimiser', dept: 'GAD', officer: 'A. Deshmukh - US', risk: 'Medium' as const, mitigation: 'Purpose limitation prompt + audit', status: 'Under Review' as const },
]

const PET_COLORS = ['from-brand-500 to-brand-600', 'from-google-blue-500 to-google-blue-600', 'from-google-red-500 to-google-red-600', 'from-emerald-500 to-emerald-700']

export function PrivacyRisk() {
  const dprTotal = DPR_SUMMARY.reduce((s, r) => s + r.thisQ, 0)
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
          <CardHeader title="Privacy risk heatmap" subtitle="Sensitivity x Volume" right={<SourceBadge source="Demo" />} />
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
                    <div className="text-xs text-ink-500">{p.dept} - Responsible officer: {p.officer}</div>
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

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="Privacy Enhancing Technologies (PET) adoption"
            subtitle="Coverage of the MAII data estate per technique"
            right={<ShieldPlus className="h-4 w-4 text-brand-500" />}
          />
          <ul className="space-y-3">
            {PET_ADOPTION.map((p, i) => (
              <li key={p.pet}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink-800">{p.pet}</span>
                  <span className="font-mono text-xs text-ink-700">{p.coverage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-ink-100">
                  <div className={`h-full rounded bg-gradient-to-r ${PET_COLORS[i % PET_COLORS.length]}`} style={{ width: `${p.coverage}%` }} />
                </div>
                <div className="mt-1 text-xs text-ink-500">{p.notes}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="STRIDE threat model canvas"
            subtitle="Applied to MAII personal-data flows"
            right={<div className="flex items-center gap-2"><Radar className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {STRIDE_GRID.map((t) => (
              <div key={t.threat} className="rounded-xl border border-ink-100 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink-800">{t.threat}</span>
                  <RiskBadge level={t.risk} />
                </div>
                <div className="text-xs text-ink-500">{t.control}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.1fr]">
        <Card>
          <CardHeader
            title="Quarterly DPIA schedule"
            subtitle="Upcoming Data Protection Impact Assessments"
            right={<CalendarClock className="h-4 w-4 text-brand-500" />}
          />
          <ol className="relative space-y-3 border-l border-dashed border-ink-200 pl-4">
            {DPIA_SCHEDULE.map((d) => (
              <li key={d.assessment} className="relative">
                <span className="absolute -left-[21px] top-1 grid h-3 w-3 rounded-full bg-white ring-2 ring-brand-400" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{d.assessment}</div>
                    <div className="text-xs text-ink-500">{d.dept} - due {d.due}</div>
                  </div>
                  <span className="chip border bg-brand-soft text-brand-700 border-brand-100 text-[10px] shrink-0">{d.q}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <CardHeader
            title="Data Subject Rights requests"
            subtitle={`This quarter - ${dprTotal} total requests`}
            right={<div className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DPR_SUMMARY.map((d) => {
              const closeRate = Math.round((d.closed / d.thisQ) * 100)
              return (
                <div key={d.kind} className="rounded-xl border border-ink-100 p-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">{d.kind}</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-ink-900">{d.thisQ}</span>
                    <span className="text-xs text-ink-500">requests</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-500">
                    <span>Closed {d.closed}</span>
                    <span>Avg {d.avgDaysToClose}d</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-ink-100">
                    <div className="h-full rounded bg-brand-gradient" style={{ width: `${closeRate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 rounded-md border border-dashed border-ink-200 px-3 py-2 text-xs text-ink-500">
            Grievance SLA per DPDP Sec 13 - median close-time stays well within the 15-day expectation.
          </div>
        </Card>
      </div>
    </div>
  )
}
