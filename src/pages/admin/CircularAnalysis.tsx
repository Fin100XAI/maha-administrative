import { Upload, ListChecks, Bell, MapPin, ClipboardCheck, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'

export function CircularAnalysis() {
  return (
    <div>
      <PageHeader
        title="Circular Analysis"
        description="Extract action points from circulars, map responsible officers, and track implementation status."
        breadcrumb={['Administrative AI', 'Circular Analysis']}
        source="Public-source linked"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_1fr]">
        <Card>
          <CardHeader title="Upload circular" subtitle="PDF · DOCX · Marathi / Hindi / English" />
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/40 p-10">
            <Upload className="mb-2 h-8 w-8 text-ink-400" />
            <div className="text-sm font-medium text-ink-700">Drop circular here or click to browse</div>
            <div className="mt-1 text-xs text-ink-500">MAII will detect deadlines, actions, responsible officers</div>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-outline"><ListChecks className="h-4 w-4" /> Extract action points</button>
            <button className="btn-outline"><Bell className="h-4 w-4" /> Draft notification</button>
            <button className="btn-outline"><ClipboardCheck className="h-4 w-4" /> Compliance checklist</button>
            <button className="btn-primary"><MapPin className="h-4 w-4" /> Map officers</button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Action points" subtitle="Extracted from Circular DIT/CIR/2026/07/22" right={<SourceBadge source="Demo" />} />
            <ul className="space-y-2 text-sm">
              {[
                { t: 'Nominate district AI nodal officer', by: 'Collectors', d: '12-Jul-2026', s: 'Open' as const },
                { t: 'Complete DPO training on DPDP consent lifecycle', by: 'All Depts', d: '22-Jul-2026', s: 'Under Review' as const },
                { t: 'Publish citizen advisory in vernacular', by: 'GAD', d: '15-Jul-2026', s: 'Open' as const },
                { t: 'Audit RBAC roles in secretariat modules', by: 'DIT', d: '30-Jul-2026', s: 'Approved' as const },
              ].map((a) => (
                <li key={a.t} className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink-800">{a.t}</div>
                    <div className="text-xs text-ink-500">Owner: {a.by} · Deadline: {a.d}</div>
                  </div>
                  <StatusBadge status={a.s} />
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Deadlines" right={<Calendar className="h-4 w-4 text-brand-500" />} />
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Nomination of nodal officer</span><span className="font-medium">12-Jul</span></li>
                <li className="flex justify-between"><span>Citizen advisory</span><span className="font-medium">15-Jul</span></li>
                <li className="flex justify-between"><span>DPO training</span><span className="font-medium">22-Jul</span></li>
                <li className="flex justify-between"><span>RBAC audit</span><span className="font-medium">30-Jul</span></li>
              </ul>
            </Card>
            <Card>
              <CardHeader title="Implementation status" right={<StatusBadge status="Under Review" />} />
              <div className="text-sm text-ink-700">4 of 6 action points assigned. Awaiting district-level roll-up.</div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-[62%] rounded-full bg-brand-gradient" />
              </div>
              <div className="mt-1 text-xs text-ink-500">62% implementation coverage</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
