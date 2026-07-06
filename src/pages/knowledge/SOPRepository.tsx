import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck2, CalendarClock, Trophy, ListChecks, Clock, X } from 'lucide-react'
import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge, ConfidenceBadge } from '@/components/ui/Badges'
import { SOP_REVIEW_CALENDAR, SOP_PREVIEW, SOP_MOST_VIEWED } from '@/data/knowledgeSamples'

function FreshnessBadge({ score }: { score: number }) {
  const label = score >= 85 ? 'Fresh' : score >= 65 ? 'Aging' : 'Stale'
  const cls =
    score >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : score >= 65
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'
  return (
    <span className={`chip border ${cls}`}>
      <Clock className="h-3 w-3" /> {label} · {score}
    </span>
  )
}

// Deterministic freshness derived from confidence + type-string hash.
function freshnessFor(id: string, confidence: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  const jitter = (h % 21) - 10
  return Math.max(30, Math.min(98, confidence + jitter))
}

export function SOPRepository() {
  const items = KNOWLEDGE.filter((k) => k.type === 'SOP' || k.type === 'Policy')
  const [showPreview, setShowPreview] = useState(true)

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<FileCheck2 className="h-5 w-5" />}
        title="SOP Repository"
        description="Standard Operating Procedures across departments — MAII-verified and versioned."
        breadcrumb={['Knowledge Brain', 'SOP Repository']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-6">
          {/* SOPs with freshness overlay */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((k) => {
              const f = freshnessFor(k.id, k.confidence)
              return (
                <div key={k.id} className="relative">
                  <div className="absolute right-3 top-3 z-10">
                    <FreshnessBadge score={f} />
                  </div>
                  <KnowledgeResultCard item={k} />
                </div>
              )
            })}
            {items.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No SOPs yet.</div>}
          </div>

          {/* Step-by-step preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip border border-brand-100 bg-brand-soft text-brand-700">SOP preview</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{SOP_PREVIEW.id}</span>
                    <StatusBadge status="Approved" />
                  </div>
                  <h3 className="mt-1 text-base font-semibold text-ink-900">{SOP_PREVIEW.title}</h3>
                  <p className="text-xs text-ink-500">Owner: {SOP_PREVIEW.owner} · v{SOP_PREVIEW.version} · Effective {SOP_PREVIEW.effective}</p>
                </div>
                <button
                  className="btn-ghost !px-2 text-ink-400 hover:text-ink-700"
                  onClick={() => setShowPreview(false)}
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="space-y-2">
                {SOP_PREVIEW.steps.map((s) => (
                  <li key={s.step} className="flex items-start gap-3 rounded-md border border-ink-100 p-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
                      {s.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-ink-800">{s.title}</div>
                      <div className="text-[11px] text-ink-500">
                        {s.actor} · ~{s.minutes} min{s.requires ? ` · needs ${s.requires}` : ''}
                      </div>
                    </div>
                    <ListChecks className="h-4 w-4 shrink-0 text-brand-400" />
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ConfidenceBadge score={94} />
                <SourceBadge source="Demo" />
                <button className="btn-outline ml-auto !px-3 !py-1.5 text-xs">Open full SOP</button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          {/* Review calendar */}
          <Card>
            <CardHeader
              title="SOP review calendar"
              subtitle="Next six SOPs due for review"
              right={<CalendarClock className="h-4 w-4 text-brand-500" />}
            />
            <ul className="space-y-2 text-sm">
              {SOP_REVIEW_CALENDAR.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start justify-between gap-3 rounded-md border border-ink-100 px-3 py-2 hover:border-brand-200"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{s.id}</div>
                    <div className="truncate text-ink-800" title={s.title}>{s.title}</div>
                    <div className="text-[11px] text-ink-500">{s.owner} · due {s.due}</div>
                  </div>
                  <FreshnessBadge score={s.freshness} />
                </motion.li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>

          {/* Most viewed */}
          <Card>
            <CardHeader
              title="Most-viewed SOPs"
              subtitle="Last 30 days"
              right={<Trophy className="h-4 w-4 text-amber-500" />}
            />
            <ul className="space-y-3 text-sm">
              {SOP_MOST_VIEWED.map((s, i) => (
                <li key={s.id}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-[10px] font-semibold text-brand-700">{i + 1}</span>
                      <span className="truncate text-ink-800" title={s.title}>{s.title}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs text-ink-500">
                      <span className="tabular-nums">{s.views.toLocaleString()}</span>
                      <span className={s.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {s.delta >= 0 ? '▲' : '▼'} {Math.abs(s.delta).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${Math.min(100, (s.views / SOP_MOST_VIEWED[0].views) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-0.5 text-[11px] text-ink-500">{s.dept}</div>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
