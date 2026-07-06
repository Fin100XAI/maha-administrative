import { useState } from 'react'
import { Download, ClipboardCheck, Sparkles, FileText, Clock, History, Paperclip, ShieldCheck, PenLine, Save, Send, Link2, Printer } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, ClassificationBadge } from '@/components/ui/Badges'
import { DEPARTMENTS, LANGUAGES } from '@/data/departments'
import { LETTER_TEMPLATES, RECENT_LETTERS } from '@/data/adminSamples'
import { TemplateGallery } from './_components/TemplateGallery'
import { RecentActivity } from './_components/RecentActivity'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const TONES = ['Formal', 'Formal — Urgent', 'Formal — Sympathy', 'Directive', 'Advisory', 'Explanatory']

export function LetterDrafting() {
  const [dept, setDept] = useState('DIT')
  const [recipient, setRecipient] = useState('Divisional Commissioner, Pune Division')
  const [subject, setSubject] = useState('Adoption of MAII AI Workspace for administrative correspondence')
  const [refNo, setRefNo] = useState('DIT/AI/2026/07/118')
  const [tone, setTone] = useState('Formal')
  const [lang, setLang] = useState<typeof LANGUAGES[number]>('English')
  const [purpose, setPurpose] = useState('Convey the state-wide roll-out schedule of the MAII AI Workspace and request nomination of nodal officers by 20 July 2026.')
  const [showOutput, setShowOutput] = useState(true)

  return (
    <div>
      <PageHeader
        title="Letter Drafting"
        description="Generate government-grade letters with department-specific formatting, tone, and language."
        breadcrumb={['Administrative AI', 'Letter Drafting']}
        source="Demo"
        eyebrow="Correspondence"
        icon={<PenLine className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Letter details" subtitle="Fill fields and generate a compliant draft" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department">
              <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d.code} value={d.code}>{d.code} · {d.name}</option>)}
              </select>
            </Field>
            <Field label="Reference No.">
              <input className="input" value={refNo} onChange={(e) => setRefNo(e.target.value)} />
            </Field>
            <Field label="Recipient" full>
              <input className="input" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </Field>
            <Field label="Subject" full>
              <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Field>
            <Field label="Tone">
              <select className="input" value={tone} onChange={(e) => setTone(e.target.value)}>
                {TONES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Language">
              <select className="input" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Purpose" full>
              <textarea rows={4} className="input resize-none" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </Field>
            <Field label="Attachments" full>
              <div className="flex flex-wrap items-center gap-2">
                <button className="btn-outline"><Paperclip className="h-4 w-4" /> Attach files</button>
                <span className="chip border border-ink-200 bg-ink-50 text-ink-600"><FileText className="h-3 w-3" /> MAII-rollout-schedule.pdf</span>
              </div>
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={() => setShowOutput(true)} className="btn-primary"><Sparkles className="h-4 w-4" /> Draft letter</button>
            <button className="btn-outline"><Download className="h-4 w-4" /> DOCX</button>
            <button className="btn-outline"><Download className="h-4 w-4" /> PDF</button>
            <button className="btn-outline"><ClipboardCheck className="h-4 w-4" /> Send for approval</button>
            <div className="ml-auto flex items-center gap-2">
              <StatusBadge status="Draft" />
              <SourceBadge source="Demo" />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Editable draft preview" subtitle="Formal template · Government of Maharashtra" right={<ClassificationBadge level="Internal" />} />
            {showOutput ? (
              <div className="rounded-xl border border-ink-100 bg-white p-6 font-serif text-[13px] leading-relaxed text-ink-800">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="font-bold uppercase tracking-wider">Government of Maharashtra</div>
                    <div className="text-xs text-ink-500">{DEPARTMENTS.find((d) => d.code === dept)?.name}</div>
                    <div className="text-xs text-ink-500">Mantralaya, Mumbai — 400 032</div>
                  </div>
                  <div className="text-right text-xs text-ink-500">
                    <div>Ref: <span className="font-medium text-ink-800">{refNo}</span></div>
                    <div>Date: 07-Jul-2026</div>
                  </div>
                </div>
                <div className="mb-3">To,<br /><span className="font-medium">{recipient}</span></div>
                <div className="mb-3"><span className="font-medium">Subject:</span> {subject}</div>
                <div className="mb-3">Sir/Madam,</div>
                <p className="mb-3">
                  With reference to the subject cited above, this is to inform that the Directorate of Information
                  Technology has been directed to roll out the MAII AI Workspace across all divisional offices in
                  a phased manner between July and October 2026. The system will be made available under sovereign
                  hosting with full DPDP compliance and on-prem deployment where applicable.
                </p>
                <p className="mb-3">
                  You are requested to kindly nominate a nodal officer (not below the rank of Deputy Secretary /
                  Additional Collector) from your Division to coordinate readiness assessment, training and go-live
                  activities. The nomination may please be communicated to this office latest by <b>20 July 2026</b>.
                </p>
                <p className="mb-3">
                  A copy of the roll-out schedule and readiness checklist is enclosed for ready reference.
                </p>
                <div className="mt-6">
                  Yours faithfully,<br />
                  <div className="mt-8 font-medium">(Rajesh Mahajan)</div>
                  <div className="text-xs text-ink-500">Principal Secretary (IT)<br />Directorate of Information Technology, GoM</div>
                </div>
                <div className="mt-6 border-t border-dashed border-ink-200 pt-3 text-xs text-ink-500">
                  Enclosure: Roll-out schedule (Annexure-A), Readiness checklist (Annexure-B).
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/40 p-8 text-center text-sm text-ink-500">
                Fill the fields on the left and click "Draft letter".
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Version history" subtitle="All revisions are stored under file DIT/AI/2026/07/118" right={<History className="h-4 w-4 text-ink-400" />} />
            <ul className="space-y-2 text-sm">
              {[
                { v: 'v0.3', at: '2026-07-07 09:14', by: 'MAII AI · autosave', s: 'Draft' as const },
                { v: 'v0.2', at: '2026-07-07 09:11', by: 'R. Mahajan · edited paragraph 2', s: 'Draft' as const },
                { v: 'v0.1', at: '2026-07-07 09:08', by: 'MAII AI · initial draft', s: 'Draft' as const },
              ].map((r) => (
                <li key={r.v} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{r.v} · {r.at}</div>
                    <div className="text-xs text-ink-500">{r.by}</div>
                  </div>
                  <StatusBadge status={r.s} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Approval status" right={<ShieldCheck className="h-4 w-4 text-emerald-500" />} />
            <ol className="flex flex-wrap items-center gap-2 text-xs">
              {['Section Officer', 'Under Secretary', 'Deputy Secretary', 'Principal Secretary'].map((s, i) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-white ${i < 1 ? 'bg-emerald-500' : 'bg-ink-300'}`}>{i + 1}</span>
                  <span className="text-ink-700">{s}</span>
                  {i < 3 && <Clock className="h-3 w-3 text-ink-300" />}
                </li>
              ))}
            </ol>
            <div className="mt-2 text-xs text-ink-500">Current status: <b>Awaiting review by Under Secretary</b></div>
          </Card>
        </div>
      </div>

      {/* Templates gallery */}
      <div className="mt-6">
        <TemplateGallery
          items={LETTER_TEMPLATES}
          subtitle="Pick a pre-approved template as your starting point"
        />
      </div>

      {/* Quick actions + shortcuts + recent activity */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <QuickActions
            actions={[
              { label: 'Save draft', icon: <Save className="h-4 w-4" /> },
              { label: 'Send to Under Secretary', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy shareable link', icon: <Link2 className="h-4 w-4" /> },
              { label: 'Print letterhead', icon: <Printer className="h-4 w-4" /> },
            ]}
          />
          <RecentActivity items={RECENT_LETTERS} />
        </div>
        <Shortcuts
          items={[
            { keys: '⌘ K', label: 'Open command palette' },
            { keys: '⌘ ↵', label: 'Draft letter with current fields' },
            { keys: '⌘ S', label: 'Save draft to file DIT/AI/2026/07/118' },
            { keys: '⌘ ⇧ P', label: 'Print letter with letterhead' },
            { keys: '⌘ /', label: 'Toggle Marathi register preview' },
          ]}
        />
      </div>
    </div>
  )
}

function Field({ label, full, children }: { label: string; full?: boolean; children: any }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="label">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
