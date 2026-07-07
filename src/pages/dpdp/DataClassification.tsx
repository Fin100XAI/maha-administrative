import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { ClassificationBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Layers, GitBranch, ArrowRight, RefreshCcw } from 'lucide-react'
import { CLASSIFIER_ACCURACY, DEPT_CLASS_COVERAGE, RECLASS_REQUESTS } from '@/data/dpdpSamples'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Cell } from 'recharts'

const CATEGORIES = [
  { level: 'Public' as const, count: 82420, owner: 'GAD', access: 'All officers - Public web', retention: '10 years', hint: 'Government orders, GRs, notices' },
  { level: 'Internal' as const, count: 148230, owner: 'Dept-specific', access: 'Officers of dept + delegated', retention: '7 years', hint: 'Note sheets, internal circulars' },
  { level: 'Confidential' as const, count: 42180, owner: 'Dept + DIT', access: 'RBAC - roles >= US - MFA', retention: '10 years', hint: 'Cabinet notes, budget drafts' },
  { level: 'Secret' as const, count: 6120, owner: 'CS + Home', access: 'RBAC - roles >= ACS - MFA + break-glass', retention: '15 years', hint: 'Home affairs, security matters' },
  { level: 'Highly Restricted' as const, count: 1180, owner: 'CS + AI Gov', access: 'Named officers only - dual approval', retention: '25 years', hint: 'National security, intelligence' },
]

// Colour ramp for coverage bar based on percentage.
function coverageColor(v: number): string {
  if (v >= 92) return '#10b981'
  if (v >= 85) return '#0B57D0'
  if (v >= 80) return '#f59e0b'
  return '#ef4444'
}

interface DecisionNode {
  q: string
  yes?: DecisionNode | string
  no?: DecisionNode | string
}

const DECISION_TREE: DecisionNode = {
  q: 'Contains named citizen PII or PHI?',
  yes: {
    q: 'Aggregated + k-anonymised (k >= 5)?',
    yes: 'Internal',
    no: {
      q: 'Cabinet, security or intelligence context?',
      yes: {
        q: 'Named individual + national security?',
        yes: 'Highly Restricted',
        no: 'Secret',
      },
      no: 'Confidential',
    },
  },
  no: {
    q: 'Published as GR / notice / open-data?',
    yes: 'Public',
    no: 'Internal',
  },
}

function TreeNode({ node, depth = 0 }: { node: DecisionNode | string; depth?: number }) {
  if (typeof node === 'string') {
    return (
      <div className="ml-2 flex items-center gap-2 rounded-md border border-brand-100 bg-brand-soft/60 px-2 py-1">
        <ArrowRight className="h-3 w-3 text-brand-500" />
        <ClassificationBadge level={node} />
      </div>
    )
  }
  return (
    <div className={depth === 0 ? '' : 'ml-4 border-l border-dashed border-ink-200 pl-4'}>
      <div className="mb-2 rounded-md border border-ink-100 bg-white px-2 py-1 text-xs font-medium text-ink-800">
        {node.q}
      </div>
      <div className="ml-2 space-y-2">
        {node.yes && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Yes</div>
            <TreeNode node={node.yes} depth={depth + 1} />
          </div>
        )}
        {node.no && (
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-500">No</div>
            <TreeNode node={node.no} depth={depth + 1} />
          </div>
        )}
      </div>
    </div>
  )
}

export function DataClassification() {
  return (
    <div>
      <PageHeader
        title="Data Classification"
        description="Uniform classification, ownership, access rules and retention policy across MAII data."
        breadcrumb={['DPDP', 'Data Classification']}
        source="Demo"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {CATEGORIES.map((c) => (
          <Card key={c.level}>
            <div className="flex items-start justify-between">
              <div>
                <ClassificationBadge level={c.level} />
                <div className="mt-2 text-2xl font-semibold text-ink-900">{c.count.toLocaleString()}</div>
                <div className="text-xs text-ink-500">records</div>
              </div>
              <Layers className="h-5 w-5 text-brand-500" />
            </div>
            <ul className="mt-3 space-y-1 text-xs text-ink-700">
              <li><span className="text-ink-500">Owner:</span> {c.owner}</li>
              <li><span className="text-ink-500">Access:</span> {c.access}</li>
              <li><span className="text-ink-500">Retention:</span> {c.retention}</li>
              <li className="text-ink-500">{c.hint}</li>
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_1fr]">
        <Card>
          <CardHeader
            title="Classification decision tree"
            subtitle="How the auto-classifier picks a label"
            right={<GitBranch className="h-4 w-4 text-brand-500" />}
          />
          <div className="overflow-x-auto pb-1">
            <div className="min-w-[420px]">
              <TreeNode node={DECISION_TREE} />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Auto-classifier accuracy"
            subtitle="Rolling 90-day cross-validated accuracy per class"
            right={<SourceBadge source="Demo" />}
          />
          <ul className="space-y-3">
            {CLASSIFIER_ACCURACY.map((r) => (
              <li key={r.level}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <ClassificationBadge level={r.level} />
                  <span className="font-mono text-ink-700">{r.accuracy.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-ink-100">
                  <div
                    className="h-full rounded"
                    style={{ width: `${r.accuracy}%`, background: coverageColor(r.accuracy) }}
                  />
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-widest text-ink-400">n = {r.samples.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <ChartCard title="Classification coverage by department" subtitle="% of assets with a valid classification label" source="Demo" height={280}>
          <ResponsiveContainer>
            <BarChart data={DEPT_CLASS_COVERAGE} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="coverage" radius={[6, 6, 0, 0]}>
                {DEPT_CLASS_COVERAGE.map((d) => (
                  <Cell key={d.dept} fill={coverageColor(d.coverage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader
            title="Reclassification requests"
            subtitle="Pending DPO + AI Governance approval"
            right={<RefreshCcw className="h-4 w-4 text-brand-500" />}
          />
          <ul className="space-y-2">
            {RECLASS_REQUESTS.map((r) => (
              <li key={r.id} className="rounded-md border border-ink-100 px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink-800">{r.asset}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-ink-500">
                      <ClassificationBadge level={r.from} />
                      <ArrowRight className="h-3 w-3 text-ink-400" />
                      <ClassificationBadge level={r.to} />
                    </div>
                    <div className="mt-1 text-xs text-ink-500 truncate">
                      {r.id} - {r.requester} - raised {r.raised}
                    </div>
                  </div>
                  <StatusBadge status="Under Review" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Classification policy at a glance" right={<SourceBadge source="Public-source linked" />} />
        <ol className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          {[
            'Every document is auto-scanned on ingest and gets a classification label.',
            'Confidential and above cannot be routed to non-sovereign models.',
            'Reclassification requires DPO + AI Governance Officer approval.',
            'Access denials, retention overrides, and break-glass events are audited.',
          ].map((l, i) => (
            <li key={i} className="rounded-md border border-ink-100 px-3 py-2 text-ink-700">{l}</li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
