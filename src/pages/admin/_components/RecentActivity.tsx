import { Activity } from 'lucide-react'
import { Card, CardHeader, EmptyState } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import type { ActivityItem } from '@/data/adminSamples'

export function RecentActivity({
  items,
  title = 'Recent activity',
  subtitle = 'Last documents processed by MAII in this flow',
}: {
  items: ActivityItem[]
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
            <Activity className="h-4 w-4 text-brand-500" />
          </div>
        }
      />
      {items.length === 0 ? (
        <EmptyState title="No recent activity" hint="Documents will appear here as they get processed." />
      ) : (
        <ul className="space-y-2 text-sm">
          {items.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink-800">{a.title}</div>
                <div className="mt-0.5 text-xs text-ink-500">
                  {a.officer} · {a.dept} · {a.time}
                </div>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
