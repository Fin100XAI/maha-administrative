import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bot, ShieldCheck, X, ClipboardList, FileText, Radio,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { ClassificationBadge } from '@/components/ui/Badges'
import { LANGUAGES, SECURITY_CLASSES } from '@/data/departments'
import { MODELS } from '@/data/models'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { cn } from '@/lib/utils'

type AuditEntry = { t: string; e: string }

const BOOT_AUDIT: AuditEntry[] = [
  { t: '09:12', e: 'Session opened · MFA verified' },
  { t: '09:13', e: 'Classification set · Internal' },
  { t: '09:14', e: 'DLP scan · no PII detected' },
]

const CITATIONS = [
  'gr.maharashtra.gov.in — GR 118/2026',
  'mahadbt.maharashtra.gov.in — beneficiary tables',
  'MAII KB — DIT/SOP/012',
]

export function AIWorkspace() {
  const [lang, setLang] = useState<typeof LANGUAGES[number]>('English')
  const [modelId, setModelId] = useState(MODELS[0].id)
  const [secClass, setSecClass] = useState<typeof SECURITY_CLASSES[number]>('Internal')
  const [details, setDetails] = useState(false)
  const [audit, setAudit] = useState<AuditEntry[]>(BOOT_AUDIT)
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? undefined
  const model = useMemo(() => MODELS.find((m) => m.id === modelId)!, [modelId])

  const logAudit = (e: string) => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setAudit((prev) => [...prev.slice(-11), { t, e }])
  }

  return (
    <div>
      <PageHeader
        compact
        title="Maha Copilot"
        description="Ask, draft, translate — under sovereign AI guardrails. Every prompt is classified, logged and routed per policy."
        breadcrumb={['Administrative AI', 'AI Workspace']}
        source="Demo"
        icon={<Bot className="h-5 w-5" />}
      />

      <div className="mx-auto max-w-4xl">
        {/* Slim context bar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            className="input !w-auto !py-1.5 !text-xs"
            value={modelId}
            onChange={(e) => { setModelId(e.target.value); logAudit('Model rerouted per policy') }}
          >
            {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name} · {m.hosting}</option>)}
          </select>
          <select
            className="input !w-auto !py-1.5 !text-xs"
            value={secClass}
            onChange={(e) => { setSecClass(e.target.value as any); logAudit('Classification set · ' + e.target.value) }}
          >
            {SECURITY_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            className="input !w-auto !py-1.5 !text-xs"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 sm:inline-flex">
            <ShieldCheck className="h-3 w-3" /> Audit-logged
          </span>
          <button
            onClick={() => setDetails(true)}
            className="btn-ghost ml-auto !px-2.5 !py-1.5 !text-xs"
          >
            <ClipboardList className="h-3.5 w-3.5" /> Audit trail (this session)
          </button>
        </div>

        {/* The copilot — one clean surface */}
        <div className="card flex min-h-[74vh] flex-col p-0">
          <CopilotChat
            className="min-h-0 flex-1"
            modelName={model.name}
            secClass={secClass}
            langLabel={lang}
            onAudit={logAudit}
            initialQuery={initialQuery}
          />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-ink-400">
          <span className="inline-flex items-center gap-1"><Radio className="h-3 w-3" /> {model.name} · {model.hosting}</span>
          <ClassificationBadge level={secClass} />
        </div>
      </div>

      {/* Session details — on demand, out of the way */}
      <AnimatePresence>
        {details && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetails(false)}
            />
            <motion.aside
              key="panel"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-[360px] overflow-y-auto border-l border-ink-100 bg-white p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="section-title text-ink-800">Audit trail (this session)</div>
                <button onClick={() => setDetails(false)} className="btn-ghost !p-2"><X className="h-4 w-4" /></button>
              </div>

              <ol className="relative space-y-3 border-l border-brand-100 pl-4 text-xs">
                {audit.map((s, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-gradient shadow-[0_0_0_2px_#fff]" />
                    <div className="text-ink-500">{s.t}</div>
                    <div className="text-ink-800">{s.e}</div>
                  </li>
                ))}
              </ol>

              <div className="mb-3 mt-6 section-title text-ink-800">Source citations</div>
              <ul className="space-y-2 text-xs">
                {CITATIONS.map((s, i) => {
                  const [domain, detail] = s.split(' — ')
                  return (
                    <li key={i} className="flex items-start gap-2 rounded-lg border border-ink-100 bg-white p-2.5">
                      <FileText className={cn('mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500')} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-ink-800">{domain}</div>
                        <div className="truncate text-ink-500">{detail}</div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
