import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ClassificationBadge, SourceBadge } from '@/components/ui/Badges'
import { Layers } from 'lucide-react'

const CATEGORIES = [
  { level: 'Public' as const, count: 82420, owner: 'GAD', access: 'All officers · Public web', retention: '10 years', hint: 'Government orders, GRs, notices' },
  { level: 'Internal' as const, count: 148230, owner: 'Dept-specific', access: 'Officers of dept + delegated', retention: '7 years', hint: 'Note sheets, internal circulars' },
  { level: 'Confidential' as const, count: 42180, owner: 'Dept + DIT', access: 'RBAC · roles ≥ US · MFA', retention: '10 years', hint: 'Cabinet notes, budget drafts' },
  { level: 'Secret' as const, count: 6120, owner: 'CS + Home', access: 'RBAC · roles ≥ ACS · MFA + break-glass', retention: '15 years', hint: 'Home affairs, security matters' },
  { level: 'Highly Restricted' as const, count: 1180, owner: 'CS + AI Gov', access: 'Named officers only · dual approval', retention: '25 years', hint: 'National security, intelligence' },
]

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
