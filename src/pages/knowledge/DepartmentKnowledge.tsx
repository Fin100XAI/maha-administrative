import { useMemo, useState } from 'react'
import { Search, Filter, Network, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { SourceBadge } from '@/components/ui/Badges'
import { KNOWLEDGE } from '@/data/knowledge'
import { DEPARTMENTS } from '@/data/departments'

export function DepartmentKnowledge() {
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [type, setType] = useState('All')
  const [lang, setLang] = useState('All')

  const filtered = useMemo(() => KNOWLEDGE.filter((k) =>
    (dept === 'All' || k.dept === dept) &&
    (type === 'All' || k.type === type) &&
    (lang === 'All' || k.language === lang) &&
    (q.trim() === '' || (k.title + ' ' + k.dept + ' ' + k.source).toLowerCase().includes(q.toLowerCase()))
  ), [q, dept, type, lang])

  return (
    <div>
      <PageHeader
        title="Knowledge Brain — Department Knowledge Base"
        description="Semantic search across the department knowledge base with citations, graph preview, confidence and language filters."
        breadcrumb={['Knowledge Brain', 'Department Knowledge']}
        source="Demo"
      />
      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search GRs, circulars, SOPs, FAQs, notes…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
            <option>All</option>
            {DEPARTMENTS.map((d) => <option key={d.name}>{d.name}</option>)}
            <option>ALL</option>
            <option>DIT</option>
          </select>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {['All','GR','Circular','SOP','FAQ','Note','Policy'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="input md:col-span-2" value={lang} onChange={(e) => setLang(e.target.value)}>
            {['All','English','Marathi','Hindi','Bilingual'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="flex items-center gap-2 md:col-span-2">
            <span className="chip border border-ink-200 bg-ink-50 text-ink-600"><Filter className="h-3 w-3" /> Semantic search enabled</span>
            <SourceBadge source="Demo" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
          {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No results — try broadening filters.</div>}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Knowledge graph preview" right={<Network className="h-4 w-4 text-brand-500" />} />
            <p className="text-xs text-ink-500">Related nodes for the top result, PMAY-U 2.0 Guidelines:</p>
            <ul className="mt-2 space-y-2 text-sm">
              {['GR-2024-URD-074 · Housing Data Standards', 'GR-2025-URD-092 · Grievance SOP', 'SOP-2026-DPO-004 · DPDP Consent', 'CIR-2026-DIT-014 · MAII Roll-out'].map((n) => (
                <li key={n} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="text-ink-700">{n}</span>
                  <ChevronRight className="h-4 w-4 text-ink-400" />
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Public source status" />
            <ul className="space-y-2 text-sm text-ink-700">
              <li>gr.maharashtra.gov.in — Public-source linked</li>
              <li>indiaai.gov.in — Public-source linked</li>
              <li>e-office.gov.in — Department API required</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
