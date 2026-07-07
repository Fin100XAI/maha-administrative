import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Database, Upload, Cpu, Bot, ClipboardCheck, Archive, ArrowRight, FolderTree, ShieldAlert, GaugeCircle } from 'lucide-react'
import { ASSET_TREE, LINEAGE_IMPACT, QUALITY_GATES, AssetNode } from '@/data/dpdpSamples'

const NODES = [
  { name: 'Source', icon: Upload, desc: 'MahaDBT - e-Office - Aaple Sarkar - Manual upload', color: 'from-sky-500 to-sky-700' },
  { name: 'Ingestion', icon: Database, desc: 'DLP scan - classification - consent check', color: 'from-google-blue-500 to-google-blue-700' },
  { name: 'Processing', icon: Cpu, desc: 'OCR - extraction - normalisation - vectorisation', color: 'from-brand-500 to-brand-900' },
  { name: 'AI Use', icon: Bot, desc: 'Retrieval - reasoning - drafting - translation', color: 'from-google-red-500 to-google-red-700' },
  { name: 'Output', icon: ClipboardCheck, desc: 'Draft note - summary - advisory - reply', color: 'from-amber-500 to-orange-600' },
  { name: 'Approval', icon: ClipboardCheck, desc: 'HITL - SO to US to DS to PS to CS', color: 'from-emerald-500 to-emerald-700' },
  { name: 'Archive', icon: Archive, desc: 'Immutable log - retention - legal hold', color: 'from-ink-500 to-ink-800' },
]

const KIND_COLOR: Record<AssetNode['kind'], string> = {
  source:    'bg-sky-50 text-sky-700 border-sky-200',
  ingest:    'bg-google-blue-50 text-google-blue-700 border-google-blue-100',
  processed: 'bg-brand-soft text-brand-700 border-brand-100',
  model:     'bg-google-red-50 text-google-red-700 border-google-red-100',
  output:    'bg-amber-50 text-amber-700 border-amber-200',
}

function AssetBranch({ node, depth = 0 }: { node: AssetNode; depth?: number }) {
  return (
    <div className={depth === 0 ? '' : 'ml-4 border-l border-dashed border-ink-200 pl-3'}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`chip border text-[10px] shrink-0 ${KIND_COLOR[node.kind]}`}>{node.kind}</span>
        <span className="truncate text-xs font-medium text-ink-800">{node.name}</span>
      </div>
      {node.children?.map((c) => (
        <AssetBranch key={c.id} node={c} depth={depth + 1} />
      ))}
    </div>
  )
}

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
              { d: 'Source to Ingestion', c: 96 },
              { d: 'Ingestion to Processing', c: 92 },
              { d: 'Processing to AI Use', c: 84 },
              { d: 'AI Use to Output', c: 82 },
              { d: 'Output to Approval', c: 88 },
              { d: 'Approval to Archive', c: 94 },
            ].map((r) => (
              <li key={r.d}>
                <div className="mb-1 flex justify-between text-xs"><span>{r.d}</span><span className="font-medium">{r.c}%</span></div>
                <div className="h-1.5 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${r.c}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Example trace - Draft note for GR-2026-URD-118" right={<StatusBadge status="Under Review" />} />
          <ol className="relative space-y-3 border-l border-ink-100 pl-4 text-sm">
            {[
              'Source - gr.maharashtra.gov.in (public)',
              'Ingestion - classified Internal - consent template CN-8241',
              'Processing - OCR + vectorisation (v3)',
              'AI Use - BharatGPT v2.4.1 - confidence 91%',
              'Output - note draft DIT/AI/2026/07/118',
              'Approval - HITL pending at Deputy Secretary',
              'Archive - retention 10 years - legal hold none',
            ].map((s, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1 grid h-3 w-3 rounded-full bg-white ring-2 ring-brand-400" />
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Data asset explorer"
            subtitle="Top-5 asset lineage with parent-child hops"
            right={<div className="flex items-center gap-2"><FolderTree className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ASSET_TREE.map((a) => (
              <div key={a.id} className="rounded-xl border border-ink-100 p-3">
                <AssetBranch node={a} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Impact analysis"
            subtitle="What breaks if a source changes"
            right={<ShieldAlert className="h-4 w-4 text-amber-500" />}
          />
          <ul className="space-y-2">
            {LINEAGE_IMPACT.map((r) => (
              <li key={r.source} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{r.source}</div>
                    <div className="mt-0.5 truncate text-xs text-ink-500">
                      Break: {r.break} - Downstream: {r.downstream}
                    </div>
                  </div>
                  <RiskBadge level={r.blastRadius} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Data-quality gate results"
          subtitle="Pass rate at each stage - last 24h"
          right={<div className="flex items-center gap-2"><GaugeCircle className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr>{['Stage', 'Gate', 'Pass %', 'Fail %', 'Trend'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {QUALITY_GATES.map((g) => (
                <tr key={g.stage} className="hover:bg-ink-50/40">
                  <td className="table-td font-medium text-ink-800">{g.stage}</td>
                  <td className="table-td text-ink-500">{g.gate}</td>
                  <td className="table-td font-mono">{g.pass}%</td>
                  <td className="table-td font-mono">{g.fail}%</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded bg-ink-100">
                        <div className="h-full bg-emerald-500" style={{ width: `${g.pass}%` }} />
                      </div>
                      <span className={`chip border text-[10px] ${g.pass >= 95 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : g.pass >= 85 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {g.pass >= 95 ? 'Healthy' : g.pass >= 85 ? 'Watch' : 'At-risk'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
