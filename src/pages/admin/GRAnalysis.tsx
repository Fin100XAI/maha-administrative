import { useMemo, useState } from 'react'
import { Upload, Search, Link2, FileSearch, AlertTriangle, Calendar, Building2, Users, IndianRupee, ClipboardCheck, ScrollText, Save, Send, Printer } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge, ConfidenceBadge } from '@/components/ui/Badges'
import { GR_UPLOADS } from '@/data/adminSamples'
import { UploadsTable } from './_components/UploadsTable'
import { CompareDiff, DiffRow } from './_components/CompareDiff'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const DIFF_ROWS: DiffRow[] = [
  {
    clause: 'Clause 3.1',
    kind: 'modified',
    left: 'Aadhaar e-KYC is recommended for beneficiary applications.',
    right: 'Aadhaar e-KYC is MANDATORY for all beneficiary applications, along with consent artefact under DPDP Act.',
  },
  {
    clause: 'Clause 4.2',
    kind: 'modified',
    left: 'MahaDBT cross-check within 30 days of application receipt.',
    right: 'MahaDBT cross-check within 15 days of application receipt.',
  },
  {
    clause: 'Clause 5.1',
    kind: 'added',
    left: '',
    right: 'District Grievance Committee to be notified within 7 days of publication.',
  },
  {
    clause: 'Clause 6.3',
    kind: 'unchanged',
    left: 'Financial outlay unchanged; disbursement via DBT.',
    right: 'Financial outlay unchanged; disbursement via DBT.',
  },
  {
    clause: 'Clause 7.1',
    kind: 'removed',
    left: 'Manual verification by ULB inspector permitted as fallback.',
    right: '',
  },
]

const GR_REPO = [
  'GR-2026-URD-118 · PMAY-U 2.0 Beneficiary Verification',
  'GR-2025-URD-092 · PMAY-U Grievance SOP',
  'GR-2024-URD-074 · Municipal Housing Data Standards',
  'GR-2025-RD-058 · Rural Migrant Domicile Relaxation',
  'GR-2023-URD-045 · Aadhaar Consent Framework',
  'GR-2026-FIN-011 · DBT Disbursement Guidelines',
]

export function GRAnalysis() {
  const [tab, setTab] = useState<'upload' | 'link' | 'search'>('upload')
  const [repoQuery, setRepoQuery] = useState('')

  const repoResults = useMemo(
    () =>
      GR_REPO.filter((r) => r.toLowerCase().includes(repoQuery.trim().toLowerCase())),
    [repoQuery],
  )

  return (
    <div>
      <PageHeader
        title="GR Analysis"
        description="Upload a Government Resolution, paste its public link, or search the GR repository — MAII will extract clauses, obligations, and impact."
        breadcrumb={['Administrative AI', 'GR Analysis']}
        source="Public-source linked"
        eyebrow="Resolution"
        icon={<ScrollText className="h-5 w-5" />}
        actions={
          <>
            <button className="btn-outline"><FileSearch className="h-4 w-4" /> View extracted clauses</button>
            <button className="btn-primary"><ClipboardCheck className="h-4 w-4" /> Generate compliance checklist</button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-ink-100 pb-3">
            {[
              { k: 'upload' as const, label: 'Upload GR PDF', icon: Upload },
              { k: 'link' as const, label: 'Paste GR link', icon: Link2 },
              { k: 'search' as const, label: 'Search repository', icon: Search },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${tab === t.k ? 'bg-brand-soft text-brand-700' : 'text-ink-600 hover:bg-ink-50'}`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'upload' && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10 text-center">
              <Upload className="mb-2 h-8 w-8 text-ink-400" />
              <div className="text-sm font-medium text-ink-700">Drop a GR PDF here, or click to browse</div>
              <div className="mt-1 text-xs text-ink-500">PDF · Marathi / Hindi / English · Up to 40 MB</div>
              <input type="file" className="hidden" />
            </label>
          )}
          {tab === 'link' && (
            <div>
              <label className="label">Paste public GR URL</label>
              <input className="input mt-1" defaultValue="https://gr.maharashtra.gov.in/…/URD/GR-2026-URD-118.pdf" />
              <div className="mt-2 text-xs text-ink-500">Public-source linked to Maharashtra GR portal.</div>
            </div>
          )}
          {tab === 'search' && (
            <div>
              <label className="label">Search GR repository</label>
              <div className="mt-1 flex gap-2">
                <input
                  className="input"
                  placeholder="e.g. PMAY-U 2.0 verification…"
                  value={repoQuery}
                  onChange={(e) => setRepoQuery(e.target.value)}
                />
                <button className="btn-primary"><Search className="h-4 w-4" /> Search</button>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                {repoResults.map((r) => (
                  <div key={r} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <span className="text-ink-800">{r}</span>
                    <button className="btn-ghost text-xs">Open →</button>
                  </div>
                ))}
                {repoResults.length === 0 && (
                  <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50/40 p-6 text-center text-ink-500">
                    No GRs match "{repoQuery}".
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Detected metadata</div>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-ink-500">GR Number</dt><dd className="font-medium text-ink-800">GR-2026-URD-118</dd></div>
              <div><dt className="text-ink-500">Department</dt><dd className="font-medium text-ink-800">Urban Development</dd></div>
              <div><dt className="text-ink-500">Effective from</dt><dd className="font-medium text-ink-800">04-Jul-2026</dd></div>
              <div><dt className="text-ink-500">Language</dt><dd className="font-medium text-ink-800">Marathi + English</dd></div>
              <div><dt className="text-ink-500">Pages</dt><dd className="font-medium text-ink-800">12</dd></div>
              <div><dt className="text-ink-500">Amendment tracker</dt><dd className="font-medium text-ink-800">Supersedes GR-2024-URD-074</dd></div>
            </dl>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Info title="Effective Date" icon={<Calendar className="h-4 w-4" />} value="04-Jul-2026" hint="Applies immediately" />
            <Info title="Responsible Dept" icon={<Building2 className="h-4 w-4" />} value="Urban Development" hint="Coordinated with MahaDBT" />
            <Info title="Deadline" icon={<Calendar className="h-4 w-4" />} value="11-Jul-2026" hint="Committee formation" />
            <Info title="Compliance Risk" icon={<AlertTriangle className="h-4 w-4" />} value="Medium" hint="Rural migrant clarification" />
            <Info title="Citizen Impact" icon={<Users className="h-4 w-4" />} value="~ 4.2 L households" hint="Public-source estimate" />
            <Info title="Financial" icon={<IndianRupee className="h-4 w-4" />} value="Neutral" hint="Within FY 2026-27 outlay" />
          </div>

          <Card>
            <CardHeader title="Summary" subtitle="MAII AI · Confidence 91%" right={<ConfidenceBadge score={91} />} />
            <p className="text-sm text-ink-700">
              The GR introduces a revised beneficiary verification workflow for PMAY-U 2.0. It mandates Aadhaar-based e-KYC, MahaDBT
              cross-verification of income proof within 15 days, and constitution of a district-level grievance redressal committee by
              the Collector within 7 days of publication.
            </p>
          </Card>

          <Card>
            <CardHeader title="Key clauses" right={<SourceBadge source="Public-source linked" />} />
            <ol className="space-y-2 text-sm text-ink-700">
              <li>• Clause 3.1 — Aadhaar e-KYC mandatory for all beneficiary applications.</li>
              <li>• Clause 4.2 — MahaDBT cross-check within 15 days of application receipt.</li>
              <li>• Clause 5.1 — District Grievance Committee to be notified in 7 days.</li>
              <li>• Clause 6.3 — Financial outlay unchanged; disbursement via DBT.</li>
              <li>• Clause 8.2 — Applicable to all municipal corporations and councils.</li>
            </ol>
          </Card>

          <Card>
            <CardHeader title="Compliance checklist" right={<StatusBadge status="Open" />} />
            <ul className="space-y-2 text-sm">
              {[
                { t: 'Nominate District Nodal Officer', s: 'Approved' as const },
                { t: 'Constitute grievance committee (7-day rule)', s: 'Under Review' as const },
                { t: 'Confirm MahaDBT API access', s: 'Open' as const },
                { t: 'Circulate SOP to ULB commissioners', s: 'Open' as const },
                { t: 'Publish citizen advisory in vernacular', s: 'Open' as const },
              ].map((r) => (
                <li key={r.t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <span className="text-ink-700">{r.t}</span>
                  <StatusBadge status={r.s} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Related GRs & amendments" />
            <ul className="space-y-2 text-sm">
              {[
                { id: 'GR-2024-URD-074', t: 'Municipal Housing Data Standards', note: 'Superseded by this GR' },
                { id: 'GR-2025-URD-092', t: 'Grievance SOP for PMAY-U', note: 'Referenced in Clause 5.2' },
                { id: 'GR-2023-URD-045', t: 'Aadhaar Consent Framework', note: 'Prerequisite for Clause 3.1' },
              ].map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{r.id} · {r.t}</div>
                    <div className="text-xs text-ink-500">{r.note}</div>
                  </div>
                  <SourceBadge source="Public-source linked" />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="AI risk flag" right={<RiskBadge level="Medium" />} />
            <p className="text-sm text-ink-700">The GR text does not explicitly address rural-migrant applicants who lack local domicile proof. Recommend clarificatory circular to prevent implementation ambiguity.</p>
          </Card>
        </div>
      </div>

      {/* Compare two GRs */}
      <div className="mt-6">
        <CompareDiff
          leftLabel="Baseline · GR-2024-URD-074"
          rightLabel="Current · GR-2026-URD-118"
          rows={DIFF_ROWS}
          title="Compare two GRs"
          subtitle="Clause-level diff between the superseded GR and the current one"
        />
      </div>

      {/* Recent uploads + quick actions + shortcuts */}
      <div className="mt-6 space-y-6">
        <UploadsTable rows={GR_UPLOADS} subtitle="Government Resolutions uploaded across departments" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <QuickActions
            actions={[
              { label: 'Save GR analysis', icon: <Save className="h-4 w-4" /> },
              { label: 'Send checklist to nodal officer', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy link to analysis', icon: <Link2 className="h-4 w-4" /> },
              { label: 'Print summary', icon: <Printer className="h-4 w-4" /> },
            ]}
          />
          <Shortcuts
            items={[
              { keys: '⌘ K', label: 'Search GR repository' },
              { keys: '⌘ U', label: 'Upload new GR' },
              { keys: '⌘ D', label: 'Toggle compare-with-previous' },
              { keys: '⌘ ⇧ C', label: 'Generate compliance checklist' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

function Info({ title, icon, value, hint }: { title: string; icon: any; value: string; hint?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-500">{icon}{title}</div>
      <div className="mt-1 text-lg font-semibold text-ink-900">{value}</div>
      {hint && <div className="text-xs text-ink-500">{hint}</div>}
    </div>
  )
}
