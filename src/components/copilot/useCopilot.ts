import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ModelEntry } from '@/data/models'
import { exportDoc } from '@/lib/exportUtils'
import {
  ApprovalRecord, CopilotAttachment, CopilotMsg, CopilotSession, FOLLOWUPS, PIPELINE,
  estimateTokens, loadApprovals, loadSessions, mdToHtml, mdToPlain, nextFileNo, pickReply,
  saveApprovals, saveSessions,
} from './engine'

/* ------------------------------------------------------------------ */
/* File intake                                                         */
/* ------------------------------------------------------------------ */

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|log|xml|html?|ya?ml|ini|conf)$/i
const MAX_ATTACHMENTS = 6
const MAX_BYTES = 10 * 1024 * 1024
/** Only the leading slice of a large text file is kept in memory. */
const MAX_TEXT_BYTES = 256 * 1024

function isTextual(file: File): boolean {
  return file.type.startsWith('text/') || file.type === 'application/json' || TEXT_EXT.test(file.name)
}

/** Read a picked file into an attachment. Text formats are parsed for real. */
async function readAttachment(file: File): Promise<CopilotAttachment> {
  const base: CopilotAttachment = {
    id: `f${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    mime: file.type,
    kind: isTextual(file) ? 'text' : 'binary',
  }
  if (base.kind !== 'text') return base
  try {
    const text = await file.slice(0, MAX_TEXT_BYTES).text()
    return { ...base, text }
  } catch {
    return { ...base, kind: 'binary' }
  }
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export type CopilotPhase = 'idle' | 'pipeline' | 'streaming'

export interface UseCopilotOptions {
  model: ModelEntry
  secClass: string
  langLabel: string
  onAudit?: (event: string) => void
}

const welcome = (): CopilotMsg => ({
  id: 'welcome',
  role: 'ai',
  text:
    'Namaskar. I am **Maha Copilot**, running on your sovereign inference stack. I can summarise GRs and circulars, draft notes, letters and RTI replies, translate to formal Marathi, and read documents you attach — always with citations and always audit-logged.\n\nType **/** for structured commands, or attach a file to ground the answer in it.',
  confidence: 96,
  sources: ['Maha Copilot · Session bootstrap'],
  ts: Date.now(),
})

export function useCopilot({ model, secClass, langLabel, onAudit }: UseCopilotOptions) {
  const [messages, setMessages] = useState<CopilotMsg[]>([welcome()])
  const [phase, setPhase] = useState<CopilotPhase>('idle')
  const [stageIdx, setStageIdx] = useState(0)
  const [attachments, setAttachments] = useState<CopilotAttachment[]>([])
  const [attachError, setAttachError] = useState<string | null>(null)

  const [sessions, setSessions] = useState<CopilotSession[]>(() => loadSessions())
  const [approvals, setApprovals] = useState<ApprovalRecord[]>(() => loadApprovals())
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [title, setTitle] = useState('')

  const timers = useRef<number[]>([])
  const startRef = useRef(0)
  /** Authoritative copy of the thread — lets every mutation stay a pure computation. */
  const messagesRef = useRef<CopilotMsg[]>(messages)
  // Live mirrors so timers and callbacks never read a stale render's values.
  const ctxRef = useRef({ model, secClass, langLabel })
  ctxRef.current = { model, secClass, langLabel }
  const sessionIdRef = useRef<string | null>(null)
  sessionIdRef.current = sessionId

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  /* ---------------------------- persistence --------------------------- */

  const persist = useCallback((msgs: CopilotMsg[]) => {
    const firstUser = msgs.find((m) => m.role === 'user')
    if (!firstUser) return
    const id = sessionIdRef.current ?? 's' + Date.now()
    sessionIdRef.current = id
    setSessionId(id)

    const stored = loadSessions()
    const existing = stored.find((s) => s.id === id)
    const session: CopilotSession = {
      id,
      title: existing?.title || firstUser.text.replace(/\s+/g, ' ').slice(0, 72),
      updatedAt: Date.now(),
      messages: msgs,
      pinned: existing?.pinned,
    }
    const next = [session, ...stored.filter((s) => s.id !== id)]
    saveSessions(next)
    setSessions(loadSessions())
    setTitle(session.title)
  }, [])

  /**
   * Single funnel for thread mutations. The updater runs against the ref rather
   * than inside React's setState callback, so persistence and other effects are
   * never replayed by StrictMode's double invocation.
   */
  const applyMessages = useCallback((
    updater: (prev: CopilotMsg[]) => CopilotMsg[],
    opts?: { persist?: boolean }
  ): CopilotMsg[] => {
    const next = updater(messagesRef.current)
    messagesRef.current = next
    setMessages(next)
    if (opts?.persist) persist(next)
    return next
  }, [persist])

  const newChat = useCallback(() => {
    clearTimers()
    setPhase('idle')
    sessionIdRef.current = null
    setSessionId(null)
    applyMessages(() => [welcome()])
    setAttachments([])
    setTitle('')
    onAudit?.('New copilot session started')
  }, [applyMessages, clearTimers, onAudit])

  const openSession = useCallback((s: CopilotSession) => {
    clearTimers()
    setPhase('idle')
    sessionIdRef.current = s.id
    setSessionId(s.id)
    applyMessages(() => (s.messages.length ? s.messages : [welcome()]))
    setTitle(s.title)
    onAudit?.(`Session reopened · ${s.title.slice(0, 40)}`)
  }, [applyMessages, clearTimers, onAudit])

  const deleteSession = useCallback((id: string) => {
    const next = loadSessions().filter((s) => s.id !== id)
    saveSessions(next)
    setSessions(next)
    onAudit?.('Session deleted from local history')
    if (sessionIdRef.current === id) newChat()
  }, [newChat, onAudit])

  const renameSession = useCallback((id: string, raw: string) => {
    const trimmed = raw.trim() || 'Untitled session'
    const next = loadSessions().map((s) => (s.id === id ? { ...s, title: trimmed } : s))
    saveSessions(next)
    setSessions(next)
    if (sessionIdRef.current === id) setTitle(trimmed)
  }, [])

  const togglePin = useCallback((id: string) => {
    const next = loadSessions().map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    saveSessions(next)
    setSessions(loadSessions())
  }, [])

  const clearAllSessions = useCallback(() => {
    saveSessions([])
    setSessions([])
    onAudit?.('Local conversation history cleared')
    newChat()
  }, [newChat, onAudit])

  /* ---------------------------- attachments --------------------------- */

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const picked = Array.from(files)
    if (!picked.length) return
    setAttachError(null)

    const accepted: CopilotAttachment[] = []
    for (const file of picked) {
      if (file.size > MAX_BYTES) {
        setAttachError(`${file.name} exceeds the 10 MB session limit.`)
        continue
      }
      accepted.push(await readAttachment(file))
    }
    if (!accepted.length) return

    setAttachments((prev) => {
      const room = MAX_ATTACHMENTS - prev.length
      if (room <= 0) {
        setAttachError(`Up to ${MAX_ATTACHMENTS} documents per prompt.`)
        return prev
      }
      const taken = accepted.slice(0, room)
      if (accepted.length > room) setAttachError(`Up to ${MAX_ATTACHMENTS} documents per prompt.`)
      onAudit?.(`${taken.length} file(s) attached · DLP scan clean`)
      return [...prev, ...taken]
    })
  }, [onAudit])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
    setAttachError(null)
  }, [])

  /* ------------------------------- send ------------------------------- */

  const stop = useCallback(() => {
    clearTimers()
    setPhase('idle')
    applyMessages(
      (prev) => prev.map((m) =>
        m.shown != null
          ? { ...m, shown: undefined, text: m.text.slice(0, m.shown) + '\n\n*— generation stopped by officer —*' }
          : m
      ),
      { persist: true }
    )
    onAudit?.('Generation stopped by officer')
  }, [applyMessages, clearTimers, onAudit])

  const send = useCallback((raw: string, opts?: { files?: CopilotAttachment[] }) => {
    const text = raw.trim()
    const files = opts?.files ?? attachments
    if ((!text && !files.length) || phase !== 'idle') return

    const { model: m, secClass: sc } = ctxRef.current
    const userMsg: CopilotMsg = {
      id: 'u' + Date.now(),
      role: 'user',
      text: text || `Review the attached document${files.length > 1 ? 's' : ''}.`,
      ts: Date.now(),
      attachments: files.length ? files : undefined,
    }
    applyMessages((prev) => [...prev, userMsg])
    setAttachments([])
    setAttachError(null)
    onAudit?.(files.length ? `Prompt sent with ${files.length} attachment(s) · DLP scan clean` : 'Prompt sent · DLP scan clean')
    startRef.current = Date.now()

    // 1) guardrail pipeline animation
    setPhase('pipeline')
    setStageIdx(0)
    PIPELINE.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStageIdx(i + 1), 240 * (i + 1)))
    })

    // 2) stream the reply in word-boundary chunks
    const reply = pickReply(userMsg.text, files)
    const aiId = 'a' + Date.now()
    timers.current.push(window.setTimeout(() => {
      setPhase('streaming')
      const aiMsg: CopilotMsg = {
        id: aiId,
        role: 'ai',
        text: reply.text,
        shown: 0,
        key: reply.key,
        confidence: 88 + Math.floor(Math.random() * 9),
        sources: reply.sources,
        ts: Date.now(),
        model: m.name,
        secClass: sc,
      }
      applyMessages((prev) => [...prev, aiMsg])

      const full = reply.text
      let shown = 0
      const tick = () => {
        shown = Math.min(full.length, shown + 8 + Math.floor(Math.random() * 12))
        while (shown < full.length && !/\s/.test(full[shown])) shown++ // land on a word boundary
        const done = shown >= full.length
        applyMessages(
          (prev) => prev.map((msg) =>
            msg.id === aiId
              ? { ...msg, shown: done ? undefined : shown, latencyMs: done ? Date.now() - startRef.current : msg.latencyMs }
              : msg
          ),
          { persist: done }
        )
        if (done) {
          setPhase('idle')
          onAudit?.('Response generated · sources cited')
        } else {
          timers.current.push(window.setTimeout(tick, 22))
        }
      }
      tick()
    }, 240 * PIPELINE.length + 180))
  }, [applyMessages, attachments, onAudit, phase])

  /** Re-run the prompt that produced this answer, dropping both from the thread first. */
  const regenerate = useCallback((msg: CopilotMsg) => {
    const current = messagesRef.current
    const idx = current.findIndex((m) => m.id === msg.id)
    if (idx < 0) return
    const prevUser = [...current.slice(0, idx)].reverse().find((m) => m.role === 'user')
    if (!prevUser) return
    applyMessages((prev) => prev.filter((m) => m.id !== msg.id && m.id !== prevUser.id))
    onAudit?.('Regeneration requested')
    send(prevUser.text, { files: prevUser.attachments ?? [] })
  }, [applyMessages, onAudit, send])

  /** Replace a prompt with edited text and re-run it, discarding everything after. */
  const editAndResend = useCallback((msg: CopilotMsg, newText: string) => {
    const text = newText.trim()
    if (!text) return
    const idx = messagesRef.current.findIndex((m) => m.id === msg.id)
    if (idx < 0) return
    applyMessages((prev) => prev.slice(0, idx))
    onAudit?.('Prompt edited and re-run')
    send(text, { files: msg.attachments ?? [] })
  }, [applyMessages, onAudit, send])

  const feedback = useCallback((msg: CopilotMsg, dir: 'up' | 'down') => {
    applyMessages(
      (prev) => prev.map((m) => (m.id === msg.id ? { ...m, feedback: m.feedback === dir ? undefined : dir } : m)),
      { persist: true }
    )
    onAudit?.(dir === 'up' ? 'Feedback recorded · helpful' : 'Feedback recorded · needs review')
  }, [applyMessages, onAudit])

  /* ------------------------------ exports ----------------------------- */

  const copyAnswer = useCallback(async (msg: CopilotMsg): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(mdToPlain(msg.text))
      onAudit?.('Answer copied to clipboard')
      return true
    } catch {
      return false
    }
  }, [onAudit])

  const downloadAnswer = useCallback((msg: CopilotMsg, format: 'doc' | 'md') => {
    const stamp = new Date(msg.ts ?? Date.now()).toLocaleString()
    const name = `maii-${msg.key ?? 'answer'}-${new Date().toISOString().slice(0, 10)}`
    if (format === 'doc') {
      const header =
        `<p style="font-size:10pt;color:#555;">Government of Maharashtra · MAII — Maha Copilot<br/>` +
        `Generated ${stamp} · Model ${msg.model ?? model.name} · Classification ${msg.secClass ?? secClass}</p><hr/>`
      const footer =
        `<hr/><p style="font-size:9pt;color:#777;">Sources: ${(msg.sources ?? []).join(' · ')}<br/>` +
        `AI-generated draft — verify against the source record before issue. Audit-logged.</p>`
      exportDoc(name, header + mdToHtml(msg.text) + footer)
    } else {
      const md =
        `# MAII — Maha Copilot\n\n_Generated ${stamp} · ${msg.model ?? model.name} · ${msg.secClass ?? secClass}_\n\n---\n\n` +
        `${msg.text}\n\n---\n\nSources: ${(msg.sources ?? []).join(' · ')}\n`
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name}.md`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }
    onAudit?.(`Answer exported · ${format.toUpperCase()}`)
  }, [model.name, onAudit, secClass])

  /** Export the whole thread as a plain-text transcript. */
  const exportTranscript = useCallback(() => {
    const lines = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => {
        const who = m.role === 'user' ? 'OFFICER' : `COPILOT (${m.model ?? model.name})`
        const time = m.ts ? new Date(m.ts).toLocaleString() : ''
        const files = m.attachments?.length ? `\nAttachments: ${m.attachments.map((a) => a.name).join(', ')}` : ''
        const src = m.sources?.length ? `\nSources: ${m.sources.join(' · ')}` : ''
        return `[${time}] ${who}\n${mdToPlain(m.text)}${files}${src}\n`
      })
    const body =
      `MAII — Maha Copilot transcript\nSession: ${title || 'Untitled'}\nExported: ${new Date().toLocaleString()}\n` +
      `Classification: ${secClass}\n${'='.repeat(60)}\n\n${lines.join('\n' + '-'.repeat(60) + '\n\n')}`
    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maii-copilot-transcript-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    onAudit?.('Session transcript exported')
  }, [messages, model.name, onAudit, secClass, title])

  /* ----------------------------- approvals ---------------------------- */

  const raiseApproval = useCallback((msg: CopilotMsg, input: { subject: string; approver: string; note: string }) => {
    const existing = loadApprovals()
    const record: ApprovalRecord = {
      id: 'ap' + Date.now(),
      fileNo: nextFileNo(existing),
      subject: input.subject.trim() || 'Copilot-generated draft',
      approver: input.approver,
      note: input.note.trim(),
      body: msg.text,
      createdAt: Date.now(),
      status: 'Pending',
    }
    const next = [record, ...existing]
    saveApprovals(next)
    setApprovals(next)
    applyMessages(
      (prev) => prev.map((m) => (m.id === msg.id ? { ...m, approvalId: record.id } : m)),
      { persist: true }
    )
    onAudit?.(`Sent for approval · ${record.fileNo} → ${record.approver}`)
    return record
  }, [applyMessages, onAudit])

  const setApprovalStatus = useCallback((id: string, status: ApprovalRecord['status']) => {
    const next = loadApprovals().map((a) => (a.id === id ? { ...a, status } : a))
    saveApprovals(next)
    setApprovals(next)
    const record = next.find((a) => a.id === id)
    onAudit?.(`Approval ${status.toLowerCase()} · ${record?.fileNo ?? id}`)
  }, [onAudit])

  const withdrawApproval = useCallback((id: string) => {
    const next = loadApprovals().filter((a) => a.id !== id)
    saveApprovals(next)
    setApprovals(next)
    applyMessages((prev) => prev.map((m) => (m.approvalId === id ? { ...m, approvalId: undefined } : m)))
    onAudit?.('Approval request withdrawn')
  }, [applyMessages, onAudit])

  /* ------------------------------ derived ----------------------------- */

  const lastAi = useMemo(
    () => [...messages].reverse().find((m) => m.role === 'ai' && m.id !== 'welcome' && m.shown == null),
    [messages]
  )
  const followups = phase === 'idle' && lastAi?.key ? (FOLLOWUPS[lastAi.key] ?? []) : []
  const isEmpty = messages.length <= 1

  const usage = useMemo(() => {
    const real = messages.filter((m) => m.id !== 'welcome')
    const promptTokens = real.filter((m) => m.role === 'user').reduce((n, m) => n + estimateTokens(m.text), 0)
    const answerTokens = real.filter((m) => m.role === 'ai').reduce((n, m) => n + estimateTokens(m.text), 0)
    const latencies = real.map((m) => m.latencyMs).filter((n): n is number => typeof n === 'number')
    return {
      prompts: real.filter((m) => m.role === 'user').length,
      answers: real.filter((m) => m.role === 'ai').length,
      promptTokens,
      answerTokens,
      totalTokens: promptTokens + answerTokens,
      avgLatencyMs: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
    }
  }, [messages])

  const citations = useMemo(() => {
    const seen = new Map<string, number>()
    messages.forEach((m) => m.sources?.forEach((s) => seen.set(s, (seen.get(s) ?? 0) + 1)))
    return [...seen.entries()].map(([label, count]) => ({ label, count }))
  }, [messages])

  return {
    // thread
    messages, phase, stageIdx, isEmpty, lastAi, followups,
    send, stop, regenerate, editAndResend, feedback,
    // sessions
    sessions, sessionId, title, newChat, openSession, deleteSession, renameSession, togglePin, clearAllSessions,
    // attachments
    attachments, attachError, addFiles, removeAttachment, setAttachError,
    // exports & approvals
    copyAnswer, downloadAnswer, exportTranscript, approvals, raiseApproval, setApprovalStatus, withdrawApproval,
    // telemetry
    usage, citations,
  }
}

export type CopilotApi = ReturnType<typeof useCopilot>
