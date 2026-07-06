import { Upload, ListChecks, Bell, MapPin, ClipboardCheck, Calendar, Megaphone, Save, Send, Link2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge, SourceBadge } from '@/components/ui/Badges'
import { CIRCULAR_UPLOADS } from '@/data/adminSamples'
import { UploadsTable } from './_components/UploadsTable'
import { CompareDiff, DiffRow } from './_components/CompareDiff'
import { QuickActions } from './_components/QuickActions'
import { Shortcuts } from './_components/Shortcuts'

const CIRCULAR_DIFF: DiffRow[] = [
  {
    clause: 'Para 2 · Nodal officer',
    kind: 'modified',
    left: 'Departments to identify a nodal officer at their convenience.',
    right: 'Departments to nominate a nodal officer (not below Dy. Secretary) by 12-Jul-2026.',
  },
  {
    clause: 'Para 3 · DPO training',
    kind: 'added',
    left: '',
    right: 'DPO training on DPDP consent lifecycle mandatory by 22-Jul-2026.',
  },
  {
    clause: 'Para 4 · Publish advisory',
    kind: 'unchanged',
    left: 'Vernacular citizen advisory to be published on portal.',
    right: 'Vernacular citizen advisory to be published on portal.',
  },
  {
    clause: 'Para 5 · Manual audit',
    kind: 'removed',
    left: 'Departments may conduct RBAC audit at year-end.',
    right: '',
  },
]

export function CircularAnalysis() {
  return (
    <div>
      <PageHeader
        title="Circular Analysis"
        description="Extract action points from circulars, map responsible officers, and track implementation status."
        breadcrumb={['Administrative AI', 'Circular Analysis']}
        source="Public-source linked"
        eyebrow="Circular"
        icon={<Megaphone className="h-5 w-5" />}
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

      {/* Compare two circulars */}
      <div className="mt-6">
        <CompareDiff
          leftLabel="Prior · DIT/CIR/2026/05/17"
          rightLabel="Current · DIT/CIR/2026/07/22"
          rows={CIRCULAR_DIFF}
          title="Compare with previous circular"
          subtitle="Highlights what changed between the two DIT circulars"
        />
      </div>

      {/* Recent uploads + quick actions + shortcuts */}
      <div className="mt-6 space-y-6">
        <UploadsTable rows={CIRCULAR_UPLOADS} subtitle="Circulars uploaded across departments this week" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <QuickActions
            actions={[
              { label: 'Save extracted actions', icon: <Save className="h-4 w-4" /> },
              { label: 'Broadcast to district officers', icon: <Send className="h-4 w-4" />, primary: true },
              { label: 'Copy link to circular', icon: <Link2 className="h-4 w-4" /> },
              { label: 'Notify DPO', icon: <Bell className="h-4 w-4" /> },
            ]}
          />
          <Shortcuts
            items={[
              { keys: '⌘ K', label: 'Search circulars' },
              { keys: '⌘ U', label: 'Upload circular' },
              { keys: '⌘ M', label: 'Map officers to actions' },
              { keys: '⌘ ⇧ D', label: 'Toggle compare with prior' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
