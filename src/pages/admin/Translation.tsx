import { useCallback, useEffect, useRef, useState } from 'react'
import { Languages, ArrowLeftRight, Copy, Check, Download, Loader2, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { LANGUAGES } from '@/data/departments'
import { ConfidenceBadge, SourceBadge } from '@/components/ui/Badges'
import { TRANSLATION_MATRIX, RECENT_TRANSLATIONS } from '@/data/adminSamples'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'
import { RecentActivity } from './_components/RecentActivity'

const SHORT_LANGS = ['English', 'Marathi', 'Hindi'] as const

const SAMPLE_INPUT =
  'Under the revised guidelines, District Collectors shall constitute a grievance redressal committee within seven days of the publication of this Government Resolution.'

// Map the display language to an ISO code the translation engines understand.
const LANG_CODE: Record<string, string> = {
  English: 'en',
  'मराठी (Marathi)': 'mr',
  'हिंदी (Hindi)': 'hi',
}

// Live translation of arbitrary text. Google's gtx engine first (best formal
// register), MyMemory as a fallback. Both are no-key, CORS-enabled.
async function translateText(text: string, from: string, to: string, signal: AbortSignal): Promise<string> {
  const sl = LANG_CODE[from] ?? 'en'
  const tl = LANG_CODE[to] ?? 'en'
  if (sl === tl) return text

  // Primary: Google gtx
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url, { signal })
    if (res.ok) {
      const data = await res.json()
      const out = (data?.[0] as any[] | undefined)?.map((seg) => seg?.[0]).filter(Boolean).join('')
      if (out) return out
    }
  } catch (e) {
    if ((e as any)?.name === 'AbortError') throw e
  }

  // Fallback: MyMemory
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${tl}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Translation service unavailable (${res.status})`)
  const data = await res.json()
  const out = data?.responseData?.translatedText
  if (!out || data?.responseStatus >= 400) throw new Error(data?.responseDetails || 'Translation failed')
  return out
}

function scoreCls(score: number): string {
  if (score >= 95) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (score >= 85) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-red-50 text-red-700 border-red-200'
}

export function Translation() {
  const [from, setFrom] = useState<typeof LANGUAGES[number]>('English')
  const [to, setTo] = useState<typeof LANGUAGES[number]>('मराठी (Marathi)')
  const [input, setInput] = useState(SAMPLE_INPUT)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const trimmed = input.trim()

  const runTranslate = useCallback(async () => {
    abortRef.current?.abort()
    const text = input.trim()
    if (text === '') { setOutput(''); setError(''); setLoading(false); return }
    if (from === to) { setOutput(input); setError(''); setLoading(false); return }
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setError('')
    try {
      const result = await translateText(input, from, to, ctrl.signal)
      if (!ctrl.signal.aborted) setOutput(result)
    } catch (e) {
      if ((e as any)?.name !== 'AbortError') {
        setError((e as Error).message || 'Translation failed. Please try again.')
        setOutput('')
      }
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [input, from, to])

  // Auto-translate any text (debounced) whenever input or languages change.
  useEffect(() => {
    const id = setTimeout(runTranslate, 600)
    return () => clearTimeout(id)
  }, [runTranslate])

  async function copyOutput() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable */ }
  }

  function downloadDocx() {
    if (!output) return
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:'Mangal','Nirmala UI',serif;font-size:12pt;line-height:1.6;">${output.replace(/\n/g, '<br/>')}</body></html>`
    const blob = new Blob(['﻿', html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-${LANG_CODE[to] ?? 'out'}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

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
            <div className="label mb-1 flex items-center gap-2">
              Translation ({to})
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-500" />}
            </div>
            <div className="min-h-[220px] whitespace-pre-wrap rounded-lg border border-ink-200 bg-ink-50/50 p-3 font-serif text-sm leading-relaxed text-ink-800">
              {output
                ? output
                : error
                  ? <span className="not-italic font-sans text-red-600">{error}</span>
                  : loading
                    ? <span className="not-italic font-sans text-ink-400">Translating…</span>
                    : trimmed === ''
                      ? <span className="not-italic font-sans text-ink-400">Enter source text to translate.</span>
                      : <span className="not-italic font-sans text-ink-400">Translating…</span>}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button onClick={copyOutput} disabled={!output} className="btn-outline disabled:opacity-50">
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={downloadDocx} disabled={!output} className="btn-outline disabled:opacity-50"><Download className="h-4 w-4" /> DOCX</button>
              <button onClick={runTranslate} disabled={loading || trimmed === ''} className="btn-primary disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />} {loading ? 'Translating…' : 'Regenerate (formal)'}
              </button>
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
              { label: 'Copy translated text', icon: <Copy className="h-4 w-4" />, onClick: copyOutput },
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
