import { CheckCircle2, XCircle, FileSearch, User, Clock } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { RiskBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'

const stages = [
  { s: 'Draft submitted', icon: FileSearch, desc: 'Prompt submitted with test cases' },
  { s: 'Risk scanned', icon: RiskIcon, desc: 'DLP + jailbreak + bias probes' },
  { s: 'Reviewer assigned', icon: User, desc: 'AI Governance Officer picks reviewer' },
  { s: 'Approved / Rejected', icon: CheckCircle2, desc: 'Decision recorded in registry' },
  { s: 'Published to library', icon: FileSearch, desc: 'Prompt visible in Prompt Library' },
]

function RiskIcon() { return <FileSearch className="h-4 w-4" /> }

const QUEUE = [
  { name: 'Marathi note tone strict-formal', dept: 'GAD', by: 'A. Deshmukh', risk: 'Medium', at: '2h ago' },
  { name: 'FIR sensitive redaction', dept: 'HOME', by: 'K. Rao', risk: 'High', at: '5h ago' },
  { name: 'Beneficiary shortlist explanation', dept: 'WCD', by: 'S. Mahale', risk: 'High', at: '1d ago' },
  { name: 'Talathi mutation query', dept: 'REV', by: 'M. Kore', risk: 'Medium', at: '1d ago' },
]

export function PromptApproval() {
  return (
    <div>
      <PageHeader
        title="Prompt Approval"
        description="Workflow for reviewing and approving prompts before they land in the Prompt Library."
        breadcrumb={['Governance', 'Prompt Approval']}
        source="Demo"
      />
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
          <CardHeader title="Approval queue" right={<StatusBadge status="Under Review" />} />
          <ul className="space-y-2">
            {QUEUE.map((q) => (
              <li key={q.name} className="flex flex-col gap-2 rounded-xl border border-ink-100 p-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-800">{q.name}</div>
                  <div className="text-xs text-ink-500">{q.dept} · submitted by {q.by} · {q.at}</div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={q.risk as any} />
                  <button className="btn-outline"><Clock className="h-4 w-4" /> Assign</button>
                  <button className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                  <button className="btn-outline text-red-600"><XCircle className="h-4 w-4" /> Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
