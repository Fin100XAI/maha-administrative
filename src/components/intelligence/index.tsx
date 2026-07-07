import { ReactNode, useState } from 'react'
import {
  FileDown, FileSpreadsheet, Presentation, Share2, ShieldCheck, Lock,
  ClipboardCheck, UserCheck, Route, Server, AlertTriangle, Bot, Check,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { SourceBadge } from '@/components/ui/Badges'
import { AI_DEPARTMENTS, AI_DISTRICTS, RISK_CLASS, RiskLevel, confidenceTier } from '@/data/administrativeIntelligence'
import { exportPagePdf, exportPageExcel, copyPageLink } from '@/lib/exportUtils'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Page header + trust strip                                           */
/* ------------------------------------------------------------------ */

export function IntelligencePageHeader({
  title, subtitle, icon, breadcrumb, confidence, source = 'Demo',
}: {
  title: string
  subtitle: string
  icon?: ReactNode
  breadcrumb?: string[]
  confidence?: number
  source?: 'Demo' | 'Public-source linked' | 'Department API required' | 'Live'
}) {
  return (
    <div>
      <PageHeader
        compact
        title={title}
        description={subtitle}
        breadcrumb={breadcrumb ?? ['Administrative Intelligence', title]}
        source={source}
        icon={icon}
        actions={<ExportActions title={title} />}
      />
      <div className="-mt-3 mb-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1 text-[10.5px] font-medium text-ink-500">
        <TrustChip icon={<ShieldCheck className="h-3 w-3" />} label="RBAC enforced" />
        <TrustChip icon={<ClipboardCheck className="h-3 w-3" />} label="Audit logged" />
        <TrustChip icon={<Lock className="h-3 w-3" />} label="DPDP aligned" />
        <TrustChip icon={<UserCheck className="h-3 w-3" />} label="Human approval enabled" />
        <TrustChip icon={<Route className="h-3 w-3" />} label="Source traceability" />
        <TrustChip icon={<Server className="h-3 w-3" />} label="On-prem ready" />
        {typeof confidence === 'number' && (
          <span className="ml-auto"><TierBadge score={confidence} /></span>
        )}
      </div>
    </div>
  )
}

function TrustChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-ink-500">
      <span className="text-emerald-600">{icon}</span> {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Export actions with API-ready toast                                 */
/* ------------------------------------------------------------------ */

export function ExportActions({ title }: { title?: string } = {}) {
  const [toast, setToast] = useState('')
  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2200)
  }
  return (
    <div className="relative flex flex-wrap items-center gap-2">
      <button className="header-btn-outline !px-3 !py-1.5 !text-xs" onClick={() => exportPagePdf(title)}><FileDown className="h-3.5 w-3.5" /> PDF</button>
      <button className="header-btn-outline !px-3 !py-1.5 !text-xs" onClick={() => { exportPageExcel(title); flash('Spreadsheet downloaded.') }}><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</button>
      <button className="header-btn-outline !px-3 !py-1.5 !text-xs" onClick={() => exportPagePdf(title)}><Presentation className="h-3.5 w-3.5" /> PPT</button>
      <button className="header-btn-primary !px-3 !py-1.5 !text-xs" onClick={async () => flash((await copyPageLink()) ? 'Shareable link copied.' : 'Copy failed.')}><Share2 className="h-3.5 w-3.5" /> Share Brief</button>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-full z-30 mt-2 flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-lg"
          >
            <Check className="h-3.5 w-3.5" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* AI recommendation + risk alert panels                               */
/* ------------------------------------------------------------------ */

export interface Recommendation { text: string; confidence?: number; action?: string }

export function AIRecommendationPanel({
  recommendations, title = 'AI Recommendations', humanApprovalRequired = true,
}: {
  recommendations: Recommendation[]
  title?: string
  humanApprovalRequired?: boolean
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Bot className="h-3.5 w-3.5" /></span>
        <span className="section-title text-ink-800">{title}</span>
        <span className="ml-auto flex items-center gap-1.5">
          <SourceBadge source="Demo" />
          {humanApprovalRequired && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
              <UserCheck className="h-2.5 w-2.5" /> Human approval
            </span>
          )}
        </span>
      </div>
      <ul className="space-y-2">
        {recommendations.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5 rounded-lg border border-ink-100 bg-gradient-to-r from-brand-50/40 to-white p-2.5 text-sm text-ink-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span className="min-w-0 flex-1">{r.text}</span>
            {typeof r.confidence === 'number' && <TierBadge score={r.confidence} />}
            {r.action && (
              <button className="shrink-0 rounded-md border border-brand-200 bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100">
                {r.action}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface RiskAlert { title: string; severity: RiskLevel; owner: string; due: string }

export function RiskAlertPanel({ alerts, title = 'Risks & Alerts' }: { alerts: RiskAlert[]; title?: string }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100"><AlertTriangle className="h-3.5 w-3.5" /></span>
        <span className="section-title text-ink-800">{title}</span>
      </div>
      <ul className="space-y-2">
        {alerts.map((a, i) => (
          <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-ink-100 bg-white p-2.5 text-sm">
            <SeverityBadge level={a.severity} />
            <span className="min-w-0 flex-1 text-ink-800">{a.title}</span>
            <span className="text-xs text-ink-500">{a.owner}</span>
            <span className="rounded-md bg-ink-50 px-1.5 py-0.5 text-[11px] font-medium text-ink-600">{a.due}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Badges + filters                                                    */
/* ------------------------------------------------------------------ */

export function SeverityBadge({ level }: { level: RiskLevel }) {
  return <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', RISK_CLASS[level])}>{level}</span>
}

/** Confidence tier badge — High ≥85%, Medium 70-84%, Low <70%. */
export function TierBadge({ score }: { score: number }) {
  const tier = confidenceTier(score)
  const cls = tier === 'High'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : tier === 'Medium'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-red-200 bg-red-50 text-red-700'
  return <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold', cls)}>{tier} · {score}%</span>
}

export function DepartmentFilter({ value, onChange, allLabel = 'All departments' }: {
  value: string
  onChange: (code: string) => void
  allLabel?: string
}) {
  return (
    <select className="input !w-auto !py-1.5 !text-xs" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="all">{allLabel}</option>
      {AI_DEPARTMENTS.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
    </select>
  )
}

export function DistrictFilter({ value, onChange, allLabel = 'All districts' }: {
  value: string
  onChange: (name: string) => void
  allLabel?: string
}) {
  return (
    <select className="input !w-auto !py-1.5 !text-xs" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="all">{allLabel}</option>
      {AI_DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
    </select>
  )
}
