import { useEffect, useRef, useState } from 'react'
import {
  Send, Paperclip, Mic, MicOff, Square, Slash, X, FileText, FileWarning,
  UploadCloud, AlertTriangle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SLASH_COMMANDS, humanSize } from './engine'
import type { CopilotApi } from './useCopilot'
import { speechLocale, useDictation } from './useDictation'

const ROTATING_PLACEHOLDERS = [
  'Summarise GR-2026-URD-118 with a compliance checklist…',
  'Draft an official letter to Divisional Commissioners…',
  'Show head-wise budget utilisation this quarter…',
  'Prepare a brief on WP 4471/2026 with our compliance status…',
  'Translate this note to formal Marathi (शासकीय मराठी)…',
]

export interface CopilotComposerProps {
  api: CopilotApi
  compact?: boolean
  /** Drives the dictation locale (en-IN / mr-IN / hi-IN). */
  langLabel: string
  className?: string
}

export function CopilotComposer({ api, compact, langLabel, className }: CopilotComposerProps) {
  const { phase, isEmpty, attachments, attachError, addFiles, removeAttachment, setAttachError, send, stop } = api

  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [phIdx, setPhIdx] = useState(0)
  const [slashIdx, setSlashIdx] = useState(0)
  const [slashDismissed, setSlashDismissed] = useState(false)
  const [dragging, setDragging] = useState(false)

  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)

  const dictation = useDictation(speechLocale(langLabel), (text) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text))
    requestAnimationFrame(() => autosize())
  })

  const slashOpen = input.startsWith('/') && !slashDismissed && phase === 'idle'
  const slashMatches = slashOpen
    ? SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.split(' ')[0].toLowerCase()))
    : []

  const autosize = () => {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, compact ? 120 : 200) + 'px'
  }

  // Rotate the hint only while the field is idle and empty.
  useEffect(() => {
    if (input || focused) return
    const id = window.setInterval(() => setPhIdx((i) => (i + 1) % ROTATING_PLACEHOLDERS.length), 4200)
    return () => window.clearInterval(id)
  }, [input, focused])

  // ⌘/ or Ctrl+/ focuses the composer from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        taRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = () => {
    if (phase !== 'idle') return
    if (!input.trim() && !attachments.length) return
    send(input)
    setInput('')
    setSlashDismissed(false)
    if (dictation.listening) dictation.stop()
    requestAnimationFrame(autosize)
  }

  const applySlash = (cmd: typeof SLASH_COMMANDS[number]) => {
    setInput(cmd.template)
    setSlashDismissed(true)
    taRef.current?.focus()
    requestAnimationFrame(autosize)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  return (
    <div
      className={cn('relative border-t border-ink-100 bg-white/70 backdrop-blur', compact ? 'p-2.5' : 'p-3 sm:p-4', className)}
      onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setDragging(true) }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => { dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false) }}
      onDrop={onDrop}
    >
      {/* Drop overlay */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-2 z-30 grid place-items-center rounded-xl border-2 border-dashed border-brand-400 bg-brand-50/90"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
              <UploadCloud className="h-5 w-5" /> Drop documents to attach — scanned in-browser
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <span className="ml-auto normal-case tracking-normal text-ink-400">↑↓ navigate · ⏎ insert · esc dismiss</span>
            </div>
            {slashMatches.map((c, i) => (
              <button
                key={c.cmd}
                onMouseEnter={() => setSlashIdx(i)}
                onClick={() => applySlash(c)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors',
                  i === slashIdx ? 'bg-brand-50 text-brand-700' : 'text-ink-700'
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

      {/* Starter prompts, only before the first exchange */}
      {isEmpty && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SLASH_COMMANDS.slice(0, compact ? 3 : 6).map((s) => (
            <button
              key={s.cmd}
              onClick={() => send(s.template)}
              className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Attachment tray */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((a) => (
            <span
              key={a.id}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px]',
                a.kind === 'text' ? 'border-brand-100 bg-brand-50 text-brand-800' : 'border-amber-200 bg-amber-50 text-amber-800'
              )}
              title={a.kind === 'text' ? 'Text extracted — answer will be grounded in this file' : 'Binary file — metadata only'}
            >
              {a.kind === 'text' ? <FileText className="h-3 w-3" /> : <FileWarning className="h-3 w-3" />}
              <span className="max-w-[160px] truncate font-medium">{a.name}</span>
              <span className="opacity-70">{humanSize(a.size)}</span>
              <button onClick={() => removeAttachment(a.id)} className="opacity-60 transition hover:text-red-600 hover:opacity-100" aria-label={`Remove ${a.name}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {(attachError || dictation.error) && (
        <div className="mb-2 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-800">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span className="flex-1">{attachError ?? dictation.error}</span>
          <button
            onClick={() => { setAttachError(null); dictation.clearError() }}
            className="opacity-60 transition hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); submit() }}
        className={cn(
          'flex items-end gap-1.5 rounded-2xl border bg-white p-1.5 shadow-sm transition',
          focused ? 'border-brand-300 ring-2 ring-brand-500/15' : 'border-ink-200'
        )}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
        />

        <button
          type="button"
          title="Attach documents"
          aria-label="Attach documents"
          onClick={() => fileRef.current?.click()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-ink-500 transition hover:bg-ink-100 hover:text-ink-800"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          ref={taRef}
          rows={1}
          value={input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setInput(e.target.value)
            setSlashIdx(0)
            if (!e.target.value.startsWith('/')) setSlashDismissed(false)
            autosize()
          }}
          placeholder={input || focused ? 'Ask Maha Copilot — or type / for commands…' : ROTATING_PLACEHOLDERS[phIdx]}
          className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-relaxed text-ink-800 placeholder:text-ink-400 focus:outline-none"
          onKeyDown={(e) => {
            if (slashOpen && slashMatches.length > 0) {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIdx((i) => (i + 1) % slashMatches.length); return }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSlashIdx((i) => (i - 1 + slashMatches.length) % slashMatches.length); return }
              if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) { e.preventDefault(); applySlash(slashMatches[slashIdx]); return }
              if (e.key === 'Escape') { e.preventDefault(); setSlashDismissed(true); return }
            }
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
          }}
        />

        {dictation.supported && (
          <button
            type="button"
            title={dictation.listening ? 'Stop dictation' : `Dictate (${speechLocale(langLabel)})`}
            aria-label="Dictate"
            onClick={dictation.toggle}
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition',
              dictation.listening ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
            )}
          >
            {dictation.listening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
          </button>
        )}

        {phase === 'idle' ? (
          <button
            type="submit"
            disabled={!input.trim() && !attachments.length}
            title="Send (Enter)"
            className="grid h-9 shrink-0 place-items-center rounded-xl bg-brand-gradient px-3 text-white shadow-glow transition hover:opacity-95 disabled:opacity-40"
          >
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Send className="h-4 w-4" /> {!compact && 'Send'}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stop}
            title="Stop generating"
            className="grid h-9 shrink-0 place-items-center rounded-xl border border-red-200 bg-red-50 px-3 text-red-600 transition hover:bg-red-100"
          >
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Square className="h-3.5 w-3.5 fill-current" /> {!compact && 'Stop'}
            </span>
          </button>
        )}
      </form>

    </div>
  )
}
