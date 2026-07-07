import { ReactNode } from 'react'
import { CardHeader } from './Card'
import { SourceBadge } from './Badges'

export function ChartCard({
  title,
  subtitle,
  source = 'Demo',
  right,
  height = 260,
  children,
}: {
  title: string
  subtitle?: string
  source?: 'Live' | 'Public-source linked' | 'Demo' | 'Department API required'
  right?: ReactNode
  height?: number
  children: ReactNode
}) {
  return (
    <div className="card p-4 sm:p-5">
      <CardHeader
        title={title}
        subtitle={subtitle}
        right={
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={source} />
            {right}
          </div>
        }
      />
      <div style={{ height }} className="w-full max-w-full">
        {children}
      </div>
    </div>
  )
}
