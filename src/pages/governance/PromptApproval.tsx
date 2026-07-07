import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from 'recharts'
import { CheckCircle2, XCircle, FileSearch, User, Clock, ListChecks, CircleCheck, Undo2, Inbox } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { REVIEWERS } from '@/data/governanceSamples'

type QueueStatus = 'Pending' | 'Assigned' | 'Approved' | 'Rejected'
interface QueueItem {
  name: string
  dept: string
  by: string
  risk: string
  at: string
  status: QueueStatus
}

const stages = [
  { s: 'Draft submitted', icon: FileSearch, desc: 'Prompt submitted with test cases' },
  { s: 'Risk scanned', icon: RiskIcon, desc: 'DLP + jailbreak + bias probes' },
  { s: 'Reviewer assigned', icon: User, desc: 'AI Governance Officer picks reviewer' },
  { s: 'Approved / Rejected', icon: CheckCircle2, desc: 'Decision recorded in registry' },
  { s: 'Published to library', icon: FileSearch, desc: 'Prompt visible in Prompt Library' },
]

function RiskIcon() { return <FileSearch className="h-4 w-4" /> }

const QUEUE: QueueItem[] = [
  { name: 'Marathi note tone strict-formal', dept: 'GAD', by: 'A. Deshmukh', risk: 'Medium', at: '2h ago', status: 'Pending' },
  { name: 'FIR sensitive redaction', dept: 'HOME', by: 'K. Rao', risk: 'High', at: '5h ago', status: 'Pending' },
  { name: 'Beneficiary shortlist explanation', dept: 'WCD', by: 'S. Mahale', risk: 'High', at: '1d ago', status: 'Pending' },
  { name: 'Talathi mutation query', dept: 'REV', by: 'M. Kore', risk: 'Medium', at: '1d ago', status: 'Pending' },
]

const SLA_BUCKETS = [
  { b: '< 2h', v: 34 },
  { b: '2–4h', v: 46 },
  { b: '4–8h', v: 28 },
  { b: '8–24h', v: 12 },
  { b: '> 24h', v: 4 },
]

const CHECKLIST = [
  { k: 'Prompt has explicit role + output format', done: true },
  { k: 'No PII or classified data in examples', done: true },
  { k: 'Jailbreak probes pass (10/10)', done: true },
  { k: 'Bias probes pass (fairness delta < 5%)', done: true },
  { k: 'Retrieval sources documented', done: true },
  { k: 'HITL policy compliance verified', done: false },
  { k: 'DPO sign-off (if High risk)', done: false },
  { k: 'Rollback plan filed', done: false },
]

export function PromptApproval() {
  const [queue, setQueue] = useState<QueueItem[]>(QUEUE)

  const setStatus = (name: string, status: QueueStatus) =>
    setQueue((q) => q.map((it) => (it.name === name ? { ...it, status } : it)))

  const active = useMemo(() => queue.filter((q) => q.status === 'Pending' || q.status === 'Assigned'), [queue])
  const resolved = useMemo(() => queue.filter((q) => q.status === 'Approved' || q.status === 'Rejected'), [queue])
  const pendingCount = active.length

  return (
    <div>
      <PageHeader
        title="Prompt Approval"
        description="Workflow for reviewing and approving prompts before they land in the Prompt Library."
        breadcrumb={['Governance', 'Prompt Approval']}
        source="Demo"
      />

      <Card className="mb-4">
        <CardHeader
          title="Active reviewers"
          subtitle="On-shift · SLA in flight"
          right={<SourceBadge source="Demo" />}
        />
        <div className="flex flex-wrap items-center gap-3">
          {REVIEWERS.map((r) => (
            <div key={r.name} className="flex min-w-0 items-center gap-2 rounded-full border border-ink-100 bg-white px-2.5 py-1.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-semibold text-white">{r.initials}</span>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-ink-800">{r.name}</div>
                <div className="truncate text-[10px] text-ink-500">{r.role} · queue {r.queue}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Approval pipeline" right={<SourceBadge source="Demo" />} />
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stages.map((s, i) => (
              <li key={s.s} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-brand-600 text-xs font-bold">{i+1}</span>
                  <div className="text-sm font-semibold text-ink-800">{s.s}</div>
                </div>
                <p className="mt-1 text-xs text-ink-500">{s.desc}</p>
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <CardHeader
            title="Approval queue"
            subtitle={`${pendingCount} awaiting decision · ${resolved.length} resolved`}
            right={<StatusBadge status={pendingCount > 0 ? 'Under Review' : 'Approved'} />}
          />
          <ul className="space-y-2">
            {active.map((q) => (
              <li key={q.name} className="flex flex-col gap-2 rounded-xl border border-ink-100 p-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-800">{q.name}</div>
                  <div className="text-xs text-ink-500">{q.dept} · submitted by {q.by} · {q.at}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge level={q.risk as any} />
                  {q.status === 'Assigned' && <StatusBadge status="Under Review" />}
                  <button
                    className="btn-outline"
                    onClick={() => setStatus(q.name, q.status === 'Assigned' ? 'Pending' : 'Assigned')}
                  >
                    <Clock className="h-4 w-4" /> {q.status === 'Assigned' ? 'Unassign' : 'Assign'}
                  </button>
                  <button className="btn-primary" onClick={() => setStatus(q.name, 'Approved')}><CheckCircle2 className="h-4 w-4" /> Approve</button>
                  <button className="btn-outline text-red-600" onClick={() => setStatus(q.name, 'Rejected')}><XCircle className="h-4 w-4" /> Reject</button>
                </div>
              </li>
            ))}
            {active.length === 0 && (
              <li className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-ink-200 bg-ink-50/40 p-6 text-center text-sm text-ink-500">
                <Inbox className="h-5 w-5 text-ink-400" />
                Queue clear — no prompts awaiting a decision.
              </li>
            )}
          </ul>

          {resolved.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-500">Resolved</div>
              <ul className="space-y-2">
                {resolved.map((q) => (
                  <li key={q.name} className="flex flex-col gap-2 rounded-xl border border-ink-100 bg-ink-50/40 p-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-ink-700">{q.name}</div>
                      <div className="text-xs text-ink-500">{q.dept} · submitted by {q.by} · {q.at}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={q.status} />
                      <button className="btn-outline" onClick={() => setStatus(q.name, 'Pending')}><Undo2 className="h-4 w-4" /> Undo</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader
            title="SLA tracker"
            subtitle="Distribution of review time — last 7 days"
            right={<SourceBadge source="Demo" />}
          />
          <div style={{ height: 220 }} className="w-full">
            <ResponsiveContainer>
              <BarChart data={SLA_BUCKETS}>
                <CartesianGrid vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="b" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} fill="#4285F4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-ink-100 p-2"><div className="text-lg font-semibold text-ink-900">3.1h</div><div className="text-[11px] text-ink-500">Median</div></div>
            <div className="rounded-lg border border-ink-100 p-2"><div className="text-lg font-semibold text-ink-900">92%</div><div className="text-[11px] text-ink-500">Within SLA</div></div>
            <div className="rounded-lg border border-ink-100 p-2"><div className="text-lg font-semibold text-ink-900">4</div><div className="text-[11px] text-ink-500">Breached</div></div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Review checklist"
            subtitle="Marathi note tone strict-formal · Assigned to A. Deshmukh"
            right={<div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-brand-500" /><SourceBadge source="Demo" /></div>}
          />
          <ul className="space-y-2">
            {CHECKLIST.map((c) => (
              <li
                key={c.k}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${c.done ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800' : 'border-ink-100 bg-white text-ink-700'}`}
              >
                <CircleCheck className={`h-4 w-4 shrink-0 ${c.done ? 'text-emerald-600' : 'text-ink-300'}`} />
                <span className="min-w-0 flex-1 truncate">{c.k}</span>
                <StatusBadge status={c.done ? 'Approved' : 'Under Review'} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
