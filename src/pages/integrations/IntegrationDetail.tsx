import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { INTEGRATIONS } from '@/data/integrations'
import {
  testStepsFor,
  SAMPLE_REQUEST,
  SAMPLE_RESPONSE,
  CHANGE_LOG,
  ENDPOINT_METRICS,
} from '@/data/platformSamples'
import {
  ExternalLink,
  Wifi,
  Lock,
  ClipboardCheck,
  User,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  FlaskConical,
  GitBranch,
  BarChart3,
  Code2,
} from 'lucide-react'

export function IntegrationDetail() {
  const { slug } = useParams<{ slug: string }>()
  const i = INTEGRATIONS.find((x) => x.slug === slug)
  if (!i) {
    return (
      <div className="text-sm text-ink-600">
        <PageHeader title="Integration not found" description="This connector is not in the registry." breadcrumb={['Integrations']} />
        <Link to="/integrations" className="btn-outline"><ChevronLeft className="h-4 w-4" /> Back to integrations</Link>
      </div>
    )
  }

  const steps = testStepsFor(i.slug)
  const passCount = steps.filter((s) => s.status === 'Pass').length

  return (
    <div>
      <PageHeader
        title={i.name}
        description={i.description}
        breadcrumb={['Integrations', i.name]}
        source={i.status === 'Connected' ? 'Live' : i.status === 'Public-source linked' ? 'Public-source linked' : 'Department API required'}
        actions={<>
          <Link to="/integrations" className="btn-outline"><ChevronLeft className="h-4 w-4" /> All integrations</Link>
          {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="btn-primary">Open portal <ExternalLink className="h-4 w-4" /></a>}
        </>}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Connector configuration" right={<StatusBadge status={i.status} />} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info k="Category" v={i.category} />
              <Info k="Access type" v={i.accessType} />
              <Info k="Data owner" v={i.dataOwner} />
              <Info k="Last sync" v={i.lastSync} />
              <Info k="Security" v={i.securityStatus} />
              <Info k="API health" v={i.apiHealth ? `${i.apiHealth}%` : '—'} />
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Test connection"
              subtitle={`${passCount} of ${steps.length} steps passed`}
              right={<div className="flex items-center gap-2"><FlaskConical className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <ol className="space-y-2 text-sm">
              {steps.map((s, idx) => (
                <motion.li
                  key={s.name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start justify-between gap-3 rounded-md border border-ink-100 px-3 py-2"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <StepIcon status={s.status} />
                    <div className="min-w-0">
                      <div className="font-medium text-ink-800">{idx + 1}. {s.name}</div>
                      <div className="truncate text-xs text-ink-500" title={s.detail}>{s.detail}</div>
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-ink-500">
                    <div className={
                      s.status === 'Pass' ? 'text-emerald-700' :
                      s.status === 'Fail' ? 'text-red-700' : 'text-ink-500'
                    }>{s.status}</div>
                    <div>{s.ms > 0 ? `${s.ms}ms` : '—'}</div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardHeader
              title="Sample request / response"
              subtitle="Illustrative payloads. Sensitive fields shown as placeholders."
              right={<div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="min-w-0">
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-500">Request</div>
                <pre className="max-h-64 overflow-auto rounded-md border border-ink-100 bg-ink-50/70 p-3 text-[11px] leading-relaxed text-ink-800">
{SAMPLE_REQUEST}
                </pre>
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-ink-500">Response</div>
                <pre className="max-h-64 overflow-auto rounded-md border border-ink-100 bg-ink-50/70 p-3 text-[11px] leading-relaxed text-ink-800">
{SAMPLE_RESPONSE}
                </pre>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Per-endpoint metrics"
              subtitle="Last 24 hours across the six busiest endpoints."
              right={<div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <div className="max-w-full overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink-500">
                    <th className="table-th">Endpoint</th>
                    <th className="table-th text-right">Calls · 24h</th>
                    <th className="table-th text-right">p95</th>
                    <th className="table-th text-right">Error rate</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINT_METRICS.map((m) => (
                    <tr key={m.endpoint} className="hover:bg-ink-50/40">
                      <td className="table-td font-mono text-xs text-ink-800">{m.endpoint}</td>
                      <td className="table-td text-right">{m.calls24h.toLocaleString()}</td>
                      <td className="table-td text-right">{m.p95ms}ms</td>
                      <td className={'table-td text-right ' + (m.errorRate > 0.3 ? 'text-red-700' : m.errorRate > 0.1 ? 'text-amber-700' : 'text-emerald-700')}>
                        {m.errorRate.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Required approvals" />
            <ul className="space-y-2 text-sm">
              {i.requiredApprovals.map((a) => (
                <li key={a} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">{a}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Data flow (illustrative)" />
            <ol className="space-y-2 text-sm">
              <li>1. Officer initiates workflow in MAII</li>
              <li>2. MAII API Gateway signs the request with department consent header</li>
              <li>3. Connector calls the source system with mTLS + JWT</li>
              <li>4. Response is DLP-scanned, classified, and returned</li>
              <li>5. Audit log written with hash of request/response</li>
            </ol>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Readiness score" />
            <div className="mt-1 text-4xl font-semibold text-ink-900">{i.connectorReadiness}%</div>
            <div className="mt-2 h-2 rounded bg-ink-100"><div className="h-full rounded bg-brand-gradient" style={{ width: `${i.connectorReadiness}%` }} /></div>
            <div className="mt-2 text-xs text-ink-500">Composite score across API access, security review and MoU status.</div>
          </Card>
          <Card>
            <CardHeader title="Public-source status" />
            <div className="flex flex-col gap-2 text-sm">
              <SourceBadge source={i.status === 'Connected' ? 'Live' : i.status === 'Public-source linked' ? 'Public-source linked' : 'Department API required'} />
              {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{i.url}</a>}
            </div>
          </Card>
          <Card>
            <CardHeader
              title="Change log"
              subtitle="Recent connector versions."
              right={<div className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
            />
            <ol className="relative space-y-3 border-l border-ink-100 pl-4 text-sm">
              {CHANGE_LOG.map((c) => (
                <li key={c.version} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand-gradient" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-ink-800">{c.version}</span>
                    <span className="text-xs text-ink-500">{c.date}</span>
                  </div>
                  <div className="text-xs text-ink-600">{c.note}</div>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <CardHeader title="Next steps" />
            <ul className="space-y-2 text-sm text-ink-700">
              <li className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand-500" /> Sign MoU with data owner</li>
              <li className="flex items-center gap-2"><Lock className="h-4 w-4 text-brand-500" /> Complete VAPT & DPO review</li>
              <li className="flex items-center gap-2"><Wifi className="h-4 w-4 text-brand-500" /> Register connector in API Gateway</li>
              <li className="flex items-center gap-2"><User className="h-4 w-4 text-brand-500" /> Nominate integration owner</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StepIcon({ status }: { status: 'Pass' | 'Fail' | 'Skipped' }) {
  if (status === 'Pass') return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
  if (status === 'Fail') return <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
  return <MinusCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs text-ink-500">{k}</div>
      <div className="font-medium text-ink-800">{v}</div>
    </div>
  )
}
