import { Upload, ChevronRight, AlertTriangle, FileText, ClipboardCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge, ConfidenceBadge } from '@/components/ui/Badges'

export function FileSummarization() {
  return (
    <div>
      <PageHeader
        title="File Summarization"
        description="Ingest a file (e-Office bundle) and get a timeline, key decisions, pending approvals, missing annexures and suggested next actions."
        breadcrumb={['Administrative AI', 'File Summarization']}
        source="Demo"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Upload file" subtitle="e-Office file bundle · ZIP/PDF" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop e-Office file bundle here</div>
            <div className="mt-1 text-xs text-ink-500">MAII will parse note sheets, correspondence, annexures</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4">
            <div className="section-title mb-2">Similar files (from KB)</div>
            <ul className="space-y-2 text-sm">
              {['DIT/AI/2025/12/044 · AI drafting pilot', 'DIT/AI/2025/09/031 · Sarvam evaluation', 'DIT/AI/2024/06/017 · LLM procurement'].map((s) => (
                <li key={s} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="text-ink-700">{s}</span>
                  <ChevronRight className="h-4 w-4 text-ink-400" />
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-ink-800">File DIT/AI/2026/07/118</div>
            <SourceBadge source="Demo" />
            <ConfidenceBadge score={89} />
          </div>

          <Card>
            <CardHeader title="File timeline" />
            <ol className="relative space-y-3 border-l border-ink-100 pl-4">
              {[
                { d: '04-Jul-2026', t: 'File opened by SO (DIT)' },
                { d: '05-Jul-2026', t: 'Preliminary note sheet drafted' },
                { d: '05-Jul-2026', t: 'Sarvam evaluation report attached' },
                { d: '06-Jul-2026', t: 'Draft moved to US · pending decision' },
              ].map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 grid h-3 w-3 place-items-center rounded-full bg-white ring-2 ring-brand-400"></span>
                  <div className="text-xs text-ink-500">{s.d}</div>
                  <div className="text-sm text-ink-800">{s.t}</div>
                </li>
              ))}
            </ol>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Key decisions" />
              <ul className="space-y-2 text-sm text-ink-700">
                <li>• Sarvam-M chosen over commercial alternatives for Marathi drafting</li>
                <li>• 30-day pilot approved by Deputy Secretary</li>
                <li>• DPO consent language cleared</li>
              </ul>
            </Card>
            <Card>
              <CardHeader title="Pending approvals" right={<ClipboardCheck className="h-4 w-4 text-brand-500" />} />
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Under Secretary</span><StatusBadge status="Under Review" /></li>
                <li className="flex justify-between"><span>Deputy Secretary</span><StatusBadge status="Draft" /></li>
                <li className="flex justify-between"><span>Principal Secretary</span><StatusBadge status="Draft" /></li>
              </ul>
            </Card>
            <Card>
              <CardHeader title="Missing annexures" right={<AlertTriangle className="h-4 w-4 text-amber-500" />} />
              <ul className="space-y-2 text-sm text-ink-700">
                <li>• Annexure-B: Budget justification (referenced in note, not attached)</li>
                <li>• Annexure-D: DPO sign-off certificate</li>
              </ul>
            </Card>
            <Card>
              <CardHeader title="Risk flags" right={<RiskBadge level="Medium" />} />
              <ul className="space-y-2 text-sm text-ink-700">
                <li>• Legal implication not paraphrased in note sheet</li>
                <li>• No explicit citation of DPDP Section 8(4)</li>
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader title="Suggested next action" right={<StatusBadge status="Open" />} />
            <p className="text-sm text-ink-700">Attach Annexure-B and Annexure-D, then move file to Deputy Secretary for decision.</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline"><FileText className="h-4 w-4" /> Export summary (DOCX)</button>
              <button className="btn-primary">Move to Deputy Secretary <ChevronRight className="h-4 w-4" /></button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
