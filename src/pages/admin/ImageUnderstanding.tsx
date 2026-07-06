import { Upload, ImageIcon, Map, ClipboardCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge, ConfidenceBadge } from '@/components/ui/Badges'

export function ImageUnderstanding() {
  return (
    <div>
      <PageHeader
        title="Image Understanding"
        description="Analyse documents, forms, charts, maps, and field inspection photos for administrative decisions."
        breadcrumb={['Administrative AI', 'Image Understanding']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upload image" subtitle="JPG · PNG · HEIC" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop image here</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-outline"><ImageIcon className="h-4 w-4" /> Document image</button>
            <button className="btn-outline"><ClipboardCheck className="h-4 w-4" /> Form extraction</button>
            <button className="btn-outline">Chart interpretation</button>
            <button className="btn-outline"><Map className="h-4 w-4" /> Map understanding</button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Field inspection photo analysis" subtitle="Village school building — Ahmednagar" right={<ConfidenceBadge score={84} />} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Kv k="Structure" v="Concrete, 2-storey" />
            <Kv k="Roof condition" v="Deteriorated (moss)" />
            <Kv k="Toilet block" v="Absent" />
            <Kv k="Boundary wall" v="Partially damaged" />
            <Kv k="Compliance evidence" v="SwachhVidyalaya criteria: 3/5" />
            <Kv k="Recommended action" v="Repair grant proposal" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Extracted form fields" right={<StatusBadge status="Approved" />} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Kv k="Applicant name" v="Sunita R. Kadam" />
            <Kv k="Application no." v="MHDBT/2026/PU/00218" />
            <Kv k="Scheme" v="PMAY-U 2.0" />
            <Kv k="Ward" v="12" />
            <Kv k="Signature detected" v="Yes" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Chart interpretation" />
          <p className="text-sm text-ink-700">The uploaded chart shows month-wise disbursements for FY 25-26 with a 22% dip in September due to model-code freeze. Peak in March aligns with year-end reconciliation.</p>
          <div className="mt-2"><SourceBadge source="Demo" /></div>
        </Card>
      </div>
    </div>
  )
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-ink-500">{k}</div>
      <div className="font-medium text-ink-800">{v}</div>
    </div>
  )
}
