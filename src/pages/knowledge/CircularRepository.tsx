import { useMemo, useState } from 'react'
import { Mail, BellRing, Link2, CheckCircle2, ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'
import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ChipStrip } from './_components/ChipStrip'
import { CIRCULAR_CATEGORIES, ACKNOWLEDGEMENT_QUEUE, CIRCULAR_SOP_LINKS } from '@/data/knowledgeSamples'

const CATEGORIES = ['All', 'Operational', 'Advisory', 'Directive', 'Clarificatory']

export function CircularRepository() {
  const [category, setCategory] = useState('All')
  const [email, setEmail] = useState('officer@maharashtra.gov.in')
  const [freq, setFreq] = useState('daily')
  const [subscribed, setSubscribed] = useState(false)

  const items = useMemo(() => KNOWLEDGE.filter((k) => k.type === 'Circular'), [])

  const catOptions = CATEGORIES.map((c) => ({
    value: c,
    label: c,
    count: c === 'All' ? undefined : CIRCULAR_CATEGORIES.find((x) => x.category === c)?.count,
  }))

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<Mail className="h-5 w-5" />}
        title="Circular Repository"
        description="Departmental circulars — routing, deadlines, and action points auto-parsed by MAII."
        breadcrumb={['Knowledge Brain', 'Circular Repository']}
        source="Demo"
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="label mb-1.5">Filter by category</div>
            <ChipStrip options={catOptions} value={category} onChange={setCategory} />
          </div>
          <div className="text-xs text-ink-500">
            Category = MAII-inferred intent · human-reviewable in Governance.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
          {items.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No circulars indexed yet.</div>}
        </div>

        <div className="space-y-4">
          {/* Requires acknowledgement */}
          <Card>
            <CardHeader
              title="Circulars requiring acknowledgement"
              subtitle="Officer read-receipt tracking"
              right={<ClipboardList className="h-4 w-4 text-brand-500" />}
            />
            <ul className="space-y-3 text-sm">
              {ACKNOWLEDGEMENT_QUEUE.map((c, i) => {
                const pct = Math.round((c.ackd / c.officers) * 100)
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-md border border-ink-100 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{c.id}</div>
                        <div className="line-clamp-2 font-medium text-ink-800" title={c.title}>{c.title}</div>
                        <div className="text-[11px] text-ink-500">{c.dept} · due {c.due}</div>
                      </div>
                      <span className="chip shrink-0 border border-amber-200 bg-amber-50 text-amber-700">Due</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
                      <span>{c.ackd.toLocaleString()} of {c.officers.toLocaleString()} officers</span>
                      <span className="tabular-nums font-semibold text-ink-800">{pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                    </div>
                  </motion.li>
                )
              })}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>

          {/* Subscribe/notify */}
          <Card className="bg-brand-soft">
            <CardHeader
              title="Subscribe to circular alerts"
              subtitle="Personal digest across the departments you follow"
              right={<BellRing className="h-4 w-4 text-brand-500" />}
            />
            <div className="space-y-3">
              <div>
                <label className="label">Delivery email</label>
                <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">Frequency</label>
                <div className="mt-1 inline-flex overflow-hidden rounded-full border border-ink-200 bg-white p-0.5">
                  {['instant', 'daily', 'weekly'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFreq(f)}
                      className={`chip !rounded-full !px-3 !py-1 text-xs capitalize ${
                        freq === f ? 'bg-brand-gradient text-white shadow-glow' : 'text-ink-600 hover:text-brand-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['UDD', 'HFW', 'FIN', 'DIT', 'HOME'].map((d) => (
                  <span key={d} className="chip border border-brand-100 bg-white text-brand-700">{d}</span>
                ))}
              </div>
              <button
                className="btn-primary w-full !py-2 text-xs"
                onClick={() => setSubscribed(true)}
              >
                {subscribed ? (<><CheckCircle2 className="h-3.5 w-3.5" /> Subscribed</>) : 'Subscribe'}
              </button>
              <p className="text-[11px] text-ink-500">
                Alerts route via secure GoM mailer; DPDP-classified circulars are digest-only, never previewed inline.
              </p>
            </div>
          </Card>

          {/* Circulars with SOPs */}
          <Card>
            <CardHeader
              title="Circulars with attached SOPs"
              subtitle="Cross-reference — click a circular to see its bundled SOPs"
              right={<Link2 className="h-4 w-4 text-brand-500" />}
            />
            <ul className="space-y-3 text-sm">
              {CIRCULAR_SOP_LINKS.map((row) => (
                <li key={row.circular} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{row.circular}</div>
                      <div className="truncate text-ink-800" title={row.circularTitle}>{row.circularTitle}</div>
                    </div>
                    <StatusBadge status="Linked" />
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-ink-600">
                    {row.sops.map((s) => (
                      <li key={s} className="flex items-center gap-1.5">
                        <Link2 className="h-3 w-3 text-brand-400" />
                        <span className="truncate" title={s}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Demo" /></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
