import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Search, Users, PlusCircle, Trophy, HelpCircle, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'
import { ChipStrip } from './_components/ChipStrip'
import { FAQ_ROWS, FAQ_POPULAR_THIS_WEEK, FAQCategory } from '@/data/knowledgeSamples'

const CATEGORIES: (FAQCategory | 'All')[] = [
  'All', 'Platform', 'Security', 'DPDP', 'Drafting', 'Models', 'Integrations', 'RBAC', 'On-prem', 'Incidents',
]

export function FAQ() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<'All' | FAQCategory>('All')
  const [open, setOpen] = useState<number | null>(0)
  const [suggestion, setSuggestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const filtered = useMemo(() =>
    FAQ_ROWS.filter((f) =>
      (category === 'All' || f.category === category) &&
      (q.trim() === '' || (f.q + ' ' + f.a).toLowerCase().includes(q.toLowerCase())),
    ), [q, category])

  const catCounts = useMemo(() => {
    const map: Record<string, number> = { All: FAQ_ROWS.length }
    for (const f of FAQ_ROWS) map[f.category] = (map[f.category] || 0) + 1
    return map
  }, [])

  const catOptions = CATEGORIES.map((c) => ({ value: c, label: c, count: catCounts[c] }))

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<HelpCircle className="h-5 w-5" />}
        title="FAQ"
        description="Frequently asked questions by officers using MAII — platform, security, DPDP, drafting, models, integrations and more."
        breadcrumb={['Knowledge Brain', 'FAQ']}
        source="Demo"
      />
      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Search FAQs… (e.g. Marathi, consent, on-prem)" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="text-xs text-ink-500 md:self-center">
            {filtered.length} of {FAQ_ROWS.length} FAQs
          </div>
        </div>
        <div className="mt-3">
          <ChipStrip
            options={catOptions}
            value={category}
            onChange={(v) => setCategory(v as 'All' | FAQCategory)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-2">
          {filtered.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              className="card"
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="chip border border-brand-100 bg-brand-soft text-[10px] text-brand-700">{f.category}</span>
                    <span className="text-[11px] text-ink-500">{f.views.toLocaleString()} views</span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink-800">{f.q}</div>
                </div>
                {open === i ? <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />}
              </button>
              {open === i && (
                <div className="mt-2 text-sm text-ink-700">
                  {f.a}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <SourceBadge source="Demo" />
                    <button className="btn-outline !px-2.5 !py-1 text-[11px]">Helpful</button>
                    <button className="btn-outline !px-2.5 !py-1 text-[11px]">Needs improvement</button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">
              No FAQs matched — try a different keyword or category.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Popular this week */}
          <Card>
            <CardHeader
              title="Popular this week"
              subtitle="Ranked by unique officer views"
              right={<Trophy className="h-4 w-4 text-amber-500" />}
            />
            <ul className="space-y-3 text-sm">
              {FAQ_POPULAR_THIS_WEEK.map((p, i) => (
                <li key={p.q}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-brand-soft text-[10px] font-semibold text-brand-700">{i + 1}</span>
                      <span className="truncate text-ink-800" title={p.q}>{p.q}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-xs text-ink-500">
                      <span className="tabular-nums">{p.views.toLocaleString()}</span>
                      <span className="text-emerald-600">▲ {p.delta.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${(p.views / FAQ_POPULAR_THIS_WEEK[0].views) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>

          {/* Ask the community */}
          <Card className="bg-brand-soft">
            <CardHeader
              title="Ask the community"
              subtitle="Peer answers from 12,400+ MAII-onboarded officers"
              right={<Users className="h-4 w-4 text-brand-500" />}
            />
            <p className="text-sm text-ink-700">
              Post an operational question to the MAII officer community. Answers are moderated by department SPOCs and DPO desks.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-ink-500">
              <span className="chip border border-brand-100 bg-white text-brand-700">Median first response · 42 min</span>
              <span className="chip border border-ink-200 bg-white text-ink-600">Council-verified · Yes</span>
            </div>
            <button className="btn-primary mt-3 w-full !py-2 text-xs">
              Open community forum
            </button>
          </Card>

          {/* Suggest a new FAQ */}
          <Card>
            <CardHeader
              title="Suggest a new FAQ"
              subtitle="Routed to the MAII editorial desk within 2 working days"
              right={<PlusCircle className="h-4 w-4 text-brand-500" />}
            />
            <div className="space-y-3">
              <div>
                <label className="label">Your question</label>
                <textarea
                  className="input mt-1 min-h-[80px] resize-none"
                  placeholder="e.g. Can I run MAII against a departmental Oracle DB behind a VPN?"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="input">
                  {(CATEGORIES.filter((c) => c !== 'All') as string[]).map((c) => <option key={c}>{c}</option>)}
                </select>
                <select className="input">
                  <option>English</option>
                  <option>Marathi</option>
                  <option>Hindi</option>
                </select>
              </div>
              <button
                className="btn-primary w-full !py-2 text-xs"
                onClick={() => { setSubmitted(true); setSuggestion('') }}
                disabled={!suggestion.trim() && !submitted}
              >
                <Send className="h-3.5 w-3.5" /> {submitted ? 'Submitted — thank you' : 'Submit suggestion'}
              </button>
              <p className="text-[11px] text-ink-500">
                Suggestions are attributed to your service ID and audited under Governance → Contributions.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
