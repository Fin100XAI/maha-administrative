import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bot, ShieldCheck, ShieldAlert, X, FileText, Plus, Search, Pin, Trash2,
  Check, Pencil, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  Download, Lock, ServerCog, Cloud, Gauge, ScrollText, BookMarked, ClipboardCheck,
  MessageSquarePlus, AlertTriangle, Cpu, Timer, Hash, Undo2, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { LANGUAGES, LanguageOption, SECURITY_CLASSES, SecurityClass } from '@/data/departments'
import { MODELS } from '@/data/models'
import { useRole } from '@/lib/rbac'
import { cn } from '@/lib/utils'
import { CopilotThread } from '@/components/copilot/CopilotThread'
import { CopilotComposer } from '@/components/copilot/CopilotComposer'
import { useCopilot, type CopilotApi } from '@/components/copilot/useCopilot'
import {
  APPROVERS, ApprovalRecord, CopilotMsg, PIPELINE, modelPolicy, relativeTime, routeModel,
} from '@/components/copilot/engine'

type AuditEntry = { t: string; e: string }
type RailTab = 'policy' | 'audit' | 'sources' | 'approvals'

const BOOT_AUDIT: AuditEntry[] = [
  { t: '09:12', e: 'Session opened · MFA verified' },
  { t: '09:13', e: 'Zero Trust posture check passed' },
  { t: '09:14', e: 'Classification set · Internal' },
]

export function MahaCopilot() {
  const { role } = useRole()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? undefined

  const [modelId, setModelId] = useState(MODELS[0].id)
  const [secClass, setSecClass] = useState<SecurityClass>('Internal')
  const [lang, setLang] = useState<LanguageOption>('English')
  const [audit, setAudit] = useState<AuditEntry[]>(BOOT_AUDIT)

  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const [mobileRail, setMobileRail] = useState<'left' | 'right' | null>(null)
  const [tab, setTab] = useState<RailTab>('policy')
  const [approvalFor, setApprovalFor] = useState<CopilotMsg | null>(null)

  const logAudit = useCallback((e: string) => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setAudit((prev) => [...prev.slice(-40), { t, e }])
  }, [])

  // Classification decides the model — the officer's pick is honoured only when policy allows it.
  const effectiveModel = useMemo(() => routeModel(MODELS, modelId, secClass), [modelId, secClass])
  const rerouted = effectiveModel.id !== modelId
  const selectedModel = MODELS.find((m) => m.id === modelId) ?? MODELS[0]

  const api = useCopilot({ model: effectiveModel, secClass, langLabel: lang, onAudit: logAudit })
  const { newChat } = api

  // Log a reroute once per distinct decision, not on every re-render.
  const lastReroute = useRef('')
  useEffect(() => {
    if (!rerouted) {
      lastReroute.current = ''
      return
    }
    const signature = `${selectedModel.id}|${secClass}|${effectiveModel.id}`
    if (lastReroute.current === signature) return
    lastReroute.current = signature
    logAudit(`Policy reroute · ${selectedModel.name} blocked at ${secClass} → ${effectiveModel.name}`)
  }, [rerouted, effectiveModel, selectedModel, secClass, logAudit])

  // Auto-run a query handed off from the topbar search, once.
  const seeded = useRef<string | null>(null)
  useEffect(() => {
    const q = initialQuery?.trim()
    if (q && seeded.current !== q) {
      seeded.current = q
      api.send(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // ⌘⇧N starts a fresh conversation from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        newChat()
      }
      if (e.key === 'Escape') setMobileRail(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [newChat])

  const pendingApprovals = api.approvals.filter((a) => a.status === 'Pending').length

  return (
    <div>
      <PageHeader
        compact
        title="Maha Copilot"
        description="Ask, draft, translate and analyse — under sovereign AI guardrails. Every prompt is classified, policy-routed, cited and audit-logged."
        breadcrumb={['Administrative AI', 'Maha Copilot']}
        source="Demo"
        icon={<Bot className="h-5 w-5" />}
      />

      {/* Command bar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <RailToggle
          side="left"
          open={leftOpen}
          onDesktop={() => setLeftOpen((v) => !v)}
          onMobile={() => setMobileRail('left')}
          label="Sessions"
        />

        <label className="sr-only" htmlFor="cp-model">Model</label>
        <select
          id="cp-model"
          className="input !w-auto !py-1.5 !text-xs"
          value={modelId}
          onChange={(e) => { setModelId(e.target.value); logAudit(`Model selected · ${MODELS.find((m) => m.id === e.target.value)?.name}`) }}
        >
          {MODELS.map((m) => {
            const ok = modelPolicy(m, secClass).allowed
            return (
              <option key={m.id} value={m.id}>
                {ok ? '' : '⛔ '}{m.name} · {m.hosting}
              </option>
            )
          })}
        </select>

        <select
          className="input !w-auto !py-1.5 !text-xs"
          value={secClass}
          onChange={(e) => { setSecClass(e.target.value as SecurityClass); logAudit('Classification set · ' + e.target.value) }}
          title="Data classification for this session"
        >
          {SECURITY_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="input !w-auto !py-1.5 !text-xs"
          value={lang}
          onChange={(e) => { setLang(e.target.value as LanguageOption); logAudit('Output language · ' + e.target.value) }}
        >
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>

        <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 sm:inline-flex">
          <ShieldCheck className="h-3 w-3" /> Sovereign · audit-logged
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={api.exportTranscript} className="btn-ghost !px-2.5 !py-1.5 !text-xs" title="Download the full transcript">
            <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Transcript</span>
          </button>
          <RailToggle
            side="right"
            open={rightOpen}
            onDesktop={() => setRightOpen((v) => !v)}
            onMobile={() => setMobileRail('right')}
            label="Governance"
            badge={pendingApprovals || undefined}
          />
        </div>
      </div>

      {/* Policy reroute banner */}
      <AnimatePresence>
        {rerouted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <span className="font-semibold">{selectedModel.name}</span> is blocked at classification{' '}
                <span className="font-semibold">{secClass}</span> — {modelPolicy(selectedModel, secClass).reason}{' '}
                Prompts are being served by <span className="font-semibold">{effectiveModel.name}</span> ({effectiveModel.hosting}).
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace */}
      <div className="flex min-h-0 gap-4">
        {leftOpen && (
          <aside className="hidden w-[268px] shrink-0 xl:block">
            <div className="card flex h-[calc(100vh-16rem)] min-h-[560px] flex-col overflow-hidden p-0">
              <SessionsRail api={api} />
            </div>
          </aside>
        )}

        <section className="card flex h-[calc(100vh-16rem)] min-h-[560px] min-w-0 flex-1 flex-col overflow-hidden p-0">
          <ThreadHeader api={api} designation={role} secClass={secClass} model={effectiveModel.name} />
          <CopilotThread
            api={api}
            modelName={effectiveModel.name}
            designation={role}
            onSendForApproval={(m) => setApprovalFor(m)}
          />
          <CopilotComposer api={api} langLabel={lang} />
        </section>

        {rightOpen && (
          <aside className="hidden w-[330px] shrink-0 xl:block">
            <div className="card flex h-[calc(100vh-16rem)] min-h-[560px] flex-col overflow-hidden p-0">
              <GovernanceRail
                api={api}
                tab={tab}
                setTab={setTab}
                audit={audit}
                model={effectiveModel}
                selectedModel={selectedModel}
                secClass={secClass}
                role={role}
              />
            </div>
          </aside>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-ink-400">
        <span className="inline-flex items-center gap-1">
          {effectiveModel.hosting === 'Cloud' ? <Cloud className="h-3 w-3" /> : <ServerCog className="h-3 w-3" />}
          {effectiveModel.name} · {effectiveModel.hosting}
        </span>
        <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> {secClass}</span>
        <span className="hidden sm:inline">⌘J dock · ⌘/ compose · ⌘⇧N new chat</span>
      </div>

      {/* Mobile rail drawers */}
      <AnimatePresence>
        {mobileRail && (
          <>
            <motion.div
              key="ov"
              className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileRail(null)}
            />
            <motion.aside
              key="dr"
              initial={{ x: mobileRail === 'left' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: mobileRail === 'left' ? '-100%' : '100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              className={cn(
                'fixed inset-y-0 z-50 flex w-[86vw] max-w-[340px] flex-col bg-white shadow-2xl xl:hidden',
                mobileRail === 'left' ? 'left-0 border-r' : 'right-0 border-l',
                'border-ink-100'
              )}
            >
              <div className="flex items-center justify-between border-b border-ink-100 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {mobileRail === 'left' ? 'Conversations' : 'Governance'}
                </span>
                <button onClick={() => setMobileRail(null)} className="btn-ghost !p-1.5" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                {mobileRail === 'left' ? (
                  <SessionsRail api={api} onNavigate={() => setMobileRail(null)} />
                ) : (
                  <GovernanceRail
                    api={api} tab={tab} setTab={setTab} audit={audit}
                    model={effectiveModel} selectedModel={selectedModel} secClass={secClass} role={role}
                  />
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Approval drawer */}
      <ApprovalDialog
        msg={approvalFor}
        api={api}
        onClose={() => setApprovalFor(null)}
        onDone={() => { setApprovalFor(null); setTab('approvals'); setRightOpen(true) }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Command-bar rail toggle                                             */
/* ------------------------------------------------------------------ */

function RailToggle({
  side, open, onDesktop, onMobile, label, badge,
}: {
  side: 'left' | 'right'
  open: boolean
  onDesktop: () => void
  onMobile: () => void
  label: string
  badge?: number
}) {
  const Icon = side === 'left'
    ? (open ? PanelLeftClose : PanelLeftOpen)
    : (open ? PanelRightClose : PanelRightOpen)
  return (
    <>
      <button onClick={onDesktop} className="btn-ghost hidden !px-2.5 !py-1.5 !text-xs xl:inline-flex" title={`${open ? 'Hide' : 'Show'} ${label}`}>
        <Icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{label}</span>
        {badge ? <span className="rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-700">{badge}</span> : null}
      </button>
      <button onClick={onMobile} className="btn-ghost !px-2.5 !py-1.5 !text-xs xl:hidden" title={label}>
        <Icon className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{label}</span>
        {badge ? <span className="rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-700">{badge}</span> : null}
      </button>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Thread header — session title, classification, quick actions        */
/* ------------------------------------------------------------------ */

function ThreadHeader({
  api, designation, secClass, model,
}: {
  api: CopilotApi
  /** Officers are identified by post, never by name. */
  designation?: string
  secClass: string
  model: string
}) {
  const { title, sessionId, isEmpty, renameSession, newChat, usage } = api
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const commit = () => {
    setEditing(false)
    if (sessionId) renameSession(sessionId, draft)
  }

  return (
    <div className="flex items-center gap-2 border-b border-ink-100 bg-white/70 px-3 py-2 backdrop-blur sm:px-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
        <Bot className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
            className="w-full rounded border border-brand-200 bg-white px-1.5 py-0.5 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        ) : (
          <button
            type="button"
            disabled={!sessionId}
            onClick={() => { setDraft(title); setEditing(true) }}
            className="group flex min-w-0 items-center gap-1.5 text-left"
            title={sessionId ? 'Rename session' : undefined}
          >
            <span className="truncate text-sm font-semibold text-ink-900">
              {title || (isEmpty ? 'New conversation' : 'Current session')}
            </span>
            {sessionId && <Pencil className="h-3 w-3 shrink-0 text-ink-300 opacity-0 transition group-hover:opacity-100" />}
          </button>
        )}
        <div className="flex flex-wrap items-center gap-x-2 text-[10.5px] text-ink-500">
          <span className="truncate">{designation ?? 'Officer'}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" />{secClass}</span>
          <span>·</span>
          <span className="truncate">{model}</span>
          {usage.answers > 0 && (
            <>
              <span>·</span>
              <span className="tabular-nums">{usage.totalTokens.toLocaleString()} tok</span>
            </>
          )}
        </div>
      </div>

      <button onClick={newChat} className="btn-ghost !px-2.5 !py-1.5 !text-xs" title="New conversation (⌘⇧N)">
        <Plus className="h-3.5 w-3.5" /> <span className="hidden sm:inline">New</span>
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Left rail — conversations                                           */
/* ------------------------------------------------------------------ */

function SessionsRail({ api, onNavigate }: { api: CopilotApi; onNavigate?: () => void }) {
  const { sessions, sessionId, newChat, openSession, deleteSession, renameSession, togglePin, clearAllSessions } = api
  const [q, setQ] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return sessions
    return sessions.filter((s) =>
      s.title.toLowerCase().includes(needle) ||
      s.messages.some((m) => m.text.toLowerCase().includes(needle))
    )
  }, [q, sessions])

  return (
    <>
      <div className="space-y-2 border-b border-ink-100 p-2.5">
        <button
          onClick={() => { newChat(); onNavigate?.() }}
          className="btn-primary w-full !py-2 !text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> New conversation
        </button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search conversations…"
            className="input !py-1.5 !pl-8 !text-xs"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 px-3 py-10 text-center text-xs text-ink-400">
            <MessageSquarePlus className="h-5 w-5" />
            {sessions.length === 0 ? 'No saved conversations yet.' : 'No conversation matches that search.'}
          </div>
        ) : (
          <ul className="space-y-1">
            {filtered.map((s) => (
              <li key={s.id}>
                <div className={cn(
                  'group rounded-lg px-2 py-1.5 transition',
                  s.id === sessionId ? 'bg-brand-50 ring-1 ring-brand-100' : 'hover:bg-ink-50'
                )}>
                  {renamingId === s.id ? (
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => { renameSession(s.id, draft); setRenamingId(null) }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { renameSession(s.id, draft); setRenamingId(null) }
                        if (e.key === 'Escape') setRenamingId(null)
                      }}
                      className="w-full rounded border border-brand-200 bg-white px-1.5 py-0.5 text-xs focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { openSession(s); onNavigate?.() }}
                        className="flex min-w-0 flex-1 flex-col text-left"
                      >
                        <span className="flex min-w-0 items-center gap-1">
                          {s.pinned && <Pin className="h-2.5 w-2.5 shrink-0 fill-brand-500 text-brand-500" />}
                          <span className="truncate text-xs font-medium text-ink-800">{s.title}</span>
                        </span>
                        <span className="text-[10px] text-ink-400">
                          {relativeTime(s.updatedAt)} · {s.messages.filter((m) => m.id !== 'welcome').length} messages
                        </span>
                      </button>
                      <div className="flex shrink-0 items-center opacity-0 transition group-hover:opacity-100">
                        <IconBtn title={s.pinned ? 'Unpin' : 'Pin'} onClick={() => togglePin(s.id)}>
                          <Pin className={cn('h-3 w-3', s.pinned && 'fill-brand-500 text-brand-500')} />
                        </IconBtn>
                        <IconBtn title="Rename" onClick={() => { setDraft(s.title); setRenamingId(s.id) }}>
                          <Pencil className="h-3 w-3" />
                        </IconBtn>
                        <IconBtn
                          title={confirmDelete === s.id ? 'Click again to delete' : 'Delete'}
                          danger={confirmDelete === s.id}
                          onClick={() => (confirmDelete === s.id ? deleteSession(s.id) : setConfirmDelete(s.id))}
                          onMouseLeave={() => setConfirmDelete((c) => (c === s.id ? null : c))}
                        >
                          {confirmDelete === s.id ? <Check className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                        </IconBtn>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-ink-100 p-2">
        <button
          onClick={() => (confirmClear ? (clearAllSessions(), setConfirmClear(false)) : setConfirmClear(true))}
          onMouseLeave={() => setConfirmClear(false)}
          disabled={sessions.length === 0}
          className={cn(
            'w-full rounded-lg px-2 py-1.5 text-[11px] font-medium transition disabled:opacity-40',
            confirmClear ? 'bg-red-50 text-red-600' : 'text-ink-500 hover:bg-ink-100'
          )}
        >
          {confirmClear ? 'Click again to clear all history' : `Clear local history (${sessions.length})`}
        </button>
        <p className="mt-1 px-1 text-[10px] leading-relaxed text-ink-400">
          Conversations are stored on this device only. Server-side audit records are retained separately per policy.
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Right rail — governance, audit, citations, approvals                */
/* ------------------------------------------------------------------ */

function GovernanceRail({
  api, tab, setTab, audit, model, selectedModel, secClass, role,
}: {
  api: CopilotApi
  tab: RailTab
  setTab: (t: RailTab) => void
  audit: AuditEntry[]
  model: typeof MODELS[number]
  selectedModel: typeof MODELS[number]
  secClass: string
  role: string
}) {
  const { usage, citations, approvals, setApprovalStatus, withdrawApproval } = api
  const pending = approvals.filter((a) => a.status === 'Pending').length

  const TABS: { key: RailTab; label: string; icon: typeof Gauge; badge?: number }[] = [
    { key: 'policy', label: 'Policy', icon: ShieldCheck },
    { key: 'audit', label: 'Audit', icon: ScrollText },
    { key: 'sources', label: 'Sources', icon: BookMarked },
    { key: 'approvals', label: 'Approvals', icon: ClipboardCheck, badge: pending || undefined },
  ]

  return (
    <>
      <div className="flex items-center gap-0.5 border-b border-ink-100 bg-ink-50/50 p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-medium transition',
              tab === t.key ? 'bg-white text-brand-700 shadow-sm ring-1 ring-ink-100' : 'text-ink-500 hover:text-ink-800'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
            {t.badge ? <span className="rounded-full bg-amber-100 px-1 text-[9px] font-semibold text-amber-700">{t.badge}</span> : null}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {tab === 'policy' && (
          <div className="space-y-4">
            <RailSection title="Active routing">
              <div className="rounded-xl border border-ink-100 bg-white p-3">
                <div className="flex items-start gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    {model.hosting === 'Cloud' ? <Cloud className="h-4 w-4" /> : <ServerCog className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-ink-900">{model.name}</div>
                    <div className="text-[11px] text-ink-500">{model.provider} · v{model.version} · {model.hosting}</div>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <Stat label="Accuracy" value={`${model.accuracy}%`} />
                  <Stat label="Latency" value={`${model.latencyMs} ms`} />
                  <Stat label="Risk class" value={model.riskClass} />
                  <Stat label="Security" value={model.securityRating} />
                </dl>
                <p className="mt-2 rounded-lg bg-emerald-50 px-2 py-1.5 text-[10.5px] leading-relaxed text-emerald-800">
                  {modelPolicy(model, secClass).reason}
                </p>
              </div>
            </RailSection>

            <RailSection title={`Model availability at ${secClass}`}>
              <ul className="space-y-1">
                {MODELS.map((m) => {
                  const v = modelPolicy(m, secClass)
                  return (
                    <li
                      key={m.id}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[11px]',
                        v.allowed ? 'border-ink-100 bg-white' : 'border-ink-100 bg-ink-50/60 opacity-70'
                      )}
                      title={v.reason}
                    >
                      {v.allowed
                        ? <Check className="h-3 w-3 shrink-0 text-emerald-600" />
                        : <Lock className="h-3 w-3 shrink-0 text-ink-400" />}
                      <span className={cn('min-w-0 flex-1 truncate', v.allowed ? 'text-ink-800' : 'text-ink-500 line-through')}>
                        {m.name}
                      </span>
                      <span className="shrink-0 rounded border border-ink-200 bg-white px-1 text-[9.5px] text-ink-500">{m.hosting}</span>
                      {m.id === selectedModel.id && (
                        <span className="shrink-0 rounded bg-brand-50 px-1 text-[9.5px] font-semibold text-brand-700">picked</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </RailSection>

            <RailSection title="Guardrails on every prompt">
              <ul className="space-y-1">
                {PIPELINE.map((s) => (
                  <li key={s.key} className="flex items-center gap-2 text-[11px] text-ink-700">
                    <Check className="h-3 w-3 shrink-0 text-emerald-600" /> {s.label}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-400">
                Enforced for role <span className="font-medium text-ink-600">{role}</span> under the AI Acceptable-Use Policy v2 and the DPDP Act 2023.
              </p>
            </RailSection>

            <RailSection title="Session usage">
              <div className="grid grid-cols-2 gap-2">
                <Meter icon={Hash} label="Prompts" value={String(usage.prompts)} />
                <Meter icon={Cpu} label="Tokens" value={usage.totalTokens.toLocaleString()} />
                <Meter icon={Timer} label="Avg latency" value={usage.avgLatencyMs ? `${(usage.avgLatencyMs / 1000).toFixed(1)}s` : '—'} />
                <Meter icon={Gauge} label="Answers" value={String(usage.answers)} />
              </div>
            </RailSection>
          </div>
        )}

        {tab === 'audit' && (
          <div className="space-y-3">
            <p className="text-[10.5px] leading-relaxed text-ink-500">
              Live trail for this session. Server-side records are immutable and retained per the audit schedule.
            </p>
            <ol className="relative space-y-3 border-l border-brand-100 pl-4 text-xs">
              {[...audit].reverse().map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-gradient shadow-[0_0_0_2px_#fff]" />
                  <div className="text-[10px] text-ink-400">{s.t}</div>
                  <div className="leading-relaxed text-ink-800">{s.e}</div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tab === 'sources' && (
          <div className="space-y-2">
            {citations.length === 0 ? (
              <EmptyRail icon={BookMarked} text="Sources cited by the copilot will collect here as the conversation develops." />
            ) : (
              citations.map((c) => {
                const [head, detail] = c.label.split(' — ')
                return (
                  <div key={c.label} className="flex items-start gap-2 rounded-lg border border-ink-100 bg-white p-2.5">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-ink-800">{head}</div>
                      {detail && <div className="truncate text-[11px] text-ink-500">{detail}</div>}
                    </div>
                    {c.count > 1 && (
                      <span className="shrink-0 rounded-full bg-ink-100 px-1.5 text-[10px] font-semibold text-ink-500">×{c.count}</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {tab === 'approvals' && (
          <div className="space-y-2">
            {approvals.length === 0 ? (
              <EmptyRail icon={ClipboardCheck} text="Answers you route for approval appear here with a file number and the officer they went to." />
            ) : (
              approvals.map((a) => <ApprovalCard key={a.id} record={a} onStatus={setApprovalStatus} onWithdraw={withdrawApproval} />)
            )}
          </div>
        )}
      </div>
    </>
  )
}

function ApprovalCard({
  record, onStatus, onWithdraw,
}: {
  record: ApprovalRecord
  onStatus: (id: string, s: ApprovalRecord['status']) => void
  onWithdraw: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const tone =
    record.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : record.status === 'Returned' ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-amber-200 bg-amber-50 text-amber-700'

  return (
    <div className="rounded-lg border border-ink-100 bg-white p-2.5">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] text-ink-400">{record.fileNo}</div>
          <div className="truncate text-xs font-semibold text-ink-900">{record.subject}</div>
          <div className="truncate text-[10.5px] text-ink-500">→ {record.approver} · {relativeTime(record.createdAt)}</div>
        </div>
        <span className={cn('shrink-0 rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold', tone)}>{record.status}</span>
      </div>

      {record.note && <p className="mt-1.5 rounded bg-ink-50 px-2 py-1 text-[10.5px] leading-relaxed text-ink-600">{record.note}</p>}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-ink-400 transition hover:text-brand-600"
      >
        <ChevronDown className={cn('h-3 w-3 transition', open && 'rotate-180')} /> {open ? 'Hide' : 'Preview'} draft
      </button>
      {open && (
        <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-ink-50 p-2 text-[10px] leading-relaxed text-ink-600">
          {record.body.slice(0, 900)}{record.body.length > 900 ? '…' : ''}
        </pre>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1">
        {record.status === 'Pending' ? (
          <>
            <button onClick={() => onStatus(record.id, 'Approved')} className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 transition hover:bg-emerald-100">
              Mark approved
            </button>
            <button onClick={() => onStatus(record.id, 'Returned')} className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 transition hover:bg-red-100">
              Return with remarks
            </button>
          </>
        ) : (
          <button onClick={() => onStatus(record.id, 'Pending')} className="inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white px-2 py-1 text-[10px] font-medium text-ink-600 transition hover:bg-ink-50">
            <Undo2 className="h-2.5 w-2.5" /> Reopen
          </button>
        )}
        <button onClick={() => onWithdraw(record.id)} className="ml-auto text-[10px] font-medium text-ink-400 transition hover:text-red-600">
          Withdraw
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Approval dialog                                                     */
/* ------------------------------------------------------------------ */

function ApprovalDialog({
  msg, api, onClose, onDone,
}: {
  msg: CopilotMsg | null
  api: CopilotApi
  onClose: () => void
  onDone: () => void
}) {
  const [subject, setSubject] = useState('')
  const [approver, setApprover] = useState(APPROVERS[1])
  const [note, setNote] = useState('')

  // Seed the subject from the draft's own heading whenever a new answer is routed.
  useEffect(() => {
    if (!msg) return
    const heading = msg.text.split('\n').find((l) => l.trim())?.replace(/[*#]/g, '').trim() ?? ''
    setSubject(heading.slice(0, 90))
    setNote('')
  }, [msg])

  if (!msg) return null

  const submit = () => {
    api.raiseApproval(msg, { subject, approver, note })
    onDone()
  }

  return (
    <AnimatePresence>
      <motion.div
        key="ovl"
        className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex items-center gap-2.5 bg-brand-gradient px-4 py-3 text-white">
            <ClipboardCheck className="h-5 w-5" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">Send draft for approval</div>
              <div className="text-[11px] text-white/80">Raises an e-Office file entry against this answer</div>
            </div>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <label className="label" htmlFor="ap-sub">Subject</label>
              <input id="ap-sub" value={subject} onChange={(e) => setSubject(e.target.value)} className="input mt-1" placeholder="Subject for the noting" />
            </div>
            <div>
              <label className="label" htmlFor="ap-who">Approving authority</label>
              <select id="ap-who" value={approver} onChange={(e) => setApprover(e.target.value)} className="input mt-1">
                {APPROVERS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="ap-note">Remarks for the approving officer</label>
              <textarea
                id="ap-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input mt-1 resize-none"
                placeholder="Optional — context, urgency, or the clause needing attention."
              />
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] leading-relaxed text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              This is an AI-generated draft. Verify every figure, date and citation against the source record before it is put up.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-ink-100 bg-ink-50/50 px-4 py-3">
            <button onClick={onClose} className="btn-outline !py-1.5 !text-xs">Cancel</button>
            <button onClick={submit} disabled={!subject.trim()} className="btn-primary !py-1.5 !text-xs">
              <ClipboardCheck className="h-3.5 w-3.5" /> Raise approval
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">{title}</div>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 px-2 py-1.5">
      <dt className="text-[9.5px] uppercase tracking-wide text-ink-400">{label}</dt>
      <dd className="text-xs font-semibold text-ink-800">{value}</dd>
    </div>
  )
}

function Meter({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white px-2 py-1.5">
      <div className="flex items-center gap-1 text-[9.5px] uppercase tracking-wide text-ink-400">
        <Icon className="h-2.5 w-2.5" /> {label}
      </div>
      <div className="text-sm font-semibold tabular-nums text-ink-900">{value}</div>
    </div>
  )
}

function EmptyRail({ icon: Icon, text }: { icon: typeof Gauge; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <Icon className="h-6 w-6 text-ink-300" />
      <p className="text-[11px] leading-relaxed text-ink-400">{text}</p>
    </div>
  )
}

function IconBtn({
  title, onClick, onMouseLeave, danger, children,
}: {
  title: string
  onClick: () => void
  onMouseLeave?: () => void
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
      className={cn(
        'grid h-6 w-6 place-items-center rounded transition',
        danger ? 'bg-red-100 text-red-600' : 'text-ink-400 hover:bg-white hover:text-ink-800'
      )}
    >
      {children}
    </button>
  )
}
