import { BookOpen, Globe, Quote, Scale, Sparkles, Download, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, ConfidenceBadge, StatusBadge } from '@/components/ui/Badges'
import { PUBLIC_SOURCES } from '@/data/publicSources'

export function ResearchAssistant() {
  return (
    <div>
      <PageHeader
        title="Research Assistant"
        description="Policy research across public web sources, state and international benchmarks, and scheme comparisons — with citations, confidence and source status."
        breadcrumb={['Administrative AI', 'Research Assistant']}
        source="Public-source linked"
        actions={<>
          <button className="btn-outline"><Download className="h-4 w-4"/> Generate report</button>
          <button className="btn-primary"><Sparkles className="h-4 w-4"/> Ask MAII</button>
        </>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Research question" />
          <textarea rows={3} className="input resize-none" defaultValue="Compare Maharashtra, Karnataka, and Tamil Nadu on beneficiary verification approaches under state urban housing schemes; identify DPDP-aligned best practices." />
          <div className="mt-3 flex flex-wrap gap-2">
            {['Compare states', 'International benchmarks', 'Scheme comparison', 'Policy timeline'].map((t) => (
              <button key={t} className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-600 hover:bg-ink-50">{t}</button>
            ))}
          </div>

          <div className="mt-5">
            <div className="section-title mb-2">Public web sources considered</div>
            <ul className="space-y-2">
              {PUBLIC_SOURCES.slice(0, 6).map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 p-3">
                  <div className="min-w-0">
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-ink-800 hover:text-brand-600">
                      {s.name} <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="mt-0.5 text-xs text-ink-500">{s.authority} · {s.accessType}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <SourceBadge source={s.status === 'Live' ? 'Live' : s.status === 'Linked' ? 'Public-source linked' : 'Department API required'} />
                    <span className="text-[10px] text-ink-500">Checked {s.lastChecked}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Findings" subtitle="Synthesised across public sources · human-review advised" right={<div className="flex gap-2"><ConfidenceBadge score={82} /><SourceBadge source="Public-source linked" /></div>} />
            <ol className="space-y-3 text-sm text-ink-700">
              <li><Quote className="mr-1 inline h-3 w-3 text-brand-500" /> <b>Maharashtra:</b> Aadhaar e-KYC + MahaDBT cross-check; 7-day grievance committee — this GR.</li>
              <li><Quote className="mr-1 inline h-3 w-3 text-brand-500" /> <b>Karnataka:</b> Aadhaar + BhoomiRTC cross-verification; 15-day grievance timeline (public policy briefs).</li>
              <li><Quote className="mr-1 inline h-3 w-3 text-brand-500" /> <b>Tamil Nadu:</b> Aadhaar + TNeGA UID linkage; DPDP-aligned consent framework (public policy briefs).</li>
              <li><Quote className="mr-1 inline h-3 w-3 text-brand-500" /> <b>International:</b> UK's DWP model uses tiered verification; Estonia's X-Road consent-first model (OECD reports).</li>
            </ol>
            <div className="mt-3 rounded-md border border-brand-200 bg-brand-soft p-3 text-xs text-ink-700">
              <b>Recommendation:</b> Adopt tiered verification with DPDP-aligned consent artifacts; align appeal window with GR-2025-URD-092.
            </div>
          </Card>

          <Card>
            <CardHeader title="Citations" right={<StatusBadge status="Under Review" />} />
            <ul className="space-y-1 text-xs text-ink-700">
              <li>[1] gr.maharashtra.gov.in — GR-2026-URD-118 · Public-source linked</li>
              <li>[2] indiaai.gov.in — Policy briefs on scheme verification · Live</li>
              <li>[3] meity.gov.in — DPDP Act reference · Public-source linked</li>
              <li>[4] niti.gov.in — State comparison policy paper (2025) · Public-source linked</li>
              <li>[5] cert-in.org.in — Advisory on citizen data handling · Public-source linked</li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Confidence & risk" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-ink-500">Source coverage</div>
                <div className="mt-1 text-lg font-semibold text-ink-900">Broad — 6 public sources</div>
              </div>
              <div>
                <div className="text-xs text-ink-500">Human review</div>
                <div className="mt-1 text-lg font-semibold text-ink-900">Advised</div>
              </div>
              <div>
                <div className="text-xs text-ink-500">Risk of hallucination</div>
                <div className="mt-1 text-lg font-semibold text-amber-600">Medium</div>
              </div>
              <div>
                <div className="text-xs text-ink-500">Fact-check gate</div>
                <div className="mt-1 text-lg font-semibold text-emerald-600">Passed</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
