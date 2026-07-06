import { GaugeCircle, User, ClipboardCheck, Route } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge, SourceBadge, StatusBadge, ClassificationBadge } from '@/components/ui/Badges'

export function Explainability() {
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
