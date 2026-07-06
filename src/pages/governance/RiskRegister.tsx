import { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable, Column } from '@/components/ui/DataTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { EXTRA_RISKS, RiskRow } from '@/data/governanceSamples'

const BASE_RISKS: RiskRow[] = [
  { id: 'RISK-001', useCase: 'Marathi legal drafting', department: 'GAD', type: 'Hallucination', severity: 'Medium', probability: 22, mitigation: 'HITL mandatory + citation validator', owner: 'AI Gov Officer', status: 'Approved', reviewDate: '2026-08-01' },
  { id: 'RISK-002', useCase: 'FIR summarisation', department: 'HOME', type: 'Data Leakage', severity: 'High', probability: 34, mitigation: 'On-prem model only + PII redaction + DPO review', owner: 'DPO', status: 'Under Review', reviewDate: '2026-07-15' },
  { id: 'RISK-003', useCase: 'Beneficiary shortlisting', department: 'WCD', type: 'Bias', severity: 'High', probability: 28, mitigation: 'Fairness eval quarterly + reviewer panel', owner: 'AI Gov Officer', status: 'Open', reviewDate: '2026-07-25' },
  { id: 'RISK-004', useCase: 'External PDF upload', department: 'ALL', type: 'Prompt Injection', severity: 'Medium', probability: 41, mitigation: 'Sanitizer + isolated sandbox + rate limit', owner: 'AI SOC', status: 'Approved', reviewDate: '2026-08-10' },
  { id: 'RISK-005', useCase: 'Cabinet note distiller', department: 'GAD', type: 'Unauthorized Access', severity: 'Medium', probability: 12, mitigation: 'RBAC + audit + break-glass control', owner: 'IT Admin', status: 'Approved', reviewDate: '2026-08-05' },
  { id: 'RISK-006', useCase: 'Auto-approved disbursement', department: 'FIN', type: 'Wrong Recommendation', severity: 'High', probability: 18, mitigation: 'Never auto-approve > ₹5 Cr; HITL two reviewers', owner: 'CFO Cell', status: 'Approved', reviewDate: '2026-09-10' },
  { id: 'RISK-007', useCase: 'RTI reply drafts', department: 'ALL', type: 'Policy Non-Compliance', severity: 'Medium', probability: 20, mitigation: 'RTI Act 2005 policy prompt + reviewer', owner: 'AI Gov Officer', status: 'Approved', reviewDate: '2026-08-20' },
  { id: 'RISK-008', useCase: 'Consent draft AI', department: 'ALL', type: 'Privacy Violation', severity: 'Medium', probability: 14, mitigation: 'DPDP-aligned template + DPO sign-off', owner: 'DPO', status: 'Approved', reviewDate: '2026-08-01' },
  { id: 'RISK-009', useCase: 'Third-party plugin', department: 'ALL', type: 'Security Threat', severity: 'High', probability: 12, mitigation: 'Plugins disallowed except allow-list; VAPT before enable', owner: 'AI SOC', status: 'Under Review', reviewDate: '2026-07-15' },
]

const RISKS: RiskRow[] = [...BASE_RISKS, ...EXTRA_RISKS]

const CLOSURE_TREND = [
  { m: 'Feb', open: 12, closed: 6 },
  { m: 'Mar', open: 14, closed: 9 },
  { m: 'Apr', open: 13, closed: 10 },
  { m: 'May', open: 15, closed: 12 },
  { m: 'Jun', open: 11, closed: 14 },
  { m: 'Jul', open: 9, closed: 16 },
]

// Heatmap: 4 probability buckets × 4 severity buckets (Low..Critical)
const PROB_BUCKETS = [
  { label: '0–15%', min: 0, max: 15 },
  { label: '15–25%', min: 15, max: 25 },
  { label: '25–35%', min: 25, max: 35 },
  { label: '35%+', min: 35, max: 101 },
]
const SEV_BUCKETS: RiskRow['severity'][] = ['Low', 'Medium', 'High']

export function RiskRegister() {
  const columns: Column<RiskRow>[] = [
    { key: 'id', header: 'Risk ID', sortable: true },
    { key: 'useCase', header: 'Use case', sortable: true },
    { key: 'department', header: 'Dept', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'severity', header: 'Severity', sortable: true, render: (r) => <RiskBadge level={r.severity} /> },
    { key: 'probability', header: 'Prob.', sortable: true, render: (r) => <span>{r.probability}%</span> },
    { key: 'mitigation', header: 'Mitigation' },
    { key: 'owner', header: 'Owner' },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
    { key: 'reviewDate', header: 'Review', sortable: true },
  ]

  // Group risks into heatmap cells
  const heatmap = useMemo(() => {
    const grid: RiskRow[][][] = SEV_BUCKETS.map(() => PROB_BUCKETS.map(() => []))
    for (const r of RISKS) {
      const si = SEV_BUCKETS.indexOf(r.severity)
      const pi = PROB_BUCKETS.findIndex((b) => r.probability >= b.min && r.probability < b.max)
      if (si >= 0 && pi >= 0) grid[si][pi].push(r)
    }
    return grid
  }, [])

  return (
    <div>
      <PageHeader
        title="AI Risk Register"
        description="Enumerated AI risks per use case, with severity, probability, mitigation, owner and review cadence."
        breadcrumb={['Governance', 'Risk Register']}
        source="Demo"
      />

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="Risk heatmap"
            subtitle="Probability × Severity — dots represent individual RISKs"
            right={<SourceBadge source="Demo" />}
          />
          <div className="overflow-x-auto">
            <div className="grid min-w-[520px]" style={{ gridTemplateColumns: '120px repeat(4, minmax(0, 1fr))' }}>
              <div />
              {PROB_BUCKETS.map((b) => (
                <div key={b.label} className="pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-500">{b.label}</div>
              ))}
              {SEV_BUCKETS.slice().reverse().map((sev) => {
                const si = SEV_BUCKETS.indexOf(sev)
                return (
                  <div key={sev} className="contents">
                    <div className="flex items-center pr-3 text-xs font-semibold uppercase tracking-wide text-ink-500">{sev}</div>
                    {PROB_BUCKETS.map((_, pi) => {
                      const cell = heatmap[si][pi]
                      const intensity = Math.min(cell.length, 4)
                      const bg = ['bg-ink-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-400'][intensity]
                      return (
                        <div
                          key={sev + pi}
                          className={`m-0.5 flex min-h-[76px] flex-wrap items-start gap-1 rounded-lg border border-ink-100 p-2 ${bg}`}
                          title={`${sev} × ${PROB_BUCKETS[pi].label}: ${cell.length} risks`}
                        >
                          {cell.map((r) => (
                            <span
                              key={r.id}
                              title={`${r.id} · ${r.useCase}`}
                              className="chip border border-white/60 bg-white/80 !text-[10px] font-semibold text-ink-800 shadow-sm"
                            >
                              {r.id.replace('RISK-', '')}
                            </span>
                          ))}
                          {cell.length === 0 && <span className="text-[10px] text-ink-400">—</span>}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-500">
            <span>Density</span>
            {['bg-ink-50', 'bg-brand-100', 'bg-brand-200', 'bg-brand-300', 'bg-brand-400'].map((c, i) => (
              <span key={c} className={`inline-block h-3 w-6 rounded ${c} border border-ink-100`} title={`${i} risks`} />
            ))}
            <span>0 → 4+</span>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Risk closure trend"
            subtitle="Open vs closed — last 6 months"
            right={<SourceBadge source="Demo" />}
          />
          <div style={{ height: 260 }} className="w-full">
            <ResponsiveContainer>
              <AreaChart data={CLOSURE_TREND}>
                <defs>
                  <linearGradient id="rOpen" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#D81B60" stopOpacity={0.45}/><stop offset="100%" stopColor="#D81B60" stopOpacity={0.02}/></linearGradient>
                  <linearGradient id="rClosed" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4A148C" stopOpacity={0.45}/><stop offset="100%" stopColor="#4A148C" stopOpacity={0.02}/></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="open" stroke="#D81B60" fill="url(#rOpen)" />
                <Area type="monotone" dataKey="closed" stroke="#4A148C" fill="url(#rClosed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-600">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#D81B60]" /> Open</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#4A148C]" /> Closed</span>
          </div>
        </Card>
      </div>

      <DataTable columns={columns} rows={RISKS} searchKeys={['useCase', 'department', 'type', 'owner']} actions={<>
        <SourceBadge source="Demo" />
        <button className="btn-primary">Add risk</button>
      </>} />
    </div>
  )
}
