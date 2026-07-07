import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { GitBranch, Rocket, Undo2, ShieldCheck, Layers, GaugeCircle } from 'lucide-react'
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
  { model: 'Sarvam-M', version: 'v1.7', at: '2026-04-02', changes: 'Reduced repetition penalty regression', by: 'Language Lab', status: 'Retired' as const, risk: 'Low' as const },
  { model: 'Claude Opus 4.7', version: '4.7', at: '2026-06-28', changes: 'Provider upstream; DLP filter re-tested', by: 'External Models Cell', status: 'Approved' as const, risk: 'Medium' as const },
  { model: 'GPT-4o', version: '2026-05', at: '2026-05-19', changes: 'Provider snapshot pin', by: 'External Models Cell', status: 'Approved' as const, risk: 'Medium' as const },
  { model: 'BharatGPT — Sovereign Council', version: 'v2.3.9', at: '2026-03-08', changes: 'Baseline snapshot before 128k extension', by: 'DIT AI Lab', status: 'Retired' as const, risk: 'Low' as const },
  { model: 'Llama 3.3 70B — Sarkar Tuned', version: 'v3.3-DIT-v1', at: '2026-02-14', changes: 'First DPO alignment attempt (rolled back)', by: 'DIT AI Lab', status: 'Rolled Back' as const, risk: 'Medium' as const },
  { model: 'Gemma 2 9B — Field OCR', version: 'v2.0', at: '2026-02-01', changes: 'Baseline OCR fine-tune', by: 'OCR Cell', status: 'Retired' as const, risk: 'Low' as const },
]

const STRATEGIES = [
  { key: 'blue-green', name: 'Blue-Green', desc: 'Two identical stacks; switch traffic in one step. Instant rollback.', for: 'Regulatory releases', active: false },
  { key: 'canary', name: 'Canary', desc: '5 → 25 → 100% traffic ramp over 72 hours with metric gates.', for: 'Current: Gemini 2.5 Pro', active: true },
  { key: 'rolling', name: 'Rolling', desc: 'Pod-by-pod update. Safest under load; no downtime.', for: 'Steady-state patches', active: false },
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STRATEGIES.map((s) => (
          <div
            key={s.key}
            className={`card p-4 transition-all ${s.active ? 'ring-2 ring-brand-500' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600">
                  <Layers className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{s.name}</div>
                  <div className="text-[11px] text-ink-500">{s.for}</div>
                </div>
              </div>
              {s.active && <StatusBadge status="Active" />}
            </div>
            <div className="mt-3 text-xs text-ink-600">{s.desc}</div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-gradient"
                style={{ width: s.active ? '35%' : '0%' }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-ink-500">
              <span>0%</span><span>{s.active ? 'Canary at 35%' : 'Idle'}</span><span>100%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Change log" subtitle={`${HISTORY.length} entries`} right={<SourceBadge source="Demo" />} />
          <ol className="relative space-y-4 border-l border-ink-100 pl-6">
            {HISTORY.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-brand-400"><GitBranch className="h-3 w-3 text-brand-500" /></span>
                <div className="text-xs text-ink-500">{h.at}</div>
                <div className="text-sm font-semibold text-ink-800">{h.model} · {h.version}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-ink-600">{h.changes} — by {h.by}</div>
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
            <CardHeader
              title="Rollback confidence"
              subtitle="Gemini 2.5 Pro canary"
              right={<div className="flex items-center gap-2"><GaugeCircle className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_minmax(0,1fr)]">
              <div style={{ height: 160 }} className="w-full">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ v: 82, fill: '#0B57D0' }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar background dataKey="v" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="-mt-24 text-center text-2xl font-semibold text-ink-900">82%</div>
              </div>
              <ul className="space-y-1.5 text-xs text-ink-700">
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Prior rollback drilled 07-Jun-2026</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Blue stack warm · RPO &lt; 60s</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Data schema forward-compatible</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> External proxy fallback untested this week</li>
              </ul>
            </div>
          </Card>

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
                  <span className="truncate text-ink-800">{m.name}</span>
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
