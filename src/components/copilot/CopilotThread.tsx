import { useEffect, useRef, useState } from 'react'
import {
  Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown, Check, ClipboardCheck, Download,
  FileText, ArrowDown, CornerDownLeft, Pencil, Paperclip, ShieldCheck, FileCode2,
  Sparkles, Lock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ConfidenceBadge } from '@/components/ui/Badges'
import { Markdown } from './Markdown'
import { CAPABILITIES, CopilotMsg, PIPELINE, humanSize } from './engine'
import type { CopilotApi } from './useCopilot'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export interface CopilotThreadProps {
  api: CopilotApi
  compact?: boolean
  modelName: string
  /** Officers are addressed by post, never by name. */
  designation?: string
  /** Opens the approval drawer — owned by the page so the dock can omit it. */
  onSendForApproval?: (msg: CopilotMsg) => void
  className?: string
}

export function CopilotThread({
  api, compact, modelName, designation, onSendForApproval, className,
}: CopilotThreadProps) {
  const { messages, phase, stageIdx, isEmpty, followups, send, regenerate, editAndResend, feedback, copyAnswer, downloadAnswer } = api

  const scrollRef = useRef<HTMLDivElement>(null)
  const atBottomRef = useRef(true)
  const [showJump, setShowJump] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  // Keep the view pinned to the newest content, but never yank it away from an
  // officer who has scrolled up to read something.
  useEffect(() => {
    const el = scrollRef.current
    if (el && atBottomRef.current) el.scrollTop = el.scrollHeight
  }, [messages, phase, stageIdx])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90
    atBottomRef.current = near
    setShowJump(!near)
  }

  const jumpToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    atBottomRef.current = true
    setShowJump(false)
  }

  const doCopy = async (m: CopilotMsg) => {
    if (await copyAnswer(m)) {
      setCopied(m.id)
      window.setTimeout(() => setCopied(null), 1500)
    }
  }

  const startEdit = (m: CopilotMsg) => {
    setEditing(m.id)
    setDraft(m.text)
  }

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={cn('relative flex-1 overflow-y-auto', compact ? 'space-y-4 p-3' : 'space-y-6 px-4 py-5 sm:px-6')}
      >
        {/* Ambient brand wash */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-brand-500/[0.05] blur-3xl" />
          <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-brand-900/[0.04] blur-3xl" />
        </div>

        {isEmpty && <EmptyState compact={compact} designation={designation} onPick={(p) => send(p)} />}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const streaming = m.shown != null
            const isWelcome = m.id === 'welcome'

            /* ---------------------------- officer prompt ---------------------------- */
            if (m.role === 'user') {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative flex justify-end gap-2.5"
                >
                  <div className="flex min-w-0 max-w-[92%] flex-col items-end sm:max-w-[80%]">
                    {editing === m.id ? (
                      <div className="w-full rounded-2xl border border-brand-200 bg-white p-2.5 shadow-sm">
                        <textarea
                          autoFocus
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              setEditing(null)
                              editAndResend(m, draft)
                            }
                            if (e.key === 'Escape') setEditing(null)
                          }}
                          rows={3}
                          className="input resize-none text-sm"
                        />
                        <div className="mt-2 flex items-center justify-end gap-1.5">
                          <button onClick={() => setEditing(null)} className="btn-ghost !px-2.5 !py-1 !text-xs">Cancel</button>
                          <button
                            onClick={() => { setEditing(null); editAndResend(m, draft) }}
                            className="btn-primary !px-2.5 !py-1 !text-xs"
                          >
                            <CornerDownLeft className="h-3 w-3" /> Re-run
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl rounded-br-md bg-brand-gradient px-4 py-2.5 text-sm leading-relaxed text-white shadow-glow ring-1 ring-brand-300/40">
                        <div className="whitespace-pre-wrap">{m.text}</div>
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/20 pt-2">
                            {m.attachments.map((a) => (
                              <span key={a.id} className="inline-flex items-center gap-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-white/25">
                                <Paperclip className="h-2.5 w-2.5" />
                                <span className="max-w-[140px] truncate">{a.name}</span>
                                <span className="text-white/70">{humanSize(a.size)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-1.5 px-1 opacity-0 transition group-hover:opacity-100">
                      {phase === 'idle' && editing !== m.id && (
                        <button
                          onClick={() => startEdit(m)}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-ink-400 transition hover:text-brand-600"
                        >
                          <Pencil className="h-2.5 w-2.5" /> Edit
                        </button>
                      )}
                      {m.ts && (
                        <span className="text-[10px] text-ink-400">
                          {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600 ring-1 ring-ink-200">
                    <User className="h-4 w-4" />
                  </div>
                </motion.div>
              )
            }

            /* ------------------------------ AI answer ------------------------------ */
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="group relative flex gap-2.5">
                <div className={cn(
                  'relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow',
                  streaming && 'ring-2 ring-brand-300/60'
                )}>
                  {streaming && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-lg ring-2 ring-brand-400/60"
                      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <Bot className="relative h-4 w-4" />
                </div>

                <div className={cn('flex min-w-0 flex-1 flex-col', compact ? 'max-w-full' : 'max-w-[860px]')}>
                  <div className={cn(
                    'relative min-w-0 overflow-hidden rounded-2xl rounded-tl-md bg-white text-sm shadow-card ring-1 ring-ink-100',
                    !isWelcome && 'border-l-[3px] border-brand-500'
                  )}>
                    <div className={cn('relative text-ink-800', compact ? 'px-3.5 py-3' : 'px-5 py-4')}>
                      <Markdown text={streaming ? m.text.slice(0, m.shown) : m.text} />
                      {streaming && <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse rounded-sm bg-brand-500" />}
                    </div>

                    {!streaming && !isWelcome && (
                      <div className={cn('space-y-2 border-t border-ink-100 bg-ink-50/40', compact ? 'px-3.5 py-2.5' : 'px-5 py-3')}>
                        {m.sources && m.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Sources</span>
                            {m.sources.map((s, i) => (
                              <span key={i} className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-brand-100 bg-white px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                                <FileText className="h-2.5 w-2.5 shrink-0" /> <span className="truncate">{s}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5">
                          {typeof m.confidence === 'number' && <ConfidenceBadge score={m.confidence} />}
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            <ShieldCheck className="h-2.5 w-2.5" /> Audit-logged
                          </span>
                          {m.approvalId && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              <ClipboardCheck className="h-2.5 w-2.5" /> In approval
                            </span>
                          )}

                          <div className="ml-auto flex items-center gap-0.5">
                            <ActionBtn title={copied === m.id ? 'Copied' : 'Copy'} onClick={() => doCopy(m)}>
                              {copied === m.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </ActionBtn>
                            <ActionBtn title="Regenerate" onClick={() => regenerate(m)} disabled={phase !== 'idle'}>
                              <RefreshCw className="h-3.5 w-3.5" />
                            </ActionBtn>
                            {!compact && (
                              <>
                                <ActionBtn title="Download as Word (.doc)" onClick={() => downloadAnswer(m, 'doc')}>
                                  <Download className="h-3.5 w-3.5" />
                                </ActionBtn>
                                <ActionBtn title="Download as Markdown" onClick={() => downloadAnswer(m, 'md')}>
                                  <FileCode2 className="h-3.5 w-3.5" />
                                </ActionBtn>
                                {onSendForApproval && (
                                  <ActionBtn title="Send for approval" onClick={() => onSendForApproval(m)}>
                                    <ClipboardCheck className={cn('h-3.5 w-3.5', m.approvalId && 'text-amber-600')} />
                                  </ActionBtn>
                                )}
                              </>
                            )}
                            <ActionBtn title="Helpful" onClick={() => feedback(m, 'up')}>
                              <ThumbsUp className={cn('h-3.5 w-3.5', m.feedback === 'up' && 'fill-emerald-500 text-emerald-600')} />
                            </ActionBtn>
                            <ActionBtn title="Needs review" onClick={() => feedback(m, 'down')}>
                              <ThumbsDown className={cn('h-3.5 w-3.5', m.feedback === 'down' && 'fill-red-400 text-red-500')} />
                            </ActionBtn>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!streaming && !isWelcome && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 px-1 text-[10px] text-ink-400">
                      {typeof m.latencyMs === 'number' && <span>{(m.latencyMs / 1000).toFixed(1)}s</span>}
                      <span>·</span>
                      <span>{m.model ?? modelName}</span>
                      {m.secClass && <><span>·</span><span className="inline-flex items-center gap-0.5"><Lock className="h-2.5 w-2.5" />{m.secClass}</span></>}
                      {m.ts && <><span>·</span><span>{new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></>}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Guardrail pipeline */}
        {phase === 'pipeline' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-card ring-1 ring-ink-100">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">Sovereign guardrail pipeline</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {PIPELINE.map((s, i) => (
                  <span
                    key={s.key}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all duration-300',
                      i < stageIdx ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : i === stageIdx ? 'border-brand-200 bg-brand-50 text-brand-700'
                          : 'border-ink-100 bg-white text-ink-400'
                    )}
                  >
                    {i < stageIdx ? <Check className="h-2.5 w-2.5" />
                      : i === stageIdx ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                        : <span className="h-2 w-2 rounded-full bg-ink-200" />}
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Contextual follow-ups */}
        {followups.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-wrap gap-1.5 pl-10">
            {followups.map((f) => (
              <button
                key={f}
                onClick={() => send(f)}
                className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white px-2.5 py-1 text-[11px] font-medium text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                <CornerDownLeft className="h-3 w-3" /> {f}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showJump && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={jumpToBottom}
            className="absolute bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-lg"
          >
            <ArrowDown className="h-3.5 w-3.5" /> {phase === 'streaming' ? 'New response' : 'Jump to latest'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ compact, designation, onPick }: { compact?: boolean; designation?: string; onPick: (p: string) => void }) {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className={cn('flex items-center gap-3', compact ? 'mb-3' : 'mb-5')}>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className={cn('font-semibold text-ink-900', compact ? 'text-sm' : 'text-lg')}>
            {greeting()}{designation ? `, ${designation}` : ''} — how can I assist?
          </div>
          <div className="text-xs text-ink-500">Sovereign inference · on-prem · every answer cited and audit-logged</div>
        </div>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <button
              key={c.title}
              onClick={() => onPick(c.prompt)}
              className="group rounded-xl border border-ink-100 bg-white/80 p-3.5 text-left shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-glow"
            >
              <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition group-hover:bg-brand-gradient group-hover:text-white">
                <c.icon className="h-4 w-4" />
              </span>
              <div className="text-sm font-semibold text-ink-900">{c.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-ink-500">{c.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ActionBtn({
  title, onClick, disabled, children,
}: {
  title: string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className="grid h-7 w-7 place-items-center rounded-md text-ink-500 transition hover:bg-white hover:text-ink-900 disabled:opacity-40"
    >
      {children}
    </button>
  )
}
