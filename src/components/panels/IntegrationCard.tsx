import { Link } from 'react-router-dom'
import { ChevronRight, Wifi, Lock, User, ClipboardCheck } from 'lucide-react'
import { Integration } from '@/data/integrations'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'

export function IntegrationCard({ i }: { i: Integration }) {
  return (
    <article className="card card-hover flex h-full flex-col gap-4 p-5">
      {/* Header — title/category shrinks, status stays on its own line if needed */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-ink-900" title={i.name}>
            {i.name}
          </h3>
          <div className="text-xs text-ink-500">{i.category}</div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={i.status} />
        </div>
      </header>

      {/* Description — clamped */}
      <p className="line-clamp-2 text-xs leading-relaxed text-ink-600" title={i.description}>
        {i.description}
      </p>

      {/* Info rows — each row truncates independently */}
      <ul className="space-y-1.5 text-xs text-ink-700">
        <li className="flex min-w-0 items-center gap-2">
          <Wifi className="h-3 w-3 shrink-0 text-brand-500" />
          <span className="truncate"><span className="text-ink-500">API health:</span> {i.apiHealth}%</span>
        </li>
        <li className="flex min-w-0 items-center gap-2">
          <Lock className="h-3 w-3 shrink-0 text-brand-500" />
          <span className="truncate" title={i.securityStatus}>
            <span className="text-ink-500">Security:</span> {i.securityStatus}
          </span>
        </li>
        <li className="flex min-w-0 items-center gap-2">
          <User className="h-3 w-3 shrink-0 text-brand-500" />
          <span className="truncate"><span className="text-ink-500">Owner:</span> {i.dataOwner}</span>
        </li>
        <li className="flex min-w-0 items-start gap-2">
          <ClipboardCheck className="mt-0.5 h-3 w-3 shrink-0 text-brand-500" />
          <span className="min-w-0 flex-1">
            <span className="text-ink-500">Approvals: </span>
            <span className="line-clamp-2 inline" title={i.requiredApprovals.join(' · ')}>
              {i.requiredApprovals.join(' · ')}
            </span>
          </span>
        </li>
      </ul>

      {/* Readiness meter */}
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-500">Connector readiness</span>
          <span className="font-medium text-ink-800">{i.connectorReadiness}%</span>
        </div>
        <div className="mt-1 h-1.5 rounded bg-ink-100">
          <div className="h-full rounded bg-brand-gradient" style={{ width: `${i.connectorReadiness}%` }} />
        </div>
      </div>

      {/* Source + last sync — wraps to next line on narrow columns */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
        <SourceBadge source={i.status === 'Connected' ? 'Live' : i.status === 'Public-source linked' ? 'Public-source linked' : 'Department API required'} />
        <span className="truncate" title={`Last sync: ${i.lastSync}`}>Last sync: {i.lastSync}</span>
      </div>

      {/* CTA — anchored bottom */}
      <Link to={`/integrations/${i.slug}`} className="btn-outline mt-auto justify-between">
        <span>Open connector</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
