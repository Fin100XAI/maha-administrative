import { useState } from 'react'
import { Presentation, Download, Loader2, Save, Send, Link2, Printer } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/departments'
import { SourceBadge } from '@/components/ui/Badges'
import { PPT_TEMPLATES } from '@/data/adminSamples'
import { TemplateGallery } from './_components/TemplateGallery'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const AUDIENCES = ['Chief Minister', 'Chief Secretary', 'Minister', 'Secretary', 'District Collector', 'Municipal Commissioner', 'Department Officer']

// Language drives the deck chrome so switching the picker is visible.
const LANG_COPY: Record<string, { org: string; slideLabel: string; briefingTo: (a: string) => string }> = {
  English: {
    org: 'Government of Maharashtra',
    slideLabel: 'Slide',
    briefingTo: (a) => `Government of Maharashtra · MAII briefing to ${a}`,
  },
  'मराठी (Marathi)': {
    org: 'महाराष्ट्र शासन',
    slideLabel: 'स्लाइड',
    briefingTo: (a) => `महाराष्ट्र शासन · ${a} यांच्यासाठी MAII सादरीकरण`,
  },
  'हिंदी (Hindi)': {
    org: 'महाराष्ट्र सरकार',
    slideLabel: 'स्लाइड',
    briefingTo: (a) => `महाराष्ट्र सरकार · ${a} हेतु MAII प्रस्तुति`,
  },
}

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

  const [generating, setGenerating] = useState(false)

  const langCopy = LANG_COPY[lang] ?? LANG_COPY.English
  // Slide count actually limits how many slides are structured/previewed.
  const shown = structure.slice(0, Math.min(slides, structure.length))

  async function generatePptx() {
    setGenerating(true)
    try {
      const { default: PptxGenJS } = await import('pptxgenjs')
      const pptx = new PptxGenJS()
      pptx.author = 'MAII · Government of Maharashtra'
      pptx.company = langCopy.org
      pptx.title = topic
      pptx.layout = 'LAYOUT_WIDE'

      const NAVY = '0B3D91'
      const INK = '1E293B'
      const MUTED = '64748B'

      // Title slide
      const title = pptx.addSlide()
      title.background = { color: NAVY }
      title.addText(langCopy.org, { x: 0.6, y: 0.5, w: 12, h: 0.4, fontSize: 14, color: 'C7D2FE', bold: true, charSpacing: 2 })
      title.addText(topic, { x: 0.6, y: 2.1, w: 12, h: 2, fontSize: 36, color: 'FFFFFF', bold: true })
      title.addText(langCopy.briefingTo(audience), { x: 0.6, y: 4.4, w: 12, h: 0.6, fontSize: 16, color: 'C7D2FE' })
      title.addText('MAII — Maharashtra Administrative Intelligence & Insights', { x: 0.6, y: 6.6, w: 12, h: 0.4, fontSize: 11, color: 'A5B4FC' })

      // Content slides
      shown.forEach((s, i) => {
        const slide = pptx.addSlide()
        slide.addText(`${langCopy.slideLabel} ${i + 1}`, { x: 0.6, y: 0.35, w: 6, h: 0.35, fontSize: 11, color: MUTED, charSpacing: 2 })
        slide.addText(s.t, { x: 0.6, y: 0.75, w: 12, h: 0.8, fontSize: 26, color: NAVY, bold: true })
        slide.addShape(pptx.ShapeType.line, { x: 0.6, y: 1.7, w: 12.1, h: 0, line: { color: NAVY, width: 1.5 } })
        slide.addText(
          s.bullets.map((b) => ({ text: b, options: { bullet: { code: '2022' }, color: INK, fontSize: 18, paraSpaceAfter: 10 } })),
          { x: 0.7, y: 2.0, w: 12, h: 3.6, valign: 'top' },
        )
        slide.addNotes(s.speaker)
        slide.addText(`${langCopy.org} · ${audience}`, { x: 0.6, y: 6.9, w: 12, h: 0.3, fontSize: 9, color: MUTED })
      })

      const safe = topic.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'MAII-deck'
      await pptx.writeFile({ fileName: `${safe}.pptx` })
    } finally {
      setGenerating(false)
    }
  }

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
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
            <div className="sm:col-span-2">
              <label className="label">Slide count: {slides}</label>
              <input type="range" min={5} max={30} value={slides} onChange={(e) => setSlides(Number(e.target.value))} className="mt-1 w-full accent-brand-500" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={generatePptx} disabled={generating} className="btn-primary disabled:opacity-60">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}
              {generating ? 'Generating…' : 'Generate & download .pptx'}
            </button>
            <button onClick={generatePptx} disabled={generating} className="btn-outline disabled:opacity-60"><Download className="h-4 w-4" /> Export .pptx</button>
          </div>
          <p className="mt-2 text-xs text-ink-500">Builds a {shown.length}-slide PowerPoint file from the inputs above — opens in PowerPoint, Google Slides or LibreOffice Impress.</p>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Suggested structure" subtitle={`${topic} · Tailored for ${audience} · ${lang}`} right={<SourceBadge source="Demo" />} />
            <ol className="space-y-2">
              {shown.map((s, i) => (
                <li key={s.t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2 text-sm">
                  <span className="text-ink-800"><span className="text-ink-500">{i + 1}.</span> {s.t}</span>
                  <span className="text-xs text-ink-500">{s.n}</span>
                </li>
              ))}
            </ol>
          </Card>

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-800">
              <Presentation className="h-4 w-4 text-brand-500" /> Slide previews · {shown.length} slide{shown.length === 1 ? '' : 's'}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {shown.map((s, i) => (
                <div key={s.t} className="card overflow-hidden p-0">
                  <div className="aspect-[16/9] bg-brand-gradient p-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{langCopy.slideLabel} {i + 1}</div>
                    <div className="mt-1 line-clamp-2 text-lg font-semibold leading-tight">{i === 0 ? topic : s.t}</div>
                    <div className="mt-2 text-xs opacity-90">{langCopy.briefingTo(audience)}</div>
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
            { label: 'Download .pptx', icon: <Download className="h-4 w-4" />, onClick: generatePptx },
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
