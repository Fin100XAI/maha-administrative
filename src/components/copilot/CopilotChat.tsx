import { useEffect, useRef, useState } from 'react'
import {
  Send, Paperclip, Mic, Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown, Check,
  ClipboardCheck, Download, Square, Info, ShieldCheck, Slash, FileText, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ConfidenceBadge } from '@/components/ui/Badges'
import { Markdown } from './Markdown'
import { CopilotMsg, PIPELINE, SLASH_COMMANDS, CAPABILITIES, pickReply } from './engine'

const WELCOME: CopilotMsg = {
  id: 'm1',
  role: 'ai',
  text: 'Namaskar. I am MAII Copilot running on your sovereign inference stack. Ask me anything — I can summarise GRs, draft notes and letters, translate to formal Marathi, and cite your department knowledge base. Type **/** for structured commands.',
  confidence: 96,
  sources: ['MAII AI · Session bootstrap'],
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
  const [messages, setMessages] = useState<CopilotMsg[]>([WELCOME])
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState<'idle' | 'pipeline' | 'streaming'>('idle')
  const [stageIdx, setStageIdx] = useState(0)
  const [attachments, setAttachments] = useState<string[]>([])
  const [mic, setMic] = useState(false)
  const [slashIdx, setSlashIdx] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const timers = useRef<number[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const slashOpen = input.startsWith('/') && phase === 'idle'
  const slashMatches = slashOpen
    ? SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.split(' ')[0].toLowerCase()))
    : []

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

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

  // Keep view pinned to the latest content
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, phase, stageIdx])

  const stop = () => {
    clearTimers()
    setPhase('idle')
    setMessages((prev) => prev.map((m) => (m.shown != null ? { ...m, shown: undefined, text: m.text.slice(0, m.shown) + ' …' } : m)))
    onAudit?.('Generation stopped by officer')
  }

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || phase !== 'idle') return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    const userMsg: CopilotMsg = { id: 'u' + Date.now(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    onAudit?.('Prompt sent · DLP scan clean')

    // 1) guardrail pipeline animation
    setPhase('pipeline')
    setStageIdx(0)
    PIPELINE.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStageIdx(i + 1), 260 * (i + 1)))
    })

    // 2) stream the reply
    const reply = pickReply(text)
    const aiId = 'a' + Date.now()
    timers.current.push(window.setTimeout(() => {
      setPhase('streaming')
      const aiMsg: CopilotMsg = {
        id: aiId, role: 'ai', text: reply.text, shown: 0,
        confidence: 88 + Math.floor(Math.random() * 9),
        sources: reply.sources,
      }
      setMessages((prev) => [...prev, aiMsg])
      const total = reply.text.length
      let shown = 0
      const tick = () => {
        shown = Math.min(total, shown + 3 + Math.floor(Math.random() * 5))
        const done = shown >= total
        setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, shown: done ? undefined : shown } : m)))
        if (done) {
          setPhase('idle')
          onAudit?.('Response generated · sources cited')
        } else {
          timers.current.push(window.setTimeout(tick, 16))
        }
      }
      tick()
    }, 260 * PIPELINE.length + 200))
  }

  const regenerate = (msg: CopilotMsg) => {
    const idx = messages.findIndex((m) => m.id === msg.id)
    const prevUser = [...messages.slice(0, idx)].reverse().find((m) => m.role === 'user')
    setMessages((prev) => prev.filter((m) => m.id !== msg.id))
    onAudit?.('Regeneration requested')
    send(prevUser?.text ?? 'Regenerate')
  }

  const copyMsg = async (msg: CopilotMsg) => {
    try { await navigator.clipboard.writeText(msg.text.replace(/\*\*/g, '')) } catch { /* clipboard unavailable */ }
    setCopied(msg.id)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const feedback = (msg: CopilotMsg, dir: 'up' | 'down') => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, feedback: m.feedback === dir ? undefined : dir } : m)))
    onAudit?.(dir === 'up' ? 'Feedback recorded · helpful' : 'Feedback recorded · needs review')
  }

  const applySlash = (cmd: typeof SLASH_COMMANDS[number]) => {
    setInput(cmd.template)
    taRef.current?.focus()
  }

  const empty = messages.length <= 1

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      {/* Thread */}
      <div ref={scrollRef} className={cn('flex-1 space-y-4 overflow-y-auto p-4', compact && 'p-3')}>
        {/* Empty-state capability grid */}
        {empty && !compact && (
          <div className="mx-auto max-w-2xl pt-2">
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
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {m.role === 'ai' && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  'relative min-w-0 overflow-hidden rounded-2xl px-4 py-3 text-sm shadow-sm',
                  compact ? 'max-w-[92%]' : 'max-w-[780px]',
                  m.role === 'user'
                    ? 'bg-brand-gradient text-white shadow-glow ring-1 ring-brand-300/40'
                    : 'bg-gradient-to-br from-white to-brand-50/40 ring-1 ring-ink-100'
                )}
              >
                {m.role === 'user' ? (
                  <div className="relative whitespace-pre-wrap leading-relaxed">{m.text}</div>
                ) : (
                  <div className="relative text-ink-800">
                    <Markdown text={m.shown != null ? m.text.slice(0, m.shown) : m.text} />
                    {m.shown != null && (
                      <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse rounded-sm bg-brand-500" />
                    )}
                  </div>
                )}

                {/* Answer footer: provenance + actions */}
                {m.role === 'ai' && m.shown == null && (
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
              {m.role === 'user' && (
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Guardrail pipeline indicator */}
        {phase === 'pipeline' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
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
                      i < stageIdx
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : i === stageIdx
                          ? 'border-brand-200 bg-brand-soft text-brand-700'
                          : 'border-ink-100 bg-white text-ink-400'
                    )}
                  >
                    {i < stageIdx
                      ? <Check className="h-2.5 w-2.5" />
                      : i === stageIdx
                        ? <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                        : <span className="h-2 w-2 rounded-full bg-ink-200" />}
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Composer */}
      <div className={cn('relative border-t border-ink-100 p-3', compact && 'p-2.5')}>
        {/* Slash-command palette */}
        <AnimatePresence>
          {slashOpen && slashMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="absolute inset-x-3 bottom-full z-20 mb-1 overflow-hidden rounded-xl border border-ink-100 bg-white/95 shadow-lg backdrop-blur"
            >
              <div className="flex items-center gap-1.5 border-b border-ink-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                <Slash className="h-3 w-3" /> Commands
              </div>
              {slashMatches.map((c, i) => (
                <button
                  key={c.cmd}
                  onMouseEnter={() => setSlashIdx(i)}
                  onClick={() => applySlash(c)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                    i === slashIdx ? 'bg-brand-soft text-brand-700' : 'text-ink-700'
                  )}
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
              onChange={(e) => {
                setInput(e.target.value)
                setSlashIdx(0)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              placeholder="Ask MAII Copilot — or type / for commands…"
              className="input resize-none pr-2 leading-relaxed"
              onKeyDown={(e) => {
                if (slashOpen && slashMatches.length > 0) {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx((i) => (i + 1) % slashMatches.length); return }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx((i) => (i - 1 + slashMatches.length) % slashMatches.length); return }
                  if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); applySlash(slashMatches[slashIdx]); return }
                  if (e.key === 'Escape') { setInput(''); return }
                }
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
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
