import { useState } from 'react'
import { Languages, ArrowLeftRight, Copy, Download, Sparkles, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/departments'
import { ConfidenceBadge, SourceBadge } from '@/components/ui/Badges'
import { TRANSLATION_MATRIX, RECENT_TRANSLATIONS } from '@/data/adminSamples'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'
import { RecentActivity } from './_components/RecentActivity'

const SHORT_LANGS = ['English', 'Marathi', 'Hindi'] as const

function scoreCls(score: number): string {
  if (score >= 95) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (score >= 85) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

export function Translation() {
  const [from, setFrom] = useState<typeof LANGUAGES[number]>('English')
  const [to, setTo] = useState<typeof LANGUAGES[number]>('मराठी (Marathi)')
  const [input, setInput] = useState('Under the revised guidelines, District Collectors shall constitute a grievance redressal committee within seven days of the publication of this Government Resolution.')

  return (
    <div>
      <PageHeader
        title="Translation"
        description="Formal-register translation between English, Marathi and Hindi. Optimised for government correspondence."
        breadcrumb={['Administrative AI', 'Translation']}
        source="Demo"
        eyebrow="Language"
        icon={<Languages className="h-5 w-5" />}
      />

      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Languages className="h-4 w-4 text-brand-500" />
          <select className="input w-auto" value={from} onChange={(e) => setFrom(e.target.value as any)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <button
            onClick={() => { const t = from; setFrom(to); setTo(t) }}
            className="rounded-full border border-ink-200 bg-white p-1.5 hover:bg-ink-50"
            title="Swap"
          >
            <ArrowLeftRight className="h-4 w-4 text-ink-500" />
          </button>
          <select className="input w-auto" value={to} onChange={(e) => setTo(e.target.value as any)}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2">
            <ConfidenceBadge score={92} />
            <SourceBadge source="Demo" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="label mb-1">Source ({from})</div>
            <textarea rows={10} className="input resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
            <div className="mt-1 text-xs text-ink-500">{input.length} characters</div>
          </div>
          <div>
            <div className="label mb-1">Translation ({to})</div>
            <div className="min-h-[220px] rounded-lg border border-ink-200 bg-ink-50/50 p-3 font-serif text-sm leading-relaxed text-ink-800">
              सुधारित मार्गदर्शक तत्त्वांनुसार, संबंधित शासन निर्णय प्रसिद्ध झाल्यापासून सात दिवसांच्या आत जिल्हाधिकाऱ्यांनी तक्रार निवारण समितीची स्थापना करावी.
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button className="btn-outline"><Copy className="h-4 w-4" /> Copy</button>
              <button className="btn-outline"><Download className="h-4 w-4" /> DOCX</button>
              <button className="btn-primary"><Sparkles className="h-4 w-4" /> Regenerate (formal)</button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Recommended model" />
          <div className="text-sm text-ink-700">Sarvam-M (v1.8) · Marathi drafting strength 98/100.</div>
        </Card>
        <Card>
          <CardHeader title="Register" />
          <div className="text-sm text-ink-700">Formal · Government correspondence.</div>
        </Card>
        <Card>
          <CardHeader title="Human review" />
          <div className="text-sm text-ink-700">Required for legal phrasing. Sent to Language Lab for verification.</div>
        </Card>
      </div>

      {/* Language matrix */}
      <div className="mt-6">
        <Card>
          <CardHeader
            title="Language quality matrix"
            subtitle="Direction-wise formal-register quality scores (BLEU-like, 0–100)"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr>
                  <th className="table-th">From \ To</th>
                  {SHORT_LANGS.map((l) => (
                    <th key={l} className="table-th">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHORT_LANGS.map((fromL) => (
                  <tr key={fromL} className="hover:bg-ink-50/40">
                    <td className="table-td font-medium text-ink-700">{fromL}</td>
                    {SHORT_LANGS.map((toL) => {
                      const cell = TRANSLATION_MATRIX.find((c) => c.from === fromL && c.to === toL)
                      if (!cell) return <td key={toL} className="table-td">—</td>
                      return (
                        <td key={toL} className="table-td">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`chip border ${scoreCls(cell.score)}`}>{cell.score}</span>
                            <span className="text-[11px] text-ink-500">{cell.note}</span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Sample dataset — swap for real evaluation set (FLORES-200 or Bhasha) once evaluation harness is wired.
          </p>
        </Card>
      </div>

      {/* Quick actions + recent + shortcuts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <QuickActions
            actions={[
              { label: 'Save translation', icon: <Save className="h-4 w-4" /> },
              { label: 'Send to Language Lab', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy Marathi text', icon: <Copy className="h-4 w-4" /> },
              { label: 'Copy link', icon: <Link2 className="h-4 w-4" /> },
            ]}
          />
          <RecentActivity items={RECENT_TRANSLATIONS} title="Recent translations" />
        </div>
        <Shortcuts
          items={[
            { keys: '⌘ ↵', label: 'Translate source text' },
            { keys: '⌘ ⇧ S', label: 'Swap source and target languages' },
            { keys: '⌘ R', label: 'Regenerate in formal register' },
            { keys: '⌘ C', label: 'Copy translated text' },
          ]}
        />
      </div>
    </div>
  )
}
