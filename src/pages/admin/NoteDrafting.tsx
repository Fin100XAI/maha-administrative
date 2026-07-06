import { useState } from 'react'
import { Download, ClipboardCheck, Sparkles, ShieldAlert, IndianRupee, Scale, FileText, Send, Save, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, ClassificationBadge, RiskBadge } from '@/components/ui/Badges'
import { DEPARTMENTS } from '@/data/departments'
import { NOTE_TEMPLATES, RECENT_NOTES } from '@/data/adminSamples'
import { TemplateGallery } from './_components/TemplateGallery'
import { RecentActivity } from './_components/RecentActivity'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

export function NoteDrafting() {
  const [dept, setDept] = useState('DIT')
  const [fileNo, setFileNo] = useState('DIT/AI/2026/07/118')
  const [summary, setSummary] = useState('Adoption of MAII AI Workspace for state-wide administrative correspondence.')
  const [background, setBackground] = useState('Marathi drafting via general-purpose LLMs shows persistent formal-register drift. Sarvam-M evaluation demonstrates 22% error reduction and 34% time saving.')
  const [fin, setFin] = useState('No additional CapEx. OpEx ₹18 L / year — absorbed within DIT budget head 22-01-107.')
  const [legal, setLegal] = useState('No fresh MoU required — governed under DIT Master AI SLA (2025) and DPDP Act, 2023.')
  const [reco, setReco] = useState('Approve production roll-out to GAD, Home, Revenue and UDD with 30-day pilot review at day 45.')

  const [decision, setDecision] = useState<'A' | 'B' | 'C'>('A')

  return (
    <div>
      <PageHeader
        title="Note Drafting"
        description="Generate a note sheet for approval with decision options and risk analysis."
        breadcrumb={['Administrative AI', 'Note Drafting']}
        source="Demo"
        eyebrow="Note sheet"
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Note inputs" subtitle="Structured fields for a note sheet" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="File No.">
              <input className="input" value={fileNo} onChange={(e) => setFileNo(e.target.value)} />
            </Field>
            <Field label="Department">
              <select className="input" value={dept} onChange={(e) => setDept(e.target.value)}>
                {DEPARTMENTS.map((d) => <option key={d.code} value={d.code}>{d.code} · {d.name}</option>)}
              </select>
            </Field>
            <Field label="Issue summary" full>
              <textarea rows={2} className="input resize-none" value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>
            <Field label="Background" full>
              <textarea rows={3} className="input resize-none" value={background} onChange={(e) => setBackground(e.target.value)} />
            </Field>
            <Field label="Financial implication" full>
              <textarea rows={2} className="input resize-none" value={fin} onChange={(e) => setFin(e.target.value)} />
            </Field>
            <Field label="Legal implication" full>
              <textarea rows={2} className="input resize-none" value={legal} onChange={(e) => setLegal(e.target.value)} />
            </Field>
            <Field label="Recommendation" full>
              <textarea rows={2} className="input resize-none" value={reco} onChange={(e) => setReco(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="btn-primary"><Sparkles className="h-4 w-4" /> Generate note sheet</button>
            <button className="btn-outline"><Download className="h-4 w-4" /> DOCX</button>
            <button className="btn-outline"><Download className="h-4 w-4" /> PDF</button>
            <div className="ml-auto flex items-center gap-2">
              <ClassificationBadge level="Internal" />
              <SourceBadge source="Demo" />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Note Sheet — Preview" subtitle={`File ${fileNo}`} right={<StatusBadge status="Draft" />} />
            <div className="rounded-xl border border-ink-100 bg-white p-6 font-serif text-[13px] leading-relaxed text-ink-800">
              <div className="mb-2 flex justify-between text-xs text-ink-500">
                <span>Government of Maharashtra · {DEPARTMENTS.find((d) => d.code === dept)?.name}</span>
                <span>File No. {fileNo}</span>
              </div>
              <div className="mb-2 text-center text-sm font-semibold uppercase tracking-wider">NOTE FOR APPROVAL</div>
              <hr className="mb-3 border-ink-200" />
              <p><b>1. Issue:</b> {summary}</p>
              <p className="mt-2"><b>2. Background:</b> {background}</p>
              <p className="mt-2"><b>3. Financial implication:</b> {fin}</p>
              <p className="mt-2"><b>4. Legal implication:</b> {legal}</p>
              <p className="mt-2"><b>5. Recommendation:</b> {reco}</p>
              <p className="mt-2"><b>6. Preferred decision option:</b> Option {decision}</p>
              <p className="mt-6 text-right">Section Officer</p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Decision options" subtitle="Choose the option you want the note to recommend" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {([
                { id: 'A', title: 'Approve as recommended', body: 'Roll-out to 4 departments in July–Aug 2026.' },
                { id: 'B', title: 'Approve with pilot cap', body: 'Restrict pilot to 2 departments; reassess at day 30.' },
                { id: 'C', title: 'Defer', body: 'Await external audit report before roll-out.' },
              ] as const).map((o) => (
                <button
                  key={o.id}
                  onClick={() => setDecision(o.id as any)}
                  className={`rounded-xl border p-4 text-left ${decision === o.id ? 'border-brand-400 bg-brand-soft' : 'border-ink-100 bg-white hover:bg-ink-50'}`}
                >
                  <div className="text-xs uppercase tracking-wider text-ink-500">Option {o.id}</div>
                  <div className="mt-1 text-sm font-semibold text-ink-900">{o.title}</div>
                  <div className="mt-1 text-xs text-ink-600">{o.body}</div>
                </button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Risk analysis" right={<RiskBadge level="Medium" />} />
              <ul className="space-y-2 text-sm text-ink-700">
                <li className="flex items-start gap-2"><ShieldAlert className="mt-0.5 h-4 w-4 text-amber-500" /> AI hallucination risk on Marathi legal phrasing — mitigated by human review gate.</li>
                <li className="flex items-start gap-2"><IndianRupee className="mt-0.5 h-4 w-4 text-emerald-600" /> Cost neutrality assumes on-prem GPU utilisation ≥ 62%.</li>
                <li className="flex items-start gap-2"><Scale className="mt-0.5 h-4 w-4 text-brand-500" /> DPDP: consent language reviewed; DPO sign-off pending.</li>
              </ul>
            </Card>

            <Card>
              <CardHeader title="Approval hierarchy" right={<ClipboardCheck className="h-4 w-4 text-brand-500" />} />
              <ol className="space-y-2 text-sm">
                {[
                  ['Section Officer (SO)', 'Approved'],
                  ['Under Secretary (US)', 'In progress'],
                  ['Deputy Secretary (DS)', 'Pending'],
                  ['Principal Secretary (PS)', 'Pending'],
                  ['Chief Secretary (CS)', 'Pending'],
                ].map(([role, s]) => (
                  <li key={role} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                    <span className="text-ink-700">{role}</span>
                    <StatusBadge status={s === 'Approved' ? 'Approved' : s === 'In progress' ? 'Under Review' : 'Draft'} />
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </div>

      {/* Templates gallery */}
      <div className="mt-6">
        <TemplateGallery items={NOTE_TEMPLATES} subtitle="Pre-approved note-sheet blueprints" />
      </div>

      {/* Quick actions + recent activity + shortcuts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <QuickActions
            actions={[
              { label: 'Save draft', icon: <Save className="h-4 w-4" /> },
              { label: 'Move to Under Secretary', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy note link', icon: <Link2 className="h-4 w-4" /> },
              { label: 'Attach annexure', icon: <ClipboardCheck className="h-4 w-4" /> },
            ]}
          />
          <RecentActivity items={RECENT_NOTES} />
        </div>
        <Shortcuts
          items={[
            { keys: '⌘ K', label: 'Open command palette' },
            { keys: '⌘ ↵', label: 'Generate note sheet from fields' },
            { keys: '⌘ D', label: 'Cycle decision option A → B → C' },
            { keys: '⌘ S', label: 'Save note draft' },
            { keys: '⌘ ⇧ R', label: 'Regenerate risk analysis' },
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
