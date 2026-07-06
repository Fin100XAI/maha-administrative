import { Scale, FileText, ShieldCheck, Users, History, Network, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'
import { POLICY_HISTORY, ATTESTATION_OFFICERS } from '@/data/governanceSamples'

const POLICIES = [
  { name: 'Acceptable-Use of AI', owner: 'DIT — AI Governance', version: 'v3.1', status: 'Approved', risk: 'Low', updated: '2026-06-20' },
  { name: 'Prompt Governance', owner: 'DIT — AI Governance', version: 'v2.4', status: 'Approved', risk: 'Low', updated: '2026-05-14' },
  { name: 'Model Risk', owner: 'DIT — Model Risk Cell', version: 'v1.8', status: 'Under Review', risk: 'Medium', updated: '2026-07-01' },
  { name: 'DPDP for AI', owner: 'DPO — GoM', version: 'v2.0', status: 'Approved', risk: 'Low', updated: '2026-06-11' },
  { name: 'Human-in-the-loop', owner: 'DIT — AI Governance', version: 'v1.5', status: 'Approved', risk: 'Low', updated: '2026-06-18' },
  { name: 'Third-party Model Use', owner: 'DIT — External Models', version: 'v1.2', status: 'Under Review', risk: 'Medium', updated: '2026-07-03' },
  { name: 'On-Prem Deployment', owner: 'DIT — Infrastructure', version: 'v2.1', status: 'Approved', risk: 'Low', updated: '2026-06-05' },
  { name: 'Incident Reporting', owner: 'AI SOC', version: 'v1.4', status: 'Approved', risk: 'Low', updated: '2026-06-22' },
]

// Simple dependency edges (source -> depends on)
const DEPS: [string, string][] = [
  ['Prompt Governance', 'Acceptable-Use of AI'],
  ['Model Risk', 'Acceptable-Use of AI'],
  ['Third-party Model Use', 'Model Risk'],
  ['Human-in-the-loop', 'Prompt Governance'],
  ['Incident Reporting', 'Model Risk'],
  ['DPDP for AI', 'Acceptable-Use of AI'],
  ['On-Prem Deployment', 'Model Risk'],
]

export function AIPolicy() {
  return (
    <div>
      <PageHeader
        title="AI Policy"
        description="MAII policy library — Responsible AI, Model Risk, DPDP, HITL and third-party controls."
        breadcrumb={['Governance', 'AI Policy']}
        source="Public-source linked"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { l: 'Active Policies', v: POLICIES.length, i: <FileText className="h-5 w-5" /> },
          { l: 'Under Review', v: POLICIES.filter(p => p.status === 'Under Review').length, i: <Scale className="h-5 w-5" /> },
          { l: 'Coverage Score', v: '92%', i: <ShieldCheck className="h-5 w-5" /> },
          { l: 'Signatories', v: 6, i: <Users className="h-5 w-5" /> },
        ].map((c) => (
          <div key={c.l} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-ink-500">{c.l}</div>
              <div className="text-brand-500">{c.i}</div>
            </div>
            <div className="mt-1 text-2xl font-semibold text-ink-900">{c.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {POLICIES.map((p) => {
          const hist = POLICY_HISTORY[p.name] ?? []
          return (
            <Card key={p.name}>
              <CardHeader
                title={p.name}
                subtitle={`${p.owner} · ${p.version}`}
                right={<StatusBadge status={p.status as any} />}
              />
              <div className="text-sm text-ink-600">
                Governs the responsible operation of AI within the platform. Reviewed at least every 90 days. Enforced via automated policy gates.
              </div>

              {hist.length > 0 && (
                <div className="mt-3 rounded-lg border border-ink-100 bg-ink-50/40 p-2.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                    <History className="h-3 w-3" /> Version history
                  </div>
                  <ul className="space-y-1 text-xs text-ink-700">
                    {hist.map((h) => (
                      <li key={h.v} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 rounded-full border border-ink-200 bg-white px-1.5 text-[10px] font-semibold text-ink-700">{h.v}</span>
                        <span className="min-w-0 flex-1 truncate" title={h.note}>{h.note}</span>
                        <span className="shrink-0 text-[10px] text-ink-500">{h.at}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <RiskBadge level={p.risk as any} />
                <SourceBadge source="Public-source linked" />
                <span className="ml-auto text-xs text-ink-500">Updated {p.updated}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-outline flex-1">Read policy</button>
                <button className="btn-primary flex-1">Attestation</button>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="Compliance attestation"
            subtitle="Officers who have signed off on the current policy set"
            right={<div className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {ATTESTATION_OFFICERS.map((o) => (
              <li key={o.name} className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink-800">{o.name}</div>
                  <div className="truncate text-[11px] text-ink-500">{o.role}</div>
                </div>
                <span className="shrink-0 text-[11px] text-ink-500">{o.at}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-2 rounded-md border border-brand-200 bg-brand-soft p-3 text-xs text-ink-700">
            <ShieldCheck className="h-4 w-4 text-brand-500" />
            <span>6 of 8 officers attested · next full attestation window opens 01 Aug 2026.</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Policy dependencies"
            subtitle="Which policies inherit which"
            right={<div className="flex items-center gap-2"><Network className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {DEPS.map(([from, to]) => (
              <div key={from + to} className="flex items-center gap-2 rounded-md border border-ink-100 p-2 text-xs">
                <span className="truncate rounded bg-brand-soft px-2 py-1 font-medium text-brand-700">{from}</span>
                <span className="text-ink-400">→</span>
                <span className="truncate rounded bg-ink-50 px-2 py-1 text-ink-700">{to}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-ink-500">
            An update to a parent policy triggers a mandatory review of all dependent policies within 30 days.
          </div>
        </Card>
      </div>
    </div>
  )
}
