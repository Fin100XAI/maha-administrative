import { ReactNode, useMemo, useRef, useState } from 'react'
import {
  Send, Paperclip, Mic, Sparkles, FileText, ChevronDown, ChevronRight, ShieldCheck,
  Download, ClipboardCheck, Save, User, Bot, Copy, RefreshCw, Trash2, Info,
  Fingerprint, Boxes, Radio,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { ClassificationBadge, ConfidenceBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { DEPARTMENTS, LANGUAGES, SECURITY_CLASSES } from '@/data/departments'
import { MODELS } from '@/data/models'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'ai'; text: string; confidence?: number; sources?: string[]; language?: string }

const CLASSIFICATION_ACTIVE_CLASS: Record<string, string> = {
  Public: 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(16,185,129,0.10)]',
  Internal: 'border-sky-400 bg-sky-50 text-sky-700 shadow-[0_0_0_3px_rgba(14,165,233,0.10)]',
  Confidential: 'border-amber-400 bg-amber-50 text-amber-700 shadow-[0_0_0_3px_rgba(245,158,11,0.10)]',
  Secret: 'border-rose-400 bg-rose-50 text-rose-700 shadow-[0_0_0_3px_rgba(244,63,94,0.10)]',
}

const PROMPT_SUGGESTIONS = [
  'Summarize this GR in Marathi',
  'Draft a note for approval',
  'Compare two circulars',
  'Create RTI reply draft',
  'Extract action points from this file',
  'Translate this letter to formal Marathi',
  'Prepare cabinet note summary',
  'Identify compliance risk in this document',
]

const DEMO_RESPONSES: Record<string, string> = {
  gr: `**GR Summary — GR-2026-URD-118**\n\n- **Subject:** PMAY-U 2.0 Beneficiary Verification Guidelines\n- **Effective from:** 04-Jul-2026\n- **Owner:** Urban Development Department\n\n**Key clauses**\n1. Aadhaar-based e-KYC becomes mandatory for beneficiary listing.\n2. Income proof cross-verified against MahaDBT records within 15 days.\n3. Grievance redressal committee to be notified by District Collector within 7 days of publication.\n\n**Financial implication:** Neutral within FY 2026-27 outlay (₹2,140 Cr already provisioned under Urban Housing head).\n\n**Compliance checklist**\n- [ ] District nodal officer nominated\n- [ ] MahaDBT API access confirmed\n- [ ] SOP circulated to ULB commissioners\n\n**Risk flag:** Medium — pending clarity on rural-migrant applicants.\n\n*Sources: gr.maharashtra.gov.in (public), MahaDBT reference tables (department API pending).*`,
  note: `**Note for Approval — File No. DIT/AI/2026/44**\n\n**Subject:** Adoption of Sarvam-M for Marathi drafting across GAD desks.\n\n**Background:** Marathi drafting via general-purpose LLMs shows persistent formal-register drift. Sarvam-M evaluation (three-district pilot, May-Jun 2026) shows 22% error reduction and 34% time saving.\n\n**Financial implication:** ₹0 additional CapEx; hosted on existing GPU cluster (Mumbai DC). Estimated OpEx ₹18 L / year for maintenance.\n\n**Legal implication:** No fresh MoU required — covered under DIT Master AI SLA (2025).\n\n**Recommendation:** Approve production roll-out to GAD, Home, Revenue, UDD.\n\n**Approval hierarchy:** Section Officer → Under Secretary → Deputy Secretary → Principal Secretary (DIT).`,
  translate: `**अनुवाद (Marathi — औपचारिक शैली):**\n\nमहोदय,\nप्रधानमंत्री आवास योजना (शहरी) २.० अंतर्गत लाभार्थ्यांच्या पडताळणीसाठी नवीन कार्यपद्धती दिनांक ०४ जुलै २०२६ पासून अंमलात येत आहे. संबंधित जिल्हाधिकाऱ्यांनी ०७ दिवसांच्या आत तक्रार निवारण समितीची स्थापना करावी.\n\nधन्यवाद,\n(हस्ताक्षर)`,
  default: `I've analysed the request under Zero Trust guardrails. This response is generated using **BharatGPT (Sovereign Council)** deployed on-prem. Sources cited below are drawn from the linked public repositories and your department's authorised knowledge base.\n\n- Confidence: **91%**\n- Data classification respected: **Internal**\n- Human review: **required if the recommendation touches disbursements over ₹5 Cr**\n\nWould you like this exported as DOCX or sent to Human Approval?`,
}

export function AIWorkspace() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'm1',
      role: 'ai',
      text: 'Namaskar. I am MAII AI running on your sovereign inference stack. Ask me anything — I can summarise GRs, draft notes, translate to formal Marathi, and pull citations from your department knowledge base.',
      confidence: 96,
      sources: ['MAII AI · Session bootstrap'],
      language: 'English',
    },
  ])
  const [input, setInput] = useState('')
  const [dept, setDept] = useState('DIT')
  const [lang, setLang] = useState<typeof LANGUAGES[number]>('English')
  const [modelId, setModelId] = useState(MODELS[0].id)
  const [secClass, setSecClass] = useState<typeof SECURITY_CLASSES[number]>('Internal')
  const [humanReview, setHumanReview] = useState(true)
  const [attachments, setAttachments] = useState<string[]>(['PMAY-U-2.0-Guidelines-2026-07-04.pdf'])
  const fileInput = useRef<HTMLInputElement>(null)
  const model = useMemo(() => MODELS.find((m) => m.id === modelId)!, [modelId])

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text) return
    const userMsg: Msg = { id: 'u' + Date.now(), role: 'user', text }
    let reply = DEMO_RESPONSES.default
    if (/gr|resolution/i.test(text)) reply = DEMO_RESPONSES.gr
    else if (/note/i.test(text)) reply = DEMO_RESPONSES.note
    else if (/translate|marathi|hindi/i.test(text)) reply = DEMO_RESPONSES.translate
    const aiMsg: Msg = {
      id: 'a' + Date.now(),
      role: 'ai',
      text: reply,
      confidence: 88 + Math.floor(Math.random() * 8),
      sources: ['gr.maharashtra.gov.in (public)', 'MahaDBT reference tables (API pending)', 'Department KB · DIT'],
      language: lang,
    }
    setMessages((prev) => [...prev, userMsg, aiMsg])
    setInput('')
  }

  return (
    <div>
      <PageHeader
        title="AI Workspace"
        description="A ChatGPT-class workspace under sovereign AI guardrails. Every prompt is classified, logged, and routed through the appropriate model per policy."
        breadcrumb={['Administrative AI', 'AI Workspace']}
        source="Demo"
        eyebrow="Sovereign · Zero Trust · On-prem routed"
        icon={<Sparkles className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Left rail — governance controls */}
        <div className="space-y-3">
          <Rail title="Session context" icon={<Fingerprint className="h-3.5 w-3.5" />}>
            <Field label="Department">
              <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d.code} value={d.code}>{d.code} · {d.name}</option>)}
              </select>
            </Field>
            <Field label="Language">
              <select className="input" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Classification">
              <div className="grid grid-cols-2 gap-2">
                {SECURITY_CLASSES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSecClass(c)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition',
                      secClass === c
                        ? CLASSIFICATION_ACTIVE_CLASS[c]
                        : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="mt-2"><ClassificationBadge level={secClass} /></div>
            </Field>
          </Rail>

          <Rail title="Model routing" icon={<Boxes className="h-3.5 w-3.5" />}>
            <Field label="Model">
              <select className="input" value={modelId} onChange={(e) => setModelId(e.target.value)}>
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name} · {m.hosting}</option>)}
              </select>
            </Field>
            <div className="rounded-lg border border-ink-100 bg-ink-50/60 p-3 text-xs text-ink-700">
              <div className="flex items-center justify-between"><span>Hosting</span><span className="font-medium">{model.hosting}</span></div>
              <div className="flex items-center justify-between"><span>Latency</span><span className="font-medium">{model.latencyMs}ms</span></div>
              <div className="flex items-center justify-between"><span>Security</span><span className="font-medium">{model.securityRating}</span></div>
              <div className="flex items-center justify-between"><span>Language</span><span className="font-medium">{model.languageStrength}</span></div>
            </div>
            <label className="flex items-center justify-between rounded-lg border border-ink-100 p-3 text-sm">
              <span className="flex items-center gap-2 text-ink-700"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Human review required</span>
              <input type="checkbox" checked={humanReview} onChange={(e) => setHumanReview(e.target.checked)} className="h-4 w-4 accent-brand-500" />
            </label>
          </Rail>

          <Rail title="Attachments" icon={<Paperclip className="h-3.5 w-3.5" />}>
            <input ref={fileInput} type="file" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setAttachments((a) => [...a, f.name])
            }} />
            <button className="btn-outline w-full" onClick={() => fileInput.current?.click()}>
              <Paperclip className="h-4 w-4" /> Upload document
            </button>
            <ul className="space-y-1.5 text-xs">
              {attachments.map((a) => (
                <li key={a} className="flex items-center justify-between rounded-lg border border-ink-100 bg-white px-2.5 py-1.5">
                  <span className="flex items-center gap-2 truncate text-ink-700"><FileText className="h-3.5 w-3.5" /> <span className="truncate">{a}</span></span>
                  <button onClick={() => setAttachments((x) => x.filter((n) => n !== a))} className="text-ink-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </li>
              ))}
              {attachments.length === 0 && <li className="text-ink-500">No attachments</li>}
            </ul>
          </Rail>
        </div>

        {/* Center — chat */}
        <div className="card relative flex min-h-[70vh] flex-col p-0">
          {/* Floating "MAII AI ready" badge */}
          <div className="pointer-events-none absolute right-3 top-3 z-10 hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-700 shadow-soft backdrop-blur md:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            MAII AI ready
          </div>

          <div className="relative flex items-center justify-between overflow-hidden rounded-t-2xl border-b border-ink-100 bg-gradient-to-r from-white via-white to-brand-50/60 p-4">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/60 to-transparent" />
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-900">MAII Workspace</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-emerald-700">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-brand-100 bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                    <Radio className="h-2.5 w-2.5" /> {model.name}
                  </span>
                  <span className="text-[10px] text-ink-500">· {model.hosting}</span>
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <ClassificationBadge level={secClass} />
              {humanReview && <StatusBadge status="Under Review" />}
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {m.role === 'ai' && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-glow"><Bot className="h-4 w-4" /></div>
                  )}
                  <div
                    className={cn(
                      'relative max-w-[720px] overflow-hidden rounded-2xl px-4 py-3 text-sm shadow-sm',
                      m.role === 'user'
                        ? 'bg-brand-gradient text-white shadow-glow ring-1 ring-brand-300/40'
                        : 'bg-gradient-to-br from-white to-brand-50/40 ring-1 ring-ink-100'
                    )}
                  >
                    {m.role === 'user' && (
                      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                    )}
                    <div className={cn('relative whitespace-pre-wrap leading-relaxed', m.role === 'ai' ? 'text-ink-800' : 'text-white')}>
                      {m.text}
                    </div>
                    {m.role === 'ai' && (
                      <div className="relative mt-3 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
                        {typeof m.confidence === 'number' && <ConfidenceBadge score={m.confidence} />}
                        <SourceBadge source="Demo" />
                        <ClassificationBadge level={secClass} />
                        <div className="ml-auto flex items-center gap-1">
                          <IconBtn icon={<Copy className="h-3.5 w-3.5" />} label="Copy" />
                          <IconBtn icon={<Download className="h-3.5 w-3.5" />} label="DOCX" />
                          <IconBtn icon={<Save className="h-3.5 w-3.5" />} label="Save to file" />
                          <IconBtn icon={<ClipboardCheck className="h-3.5 w-3.5" />} label="Send for approval" />
                        </div>
                      </div>
                    )}
                    {m.role === 'ai' && (
                      <span
                        className="pointer-events-none absolute inset-x-3 bottom-0 h-px animate-shimmer bg-gradient-to-r from-transparent via-brand-400/60 to-transparent"
                        style={{ backgroundSize: '1000px 100%' }}
                      />
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-600"><User className="h-4 w-4" /></div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-ink-100 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {PROMPT_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] text-ink-600 hover:bg-ink-50">
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask MAII AI in ${lang}…`}
                  className="input resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                  }}
                />
              </div>
              <button type="button" className="btn-outline" onClick={() => fileInput.current?.click()}><Paperclip className="h-4 w-4" /></button>
              <button type="button" className="btn-outline"><Mic className="h-4 w-4" /></button>
              <button type="submit" className="btn-primary"><Send className="h-4 w-4" /> Send</button>
            </form>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-500">
              <Info className="h-3 w-3" /> Prompts are logged and DLP-scanned. Confidential/Secret prompts route only to on-prem models.
            </div>
          </div>
        </div>

        {/* Right rail — sources, audit */}
        <div className="space-y-3">
          <Rail title="Source citations">
            <ul className="space-y-2 text-xs">
              {['gr.maharashtra.gov.in — GR 118/2026', 'mahadbt.maharashtra.gov.in — beneficiary tables', 'MAII KB — DIT/SOP/012'].map((s, i) => {
                const [domain, detail] = s.split(' — ')
                const letter = domain.replace(/^https?:\/\//, '').charAt(0).toUpperCase()
                return (
                  <li key={i} className="flex items-start gap-2 rounded-lg border border-ink-100 bg-white p-2.5 transition hover:border-brand-200 hover:shadow-soft">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                      {letter}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-ink-800">{domain}</div>
                      <div className="truncate text-ink-500">{detail}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Rail>

          <Rail title="Audit trail (this session)">
            <ol className="relative space-y-3 border-l border-brand-100 pl-4 text-xs">
              <span className="pointer-events-none absolute -left-[1px] top-0 h-full w-px animate-pulse-slow bg-gradient-to-b from-transparent via-brand-300/70 to-transparent" />
              {[
                { t: '09:12', e: 'Session opened · MFA verified' },
                { t: '09:12', e: 'Model selected · BharatGPT · On-prem' },
                { t: '09:13', e: 'Classification set · Internal' },
                { t: '09:14', e: 'File uploaded · PMAY-U 2.0 guidelines' },
                { t: '09:14', e: 'DLP scan · no PII detected' },
                { t: '09:15', e: 'Prompt sent · summarise GR' },
                { t: '09:15', e: 'Response cited public source' },
              ].map((s, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[22px] top-1 grid h-3 w-3 place-items-center rounded-full bg-brand-gradient shadow-[0_0_0_2px_#fff,0_0_0_3px_rgba(11,87,208,0.25)]">
                    <span className="h-1 w-1 rounded-full bg-white/90 animate-pulse-slow" />
                  </span>
                  <div className="text-ink-500">{s.t}</div>
                  <div className="text-ink-800">{s.e}</div>
                </li>
              ))}
            </ol>
          </Rail>

          <Rail title="Actions">
            <button className="btn-outline w-full"><Download className="h-4 w-4" /> Export session</button>
            <button className="btn-outline w-full"><ClipboardCheck className="h-4 w-4" /> Send for approval</button>
            <button className="btn-outline w-full"><RefreshCw className="h-4 w-4" /> New session</button>
          </Rail>
        </div>
      </div>
    </div>
  )
}

function Rail({ title, icon, children }: { title: string; icon?: ReactNode; children: any }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="card p-4">
      <button onClick={() => setOpen(!open)} className="mb-2 flex w-full items-center justify-between text-left">
        <span className="flex items-center gap-2">
          {icon && (
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-soft text-brand-600 ring-1 ring-brand-100">
              {icon}
            </span>
          )}
          <span className="section-title text-ink-800">{title}</span>
        </span>
        {open ? <ChevronDown className="h-4 w-4 text-ink-400" /> : <ChevronRight className="h-4 w-4 text-ink-400" />}
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function IconBtn({ icon, label }: { icon: any; label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-ink-500 hover:bg-ink-100">
      {icon}{label}
    </button>
  )
}
