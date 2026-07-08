import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Send, Paperclip, Mic, Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown, Check,
  ClipboardCheck, Download, Square, Info, ShieldCheck, Slash, FileText, X,
  History, Plus, Trash2, ArrowDown, MessageSquarePlus, Pencil, CornerDownLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ConfidenceBadge } from '@/components/ui/Badges'
import { Markdown } from './Markdown'
import {
  CopilotMsg, CopilotSession, PIPELINE, SLASH_COMMANDS, CAPABILITIES, FOLLOWUPS,
  pickReply, loadSessions, saveSessions, relativeTime,
} from './engine'

const welcome = (): CopilotMsg => ({
  id: 'welcome',
  role: 'ai',
  text: 'Namaskar. I am Maha Copilot running on your sovereign inference stack. Ask me anything — I can summarise GRs, draft notes and letters, translate to formal Marathi, and cite your department knowledge base. Type **/** for structured commands.',
  confidence: 96,
  sources: ['Maha Copilot · Session bootstrap'],
  ts: Date.now(),
})

const ROTATING_PLACEHOLDERS = [
  'Summarise GR-2026-URD-118 with a compliance checklist…',
  'Draft an official letter to Divisional Commissioners…',
  'Show head-wise budget utilisation this quarter…',
]

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export interface CopilotChatProps {
  compact?: boolean
  modelName?: string
  secClass?: string
  langLabel?: string
  onAudit?: (event: string) => void
  className?: string
  initialQuery?: string
}

export function CopilotChat({ compact, modelName = 'BharatGPT', secClass = 'Internal', langLabel = 'English', onAudit, className, initialQuery }: CopilotChatProps) {
  const [messages, setMessages] = useState<CopilotMsg[]>([welcome()])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<'idle' | 'pipeline' | 'streaming'>('idle')
  const [stageIdx, setStageIdx] = useState(0)
  const [attachments, setAttachments] = useState<string[]>([])
  const [mic, setMic] = useState(false)
  const [slashIdx, setSlashIdx] = useState(0)
  const [slashDismissed, setSlashDismissed] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const [phIdx, setPhIdx] = useState(0)

  // Conversation history
  const [sessions, setSessions] = useState<CopilotSession[]>(() => loadSessions())
  const [historyOpen, setHistoryOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState('')
  const sessionIdRef = useRef<string | null>(null)

  // Smart scroll
  const [showJump, setShowJump] = useState(false)
  const atBottomRef = useRef(true)

  const timers = useRef<number[]>([])
  const startRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const slashOpen = input.startsWith('/') && !slashDismissed && phase === 'idle'
  const slashMatches = slashOpen
    ? SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.split(' ')[0].toLowerCase()))
    : []

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  // Rotating placeholder while empty + unfocused
  useEffect(() => {
    if (input || focused) return
    const id = window.setInterval(() => setPhIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length), 4000)
    return () => window.clearInterval(id)
  }, [input, focused])

  // Auto-send a query handed off from the header search (once).
  const seededQuery = useRef<string | null>(null)
  useEffect(() => {
    const q = initialQuery?.trim()
    if (q && seededQuery.current !== q) {
      seededQuery.current = q
      send(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  // Keep view pinned to the latest content — but only when already near the bottom.
  useEffect(() => {
    const el = scrollRef.current
    if (el && atBottomRef.current) el.scrollTop = el.scrollHeight
  }, [messages, phase, stageIdx])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    atBottomRef.current = near
    setShowJump(!near)
  }
  const jumpToBottom = () => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    atBottomRef.current = true
    setShowJump(false)
  }

  /* --------------------------- persistence --------------------------- */
  const persist = (msgs: CopilotMsg[]) => {
    const firstUser = msgs.find((m) => m.role === 'user')
    if (!firstUser) return
    const id = sessionIdRef.current ?? 's' + Date.now()
    sessionIdRef.current = id
    const existing = sessions.find((s) => s.id === id)
    const session: CopilotSession = {
      id,
      title: existing?.title || firstUser.text.slice(0, 64),
      updatedAt: Date.now(),
      messages: msgs,
    }
    const next = [session, ...loadSessions().filter((s) => s.id !== id)]
    saveSessions(next)
    setSessions(loadSessions())
    setTitle(session.title)
  }

  const newChat = () => {
    clearTimers()
    setPhase('idle')
    sessionIdRef.current = null
    setMessages([welcome()])
    setTitle('')
    setEditingTitle(false)
    setHistoryOpen(false)
    atBottomRef.current = true
    onAudit?.('New copilot session started')
  }

  const openSession = (s: CopilotSession) => {
    clearTimers()
    setPhase('idle')
    sessionIdRef.current = s.id
    setMessages(s.messages.length ? s.messages : [welcome()])
    setTitle(s.title)
    setHistoryOpen(false)
    atBottomRef.current = true
    requestAnimationFrame(jumpToBottom)
  }

  const deleteSession = (id: string) => {
    const next = loadSessions().filter((s) => s.id !== id)
    saveSessions(next)
    setSessions(next)
    if (sessionIdRef.current === id) newChat()
    setConfirmDelete(null)
  }

  const commitTitle = () => {
    setEditingTitle(false)
    const id = sessionIdRef.current
    if (!id) return
    const trimmed = title.trim() || 'Untitled session'
    setTitle(trimmed)
    const next = loadSessions().map((s) => (s.id === id ? { ...s, title: trimmed } : s))
    saveSessions(next)
    setSessions(next)
  }

  /* ------------------------------ send ------------------------------- */
  const stop = () => {
    clearTimers()
    setPhase('idle')
    setMessages((prev) => {
      const next = prev.map((m) => (m.shown != null ? { ...m, shown: undefined, text: m.text.slice(0, m.shown) + ' …' } : m))
      persist(next)
      return next
    })
    onAudit?.('Generation stopped by officer')
  }

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || phase !== 'idle') return
    setInput('')
    setSlashDismissed(false)
    if (taRef.current) taRef.current.style.height = 'auto'
    atBottomRef.current = true
    const userMsg: CopilotMsg = { id: 'u' + Date.now(), role: 'user', text, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    onAudit?.('Prompt sent · DLP scan clean')
    startRef.current = Date.now()

    // 1) guardrail pipeline animation
    setPhase('pipeline')
    setStageIdx(0)
    PIPELINE.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStageIdx(i + 1), 240 * (i + 1)))
    })

    // 2) stream the reply (word-ish chunks for a smooth reveal)
    const reply = pickReply(text)
    const aiId = 'a' + Date.now()
    timers.current.push(window.setTimeout(() => {
      setPhase('streaming')
      const aiMsg: CopilotMsg = {
        id: aiId, role: 'ai', text: reply.text, shown: 0, key: reply.key,
        confidence: 88 + Math.floor(Math.random() * 9),
        sources: reply.sources, ts: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
      const full = reply.text
      let shown = 0
      const tick = () => {
        shown = Math.min(full.length, shown + 8 + Math.floor(Math.random() * 12))
        while (shown < full.length && !/\s/.test(full[shown])) shown++ // land on a word boundary
        const done = shown >= full.length
        setMessages((prev) => {
          const next = prev.map((m) =>
            m.id === aiId ? { ...m, shown: done ? undefined : shown, latencyMs: done ? Date.now() - startRef.current : m.latencyMs } : m
          )
          if (done) persist(next)
          return next
        })
        if (done) {
          setPhase('idle')
          onAudit?.('Response generated · sources cited')
        } else {
          timers.current.push(window.setTimeout(tick, 22))
        }
      }
      tick()
    }, 240 * PIPELINE.length + 180))
  }

  const regenerate = (msg: CopilotMsg) => {
    const idx = messages.findIndex((m) => m.id === msg.id)
    const prevUser = [...messages.slice(0, idx)].reverse().find((m) => m.role === 'user')
    setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    onAudit?.('Regeneration requested')
    send(prevUser?.text ?? 'Regenerate')
  }

  const copyMsg = async (msg: CopilotMsg) => {
    try { await navigator.clipboard.writeText(msg.text.replace(/\*\*/g, '').replace(/`/g, '')) } catch { /* clipboard unavailable */ }
    setCopied(msg.id)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const feedback = (msg: CopilotMsg, dir: 'up' | 'down') => {
    setMessages((prev) => {
      const next = prev.map((m) => (m.id === msg.id ? { ...m, feedback: m.feedback === dir ? undefined : dir } : m))
      persist(next)
      return next
    })
    onAudit?.(dir === 'up' ? 'Feedback recorded · helpful' : 'Feedback recorded · needs review')
  }

  const applySlash = (cmd: typeof SLASH_COMMANDS[number]) => {
    setInput(cmd.template)
    setSlashDismissed(true)
    taRef.current?.focus()
  }

  const empty = messages.length <= 1
  const lastAi = useMemo(() => [...messages].reverse().find((m) => m.role === 'ai' && m.id !== 'welcome' && m.shown == null), [messages])
  const followups = phase === 'idle' && lastAi?.key ? (FOLLOWUPS[lastAi.key] ?? []) : []

  return (
    <div className={cn('relative flex min-h-0 flex-col', className)}>
      {/* Session toolbar */}
      <div className="flex items-center gap-1.5 border-b border-ink-100 bg-white/60 px-2.5 py-1.5 backdrop-blur">
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className={cn('inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition', historyOpen ? 'bg-brand-soft text-brand-700' : 'text-ink-600 hover:bg-ink-100')}
          title="Conversation history"
        >
          <History className="h-3.5 w-3.5" /> {!compact && 'History'}
          {sessions.length > 0 && (
            <span className="rounded-full bg-ink-100 px-1.5 text-[10px] font-semibold text-ink-500">{sessions.length}</span>
          )}
        </button>

        <div className="mx-1 h-4 w-px bg-ink-100" />

        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false) }}
            className="min-w-0 flex-1 rounded border border-brand-200 bg-white px-1.5 py-0.5 text-xs text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        ) : (
          <button
            type="button"
            onClick={() => sessionIdRef.current && setEditingTitle(true)}
            disabled={!sessionIdRef.current}
            className="group flex min-w-0 flex-1 items-center gap-1.5 text-left"
            title={sessionIdRef.current ? 'Rename session' : undefined}
          >
            <span className="truncate text-xs font-medium text-ink-700">{title || (empty ? 'New conversation' : 'Current session')}</span>
            {sessionIdRef.current && <Pencil className="h-3 w-3 shrink-0 text-ink-300 opacity-0 transition group-hover:opacity-100" />}
          </button>
        )}

        <button
          type="button"
          onClick={newChat}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-600 transition hover:bg-ink-100"
          title="New chat"
        >
          <Plus className="h-3.5 w-3.5" /> {!compact && 'New'}
        </button>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-ink-100 bg-ink-50/50"
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center gap-1.5 py-6 text-center text-xs text-ink-400">
                  <MessageSquarePlus className="h-5 w-5" />
                  No saved conversations yet.
                </div>
              ) : (
                <ul className="space-y-1">
                  {sessions.map((s) => (
                    <li key={s.id}>
                      <div className={cn('group flex items-center gap-2 rounded-lg px-2 py-1.5 transition', s.id === sessionIdRef.current ? 'bg-brand-soft' : 'hover:bg-white')}>
                        <button onClick={() => openSession(s)} className="flex min-w-0 flex-1 flex-col text-left">
                          <span className="truncate text-xs font-medium text-ink-800">{s.title}</span>
                          <span className="text-[10px] text-ink-400">{relativeTime(s.updatedAt)} · {s.messages.filter((m) => m.role !== 'ai' || m.id !== 'welcome').length} messages</span>
                        </button>
                        <button
                          onClick={() => confirmDelete === s.id ? deleteSession(s.id) : setConfirmDelete(s.id)}
                          onMouseLeave={() => setConfirmDelete((c) => (c === s.id ? null : c))}
                          className={cn('grid h-6 w-6 shrink-0 place-items-center rounded transition', confirmDelete === s.id ? 'bg-red-100 text-red-600' : 'text-ink-300 hover:bg-ink-100 hover:text-red-500')}
                          title={confirmDelete === s.id ? 'Click again to delete' : 'Delete'}
                        >
                          {confirmDelete === s.id ? <Check className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thread */}
      <div ref={scrollRef} onScroll={onScroll} className={cn('relative flex-1 space-y-4 overflow-y-auto p-4', compact && 'p-3')}>
        {/* Ambient brand mesh */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
          <div className="absolute -left-24 -top-16 h-64 w-64 rounded-full bg-brand-500/[0.05] blur-3xl" />
          <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-brand-900/[0.04] blur-3xl" />
        </div>

        {/* Empty-state greeting + capability grid */}
        {empty && (
          <div className="relative mx-auto max-w-2xl pt-1">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink-900">{greeting()} — how can I assist?</div>
                <div className="text-xs text-ink-500">Sovereign · on-prem · audit-logged</div>
              </div>
            </div>
            {!compact && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {CAPABILITIES.map((c) => (
                  <button
                    key={c.title}
                    onClick={() => taRef.current?.focus()}
                    className="group rounded-xl border border-ink-100 bg-white/70 p-3.5 text-left backdrop-blur transition hover:border-brand-200 hover:shadow-soft"
                  >
                    <span className="mb-2 grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand-600 ring-1 ring-brand-100 transition group-hover:bg-brand-gradient group-hover:text-white">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <div className="text-sm font-semibold text-ink-900">{c.title}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-ink-500">{c.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const streaming = m.shown != null
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('group relative flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'ai' && (
                  <div className={cn('relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow', streaming && 'ring-2 ring-brand-300/60')}>
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
                )}
                <div className="flex min-w-0 flex-col">
                  <div
                    className={cn(
                      'relative min-w-0 overflow-hidden rounded-2xl px-4 py-3 text-sm shadow-sm',
                      compact ? 'max-w-[92%]' : 'max-w-[780px]',
                      m.role === 'user'
                        ? 'self-end bg-brand-gradient text-white shadow-glow ring-1 ring-brand-300/40'
                        : 'bg-gradient-to-br from-white to-brand-50/40 ring-1 ring-ink-100'
                    )}
                  >
                    {m.role === 'user' ? (
                      <div className="relative whitespace-pre-wrap leading-relaxed">{m.text}</div>
                    ) : (
                      <div className="relative text-ink-800">
                        <Markdown text={streaming ? m.text.slice(0, m.shown) : m.text} />
                        {streaming && <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse rounded-sm bg-brand-500" />}
                      </div>
                    )}

                    {/* Answer footer: provenance + actions */}
                    {m.role === 'ai' && !streaming && m.id !== 'welcome' && (
                      <div className="relative mt-3 space-y-2 border-t border-ink-100 pt-2.5">
                        {m.sources && m.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {m.sources.map((s, i) => (
                              <span key={i} className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-brand-100 bg-brand-soft/70 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
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
                          <div className="ml-auto flex items-center gap-0.5">
                            <ActionBtn title={copied === m.id ? 'Copied' : 'Copy'} onClick={() => copyMsg(m)}>
                              {copied === m.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            </ActionBtn>
                            <ActionBtn title="Regenerate" onClick={() => regenerate(m)}><RefreshCw className="h-3.5 w-3.5" /></ActionBtn>
                            {!compact && <ActionBtn title="Export DOCX"><Download className="h-3.5 w-3.5" /></ActionBtn>}
                            {!compact && <ActionBtn title="Send for approval"><ClipboardCheck className="h-3.5 w-3.5" /></ActionBtn>}
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
                  {/* meta line: latency · model · time */}
                  {m.role === 'ai' && !streaming && m.id !== 'welcome' && (
                    <div className="mt-1 px-1 text-[10px] text-ink-400">
                      {typeof m.latencyMs === 'number' && <span>{(m.latencyMs / 1000).toFixed(1)}s · </span>}
                      {modelName} · on-prem{m.ts ? ` · ${new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </div>
                  )}
                  {m.role === 'user' && m.ts && (
                    <div className="mt-0.5 px-1 text-right text-[10px] text-ink-400 opacity-0 transition group-hover:opacity-100">
                      {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Guardrail pipeline indicator */}
        {phase === 'pipeline' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-brand-50/40 px-4 py-3 ring-1 ring-ink-100">
              <div className="flex flex-wrap items-center gap-1.5">
                {PIPELINE.map((s, i) => (
                  <span
                    key={s.key}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all duration-300',
                      i < stageIdx ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : i === stageIdx ? 'border-brand-200 bg-brand-soft text-brand-700'
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

        {/* Follow-up suggestions */}
        {followups.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-wrap gap-1.5 pl-10">
            {followups.map((f) => (
              <button
                key={f}
                onClick={() => send(f)}
                className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-white px-2.5 py-1 text-[11px] font-medium text-brand-700 transition hover:bg-brand-soft"
              >
                <CornerDownLeft className="h-3 w-3" /> {f}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Jump-to-latest pill */}
      <AnimatePresence>
        {showJump && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={jumpToBottom}
            className="absolute bottom-24 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-lg"
          >
            <ArrowDown className="h-3.5 w-3.5" /> {phase === 'streaming' ? 'New response' : 'Jump to latest'}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div className={cn('relative border-t border-ink-100 p-3', compact && 'p-2.5')}>
        {/* Slash-command palette */}
        <AnimatePresence>
          {slashOpen && slashMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute inset-x-3 bottom-full z-20 mb-1 max-h-72 overflow-y-auto rounded-xl border border-ink-100 bg-white/95 shadow-lg backdrop-blur"
            >
              <div className="sticky top-0 flex items-center gap-1.5 border-b border-ink-100 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                <Slash className="h-3 w-3" /> Commands
              </div>
              {slashMatches.map((c, i) => (
                <button
                  key={c.cmd}
                  onMouseEnter={() => setSlashIdx(i)}
                  onClick={() => applySlash(c)}
                  className={cn('flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors', i === slashIdx ? 'bg-brand-soft text-brand-700' : 'text-ink-700')}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white text-brand-600 ring-1 ring-ink-100">
                    <c.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-xs font-semibold text-brand-600">{c.cmd}</span>
                  <span className="truncate text-ink-600">{c.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt suggestions (only before first exchange) */}
        {empty && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SLASH_COMMANDS.slice(0, compact ? 3 : 5).map((s) => (
              <button
                key={s.cmd}
                onClick={() => send(s.template)}
                className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-600 transition hover:border-brand-200 hover:bg-brand-soft hover:text-brand-700"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {attachments.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-lg border border-ink-100 bg-ink-50 px-2 py-1 text-[11px] text-ink-700">
                <Paperclip className="h-3 w-3" /> <span className="max-w-[160px] truncate">{a}</span>
                <button onClick={() => setAttachments((x) => x.filter((n) => n !== a))} className="text-ink-400 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-end gap-1.5">
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) { setAttachments((a) => [...a, f.name]); onAudit?.('File attached · DLP scan clean') }
          }} />
          <div className="relative min-w-0 flex-1">
            <textarea
              ref={taRef}
              rows={compact ? 1 : 2}
              value={input}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => {
                setInput(e.target.value)
                setSlashIdx(0)
                if (!e.target.value.startsWith('/')) setSlashDismissed(false)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              placeholder={input || focused ? 'Ask Maha Copilot — or type / for commands…' : ROTATING_PLACEHOLDERS[phIdx]}
              className="input resize-none pr-2 leading-relaxed"
              onKeyDown={(e) => {
                if (slashOpen && slashMatches.length > 0) {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx((i) => (i + 1) % slashMatches.length); return }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx((i) => (i - 1 + slashMatches.length) % slashMatches.length); return }
                  if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) { e.preventDefault(); applySlash(slashMatches[slashIdx]); return }
                  if (e.key === 'Escape') { e.preventDefault(); setSlashDismissed(true); return }
                }
                if ((e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || (e.key === 'Enter' && !e.shiftKey)) {
                  e.preventDefault(); send()
                }
              }}
            />
          </div>
          <button type="button" title="Attach document" className="btn-ghost !p-2.5" onClick={() => fileRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Dictate"
            onClick={() => setMic((v) => !v)}
            className={cn('btn-ghost !p-2.5', mic && '!bg-red-50 !text-red-600 ring-1 ring-red-200')}
          >
            <Mic className={cn('h-4 w-4', mic && 'animate-pulse')} />
          </button>
          {phase === 'idle' ? (
            <button type="submit" disabled={!input.trim()} className="btn-primary !px-3.5">
              <Send className="h-4 w-4" /> {!compact && 'Send'}
            </button>
          ) : (
            <button type="button" onClick={stop} className="btn-outline !px-3.5 !text-red-600">
              <Square className="h-3.5 w-3.5 fill-current" /> {!compact && 'Stop'}
            </button>
          )}
        </form>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-ink-500">
          <Info className="h-3 w-3 shrink-0" />
          <span>Prompts are logged and DLP-scanned. Confidential/Secret prompts route only to on-prem models.</span>
          <span className="ml-auto hidden items-center gap-1.5 sm:inline-flex">
            <span className="rounded border border-ink-200 bg-ink-50 px-1 font-medium">{modelName}</span>
            <span className="rounded border border-ink-200 bg-ink-50 px-1 font-medium">{secClass}</span>
            <span className="rounded border border-ink-200 bg-ink-50 px-1 font-medium">{langLabel}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ title, onClick, children }: { title: string; onClick?: () => void; children: any }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded-md text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
    >
      {children}
    </button>
  )
}
