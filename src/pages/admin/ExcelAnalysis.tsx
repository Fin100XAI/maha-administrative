import { Upload, Table2, LineChart as LC, Grid3x3, Calculator } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfidenceBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

const trend = [
  { m: 'Jan', budget: 210, actual: 194 },
  { m: 'Feb', budget: 220, actual: 202 },
  { m: 'Mar', budget: 240, actual: 226 },
  { m: 'Apr', budget: 250, actual: 244 },
  { m: 'May', budget: 260, actual: 252 },
  { m: 'Jun', budget: 275, actual: 268 },
  { m: 'Jul', budget: 290, actual: 281 },
]

export function ExcelAnalysis() {
  return (
    <div>
      <PageHeader
        title="Excel Analysis"
        description="Upload an Excel workbook and MAII will detect columns, score data quality, propose pivots and forecast trends."
        breadcrumb={['Administrative AI', 'Excel Analysis']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.4fr]">
        <Card>
          <CardHeader title="Upload workbook" subtitle="XLSX · CSV" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop XLSX/CSV here</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-outline"><Table2 className="h-4 w-4" /> Detect columns</button>
            <button className="btn-outline"><Grid3x3 className="h-4 w-4" /> Pivot suggestions</button>
            <button className="btn-outline"><Calculator className="h-4 w-4" /> Formula helper</button>
            <button className="btn-outline"><LC className="h-4 w-4" /> Auto-forecast</button>
          </div>

          <div className="mt-4 space-y-2">
            <Metric label="Data quality score" value={82} />
            <Metric label="Missing values" value={4} unit="%" invert />
            <Metric label="Duplicates" value={1.2} unit="%" invert />
            <Metric label="Detected type coverage" value={96} />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Detected columns" subtitle="scheme_budget_actuals.xlsx" right={<StatusBadge status="Approved" />} />
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'district', 'scheme', 'budget_lakh', 'actual_lakh', 'beneficiaries', 'month', 'status', 'notes',
              ].map((c) => (
                <div key={c} className="rounded-md border border-ink-100 bg-white px-3 py-2 font-mono text-ink-700">{c}</div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Trend & forecast" subtitle="Budget vs Actuals (₹ Cr)" right={<div className="flex gap-2"><ConfidenceBadge score={83} /><SourceBadge source="Demo" /></div>} />
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={trend}>
                  <CartesianGrid vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Line type="monotone" dataKey="budget" stroke="#4A148C" strokeWidth={2} />
                  <Line type="monotone" dataKey="actual" stroke="#D81B60" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Pivot suggestions" />
              <ul className="space-y-2 text-sm text-ink-700">
                <li>• Beneficiaries by district × scheme</li>
                <li>• Monthly burn rate (actual / budget)</li>
                <li>• Top 5 schemes by under-utilisation</li>
              </ul>
            </Card>
            <Card>
              <CardHeader title="Formula helper" />
              <div className="rounded-md bg-ink-900 p-3 font-mono text-xs text-emerald-300">=SUMIFS(actual_lakh, district, "Pune", scheme, "PMAY-U 2.0")</div>
              <div className="mt-2 text-xs text-ink-500">Suggested by MAII AI for the pivot above.</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, unit = '%', invert }: { label: string; value: number; unit?: string; invert?: boolean }) {
  const good = invert ? value < 5 : value > 80
  return (
    <div className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2 text-sm">
      <span className="text-ink-700">{label}</span>
      <span className={`font-medium ${good ? 'text-emerald-600' : 'text-amber-600'}`}>{value}{unit}</span>
    </div>
  )
}
