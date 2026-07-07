import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
} from 'recharts'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'
import { ChartCard } from '@/components/ui/ChartCard'
import {
  ShieldQuestion,
  Users,
  Workflow,
  AlertTriangle,
  ClipboardCheck,
  Building2,
} from 'lucide-react'
import { RBAC_WORKFLOW, ROLE_USAGE, TOXIC_COMBOS, ROLE_BY_DEPT } from '@/data/platformSamples'

const ROLES = [
  'Chief Secretary', 'Principal Secretary', 'District Collector',
  'Municipal Commissioner', 'Department Officer', 'Section Officer',
  'IT Admin', 'AI Governance Officer', 'Security Officer', 'Data Protection Officer',
]

const MODULES = [
  'AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops',
  'Audit Logs', 'RBAC', 'Encryption', 'Integrations',
]

const grid: Record<string, string[]> = {
  'Chief Secretary': ['AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops', 'Audit Logs'],
  'Principal Secretary': ['AI Workspace', 'Governance', 'Model Registry', 'Prompt Registry', 'DPDP', 'Security Ops'],
  'District Collector': ['AI Workspace', 'Governance', 'DPDP'],
  'Municipal Commissioner': ['AI Workspace', 'Governance'],
  'Department Officer': ['AI Workspace', 'Governance'],
  'Section Officer': ['AI Workspace'],
  'IT Admin': ['RBAC', 'Encryption', 'Integrations', 'Audit Logs', 'Security Ops'],
  'AI Governance Officer': ['Governance', 'Model Registry', 'Prompt Registry', 'DPDP'],
  'Security Officer': ['Security Ops', 'Audit Logs', 'RBAC'],
  'Data Protection Officer': ['DPDP', 'Audit Logs', 'RBAC'],
}

export function RBAC() {
  const campaignPct = 68
  return (
    <div>
      <PageHeader
        title="RBAC"
        description="Role-based access control matrix — least-privilege by default, with data-classification limits and approval authority."
        breadcrumb={['Platform Admin', 'RBAC']}
        source="Demo"
        eyebrow="Access control"
        icon={<ShieldQuestion className="h-5 w-5" />}
      />

      <Card>
        <CardHeader title="Role x Module matrix" right={<SourceBadge source="Demo" />} />
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="min-w-max text-xs">
            <thead>
              <tr>
                <th className="table-th sticky left-0 z-10 bg-ink-50/90 whitespace-nowrap">Role</th>
                {MODULES.map((m) => (
                  <th key={m} className="table-th whitespace-nowrap text-center">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r}>
                  <td className="table-td sticky left-0 z-10 bg-white whitespace-nowrap font-medium text-ink-800">
                    {r}
                  </td>
                  {MODULES.map((m) => (
                    <td key={m} className="table-td text-center">
                      {grid[r]?.includes(m)
                        ? <span className="text-emerald-600">*</span>
                        : <span className="text-ink-300">o</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role provisioning workflow */}
      <Card className="mt-6">
        <CardHeader
          title="Role provisioning workflow"
          subtitle="Request -> Review -> Approve -> Provision -> Certify"
          right={<div className="flex items-center gap-2"><Workflow className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {RBAC_WORKFLOW.map((step, idx) => (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="relative rounded-xl border border-ink-100 bg-white p-3"
            >
              <div className="absolute -top-2 left-3 rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                Step {idx + 1}
              </div>
              <div className="mt-1 font-semibold text-ink-800">{step.step}</div>
              <div className="text-xs text-ink-600">Owner · {step.owner}</div>
              <div className="mt-1 text-[11px] text-ink-500">SLA · {step.sla}</div>
            </motion.li>
          ))}
        </ol>
      </Card>

      {/* Role usage + Toxic combinations */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard
          title="Role usage frequency"
          subtitle="Monthly active officers per role."
          source="Demo"
        >
          <ResponsiveContainer>
            <BarChart data={ROLE_USAGE} layout="vertical" margin={{ left: 32 }}>
              <CartesianGrid horizontal={false} stroke="#eef2f7" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="role" width={160} tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="activeMonthly" name="Active/mo" fill="#0B57D0" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Toxic combinations (SoD)"
            subtitle="Segregation-of-duties conflicts detected."
            right={<div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {TOXIC_COMBOS.map((c) => (
              <li key={c.pair} className="rounded-md border border-ink-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink-800">{c.pair}</span>
                  <RiskBadge level={c.risk} />
                </div>
                <div className="mt-1 text-xs text-ink-600">{c.detail}</div>
                <div className="mt-1 text-xs">
                  <span className={c.found > 0 ? 'text-red-700' : 'text-emerald-700'}>
                    {c.found} officer(s) currently affected
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Per-department role distribution + Access review campaign */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader
            title="Per-department role distribution"
            subtitle="Distinct roles in use per department."
            right={<div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2 text-sm">
            {ROLE_BY_DEPT.map((d) => (
              <li key={d.dept} className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="chip border-ink-200 bg-white text-ink-700">{d.dept}</span>
                    <span className="truncate text-xs text-ink-500">{d.officers.toLocaleString()} officers</span>
                  </div>
                  <span className="font-medium text-ink-800">{d.distinctRoles} roles</span>
                </div>
                <div className="h-1.5 rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${(d.distinctRoles / 10) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Access review campaign · Q2 FY26"
            subtitle="Quarterly certification of active officer access."
            right={<div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <div className="text-4xl font-semibold text-ink-900">{campaignPct}%</div>
          <div className="mt-1 text-xs text-ink-500">Officers certified so far</div>
          <div className="mt-3 h-2 rounded bg-ink-100">
            <div className="h-full rounded bg-brand-gradient" style={{ width: `${campaignPct}%` }} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink-500">Officers in scope</dt><dd>44,192</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Certified</dt><dd className="text-emerald-700">30,052</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Access revoked</dt><dd className="text-red-700">418</dd></div>
            <div className="flex justify-between"><dt className="text-ink-500">Campaign closes</dt><dd>2026-08-31</dd></div>
          </dl>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Data access rules" right={<ShieldQuestion className="h-4 w-4 text-brand-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>Classification-aware read/write</li>
            <li>Break-glass with dual approval</li>
            <li>Time-boxed elevation only</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Approval authority" right={<Users className="h-4 w-4 text-brand-500" />} />
          <ul className="space-y-2 text-sm text-ink-700">
            <li>SO submits · US reviews · DS decides · PS/CS approves</li>
            <li>DPO for privacy-sensitive AI use cases</li>
            <li>AI Governance Officer for prompts/models</li>
          </ul>
        </Card>
        <Card>
          <CardHeader title="Admin controls" />
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>User provisioning</span><StatusBadge status="Approved" /></li>
            <li className="flex justify-between"><span>Access reviews</span><StatusBadge status="Under Review" /></li>
            <li className="flex justify-between"><span>SoD violations</span><StatusBadge status="Resolved" /></li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
