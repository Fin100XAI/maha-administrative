import { Layers, XCircle, Play, Pause, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import type { BatchJob } from '@/data/adminSamples'
import { cn } from '@/lib/utils'

function stateChip(state: BatchJob['state']) {
  const map: Record<BatchJob['state'], { cls: string; icon: any }> = {
    Queued: { cls: 'bg-ink-100 text-ink-700 border-ink-200', icon: Play },
    Running: { cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: Play },
    Completed: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    Paused: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Pause },
    Failed: { cls: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  }
  const conf = map[state]
  const Icon = conf.icon
  return (
    <span className={cn('chip border', conf.cls)}>
      <Icon className="h-3 w-3" /> {state}
    </span>
  )
}

export function BatchQueue({
  jobs,
  title = 'Batch queue',
  subtitle = 'Bulk jobs in flight — auto-refresh every 30s',
}: {
  jobs: BatchJob[]
  title?: string
  subtitle?: string
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={subtitle}
        right={
          <div className="flex items-center gap-2">
            <SourceBadge source="Demo" />
            <Layers className="h-4 w-4 text-brand-500" />
          </div>
        }
      />
      <ul className="space-y-3">
        {jobs.map((j) => (
          <li key={j.id} className="rounded-xl border border-ink-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink-800">{j.name}</div>
                <div className="mt-0.5 text-xs text-ink-500">
                  {j.count} files · {j.dept} · ETA {j.eta}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {stateChip(j.state)}
                {j.state !== 'Completed' && (
                  <button
                    className="rounded-md border border-ink-200 bg-white p-1 text-ink-500 hover:bg-ink-50"
                    title="Cancel"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                className={cn(
                  'h-full rounded-full',
                  j.state === 'Failed' ? 'bg-red-500' : j.state === 'Completed' ? 'bg-emerald-500' : 'bg-brand-gradient',
                )}
                style={{ width: `${j.progress}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[11px] text-ink-500">{j.progress}%</div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
