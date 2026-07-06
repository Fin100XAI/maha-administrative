import { Upload, GitCompare, Table2, Signature, FileText, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'

export function PDFIntelligence() {
  return (
    <div>
      <PageHeader
        title="PDF Intelligence"
        description="Ask a PDF, compare two PDFs, extract tables, detect missing pages, extract signatures, generate executive summary, and flag risky clauses."
        breadcrumb={['Administrative AI', 'PDF Intelligence']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upload PDF" subtitle="Text or scanned PDFs · up to 200 MB" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop PDF or click to browse</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-outline"><FileText className="h-4 w-4" /> Ask PDF</button>
            <button className="btn-outline"><GitCompare className="h-4 w-4" /> Compare PDFs</button>
            <button className="btn-outline"><Table2 className="h-4 w-4" /> Extract tables</button>
            <button className="btn-outline"><Signature className="h-4 w-4" /> Extract signatures</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Ask this PDF" subtitle="Retrieval-augmented answer with citations" right={<SourceBadge source="Demo" />} />
          <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-3 text-sm text-ink-700">
            <b>Q:</b> What is the deadline for grievance committee formation?
          </div>
          <div className="mt-3 rounded-xl border border-ink-100 bg-white p-3 text-sm text-ink-800">
            <b>A:</b> Seven days from GR publication (04-Jul-2026 → deadline 11-Jul-2026). <span className="text-xs text-ink-500">Cited from Clause 5.1, page 4.</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="btn-outline">Follow-up: financial impact</button>
            <button className="btn-outline">Follow-up: signatories</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Executive summary" right={<StatusBadge status="Approved" />} />
          <p className="text-sm text-ink-700">This GR revises the beneficiary verification workflow for PMAY-U 2.0. Aadhaar e-KYC becomes mandatory, MahaDBT cross-verification within 15 days, district grievance committee within 7 days. Financial impact neutral within FY 2026-27 outlay.</p>
        </Card>

        <Card>
          <CardHeader title="Clause risk analysis" right={<RiskBadge level="Medium" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /> Clause 3.1 lacks explicit consent language per DPDP Section 6.</li>
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /> Clause 5.2 timeline conflicts with GR-2025-URD-092 (Grievance SOP).</li>
            <li className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" /> Missing appeal window definition for rejected applications.</li>
          </ul>
        </Card>

        <Card>
          <CardHeader title="Missing pages detection" />
          <div className="text-sm text-ink-700">Detected 12 pages in table of contents but only 11 rendered pages. Page 7 appears to be missing.</div>
        </Card>

        <Card>
          <CardHeader title="Signatures" />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>Signed by <b>Milind Mhaiskar</b>, Principal Secretary (UDD) · Page 12</li>
            <li>Counter-signed by <b>Nitin Kareer</b>, Chief Secretary · Page 12</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
