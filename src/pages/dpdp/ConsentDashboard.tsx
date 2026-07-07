import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard } from '@/components/ui/MetricCard'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, Column } from '@/components/ui/DataTable'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Cookie, XCircle, Clock, Users, FileText, Layers, ArrowRight } from 'lucide-react'
import { CONSENT_PURPOSES, CONSENT_FUNNEL } from '@/data/dpdpSamples'

interface Row {
  id: string
  purpose: string
  principal: string
  dept: string
  status: 'Active' | 'Withdrawn' | 'Expired' | 'Under Review'
  granted: string
  expires: string
}

const rows: Row[] = [
  { id: 'CN-8241', purpose: 'PMAY-U 2.0 eligibility verification', principal: 'Citizen - household', dept: 'UDD', status: 'Active', granted: '2026-03-14', expires: '2027-03-13' },
  { id: 'CN-8240', purpose: 'MahaDBT scheme onboarding', principal: 'Citizen - individual', dept: 'PLN', status: 'Active', granted: '2026-03-12', expires: '2027-03-11' },
  { id: 'CN-8239', purpose: 'e-HRMS transfer optimiser', principal: 'Employee - officer', dept: 'GAD', status: 'Under Review', granted: '2026-05-01', expires: '2026-11-01' },
  { id: 'CN-8238', purpose: 'RTI reply drafting', principal: 'Citizen - applicant', dept: 'ALL', status: 'Active', granted: '2026-06-04', expires: '2027-06-03' },
  { id: 'CN-8237', purpose: 'Vaccination reminder', principal: 'Citizen - household', dept: 'HFW', status: 'Withdrawn', granted: '2025-11-14', expires: '2026-11-14' },
  { id: 'CN-8236', purpose: 'Crop-loss appeal drafting', principal: 'Citizen - farmer', dept: 'AGR', status: 'Expired', granted: '2025-05-14', expires: '2026-05-14' },
  { id: 'CN-8235', purpose: 'Aaple Sarkar concierge', principal: 'Citizen - individual', dept: 'GAD', status: 'Active', granted: '2026-06-18', expires: '2027-06-17' },
  { id: 'CN-8234', purpose: 'e-Fasal Bima claim', principal: 'Citizen - farmer', dept: 'AGR', status: 'Active', granted: '2026-05-22', expires: '2027-05-21' },
  { id: 'CN-8233', purpose: 'Widow-pension disbursal', principal: 'Citizen - individual', dept: 'WCD', status: 'Active', granted: '2026-04-10', expires: '2027-04-09' },
  { id: 'CN-8232', purpose: 'Clinical decision support', principal: 'Patient - individual', dept: 'HFW', status: 'Under Review', granted: '2026-06-25', expires: '2026-12-25' },
  { id: 'CN-8231', purpose: 'Note-sheet drafting', principal: 'Employee - officer', dept: 'GAD', status: 'Active', granted: '2026-02-08', expires: '2027-02-07' },
  { id: 'CN-8230', purpose: 'e-KYC re-verification', principal: 'Citizen - individual', dept: 'REV', status: 'Withdrawn', granted: '2025-12-01', expires: '2026-12-01' },
]

// Max value for funnel width normalisation.
const FUNNEL_MAX = Math.max(...CONSENT_FUNNEL.map((s) => s.value))
const FUNNEL_COLORS = ['from-google-blue-500 to-google-blue-600', 'from-brand-500 to-brand-600', 'from-brand-600 to-brand-700', 'from-emerald-500 to-emerald-600', 'from-red-400 to-red-500']

export function ConsentDashboard() {
  const columns: Column<Row>[] = [
    { key: 'id', header: 'Consent ID', sortable: true },
    { key: 'purpose', header: 'Purpose' },
    { key: 'principal', header: 'Data principal' },
    { key: 'dept', header: 'Dept owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status as any} /> },
    { key: 'granted', header: 'Granted', sortable: true },
    { key: 'expires', header: 'Expires', sortable: true },
  ]
  return (
    <div>
      <PageHeader
        title="Consent Dashboard"
        description="DPDP-aligned consent records, withdrawal requests, expiry, and principal categorisation."
        breadcrumb={['DPDP', 'Consent Dashboard']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Active consents" value="1.24 L" icon={<Cookie className="h-5 w-5" />} delta={5.2} source="Demo" confidence={86} />
        <MetricCard label="Withdrawn (24h)" value={42} icon={<XCircle className="h-5 w-5" />} delta={-8} source="Demo" confidence={90} />
        <MetricCard label="Expiring in 30 days" value={318} icon={<Clock className="h-5 w-5" />} delta={0} source="Demo" confidence={86} />
        <MetricCard label="Distinct principals" value="4.62 L" icon={<Users className="h-5 w-5" />} delta={4.2} source="Demo" confidence={80} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="Consent purpose taxonomy"
            subtitle="12 purposes categorised for DPDP notice + register"
            right={<Layers className="h-4 w-4 text-brand-500" />}
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {CONSENT_PURPOSES.map((g) => (
              <div key={g.group} className="rounded-xl border border-ink-100 p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">{g.group}</div>
                <ul className="space-y-1 text-sm text-ink-700">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <span className="truncate">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Consent lifecycle funnel"
            subtitle="Requested to Granted to Active to Renewed or Withdrawn"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-3">
            {CONSENT_FUNNEL.map((s, i) => {
              const pct = Math.round((s.value / FUNNEL_MAX) * 100)
              const rate = i === 0 ? 100 : Math.round((s.value / CONSENT_FUNNEL[0].value) * 100)
              return (
                <li key={s.stage}>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="font-medium text-ink-800">{s.stage}</span>
                    <span className="text-ink-500">{s.value.toLocaleString()} <span className="text-ink-400">({rate}%)</span></span>
                  </div>
                  <div className="h-3 overflow-hidden rounded bg-ink-100">
                    <div className={`h-full rounded bg-gradient-to-r ${FUNNEL_COLORS[i % FUNNEL_COLORS.length]}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 rounded-md border border-dashed border-ink-200 px-3 py-2 text-xs text-ink-500">
            Withdrawal rate below 5% - consistent with DPDP Sec 6(4) - free-and-easy withdrawal expectation.
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Consent artifact preview"
          subtitle="Template CN-TMPL-14 - what the citizen sees + signs"
          right={<div className="flex items-center gap-2"><SourceBadge source="Demo" /><FileText className="h-4 w-4 text-brand-500" /></div>}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_1fr]">
          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <div className="flex items-center justify-between border-b border-dashed border-ink-200 pb-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-ink-500">Consent Notice</div>
                <div className="text-sm font-semibold text-ink-900">PMAY-U 2.0 - Beneficiary verification</div>
              </div>
              <StatusBadge status="Active" />
            </div>
            <div className="mt-3 space-y-3 text-sm text-ink-800">
              <p><span className="font-semibold">Data Fiduciary:</span> Directorate of IT, GoM (MAH-DF-2024-0018)</p>
              <p><span className="font-semibold">Data collected:</span> Name, Aadhaar (masked - XXXX XXXX 1234), address, household composition, income proof reference.</p>
              <p><span className="font-semibold">Purpose:</span> Verify eligibility for PMAY-U 2.0 subsidy against the MahaDBT beneficiary registry.</p>
              <p><span className="font-semibold">Retention:</span> 5 years from disbursement or scheme closure.</p>
              <p><span className="font-semibold">Your rights:</span> Access, correction, erasure, grievance redressal via Aaple Sarkar or dpo-cell***@maharashtra.gov.in.</p>
              <p className="text-xs text-ink-500">You may withdraw this consent at any time. Withdrawal will not affect processing done before withdrawal.</p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink-200 pt-2 text-xs text-ink-500">
              <span>Language: Marathi + English</span>
              <span>Version: CN-TMPL-14</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">Template metadata</div>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between border-b border-ink-100 pb-1"><dt className="text-ink-500">Reading grade</dt><dd className="font-medium">Class 8</dd></div>
              <div className="flex justify-between border-b border-ink-100 pb-1"><dt className="text-ink-500">Languages</dt><dd className="font-medium">Marathi, English, Hindi</dd></div>
              <div className="flex justify-between border-b border-ink-100 pb-1"><dt className="text-ink-500">Consent mode</dt><dd className="font-medium">Opt-in (explicit)</dd></div>
              <div className="flex justify-between border-b border-ink-100 pb-1"><dt className="text-ink-500">Withdrawal path</dt><dd className="font-medium">Aaple Sarkar - 1 click</dd></div>
              <div className="flex justify-between border-b border-ink-100 pb-1"><dt className="text-ink-500">Legal basis</dt><dd className="font-medium">Sec 6 + Sec 7(b)</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Last DPO review</dt><dd className="font-medium">2026-06-30</dd></div>
            </dl>
            <div className="mt-3 flex items-center gap-2 text-xs text-brand-600">
              <ArrowRight className="h-3.5 w-3.5" />
              Preview stored with SHA-256 fingerprint per issued copy.
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <DataTable columns={columns} rows={rows} searchKeys={['purpose', 'principal', 'dept']} actions={<><SourceBadge source="Demo" /><button className="btn-primary">Create consent template</button></>} />
      </div>
    </div>
  )
}
