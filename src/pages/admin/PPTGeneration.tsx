import { useState } from 'react'
import { Presentation, Download, Sparkles, Save, Send, Link2, Printer } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/departments'
import { SourceBadge } from '@/components/ui/Badges'
import { PPT_TEMPLATES } from '@/data/adminSamples'
import { TemplateGallery } from './_components/TemplateGallery'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const AUDIENCES = ['Chief Minister', 'Chief Secretary', 'Minister', 'Secretary', 'District Collector', 'Municipal Commissioner', 'Department Officer']

interface SlideDef {
  t: string
  n: string
  bullets: string[]
  speaker: string
}

const structure: SlideDef[] = [
  {
    t: 'Executive Summary',
    n: '1 slide',
    bullets: ['Sovereign AI for GoM administration', '4 departments, 30-day pilot proven', 'DPDP-aligned, on-prem ready'],
    speaker: 'Two-minute framing of the sovereign AI opportunity.',
  },
  {
    t: 'MAII Vision & Objectives',
    n: '1 slide',
    bullets: ['Marathi-first LLM stack (Sarvam-M)', 'Officer productivity 34% up', 'Citizen turnaround halved'],
    speaker: 'Position MAII as the state-wide sovereign AI backbone.',
  },
  {
    t: 'Sovereign AI Stack',
    n: '1 slide',
    bullets: ['On-prem GPU cluster (Pune DC)', 'Model gateway with RBAC + audit', 'Sarvam-M · Bhashini · MahaDBT hooks'],
    speaker: 'Explain the stack layer-by-layer, from data plane to human review.',
  },
  {
    t: 'Roll-out Roadmap',
    n: '2 slides',
    bullets: ['Phase 1 · Pilot depts (DIT, GAD, UDD, HFW)', 'Phase 2 · Divisional roll-out', 'Phase 3 · District & ULB'],
    speaker: 'Walk the calendar view; call out review gates at day 30, 60 and 90.',
  },
  {
    t: 'DPDP & Security Posture',
    n: '1 slide',
    bullets: ['DPDP Act 2023 · Consent artefacts', 'RBAC + PII redaction gates', 'CERT-In advisory alignment'],
    speaker: 'Reassure on data-protection controls before requesting sign-off.',
  },
  {
    t: 'Department Readiness Scorecard',
    n: '1 slide',
    bullets: ['DIT 96 · GAD 92 · UDD 88 · HFW 90', 'Home 87 · Revenue 86 · Finance 94', 'Lowest readiness · Labour 79'],
    speaker: 'Frame variance across departments; nominate nodal officers.',
  },
  {
    t: 'Financial Impact',
    n: '1 slide',
    bullets: ['OpEx ₹18 L / year absorbed', 'No fresh CapEx (existing GPU)', 'Break-even at 62% utilisation'],
    speaker: 'Emphasise cost neutrality within DIT budget head 22-01-107.',
  },
  {
    t: 'Risks & Mitigation',
    n: '1 slide',
    bullets: ['Hallucination risk · Human gate', 'Model drift · Weekly evaluation', 'DPO sign-off · pending'],
    speaker: 'Show a clear risk register with owners and mitigation dates.',
  },
  {
    t: 'Ask & Next Steps',
    n: '1 slide',
    bullets: ['Approve Phase 1 roll-out', 'Nominate nodal officers by 20-Jul', 'Reconvene at day 45 review'],
    speaker: 'Close on 3 clear asks; no ambiguity on ownership.',
  },
]

export function PPTGeneration() {
  const [topic, setTopic] = useState('MAII AI Workspace — State-wide Roll-out Plan')
  const [audience, setAudience] = useState('Chief Secretary')
  const [slides, setSlides] = useState(10)
  const [lang, setLang] = useState<typeof LANGUAGES[number]>('English')

  return (
    <div>
      <PageHeader
        title="PPT Generation"
        description="Generate an audience-appropriate briefing deck with structure, slide content and speaker notes."
        breadcrumb={['Administrative AI', 'PPT Generation']}
        source="Demo"
        eyebrow="Presentation"
        icon={<Presentation className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1.4fr]">
        <Card>
          <CardHeader title="Deck inputs" />
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">Topic</label>
              <input className="input mt-1" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div>
              <label className="label">Audience</label>
              <select className="input mt-1" value={audience} onChange={(e) => setAudience(e.target.value)}>
                {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input mt-1" value={lang} onChange={(e) => setLang(e.target.value as any)}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Slide count: {slides}</label>
              <input type="range" min={5} max={30} value={slides} onChange={(e) => setSlides(Number(e.target.value))} className="mt-1 w-full accent-brand-500" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary"><Sparkles className="h-4 w-4" /> Generate structure</button>
            <button className="btn-outline"><Download className="h-4 w-4" /> Export .pptx (placeholder)</button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Suggested structure" subtitle={`Tailored for: ${audience}`} right={<SourceBadge source="Demo" />} />
            <ol className="space-y-2">
              {structure.map((s, i) => (
                <li key={s.t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2 text-sm">
                  <span className="text-ink-800"><span className="text-ink-500">{i + 1}.</span> {s.t}</span>
                  <span className="text-xs text-ink-500">{s.n}</span>
                </li>
              ))}
            </ol>
          </Card>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-800">
              <Presentation className="h-4 w-4 text-brand-500" /> Slide previews · all 9 slides
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {structure.map((s, i) => (
                <div key={s.t} className="card overflow-hidden p-0">
                  <div className="aspect-[16/9] bg-brand-gradient p-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Slide {i + 1}</div>
                    <div className="mt-1 line-clamp-2 text-lg font-semibold leading-tight">{s.t}</div>
                    <div className="mt-2 text-xs opacity-90">Government of Maharashtra · MAII briefing to {audience}</div>
                    <ul className="mt-3 space-y-1 text-[11px] opacity-95">
                      {s.bullets.map((b) => (
                        <li key={b} className="line-clamp-1">• {b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 text-xs text-ink-600">
                    <b>Speaker notes:</b> {s.speaker}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates gallery */}
      <div className="mt-6">
        <TemplateGallery items={PPT_TEMPLATES} subtitle="Reusable deck templates from the MAII library" />
      </div>

      {/* Quick actions + shortcuts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <QuickActions
          actions={[
            { label: 'Save deck', icon: <Save className="h-4 w-4" /> },
            { label: 'Send to CM office', icon: <Send className="h-4 w-4" />, primary: true },
            { label: 'Copy shareable link', icon: <Link2 className="h-4 w-4" /> },
            { label: 'Print speaker notes', icon: <Printer className="h-4 w-4" /> },
          ]}
        />
        <Shortcuts
          items={[
            { keys: '⌘ ↵', label: 'Generate structure' },
            { keys: '⌘ E', label: 'Export as .pptx' },
            { keys: '⌘ K', label: 'Command palette' },
            { keys: '⌘ ⇧ L', label: 'Toggle Marathi title lines' },
          ]}
        />
      </div>
    </div>
  )
}
