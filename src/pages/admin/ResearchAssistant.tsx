import { useState } from 'react'
import { BookOpen, Globe, Quote, Scale, Download, ExternalLink, Building2, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, ConfidenceBadge, StatusBadge } from '@/components/ui/Badges'
import { exportPagePdf } from '@/lib/exportUtils'
import { PUBLIC_SOURCES } from '@/data/publicSources'
import { RELATED_DEPARTMENTS, SIMILAR_RESEARCH } from '@/data/adminSamples'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

type Finding = { label: string; body: string }

const RESEARCH_MODES = ['Compare states', 'International benchmarks', 'Scheme comparison', 'Policy timeline'] as const

// Each segmented mode drives the Findings + recommendation shown below.
const FINDINGS: Record<(typeof RESEARCH_MODES)[number], { findings: Finding[]; recommendation: string }> = {
  'Compare states': {
    findings: [
      { label: 'Maharashtra', body: 'Aadhaar e-KYC + MahaDBT cross-check; 7-day grievance committee — this GR.' },
      { label: 'Karnataka', body: 'Aadhaar + BhoomiRTC cross-verification; 15-day grievance timeline (public policy briefs).' },
      { label: 'Tamil Nadu', body: 'Aadhaar + TNeGA UID linkage; DPDP-aligned consent framework (public policy briefs).' },
      { label: 'International', body: "UK's DWP model uses tiered verification; Estonia's X-Road consent-first model (OECD reports)." },
    ],
    recommendation: 'Adopt tiered verification with DPDP-aligned consent artifacts; align appeal window with GR-2025-URD-092.',
  },
  'International benchmarks': {
    findings: [
      { label: 'United Kingdom', body: 'DWP tiered risk-based verification — low-risk applicants auto-cleared, high-risk routed to manual review.' },
      { label: 'Estonia', body: 'X-Road consent-first data exchange; citizens see every access to their records (OECD digital-gov reports).' },
      { label: 'Singapore', body: 'MyInfo single source of verified attributes; consent captured per data-pull (public GovTech briefs).' },
      { label: 'OECD takeaway', body: 'Consent-first + audit transparency correlate with higher citizen trust and lower grievance volume.' },
    ],
    recommendation: 'Layer an X-Road-style access-transparency log over MahaDBT so citizens can audit every verification pull.',
  },
  'Scheme comparison': {
    findings: [
      { label: 'PMAY-U 2.0 (this GR)', body: 'Aadhaar e-KYC mandatory; MahaDBT cross-check within 15 days; DBT disbursement.' },
      { label: 'PM-KISAN', body: 'Aadhaar-seeded beneficiary list; state-level physical verification of land records.' },
      { label: 'Fasal Bima', body: 'e-Fasal survey + insurer cross-check; appeal window explicitly defined at 30 days.' },
      { label: 'Gap', body: 'PMAY-U 2.0 lacks the explicit appeal window that Fasal Bima defines — a likely source of grievances.' },
    ],
    recommendation: 'Import Fasal Bima\'s 30-day appeal-window clause into the PMAY-U 2.0 verification SOP.',
  },
  'Policy timeline': {
    findings: [
      { label: '2023', body: 'DPDP Act enacted — consent artefacts become the legal basis for beneficiary data processing.' },
      { label: '2024', body: 'GR-2024-URD-074 sets municipal housing data standards (now superseded).' },
      { label: '2025', body: 'GR-2025-URD-092 issues the PMAY-U grievance SOP; 15-day timelines introduced.' },
      { label: '2026', body: 'GR-2026-URD-118 mandates Aadhaar e-KYC and 7-day district grievance committees — this GR.' },
    ],
    recommendation: 'Track the 2023→2026 tightening trend; the next revision should codify appeal windows and access-transparency.',
  },
}

export function ResearchAssistant() {
  const [mode, setMode] = useState<(typeof RESEARCH_MODES)[number]>('Compare states')
  const active = FINDINGS[mode]

  return (
    <div>
      <PageHeader
        title="Research Assistant"
        description="Policy research across public web sources, state and international benchmarks, and scheme comparisons — with citations, confidence and source status."
        breadcrumb={['Administrative AI', 'Research Assistant']}
        source="Public-source linked"
        eyebrow="Research"
        icon={<BookOpen className="h-5 w-5" />}
        actions={<>
          <button onClick={() => exportPagePdf('Research Assistant')} className="btn-outline"><Download className="h-4 w-4"/> Generate report</button>
          <button className="btn-primary"><Send className="h-4 w-4"/> Ask MAII</button>
        </>}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Research question" />
          <textarea rows={3} className="input resize-none" defaultValue="Compare Maharashtra, Karnataka, and Tamil Nadu on beneficiary verification approaches under state urban housing schemes; identify DPDP-aligned best practices." />
          <div className="mt-3 flex flex-wrap gap-2">
            {RESEARCH_MODES.map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  mode === t
                    ? 'border-brand-400 bg-brand-soft text-brand-700'
                    : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                }`}
              >
                {t}
              </button>
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
            <CardHeader title="Findings" subtitle={`${mode} · synthesised across public sources · human-review advised`} right={<div className="flex gap-2"><ConfidenceBadge score={82} /><SourceBadge source="Public-source linked" /></div>} />
            <ol className="space-y-3 text-sm text-ink-700">
              {active.findings.map((f) => (
                <li key={f.label}><Quote className="mr-1 inline h-3 w-3 text-brand-500" /> <b>{f.label}:</b> {f.body}</li>
              ))}
            </ol>
            <div className="mt-3 rounded-md border border-brand-200 bg-brand-soft p-3 text-xs text-ink-700">
              <b>Recommendation:</b> {active.recommendation}
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
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
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

      {/* Related resources */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Related departments"
            subtitle="Departments to loop in on this research"
            right={
              <div className="flex items-center gap-2">
                <SourceBadge source="Demo" />
                <Building2 className="h-4 w-4 text-brand-500" />
              </div>
            }
          />
          <ul className="space-y-2 text-sm">
            {RELATED_DEPARTMENTS.map((d) => (
              <li key={d.code} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-800">{d.code} · {d.name}</div>
                  <div className="mt-0.5 text-xs text-ink-500">{d.why}</div>
                </div>
                <button className="btn-ghost text-xs">Loop in →</button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Similar past research"
            subtitle="Prior MAII research the current question overlaps with"
            right={
              <div className="flex items-center gap-2">
                <SourceBadge source="Demo" />
                <Globe className="h-4 w-4 text-brand-500" />
              </div>
            }
          />
          <ul className="space-y-2 text-sm">
            {SIMILAR_RESEARCH.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink-800">{r.title}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-ink-500">
                    <span>{r.by}</span>
                    <span>·</span>
                    <span>{r.when}</span>
                    {r.tags.map((tag) => (
                      <span key={tag} className="chip border border-ink-200 bg-ink-50 text-[10px] text-ink-600">{tag}</span>
                    ))}
                  </div>
                </div>
                <button className="btn-ghost text-xs">Open →</button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Quick actions + shortcuts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <QuickActions
          actions={[
            { label: 'Save research', icon: <Save className="h-4 w-4" /> },
            { label: 'Send report to PS', icon: <Send className="h-4 w-4" />, primary: true },
            { label: 'Copy citations', icon: <Link2 className="h-4 w-4" /> },
            { label: 'Cross-reference legal', icon: <Scale className="h-4 w-4" /> },
          ]}
        />
        <Shortcuts
          items={[
            { keys: '⌘ ↵', label: 'Run research query' },
            { keys: '⌘ K', label: 'Command palette' },
            { keys: '⌘ E', label: 'Export report (DOCX)' },
            { keys: '⌘ ⇧ C', label: 'Copy all citations' },
          ]}
        />
      </div>
    </div>
  )
}
