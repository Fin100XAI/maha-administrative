import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { GaugeCircle, User, ClipboardCheck, Route, ChevronDown, Sparkles, Layers } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge, SourceBadge, StatusBadge, ClassificationBadge } from '@/components/ui/Badges'

const FEATURES = [
  { name: 'GR-2026-URD-118 clause 5.1', v: 92 },
  { name: 'Budget doc art. 47', v: 78 },
  { name: 'DIT prompt template v3.1', v: 66 },
  { name: 'HITL guardrail policy', v: 58 },
  { name: 'Historical GR corpus (2020-25)', v: 42 },
  { name: 'Marathi legal register lexicon', v: 34 },
]

const SIMILAR = [
  { id: 'DEC-8821', at: '2026-05-14', title: 'Note draft for GR-2025-URD-094 (PMAY-U review committee)', reviewer: 'N. Deshpande', outcome: 'Approved', similarity: 0.88 },
  { id: 'DEC-8756', at: '2026-04-02', title: 'Note draft for GR-2025-URD-072 (grievance redressal)', reviewer: 'K. Kore', outcome: 'Approved with edits', similarity: 0.81 },
  { id: 'DEC-8691', at: '2026-02-10', title: 'Note draft for GR-2024-URD-118 (Urban Housing outlay)', reviewer: 'N. Deshpande', outcome: 'Approved', similarity: 0.79 },
]

const REASONING = [
  { s: 'Parse intent', d: 'Identified as an internal note draft request for a housing-related GR.' },
  { s: 'Retrieve context', d: 'Top-3 sources: GR-2026-URD-118, FY 2026-27 Budget, DIT SOP-012 (sim 0.82 avg).' },
  { s: 'Select tone', d: 'Formal Marathi/English administrative register — matched to prompt v3.1.' },
  { s: 'Draft & self-check', d: 'Generated 3 candidates; picked highest citation coverage (91%).' },
  { s: 'Guardrail pass', d: 'DLP clean · classification tagged Internal · HITL gate opened.' },
]

export function Explainability() {
  const [openReasoning, setOpenReasoning] = useState(true)

  return (
    <div>
      <PageHeader
        title="Explainability"
        description="For every AI output — sources used, why this answer, confidence, model, prompt, classification, reviewer and decision trace."
        breadcrumb={['Governance', 'Explainability']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Recent AI output" subtitle="Note draft for GR-2026-URD-118" right={<div className="flex gap-2"><ConfidenceBadge score={91} /><ClassificationBadge level="Internal" /></div>} />
          <div className="rounded-xl border border-ink-100 bg-white p-4 font-serif text-[13px] leading-relaxed text-ink-800">
            The Directorate of Information Technology has been directed to co-ordinate roll-out of PMAY-U 2.0 verification.
            District Collectors shall constitute grievance redressal committees within seven days of GR publication.
            Financial impact is neutral within the FY 2026-27 outlay under the Urban Housing head.
          </div>

          <div className="mt-4">
            <CardHeader
              title="Feature importance"
              subtitle="Which inputs shaped this output"
              right={<div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <div style={{ height: 220 }} className="w-full">
              <ResponsiveContainer>
                <BarChart data={FEATURES} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid horizontal={false} stroke="#eef2f7" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={180} tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="v" radius={[0, 8, 8, 0]} fill="#D81B60" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4">
            <CardHeader
              title="Similar prior decisions"
              subtitle="Top-3 nearest cases from the decision archive"
              right={<div className="flex items-center gap-2"><Layers className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <ul className="space-y-2">
              {SIMILAR.map((c) => (
                <li key={c.id} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="line-clamp-2 text-sm font-medium text-ink-800">{c.title}</div>
                      <div className="truncate text-[11px] text-ink-500">{c.id} · {c.at} · reviewer {c.reviewer}</div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="chip border border-brand-200 bg-brand-soft text-brand-700">sim {c.similarity.toFixed(2)}</span>
                      <StatusBadge status={c.outcome === 'Approved' ? 'Approved' : 'Under Review'} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Why this answer" right={<GaugeCircle className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm text-ink-700">
              <li>• Retrieved Clause 5.1 from GR-2026-URD-118 (page 4)</li>
              <li>• Cross-referenced Article 47 of FY 2026-27 Budget document (public source)</li>
              <li>• Aligned drafting style with DIT prompt v3.1 (approved)</li>
              <li>• Applied HITL guardrail — awaits Deputy Secretary review</li>
            </ul>
          </Card>
          <Card>
            <CardHeader title="Sources used" right={<SourceBadge source="Public-source linked" />} />
            <ol className="space-y-1 text-xs text-ink-700">
              <li>1. gr.maharashtra.gov.in — GR-2026-URD-118 · public</li>
              <li>2. finance.maharashtra.gov.in — Budget 2026-27 · public</li>
              <li>3. MAII KB — DIT/SOP/012 · internal</li>
            </ol>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Model used" />
              <div className="text-sm text-ink-800">BharatGPT — Sovereign Council · v2.4.1</div>
              <div className="text-xs text-ink-500">On-prem inference · Air-gapped</div>
            </Card>
            <Card>
              <CardHeader title="Prompt used" />
              <div className="text-sm text-ink-800">DIT/Note/v3.1 · Formal drafting</div>
              <div className="text-xs text-ink-500">Governance status: Approved</div>
            </Card>
            <Card>
              <CardHeader title="Human reviewer" right={<User className="h-4 w-4 text-ink-400" />} />
              <div className="text-sm text-ink-800">Nikhil Deshpande · Deputy Secretary (DIT)</div>
              <div className="text-xs text-ink-500">Reviewing since 07-Jul-2026 10:14</div>
            </Card>
            <Card>
              <CardHeader title="Data classification" right={<ClassificationBadge level="Internal" />} />
              <div className="text-sm text-ink-800">Internal — GoM circulation</div>
              <div className="text-xs text-ink-500">Access limited to DIT + UDD</div>
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Model reasoning steps"
              subtitle="Step-by-step trace"
              right={
                <button
                  onClick={() => setOpenReasoning((v) => !v)}
                  className="btn-outline !py-1"
                  title="Toggle"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${openReasoning ? 'rotate-180' : ''}`} />
                  {openReasoning ? 'Collapse' : 'Expand'}
                </button>
              }
            />
            {openReasoning && (
              <ol className="relative space-y-3 border-l border-ink-100 pl-4 text-sm text-ink-700">
                {REASONING.map((r, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 grid h-3 w-3 place-items-center rounded-full bg-white ring-2 ring-brand-400" />
                    <div className="font-semibold text-ink-800">{r.s}</div>
                    <div className="text-xs text-ink-600">{r.d}</div>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card>
            <CardHeader title="Decision trace" right={<Route className="h-4 w-4 text-brand-500" />} />
            <ol className="relative space-y-3 border-l border-ink-100 pl-4 text-xs text-ink-700">
              {[
                'Prompt received · classified Internal',
                'DLP scan — no sensitive data leaked',
                'Retrieval: 3 sources · avg similarity 0.82',
                'Draft generated · confidence 91%',
                'Fact-checker: all claims cited',
                'HITL gate opened — awaiting DS review',
              ].map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 grid h-3 w-3 rounded-full bg-white ring-2 ring-brand-400" />
                  {s}
                </li>
              ))}
            </ol>
          </Card>
          <div className="flex gap-2">
            <button className="btn-outline flex-1"><ClipboardCheck className="h-4 w-4" /> Send for approval</button>
            <button className="btn-primary flex-1">Download trace (JSON)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
