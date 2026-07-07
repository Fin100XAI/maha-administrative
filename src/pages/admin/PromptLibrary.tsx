import { useMemo, useState } from 'react'
import { Search, Copy, Library, Filter, History, ChevronDown, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { cn } from '@/lib/utils'
import { PROMPT_HISTORY, PromptVersion } from '@/data/adminSamples'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const CATEGORIES = [
  'Administration', 'Drafting', 'GR Analysis', 'RTI', 'e-Office', 'HR', 'Procurement', 'Budget',
  'Welfare', 'Health', 'Agriculture', 'Urban Development', 'Police', 'Education', 'Revenue', 'Legal', 'Citizen Services',
]

const RISKS = ['Low', 'Medium', 'High'] as const
const STATUSES = ['Draft', 'Approved', 'Deprecated', 'High Risk', 'Needs Review'] as const

interface Prompt {
  id: string
  title: string
  useCase: string
  department: string
  language: 'English' | 'Marathi' | 'Hindi' | 'Bilingual'
  risk: typeof RISKS[number]
  status: typeof STATUSES[number]
  version: string
  category: string
}

const PROMPTS: Prompt[] = [
  { id: 'p1', title: 'Summarise a GR into 5 bullet points', useCase: 'Executive briefing for the desk of the Chief Secretary — condenses long GR PDFs into decision-ready bullets.', department: 'All', language: 'Bilingual', risk: 'Low', status: 'Approved', version: 'v3', category: 'GR Analysis' },
  { id: 'p2', title: 'Draft formal note for approval', useCase: 'Structured note-sheet drafting with issue, background, financial & legal implication, recommendation.', department: 'DIT', language: 'English', risk: 'Low', status: 'Approved', version: 'v4', category: 'Drafting' },
  { id: 'p3', title: 'Convert order to citizen advisory (Marathi)', useCase: 'Turns a formal order into a plain-language Marathi advisory for citizens.', department: 'GAD', language: 'Marathi', risk: 'Medium', status: 'Approved', version: 'v2', category: 'Citizen Services' },
  { id: 'p4', title: 'Reply to RTI query — Section 6', useCase: 'Drafts a compliant RTI response citing the correct RTI Act 2005 sub-sections.', department: 'All', language: 'English', risk: 'Medium', status: 'Needs Review', version: 'v1', category: 'RTI' },
  { id: 'p5', title: 'Compare two GRs for conflicts', useCase: 'Legal review — highlights conflicting clauses, timelines and obligations across two GRs.', department: 'Legal', language: 'English', risk: 'Medium', status: 'Approved', version: 'v2', category: 'Legal' },
  { id: 'p6', title: 'Procurement note — GFR 2017 alignment', useCase: 'Prepares procurement notes aligned with General Financial Rules 2017.', department: 'Finance', language: 'English', risk: 'Medium', status: 'Approved', version: 'v1', category: 'Procurement' },
  { id: 'p7', title: 'Weekly HFW brief for CS', useCase: 'Weekly public-health digest for Chief Secretary — trends, incidents, outbreaks.', department: 'Health', language: 'English', risk: 'Low', status: 'Approved', version: 'v5', category: 'Health' },
  { id: 'p8', title: 'Crop-loss appeal draft', useCase: 'Farmer grievance draft in formal Marathi with legal citation to e-Fasal Bima GR.', department: 'Agriculture', language: 'Marathi', risk: 'Medium', status: 'Approved', version: 'v2', category: 'Agriculture' },
  { id: 'p9', title: 'Municipal grievance triage', useCase: 'Classifies citizen grievances, assigns ULB owner and estimated SLA.', department: 'UDD', language: 'Bilingual', risk: 'Low', status: 'Approved', version: 'v3', category: 'Urban Development' },
  { id: 'p10', title: 'FIR summary — sensitive redaction', useCase: 'Summarises FIRs with automatic PII redaction for internal briefings.', department: 'Home', language: 'English', risk: 'High', status: 'High Risk', version: 'v1', category: 'Police' },
  { id: 'p11', title: 'Cabinet note distiller', useCase: 'Distils a full cabinet note into a 1-page brief for the Chief Secretary desk.', department: 'GAD', language: 'English', risk: 'Medium', status: 'Approved', version: 'v3', category: 'Administration' },
  { id: 'p12', title: 'Budget speech summary (Marathi)', useCase: 'Assembly briefing — extracts sector-wise commitments and outlays.', department: 'Finance', language: 'Marathi', risk: 'Medium', status: 'Approved', version: 'v2', category: 'Budget' },
  { id: 'p13', title: 'School inspection note', useCase: 'Field-visit note with SwachhVidyalaya criteria checklist and infrastructure grading.', department: 'Education', language: 'Bilingual', risk: 'Low', status: 'Approved', version: 'v2', category: 'Education' },
  { id: 'p14', title: 'Revenue mutation query', useCase: 'Assists Talathi on 7/12 mutation queries with correct workflow references.', department: 'Revenue', language: 'Marathi', risk: 'Medium', status: 'Needs Review', version: 'v1', category: 'Revenue' },
  { id: 'p15', title: 'e-Office file movement note', useCase: 'Tracks file movement, pending reviewers and expected next step.', department: 'All', language: 'English', risk: 'Low', status: 'Approved', version: 'v4', category: 'e-Office' },
  { id: 'p16', title: 'Welfare beneficiary shortlist explain', useCase: 'Explainability wrapper around WCD shortlisting model — deprecated in favour of new HITL flow.', department: 'WCD', language: 'English', risk: 'High', status: 'Deprecated', version: 'v1', category: 'Welfare' },
  { id: 'p17', title: 'HR service book audit', useCase: 'Audits e-HRMS service book entries for missing fields, promotions, and pay-fix anomalies.', department: 'DIT', language: 'English', risk: 'Low', status: 'Approved', version: 'v2', category: 'HR' },
]

function fallbackHistory(p: Prompt): PromptVersion[] {
  return [
    { version: p.version, at: '2026-06-15', by: 'MAII AI', note: 'Latest approved revision.' },
    { version: 'v0', at: '2026-01-10', by: 'MAII AI', note: 'Initial draft.' },
  ]
}

export function PromptLibrary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('All')
  const [openHistory, setOpenHistory] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => PROMPTS.filter((p) =>
    (cat === 'All' || p.category === cat) &&
    (q.trim() === '' || (p.title + ' ' + p.useCase + ' ' + p.department).toLowerCase().includes(q.toLowerCase()))
  ), [q, cat])

  return (
    <div>
      <PageHeader
        title="Prompt Library"
        description="Curated, versioned, approved prompts for administrative tasks. Each prompt is governance-tagged."
        breadcrumb={['Administrative AI', 'Prompt Library']}
        source="Demo"
        eyebrow="Prompts"
        icon={<Library className="h-5 w-5" />}
      />

      {/* Filter bar — search on its own row, categories on their own row */}
      <div className="card mb-6 space-y-4 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search prompts by title, use-case or department…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="chip border border-ink-200 bg-ink-50 text-ink-600">
              <Filter className="h-3 w-3" /> {filtered.length} of {PROMPTS.length}
            </span>
            <SourceBadge source="Demo" />
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-500">
            Filter by category
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  cat === c
                    ? 'border-brand-400 bg-brand-soft text-brand-700 shadow-sm'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid — breathing gap, ordered content, buttons anchored bottom */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((p) => {
          const history = PROMPT_HISTORY[p.id] ?? fallbackHistory(p)
          const isOpen = !!openHistory[p.id]
          return (
            <article
              key={p.id}
              className="card card-hover flex h-full flex-col gap-4 p-5"
            >
              {/* Header — icon + title/meta, wraps cleanly */}
              <header className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-600">
                  <Library className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900" title={p.title}>
                    {p.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-ink-500">
                    <span className="font-medium text-ink-700">{p.department}</span>
                    <span className="text-ink-300">·</span>
                    <span>{p.language}</span>
                    <span className="text-ink-300">·</span>
                    <span>{p.version}</span>
                  </div>
                </div>
              </header>

              {/* Use-case — clamped to 3 lines so cards stay level */}
              <div className="min-h-[3.75rem]">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  Use case
                </div>
                <p className="line-clamp-3 text-[13px] leading-relaxed text-ink-700">
                  {p.useCase}
                </p>
              </div>

              {/* Tag row — category is a stand-alone chip; governance chips wrap below */}
              <div className="space-y-2">
                <span className="inline-flex max-w-full items-center rounded-full border border-ink-200 bg-ink-50 px-2.5 py-1 text-[11px] font-medium text-ink-700">
                  <span className="truncate">{p.category}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <RiskBadge level={p.risk} />
                  <StatusBadge status={p.status as any} />
                  <button
                    onClick={() => setOpenHistory((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    className={cn(
                      'chip border transition-colors',
                      isOpen ? 'border-brand-300 bg-brand-soft text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
                    )}
                    title="Show version history"
                  >
                    <History className="h-3 w-3" /> History
                    <ChevronDown className={cn('h-3 w-3 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                </div>
              </div>

              {/* Version history — reveal */}
              {isOpen && (
                <ol className="relative space-y-2 rounded-lg border border-ink-100 bg-ink-50/40 p-3 text-[12px]">
                  {history.map((h) => (
                    <li key={h.version} className="flex items-start gap-2">
                      <span className="mt-0.5 grid h-5 shrink-0 items-center rounded-md border border-ink-200 bg-white px-1.5 font-mono text-[10px] text-ink-700">
                        {h.version}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] text-ink-500">{h.at} · {h.by}</div>
                        <div className="text-[12px] text-ink-700">{h.note}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {/* Actions — anchored to bottom */}
              <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
                <button className="btn-outline !px-3 whitespace-nowrap">
                  <Copy className="h-4 w-4" /> Copy
                </button>
                <button className="btn-primary !px-3 whitespace-nowrap">
                  <Send className="h-4 w-4" /> Use
                </button>
              </div>
            </article>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-ink-200 bg-ink-50/40 p-10 text-center text-sm text-ink-500">
            No prompts match your filters. Try clearing the category or search.
          </div>
        )}
      </div>

      {/* Quick actions + shortcuts */}
      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <QuickActions
          actions={[
            { label: 'Save selection', icon: <Save className="h-4 w-4" /> },
            { label: 'Submit prompt for review', icon: <Send className="h-4 w-4" />, primary: true },
            { label: 'Copy prompt permalink', icon: <Link2 className="h-4 w-4" /> },
            { label: 'Fork into Workspace', icon: <Copy className="h-4 w-4" /> },
          ]}
        />
        <Shortcuts
          items={[
            { keys: '⌘ K', label: 'Focus search' },
            { keys: '⌘ ⇧ H', label: 'Toggle all history panels' },
            { keys: '⌘ ↵', label: 'Use selected prompt' },
            { keys: '⌘ C', label: 'Copy prompt text' },
          ]}
        />
      </div>
    </div>
  )
}
