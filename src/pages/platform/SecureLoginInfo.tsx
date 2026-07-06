import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { StatusBadge, SourceBadge, RiskBadge } from '@/components/ui/Badges'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  KeyRound,
  Fingerprint,
  ClipboardList,
  Server,
  Lock,
  Users,
  Siren,
} from 'lucide-react'
import { ROLES } from '@/data/departments'
import { LOGIN_ATTEMPTS_7D, OFFICER_SESSIONS, AUTH_METHODS, LOGIN_ANOMALIES } from '@/data/platformSamples'

export function SecureLoginInfo() {
  return (
    <div>
      <PageHeader
        title="Secure Login"
        description="Government-grade officer sign-in — MFA, RBAC, audit logging, encryption and on-prem readiness."
        breadcrumb={['Platform Admin', 'Secure Login']}
        source="Demo"
        eyebrow="Identity posture"
        icon={<Fingerprint className="h-5 w-5" />}
        actions={<Link to="/login" className="btn-primary">Go to sign-in</Link>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { icon: ShieldCheck, t: 'Zero Trust', d: 'Continuous verification of device, user, location and session risk.' },
          { icon: KeyRound, t: 'MFA · NIC', d: '6-digit TOTP via NIC MFA. Fallback via SMS DLT.' },
          { icon: Fingerprint, t: 'RBAC · Least privilege', d: 'Roles bound to ministry-level restrictions and file-classification limits.' },
          { icon: ClipboardList, t: 'Audit logging', d: 'Immutable append-only log for every action, decision and API call.' },
          { icon: Lock, t: 'Encryption', d: 'AES-256 at rest, TLS 1.3 in transit, HSM-backed key management.' },
          { icon: Server, t: 'On-Prem ready', d: 'Deployable on MeghRaj / State Data Centre, with air-gapped option.' },
        ].map((f) => (
          <Card key={f.t}>
            <div className="flex items-center gap-2 text-brand-500"><f.icon className="h-4 w-4" /><span className="section-title text-ink-800">{f.t}</span></div>
            <p className="mt-2 text-sm text-ink-700">{f.d}</p>
            <div className="mt-2"><StatusBadge status="Approved" /></div>
          </Card>
        ))}
      </div>

      {/* Login attempts analytics */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <ChartCard
          title="Login attempts · last 7 days"
          subtitle="Successful vs failed vs MFA-blocked."
          source="Demo"
        >
          <ResponsiveContainer>
            <BarChart data={LOGIN_ATTEMPTS_7D} barCategoryGap="24%">
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="success"    name="Success"    fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="failed"     name="Failed"     fill="#F59E0B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="mfaBlocked" name="MFA-blocked" fill="#D81B60" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Login anomalies"
            subtitle="Signals raised by the Zero Trust engine."
            right={<div className="flex items-center gap-2"><Siren className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-3 text-sm">
            {LOGIN_ANOMALIES.map((a) => (
              <motion.li
                key={a.ts + a.officer}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-md border border-ink-100 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-ink-500">{a.ts}</span>
                  <RiskBadge level="High" />
                </div>
                <div className="mt-1 font-mono text-xs text-ink-800">{a.officer}</div>
                <div className="text-sm text-ink-700">{a.reason}</div>
                <div className="mt-1 text-xs text-ink-500">Action · {a.action}</div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Officer session snapshot */}
      <Card className="mt-6">
        <CardHeader
          title="Officer session snapshot"
          subtitle="10 active officer sessions right now."
          right={<div className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
        />
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="table-th">Officer</th>
                <th className="table-th">Role</th>
                <th className="table-th">Device</th>
                <th className="table-th">Location</th>
                <th className="table-th">Since</th>
                <th className="table-th">Duration</th>
              </tr>
            </thead>
            <tbody>
              {OFFICER_SESSIONS.map((s) => (
                <tr key={s.officer} className="hover:bg-ink-50/40">
                  <td className="table-td font-mono text-xs text-ink-800">{s.officer}</td>
                  <td className="table-td">{s.role}</td>
                  <td className="table-td text-ink-700">{s.device}</td>
                  <td className="table-td text-ink-700">{s.location}</td>
                  <td className="table-td">{s.since}</td>
                  <td className="table-td">{s.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Supported auth method matrix */}
      <Card className="mt-6">
        <CardHeader
          title="Supported authentication methods"
          subtitle="Rollout across the officer base."
          right={<SourceBadge source="Demo" />}
        />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {AUTH_METHODS.map((m) => (
            <li key={m.method} className="rounded-md border border-ink-100 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-ink-800">{m.method}</span>
                <StatusBadge status={m.status === 'Live' ? 'Live' : m.status === 'Pilot' ? 'Under Review' : 'Draft'} />
              </div>
              <div className="mt-1 text-xs text-ink-500">{m.note}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className="h-1.5 flex-1 rounded bg-ink-100">
                  <div className="h-full rounded bg-brand-gradient" style={{ width: `${m.rollout}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right font-medium text-ink-700">{m.rollout}%</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <CardHeader title="Supported officer roles" right={<SourceBadge source="Demo" />} />
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => <span key={r} className="chip border border-ink-200 bg-white text-ink-700">{r}</span>)}
        </div>
      </Card>
    </div>
  )
}
