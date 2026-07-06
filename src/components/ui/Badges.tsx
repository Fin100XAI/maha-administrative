import { AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck, Sparkles, Clock, Lock, Globe, ServerCog, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatusBadge({
  status,
  className,
}: {
  status:
    | 'Live'
    | 'Linked'
    | 'Pending API'
    | 'Requires Government Access'
    | 'Connected'
    | 'Public-source linked'
    | 'API pending'
    | 'Department access required'
    | 'In development'
    | 'Approved'
    | 'Under Review'
    | 'Retired'
    | 'Rolled Back'
    | 'Draft'
    | 'Rejected'
    | 'Escalated'
    | 'Active'
    | 'Blocked'
    | 'Resolved'
    | 'Investigating'
    | 'Open'
    | 'Closed'
    | string
  className?: string
}) {
  const map: Record<string, string> = {
    Live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Linked: 'bg-sky-50 text-sky-700 border-sky-200',
    'Public-source linked': 'bg-sky-50 text-sky-700 border-sky-200',
    'Pending API': 'bg-amber-50 text-amber-700 border-amber-200',
    'API pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Requires Government Access': 'bg-purple-50 text-purple-700 border-purple-200',
    'Department access required': 'bg-purple-50 text-purple-700 border-purple-200',
    'In development': 'bg-ink-100 text-ink-700 border-ink-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
    Retired: 'bg-ink-100 text-ink-600 border-ink-200',
    'Rolled Back': 'bg-red-50 text-red-700 border-red-200',
    Draft: 'bg-ink-100 text-ink-700 border-ink-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Escalated: 'bg-rose-50 text-rose-700 border-rose-200',
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Blocked: 'bg-red-50 text-red-700 border-red-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Investigating: 'bg-amber-50 text-amber-700 border-amber-200',
    Open: 'bg-sky-50 text-sky-700 border-sky-200',
    Closed: 'bg-ink-100 text-ink-600 border-ink-200',
  }
  return (
    <span className={cn('chip border', map[status] || 'bg-ink-100 text-ink-700 border-ink-200', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', {
        'bg-emerald-500': /Live|Connected|Approved|Active|Resolved/.test(status),
        'bg-sky-500': /Linked|Open/.test(status),
        'bg-amber-500': /Pending|Under Review|Investigating/.test(status),
        'bg-purple-500': /Requires|Department access/.test(status),
        'bg-red-500': /Rejected|Rolled Back|Blocked/.test(status),
        'bg-rose-500': /Escalated/.test(status),
        'bg-ink-400': /In development|Retired|Draft|Closed/.test(status),
      })} />
      {status}
    </span>
  )
}

export function RiskBadge({
  level,
  className,
}: {
  level: 'Low' | 'Medium' | 'High' | 'Critical' | string
  className?: string
}) {
  const map: Record<string, string> = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Critical: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={cn('chip border', map[level] || 'bg-ink-100 text-ink-700 border-ink-200', className)}>
      <ShieldAlert className="h-3 w-3" />
      {level} risk
    </span>
  )
}

export function ConfidenceBadge({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  const level = score >= 85 ? 'High' : score >= 65 ? 'Medium' : 'Low'
  const map = {
    High: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-red-50 text-red-700 border-red-200',
  } as const
  return (
    <span className={cn('chip border', map[level], className)}>
      <Sparkles className="h-3 w-3" />
      Confidence: {score}% ({level})
    </span>
  )
}

export function SourceBadge({
  source,
  className,
}: {
  source: 'Live' | 'Public-source linked' | 'Demo' | 'Department API required' | string
  className?: string
}) {
  const icon =
    source === 'Live' ? <Globe className="h-3 w-3" /> :
    source === 'Public-source linked' ? <Info className="h-3 w-3" /> :
    source === 'Department API required' ? <ServerCog className="h-3 w-3" /> :
    <Database className="h-3 w-3" />
  const cls: Record<string, string> = {
    Live: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Public-source linked': 'bg-sky-50 text-sky-700 border-sky-200',
    Demo: 'bg-ink-100 text-ink-600 border-ink-200',
    'Department API required': 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span className={cn('chip border', cls[source] || 'bg-ink-100 text-ink-700 border-ink-200', className)}>
      {icon} {source}
    </span>
  )
}

export function SeverityBadge({ level }: { level: 'Critical' | 'High' | 'Medium' | 'Low' | string }) {
  const map: Record<string, string> = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }
  return <span className={cn('chip border', map[level] || 'bg-ink-100 text-ink-700 border-ink-200')}>{level}</span>
}

export function ClassificationBadge({ level }: { level: 'Public' | 'Internal' | 'Confidential' | 'Secret' | 'Highly Restricted' | string }) {
  const map: Record<string, string> = {
    Public: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Internal: 'bg-sky-50 text-sky-700 border-sky-200',
    Confidential: 'bg-amber-50 text-amber-700 border-amber-200',
    Secret: 'bg-rose-50 text-rose-700 border-rose-200',
    'Highly Restricted': 'bg-red-100 text-red-800 border-red-300',
  }
  return (
    <span className={cn('chip border', map[level] || 'bg-ink-100 text-ink-700 border-ink-200')}>
      <Lock className="h-3 w-3" /> {level}
    </span>
  )
}

export function TrendBadge({ delta }: { delta: number }) {
  const up = delta >= 0
  return (
    <span className={cn('chip border text-xs', up ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200')}>
      {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
    </span>
  )
}

export function InfoIcon() { return <Info className="h-4 w-4 text-ink-400" /> }
export const StatusIcons = { CheckCircle2, AlertTriangle, ShieldCheck, Clock }
