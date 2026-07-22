import { useEffect, useMemo, useRef, useState } from 'react'
import { History, Plus, Trash2, Check, MessageSquarePlus, Pin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MODELS } from '@/data/models'
import { CopilotThread } from './CopilotThread'
import { CopilotComposer } from './CopilotComposer'
import { relativeTime } from './engine'
import { useCopilot } from './useCopilot'

export interface CopilotChatProps {
  compact?: boolean
  modelName?: string
  secClass?: string
  langLabel?: string
  onAudit?: (event: string) => void
  className?: string
  initialQuery?: string
}

/**
 * Self-contained copilot surface — session toolbar, thread and composer in one
 * column. Used by the floating dock; the full workspace composes the same
 * pieces around its own rails.
 */
export function CopilotChat({
  compact,
  modelName,
  secClass = 'Internal',
  langLabel = 'English',
  onAudit,
  className,
  initialQuery,
}: CopilotChatProps) {
  const model = useMemo(() => MODELS.find((m) => m.name === modelName) ?? MODELS[0], [modelName])
  const api = useCopilot({ model, secClass, langLabel, onAudit })
  const { sessions, sessionId, title, isEmpty, newChat, openSession, deleteSession, togglePin, send } = api

  const [historyOpen, setHistoryOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Auto-run a query handed off from the header search, exactly once.
  const seeded = useRef<string | null>(null)
  useEffect(() => {
    const q = initialQuery?.trim()
    if (q && seeded.current !== q) {
      seeded.current = q
      send(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  return (
    <div className={cn('relative flex min-h-0 flex-col', className)}>
      {/* Session toolbar */}
      <div className="flex items-center gap-1.5 border-b border-ink-100 bg-white/60 px-2.5 py-1.5 backdrop-blur">
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition',
            historyOpen ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100'
          )}
          title="Conversation history"
        >
          <History className="h-3.5 w-3.5" /> {!compact && 'History'}
          {sessions.length > 0 && (
            <span className="rounded-full bg-ink-100 px-1.5 text-[10px] font-semibold text-ink-500">{sessions.length}</span>
          )}
        </button>

        <div className="mx-1 h-4 w-px bg-ink-100" />

        <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink-700">
          {title || (isEmpty ? 'New conversation' : 'Current session')}
        </span>

        <button
          type="button"
          onClick={newChat}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-600 transition hover:bg-ink-100"
          title="New chat"
        >
          <Plus className="h-3.5 w-3.5" /> {!compact && 'New'}
        </button>
      </div>

      {/* History drawer */}
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
                      <div className={cn(
                        'group flex items-center gap-2 rounded-lg px-2 py-1.5 transition',
                        s.id === sessionId ? 'bg-brand-50' : 'hover:bg-white'
                      )}>
                        <button
                          onClick={() => { openSession(s); setHistoryOpen(false) }}
                          className="flex min-w-0 flex-1 flex-col text-left"
                        >
                          <span className="flex items-center gap-1 truncate text-xs font-medium text-ink-800">
                            {s.pinned && <Pin className="h-2.5 w-2.5 shrink-0 fill-brand-500 text-brand-500" />}
                            <span className="truncate">{s.title}</span>
                          </span>
                          <span className="text-[10px] text-ink-400">
                            {relativeTime(s.updatedAt)} · {s.messages.filter((m) => m.id !== 'welcome').length} messages
                          </span>
                        </button>
                        <button
                          onClick={() => togglePin(s.id)}
                          className="grid h-6 w-6 shrink-0 place-items-center rounded text-ink-300 transition hover:bg-ink-100 hover:text-brand-600"
                          title={s.pinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin className={cn('h-3.5 w-3.5', s.pinned && 'fill-brand-500 text-brand-500')} />
                        </button>
                        <button
                          onClick={() => (confirmDelete === s.id ? deleteSession(s.id) : setConfirmDelete(s.id))}
                          onMouseLeave={() => setConfirmDelete((c) => (c === s.id ? null : c))}
                          className={cn(
                            'grid h-6 w-6 shrink-0 place-items-center rounded transition',
                            confirmDelete === s.id ? 'bg-red-100 text-red-600' : 'text-ink-300 hover:bg-ink-100 hover:text-red-500'
                          )}
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

      <CopilotThread api={api} compact={compact} modelName={model.name} />
      <CopilotComposer api={api} compact={compact} langLabel={langLabel} />
    </div>
  )
}
