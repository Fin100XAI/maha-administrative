import { useMemo, useState } from 'react'
import { ScrollText, Sparkles, AlertTriangle, ArrowRight, Newspaper } from 'lucide-react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { KNOWLEDGE } from '@/data/knowledge'
import { KnowledgeResultCard } from '@/components/panels/KnowledgeResultCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { ChipStrip } from './_components/ChipStrip'
import { GR_BY_YEAR, GR_TOP_DEPTS, NEW_GRS_7D, AMENDMENT_TRACKER } from '@/data/knowledgeSamples'

const YEARS = ['All', '2026', '2025', '2024', '2023', '2022']

export function GRRepository() {
  const [year, setYear] = useState('All')

  const grs = useMemo(
    () => KNOWLEDGE.filter((k) => k.type === 'GR' && (year === 'All' || k.date.startsWith(year))),
    [year],
  )

  const yearOptions = YEARS.map((y) => ({
    value: y,
    label: y,
    count: y === 'All' ? undefined : GR_BY_YEAR.find((b) => b.year === Number(y))?.count,
  }))

  const latest = NEW_GRS_7D[0]

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Brain"
        icon={<ScrollText className="h-5 w-5" />}
        title="GR Repository"
        description="Government Resolutions issued by GoM departments — public-source linked to gr.maharashtra.gov.in."
        breadcrumb={['Knowledge Brain', 'GR Repository']}
        source="Public-source linked"
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="label mb-1.5">Filter by year</div>
            <ChipStrip options={yearOptions} value={year} onChange={setYear} />
          </div>
          <div className="text-xs text-ink-500">
            Showing <span className="font-semibold text-ink-800">{grs.length}</span> GRs · GR portal indexed nightly.
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-6">
          <ChartCard
            title="Top departments by GR volume"
            subtitle="Rolling last 24 months"
            source="Public-source linked"
            height={260}
          >
            <ResponsiveContainer>
              <BarChart data={GR_TOP_DEPTS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gr-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D81B60" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#4A148C" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="dept" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="grs" fill="url(#gr-bar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {grs.map((k) => <KnowledgeResultCard key={k.id} item={k} />)}
            {grs.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No GRs match this year filter.</div>}
          </div>
        </div>

        <div className="space-y-4">
          {/* Impact analysis */}
          <Card className="bg-brand-soft">
            <CardHeader
              title="Impact analysis — latest GR"
              subtitle={latest.id}
              right={<Sparkles className="h-4 w-4 text-brand-500" />}
            />
            <div className="text-sm font-semibold text-ink-900">{latest.title}</div>
            <div className="mt-1 text-xs text-ink-500">Effective {latest.date} · Owner: {latest.dept}</div>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" /><span>Supersedes GR-2024-URD-074 clauses 4.2–4.9 on beneficiary data standards.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" /><span>Estimated ~2.1L applications require re-verification within 90 days.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" /><span>27 district collectorates and 41 ULBs identified as primary implementers.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" /><span>DPDP consent artefact refresh triggered for beneficiary aggregators.</span></li>
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status="Approved" />
              <SourceBadge source="Public-source linked" />
              <button className="btn-outline ml-auto !px-3 !py-1.5 text-xs">
                Full impact brief <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>

          {/* New GRs ticker */}
          <Card>
            <CardHeader
              title="New GRs — last 7 days"
              subtitle="Auto-fetched from gr.maharashtra.gov.in"
              right={<Newspaper className="h-4 w-4 text-brand-500" />}
            />
            <ul className="space-y-2 text-sm">
              {NEW_GRS_7D.map((g, i) => (
                <motion.li
                  key={g.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start justify-between gap-3 rounded-md border border-ink-100 px-3 py-2 hover:border-brand-200"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">{g.id}</div>
                    <div className="line-clamp-2 text-ink-800" title={g.title}>{g.title}</div>
                    <div className="text-[11px] text-ink-500">{g.dept} · {g.date}</div>
                  </div>
                  <span className="chip shrink-0 border border-emerald-200 bg-emerald-50 text-emerald-700">New</span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {/* Amendment tracker */}
          <Card>
            <CardHeader
              title="Amendment tracker"
              subtitle="Supersession, amendment, and clarification links"
              right={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            />
            <ul className="space-y-3 text-sm">
              {AMENDMENT_TRACKER.map((a) => (
                <li key={a.parent} className="rounded-md border border-ink-100 p-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                    <span className="text-brand-700">{a.parent}</span>
                    <ArrowRight className="h-3 w-3 text-ink-400" />
                    <span className="text-ink-600">{a.amends}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`chip border ${
                        a.status === 'Supersedes'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : a.status === 'Amends'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : a.status === 'Withdrawn'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {a.status}
                    </span>
                    <span className="text-xs text-ink-500">Effective {a.effective}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-600">{a.summary}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3"><SourceBadge source="Public-source linked" /></div>
          </Card>
        </div>
      </div>
    </div>
  )
}
