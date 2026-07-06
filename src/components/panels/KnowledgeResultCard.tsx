import { Sparkles, GitCompare, FileText } from 'lucide-react'
import { KnowledgeItem } from '@/data/knowledge'
import { ConfidenceBadge, SourceBadge } from '@/components/ui/Badges'

export function KnowledgeResultCard({ item }: { item: KnowledgeItem }) {
  return (
    <article className="card card-hover flex h-full flex-col gap-3 p-5">
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
        <span className="chip border border-ink-200 bg-ink-50 text-ink-700">{item.type}</span>
        <span>{item.language}</span>
        <span className="text-ink-300">·</span>
        <span>{item.date}</span>
      </div>

      {/* Title */}
      <h3
        className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900"
        title={item.title}
      >
        {item.title}
      </h3>

      {/* Dept + source */}
      <div className="min-w-0 text-xs text-ink-500">
        <div className="truncate" title={item.dept}>{item.dept}</div>
        <div className="truncate" title={item.source}>Source: {item.source}</div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <ConfidenceBadge score={item.confidence} />
        <SourceBadge source={item.source.startsWith('gr.') ? 'Public-source linked' : 'Demo'} />
      </div>

      {/* Related — clamped so it never overflows */}
      {item.related && item.related.length > 0 && (
        <div className="min-h-[2.5rem] text-xs text-ink-500">
          <span className="font-medium text-ink-600">Related: </span>
          <span className="line-clamp-2 inline">{item.related.join(', ')}</span>
        </div>
      )}

      {/* Actions — anchored bottom; icon-only tertiary keeps it aligned in narrow columns */}
      <div className="mt-auto grid grid-cols-3 gap-2 pt-1">
        <button className="btn-outline !px-2 whitespace-nowrap text-xs" title="Open">
          <FileText className="h-4 w-4" /> Open
        </button>
        <button className="btn-outline !px-2 whitespace-nowrap text-xs" title="Summarize">
          <Sparkles className="h-4 w-4" /> Summary
        </button>
        <button className="btn-outline !px-2 whitespace-nowrap text-xs" title="Compare">
          <GitCompare className="h-4 w-4" /> Compare
        </button>
      </div>
    </article>
  )
}
