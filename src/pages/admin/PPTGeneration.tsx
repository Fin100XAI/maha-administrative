import { useState } from 'react'
import { Presentation, Download, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/departments'
import { SourceBadge } from '@/components/ui/Badges'

const AUDIENCES = ['Chief Minister', 'Chief Secretary', 'Minister', 'Secretary', 'District Collector', 'Municipal Commissioner', 'Department Officer']

export function PPTGeneration() {
  const [topic, setTopic] = useState('MAII AI Workspace — State-wide Roll-out Plan')
  const [audience, setAudience] = useState('Chief Secretary')
  const [slides, setSlides] = useState(10)
  const [lang, setLang] = useState<typeof LANGUAGES[number]>('English')

  const structure = [
    { t: 'Executive Summary', n: '1 slide' },
    { t: 'MAII Vision & Objectives', n: '1 slide' },
    { t: 'Sovereign AI Stack', n: '1 slide' },
    { t: 'Roll-out Roadmap', n: '2 slides' },
    { t: 'DPDP & Security Posture', n: '1 slide' },
    { t: 'Department Readiness Scorecard', n: '1 slide' },
    { t: 'Financial Impact', n: '1 slide' },
    { t: 'Risks & Mitigation', n: '1 slide' },
    { t: 'Ask & Next Steps', n: '1 slide' },
  ]

  return (
    <div>
      <PageHeader
        title="PPT Generation"
        description="Generate an audience-appropriate briefing deck with structure, slide content and speaker notes."
        breadcrumb={['Administrative AI', 'PPT Generation']}
        source="Demo"
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
              <Presentation className="h-4 w-4 text-brand-500" /> Slide previews
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {structure.slice(0, 4).map((s, i) => (
                <div key={s.t} className="card overflow-hidden p-0">
                  <div className="aspect-[16/9] bg-brand-gradient p-4 text-white">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">Slide {i + 1}</div>
                    <div className="mt-1 text-lg font-semibold leading-tight">{s.t}</div>
                    <div className="mt-2 text-xs opacity-90">Government of Maharashtra · MAII briefing to {audience}</div>
                  </div>
                  <div className="p-3 text-xs text-ink-600">
                    <b>Speaker notes:</b> {i === 0 ? 'Two-minute framing of the sovereign AI opportunity.' : 'Key point ' + (i + 1) + ' with citation to public source and department data.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
