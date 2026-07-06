import { GitBranch, Rocket, Undo2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { MODELS } from '@/data/models'

const HISTORY = [
  { model: 'BharatGPT — Sovereign Council', version: 'v2.4.1', at: '2026-06-24', changes: 'Improved Marathi legal register + reduced hallucination rate 18%', by: 'DIT AI Lab', status: 'Approved' as const, risk: 'Low' as const },
  { model: 'BharatGPT — Sovereign Council', version: 'v2.4.0', at: '2026-05-11', changes: 'Long-context extension to 128k', by: 'DIT AI Lab', status: 'Retired' as const, risk: 'Low' as const },
  { model: 'Sarvam-M', version: 'v1.8', at: '2026-06-10', changes: 'Fine-tune on GAD Marathi corpus', by: 'Language Lab', status: 'Approved' as const, risk: 'Low' as const },
  { model: 'Gemini 2.5 Pro', version: '2026-06', at: '2026-06-14', changes: 'Provider upstream release', by: 'External Models Cell', status: 'Under Review' as const, risk: 'Medium' as const },
  { model: 'Llama 3.3 70B — Sarkar Tuned', version: 'v3.3-DIT-v2', at: '2026-06-18', changes: 'DPO alignment for compliance drafting', by: 'DIT AI Lab', status: 'Approved' as const, risk: 'Low' as const },
  { model: 'Gemma 2 9B — Field OCR', version: 'v2.1', at: '2026-05-30', changes: 'Handwriting improvement', by: 'OCR Cell', status: 'Approved' as const, risk: 'Low' as const },
]

export function ModelVersioning() {
  return (
    <div>
      <PageHeader
        title="Model Versioning"
        description="Version history for every registered model. Deployment gates, rollback authority, evaluation notes."
        breadcrumb={['Governance', 'Model Versioning']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Change log" right={<SourceBadge source="Demo" />} />
          <ol className="relative space-y-4 border-l border-ink-100 pl-6">
            {HISTORY.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-brand-400"><GitBranch className="h-3 w-3 text-brand-500" /></span>
                <div className="text-xs text-ink-500">{h.at}</div>
                <div className="text-sm font-semibold text-ink-800">{h.model} · {h.version}</div>
                <div className="mt-0.5 text-xs text-ink-600">{h.changes} — by {h.by}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={h.status} />
                  <RiskBadge level={h.risk} />
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Deployment gates" />
            <ul className="space-y-2 text-sm">
              {[
                'Security scan (SAST/DAST) — passed',
                'Bias evaluation on Bharat-Bench — passed',
                'Hallucination panel — 3 reviewers required',
                'DPO sign-off — pending',
                'Rollback plan filed',
              ].map((g, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="text-ink-700">{g}</span>
                  <StatusBadge status={i === 3 ? 'Under Review' : 'Approved'} />
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Currently in canary" right={<StatusBadge status="Under Review" />} />
            <div className="rounded-xl border border-ink-100 p-4">
              <div className="text-sm font-semibold text-ink-900">Gemini 2.5 Pro · 2026-06 release</div>
              <div className="text-xs text-ink-500">10% traffic · 3 department pilot · monitor for drift</div>
              <div className="mt-2 flex gap-2">
                <button className="btn-outline"><Rocket className="h-4 w-4" /> Promote</button>
                <button className="btn-outline"><Undo2 className="h-4 w-4" /> Rollback</button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Available models" />
            <ul className="space-y-1.5 text-sm">
              {MODELS.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="text-ink-800">{m.name}</span>
                  <span className="text-xs text-ink-500">v{m.version}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
