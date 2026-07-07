import { Upload, GitCompare, Table2, Signature, FileText, AlertTriangle, FileBox, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'
import { PDF_UPLOADS, PDF_BATCH, PDF_VOLUME_7D } from '@/data/adminSamples'
import { CompareDiff, DiffRow } from './_components/CompareDiff'
import { UploadsTable } from './_components/UploadsTable'
import { BatchQueue } from './_components/BatchQueue'
import { VolumeInsights } from './_components/VolumeInsights'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const PDF_DIFF: DiffRow[] = [
  {
    clause: 'Section 3 · Beneficiary criteria',
    kind: 'modified',
    left: 'Applicant must produce local domicile proof issued within the last 2 years.',
    right: 'Applicant may present Aadhaar or any DPDP-compliant identity artefact; domicile relaxed for rural migrants.',
  },
  {
    clause: 'Section 4 · Timelines',
    kind: 'modified',
    left: 'Cross-verification within 30 working days.',
    right: 'Cross-verification within 15 working days via MahaDBT API.',
  },
  {
    clause: 'Section 5 · Grievance',
    kind: 'added',
    left: '',
    right: 'District Grievance Committee constituted within 7 days of GR publication.',
  },
  {
    clause: 'Section 7 · Fallback',
    kind: 'removed',
    left: 'Manual ULB fallback permitted if digital verification fails twice.',
    right: '',
  },
]

export function PDFIntelligence() {
  return (
    <div>
      <PageHeader
        title="PDF Intelligence"
        description="Ask a PDF, compare two PDFs, extract tables, detect missing pages, extract signatures, generate executive summary, and flag risky clauses."
        breadcrumb={['Administrative AI', 'PDF Intelligence']}
        source="Demo"
        eyebrow="Documents"
        icon={<FileBox className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upload PDF" subtitle="Text or scanned PDFs · up to 200 MB" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop PDF or click to browse</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          <div className="mt-3 flex flex-wrap items-center gap-2">
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

      {/* Compare two PDFs */}
      <div className="mt-6">
        <CompareDiff
          leftLabel="v1 · draft-2026-05.pdf"
          rightLabel="v2 · GR-2026-URD-118.pdf"
          rows={PDF_DIFF}
          title="Compare two PDFs"
          subtitle="Section-level diff across two versions of the same document"
        />
      </div>

      {/* Insights + batch */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <VolumeInsights title="PDF processing volume — last 7 days" data={PDF_VOLUME_7D} />
        <BatchQueue jobs={PDF_BATCH} title="PDF batch queue" subtitle="Bulk PDF extraction jobs" />
      </div>

      {/* Recent uploads + quick actions + shortcuts */}
      <div className="mt-6 space-y-6">
        <UploadsTable rows={PDF_UPLOADS} subtitle="PDFs uploaded to the intelligence pipeline this week" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <QuickActions
            actions={[
              { label: 'Save summary', icon: <Save className="h-4 w-4" /> },
              { label: 'Send answer to Workspace', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy citation link', icon: <Link2 className="h-4 w-4" /> },
              { label: 'Extract all tables', icon: <Table2 className="h-4 w-4" /> },
            ]}
          />
          <Shortcuts
            items={[
              { keys: '⌘ U', label: 'Upload PDF' },
              { keys: '⌘ K', label: 'Ask this PDF' },
              { keys: '⌘ D', label: 'Toggle compare mode' },
              { keys: '⌘ T', label: 'Extract tables' },
              { keys: '⌘ ⇧ B', label: 'Open batch queue' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
