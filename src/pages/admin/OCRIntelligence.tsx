import { Upload, FileText, ScanText, Languages } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, ConfidenceBadge } from '@/components/ui/Badges'

export function OCRIntelligence() {
  return (
    <div>
      <PageHeader
        title="OCR Intelligence"
        description="Scan and extract text from documents in Marathi, Hindi and English. Includes table extraction and handwritten note detection."
        breadcrumb={['Administrative AI', 'OCR Intelligence']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Upload scanned document" subtitle="JPG · PNG · PDF (image)" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop scanned page(s) here</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 rounded-xl border border-ink-100 bg-white p-4">
            <div className="section-title mb-2">Detected characteristics</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-ink-500">Language: </span><span className="font-medium">Marathi + English</span></div>
              <div><span className="text-ink-500">Pages: </span><span className="font-medium">3</span></div>
              <div><span className="text-ink-500">Handwritten: </span><span className="font-medium">Yes (page 2)</span></div>
              <div><span className="text-ink-500">Tables: </span><span className="font-medium">1 detected</span></div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="OCR result" subtitle="Text extracted · Confidence 88%" right={<ConfidenceBadge score={88} />} />
          <div className="rounded-xl border border-ink-100 bg-white p-4 font-serif text-sm leading-relaxed text-ink-800">
            <p><b>महाराष्ट्र शासन</b><br /><span className="text-xs text-ink-500">नगर विकास विभाग · मंत्रालय, मुंबई</span></p>
            <p className="mt-2"><b>विषय:</b> पीएमएवाय-यू 2.0 अंतर्गत लाभार्थ्यांच्या पडताळणीसाठी सुधारित कार्यपद्धती</p>
            <p className="mt-2 text-ink-700">या शासन निर्णयान्वये...</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button className="btn-outline"><FileText className="h-4 w-4" /> Searchable PDF</button>
            <button className="btn-outline"><Languages className="h-4 w-4" /> Translate</button>
            <button className="btn-primary"><ScanText className="h-4 w-4" /> Send to Workspace</button>
            <div className="ml-auto"><SourceBadge source="Demo" /></div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Section-wise confidence" />
          <ul className="space-y-2">
            {[
              { s: 'Header block', c: 96 },
              { s: 'Body paragraph 1', c: 92 },
              { s: 'Body paragraph 2', c: 87 },
              { s: 'Handwritten margin note (p.2)', c: 62 },
              { s: 'Table on page 3', c: 84 },
            ].map((r) => (
              <li key={r.s} className="flex items-center gap-3">
                <span className="w-56 shrink-0 text-sm text-ink-700">{r.s}</span>
                <div className="flex-1"><div className="h-2 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.c}%` }} /></div></div>
                <span className="w-10 text-right text-sm font-medium text-ink-800">{r.c}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Extracted table (preview)" right={<StatusBadge status="Approved" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>
                <th className="table-th">ULB</th>
                <th className="table-th">Households (est.)</th>
                <th className="table-th">Verified</th>
                <th className="table-th">Pending</th>
              </tr></thead>
              <tbody>
                {[
                  ['Pune Municipal Corp.', '68,240', '46,120', '22,120'],
                  ['Nagpur Municipal Corp.', '52,180', '31,470', '20,710'],
                  ['Nashik Municipal Corp.', '41,340', '28,910', '12,430'],
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="table-td">{r[0]}</td>
                    <td className="table-td">{r[1]}</td>
                    <td className="table-td">{r[2]}</td>
                    <td className="table-td">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
