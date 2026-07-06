import { useMemo, useState } from 'react'
import { Search, Filter, Network, ChevronRight, Sparkles, TrendingUp, Trophy, Wand2, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { SourceBadge } from '@/components/ui/Badges'
import { KNOWLEDGE } from '@/data/knowledge'
import { DEPARTMENTS } from '@/data/departments'
import {
  TRENDING_QUERIES,
  DEPT_COVERAGE_LEADERBOARD,
} from '@/data/knowledgeSamples'
import { KnowledgeGraphSVG } from './_components/KnowledgeGraphSVG'

type SearchMode = 'semantic' | 'keyword'

export function DepartmentKnowledge() {
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [type, setType] = useState('All')
  const [lang, setLang] = useState('All')
  const [mode, setMode] = useState<SearchMode>('semantic')
  const [askInput, setAskInput] = useState('')

  const filtered = useMemo(() => KNOWLEDGE.filter((k) =>
    (dept === 'All' || k.dept === dept) &&
    (type === 'All' || k.type === type) &&
    (lang === 'All' || k.language === lang) &&
    (q.trim() === '' || (k.title + ' ' + k.dept + ' ' + k.source).toLowerCase().includes(q.toLowerCase()))
  ), [q, dept, type, lang])

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<BookOpen className="h-5 w-5" />}
        title="Department Knowledge Base"
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

          {/* Semantic vs Keyword toggle */}
          <div className="flex flex-wrap items-center gap-2 md:col-span-2">
            <div className="inline-flex overflow-hidden rounded-full border border-ink-200 bg-white p-0.5">
              {(['semantic', 'keyword'] as SearchMode[]).map((m) => {
                const active = mode === m
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`chip !rounded-full !px-3 !py-1 text-xs transition-colors ${
                      active ? 'bg-brand-gradient text-white shadow-glow' : 'text-ink-600 hover:text-brand-600'
                    }`}
                  >
                    {m === 'semantic' ? <Sparkles className="h-3 w-3" /> : <Filter className="h-3 w-3" />}
                    {m === 'semantic' ? 'Semantic' : 'Keyword'}
                  </button>
                )
              })}
            </div>
            <span className="text-xs text-ink-500">
              {mode === 'semantic'
                ? 'Vector + BM25 hybrid; results ranked by intent and citation strength.'
                : 'Exact phrase match with stemming; recall over precision.'}
            </span>
            <SourceBadge source="Demo" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-6">
          {/* Knowledge graph visual */}
          <Card>
            <CardHeader
              title="Knowledge graph — 6 anchor documents"
              subtitle="Nodes are documents; edges show supersession, dependency and notification links."
              right={<span className="chip border border-ink-200 bg-ink-50 text-ink-600"><Network className="h-3 w-3" /> Interactive preview</span>}
            />
            <KnowledgeGraphSVG />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-ink-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#D81B60' }} /> GR</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#6A1B9A' }} /> SOP</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#4A148C' }} /> Circular</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: '#EC407A' }} /> Policy</span>
              <SourceBadge source="Demo" />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
            {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No results — try broadening filters.</div>}
          </div>
        </div>

        <div className="space-y-4">
          {/* Ask MAII AI right-rail */}
          <Card className="bg-brand-soft">
            <CardHeader
              title="Ask MAII AI about the knowledge base"
              subtitle="Grounded on department GRs, circulars and SOPs. Cites every claim."
              right={<Wand2 className="h-4 w-4 text-brand-500" />}
            />
            <div className="relative">
              <input
                className="input pr-24"
                placeholder='e.g. "Which PMAY-U 2.0 clause supersedes GR-2024-URD-074?"'
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
              />
              <button className="btn-primary absolute right-1 top-1/2 -translate-y-1/2 !px-3 !py-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5" /> Ask
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Recent DPDP SOPs', 'Marathi drafting rules', 'GRs replaced this quarter', 'ASHA honorarium updates'].map((s) => (
                <button
                  key={s}
                  onClick={() => setAskInput(s)}
                  className="chip border border-brand-100 bg-white text-brand-700 hover:border-brand-300"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-ink-500">
              Answers are routed to the on-prem sovereign model when the query touches Confidential material.
            </div>
          </Card>

          {/* Trending queries */}
          <Card>
            <CardHeader
              title="Trending queries this week"
              subtitle="Ranked by unique officer sessions"
              right={<TrendingUp className="h-4 w-4 text-brand-500" />}
            />
            <ol className="space-y-2 text-sm">
              {TRENDING_QUERIES.map((t, i) => (
                <motion.li
                  key={t.q}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between gap-3 rounded-md border border-ink-100 px-3 py-2 hover:border-brand-200 hover:bg-brand-soft"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-[10px] font-semibold text-brand-700">{i + 1}</span>
                    <span className="truncate text-ink-700" title={t.q}>{t.q}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-ink-500">
                    <span>{t.count}</span>
                    <span className={t.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {t.delta >= 0 ? '▲' : '▼'} {Math.abs(t.delta).toFixed(1)}%
                    </span>
                  </div>
                </motion.li>
              ))}
            </ol>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>

          {/* Coverage leaderboard */}
          <Card>
            <CardHeader
              title="Departments with best-indexed knowledge"
              subtitle="Coverage = share of active docs vectorised and cross-referenced"
              right={<Trophy className="h-4 w-4 text-amber-500" />}
            />
            <ul className="space-y-3 text-sm">
              {DEPT_COVERAGE_LEADERBOARD.map((d) => (
                <li key={d.code}>
                  <div className="flex items-center justify-between text-xs text-ink-600">
                    <span className="truncate font-medium text-ink-800" title={d.name}>{d.name}</span>
                    <span className="tabular-nums text-ink-500">{d.indexed.toLocaleString()} docs · {d.coverage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${d.coverage}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>

          {/* Existing graph list */}
          <Card>
            <CardHeader title="Related to top result" right={<Network className="h-4 w-4 text-brand-500" />} />
            <p className="text-xs text-ink-500">Related nodes for the top result, PMAY-U 2.0 Guidelines:</p>
            <ul className="mt-2 space-y-2 text-sm">
              {['GR-2024-URD-074 · Housing Data Standards', 'GR-2025-URD-092 · Grievance SOP', 'SOP-2026-DPO-004 · DPDP Consent', 'CIR-2026-DIT-014 · MAII Roll-out'].map((n) => (
                <li key={n} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="truncate text-ink-700" title={n}>{n}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />
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
