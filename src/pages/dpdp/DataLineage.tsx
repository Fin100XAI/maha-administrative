import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Database, Upload, Cpu, Sparkles, ClipboardCheck, Archive, ArrowRight } from 'lucide-react'

const NODES = [
  { name: 'Source', icon: Upload, desc: 'MahaDBT · e-Office · Aaple Sarkar · Manual upload', color: 'from-sky-500 to-sky-700' },
  { name: 'Ingestion', icon: Database, desc: 'DLP scan · classification · consent check', color: 'from-purple-500 to-purple-700' },
  { name: 'Processing', icon: Cpu, desc: 'OCR · extraction · normalisation · vectorisation', color: 'from-brand-500 to-brand-900' },
  { name: 'AI Use', icon: Sparkles, desc: 'Retrieval · reasoning · drafting · translation', color: 'from-pink-500 to-brand-700' },
  { name: 'Output', icon: ClipboardCheck, desc: 'Draft note · summary · advisory · reply', color: 'from-amber-500 to-orange-600' },
  { name: 'Approval', icon: ClipboardCheck, desc: 'HITL · SO → US → DS → PS → CS', color: 'from-emerald-500 to-emerald-700' },
  { name: 'Archive', icon: Archive, desc: 'Immutable log · retention · legal hold', color: 'from-ink-500 to-ink-800' },
]

export function DataLineage() {
  return (
    <div>
      <PageHeader
        title="Data Lineage"
        description="End-to-end flow: how data enters, is classified, processed by AI, reviewed and archived."
        breadcrumb={['DPDP', 'Data Lineage']}
        source="Demo"
      />

      <Card>
        <CardHeader title="Flow diagram" right={<SourceBadge source="Demo" />} />
        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max items-stretch gap-3">
            {NODES.map((n, i) => (
              <div key={n.name} className="flex items-center gap-3">
                <div className={`flex w-48 shrink-0 flex-col rounded-xl p-3 text-white bg-gradient-to-br ${n.color}`}>
                  <div className="flex items-center gap-2">
                    <n.icon className="h-4 w-4 shrink-0" />
                    <div className="truncate text-xs font-semibold">{n.name}</div>
                  </div>
                  <div className="mt-1 text-[11px] leading-relaxed opacity-90">{n.desc}</div>
                </div>
                {i < NODES.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Lineage coverage" />
          <ul className="space-y-2 text-sm">
            {[
              { d: 'Source → Ingestion', c: 96 },
              { d: 'Ingestion → Processing', c: 92 },
              { d: 'Processing → AI Use', c: 84 },
              { d: 'AI Use → Output', c: 82 },
              { d: 'Output → Approval', c: 88 },
              { d: 'Approval → Archive', c: 94 },
            ].map((r) => (
              <li key={r.d}>
                <div className="mb-1 flex justify-between text-xs"><span>{r.d}</span><span className="font-medium">{r.c}%</span></div>
                <div className="h-1.5 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.c}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Example trace — Draft note for GR-2026-URD-118" right={<StatusBadge status="Under Review" />} />
          <ol className="relative space-y-3 border-l border-ink-100 pl-4 text-sm">
            {[
              'Source · gr.maharashtra.gov.in (public)',
              'Ingestion · classified Internal · consent template CN-8241',
              'Processing · OCR + vectorisation (v3)',
              'AI Use · BharatGPT v2.4.1 · confidence 91%',
              'Output · note draft DIT/AI/2026/07/118',
              'Approval · HITL pending at Deputy Secretary',
              'Archive · retention 10 years · legal hold none',
            ].map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 grid h-3 w-3 rounded-full bg-white ring-2 ring-brand-400" />
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  )
}
