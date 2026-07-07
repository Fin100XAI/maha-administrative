import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, MessageSquare, ChevronRight, Globe, Info, ServerCog, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { exportPagePdf } from '@/lib/exportUtils'

export interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: string[]
  source?: 'Live' | 'Public-source linked' | 'Demo' | 'Department API required'
  actions?: ReactNode
  compact?: boolean
  eyebrow?: string
  icon?: ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  source,
  actions,
  compact,
  eyebrow,
  icon,
}: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className={cn('relative mb-6 overflow-hidden rounded-2xl', compact && 'mb-4')}>
      {/* Gradient base */}
      <div className="absolute inset-0 bg-brand-gradient" />
      {/* Mesh / glow orbs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
        backgroundSize: '18px 18px',
      }} />
      {/* Sheen line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className={cn('relative flex flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:items-start md:justify-between md:px-8 md:py-7', compact && 'py-4 md:py-5')}>
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-white/70">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-white/40" />}
                  <span>{b}</span>
                </span>
              ))}
            </div>
          )}

          {/* Eyebrow chip */}
          {eyebrow && (
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
              {eyebrow}
            </div>
          )}

          {/* Title with optional icon */}
          <div className="flex items-start gap-3">
            {icon && (
              <div className="mt-1 hidden h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/10 text-white shadow-inner backdrop-blur md:grid">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className={cn('font-semibold leading-tight text-white', compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl')}>
                {title}
              </h1>
              {description && (
                <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-white/85">
                  {description}
                </p>
              )}
            </div>
          </div>

          {source && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <HeaderSourcePill source={source} />
              <span className="text-[11px] text-white/75">Sovereign · On-prem ready · DPDP-aligned</span>
            </div>
          )}
        </div>

        {/* Actions — glass buttons override */}
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <HeaderActionsProvider>
            {actions ?? (
              <>
                <button className="header-btn-outline" onClick={() => exportPagePdf(title)}>
                  <Download className="h-4 w-4" /> Export
                </button>
                <button className="header-btn-primary" onClick={() => navigate('/workspace')}>
                  <MessageSquare className="h-4 w-4" /> Ask Maha Copilot
                </button>
              </>
            )}
          </HeaderActionsProvider>
        </div>
      </div>
    </div>
  )
}

/**
 * The rest of the app renders actions with `btn-primary` / `btn-outline`.
 * Inside the page header, buttons should feel glassy on the gradient background.
 * We remap the utility classes by wrapping in a scope-styled container.
 */
function HeaderActionsProvider({ children }: { children: ReactNode }) {
  return <div className="header-actions flex flex-wrap items-center gap-2">{children}</div>
}

/** All-white glass pill for the source badge in the header — no coloured text on the gradient banner. */
function HeaderSourcePill({ source }: { source: NonNullable<PageHeaderProps['source']> }) {
  const Icon =
    source === 'Live' ? Globe :
    source === 'Public-source linked' ? Info :
    source === 'Department API required' ? ServerCog :
    Database
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
      <span className="grid h-4 w-4 place-items-center rounded-full bg-white/25">
        <Icon className="h-2.5 w-2.5 text-white" />
      </span>
      {source}
    </span>
  )
}
