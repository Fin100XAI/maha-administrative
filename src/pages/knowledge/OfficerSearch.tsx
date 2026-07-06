import { useState } from 'react'
import { Search, User2, Building2, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge, StatusBadge } from '@/components/ui/Badges'

const OFFICERS = [
  { name: 'Rajesh Mahajan', role: 'Principal Secretary (IT)', dept: 'DIT', posting: 'Mantralaya, Mumbai', service: 'IAS-2011-MH-0182' },
  { name: 'Nitin Kareer', role: 'Chief Secretary', dept: 'GAD', posting: 'Mantralaya, Mumbai', service: 'IAS-1985-MH-0021' },
  { name: 'Milind Mhaiskar', role: 'Principal Secretary (UDD)', dept: 'UDD', posting: 'Mantralaya, Mumbai', service: 'IAS-1993-MH-0058' },
  { name: 'Praveen Darade', role: 'District Collector', dept: 'REV', posting: 'Aurangabad', service: 'IAS-2013-MH-0244' },
  { name: 'Ashutosh Salil', role: 'Municipal Commissioner', dept: 'UDD', posting: 'Nashik', service: 'IAS-2014-MH-0273' },
  { name: 'S. Kadam', role: 'Data Protection Officer', dept: 'HFW', posting: 'Pune', service: 'MPSC-2014-0812' },
]

export function OfficerSearch() {
  const [q, setQ] = useState('')
  const filtered = OFFICERS.filter((o) => (o.name + o.role + o.dept + o.posting + o.service).toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <PageHeader
        title="Officer Knowledge Search"
        description="Search the officer directory — role, department, posting, service ID. Public directory data from GoM sources."
        breadcrumb={['Knowledge Brain', 'Officer Search']}
        source="Department API required"
      />
      <Card className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search by name, role, department, service ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((o) => (
          <div key={o.service} className="card card-hover">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-gradient text-white text-sm font-semibold">
                {o.name.split(' ').map((n) => n[0]).join('').slice(0,2)}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink-900">{o.name}</div>
                <div className="text-xs text-ink-500">{o.role}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-ink-500"><Building2 className="h-3 w-3" /> {o.dept} · {o.posting}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-ink-500"><User2 className="h-3 w-3" /> {o.service}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status="Active" />
              <SourceBadge source="Department API required" />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline flex-1">Profile</button>
              <button className="btn-primary flex-1">Share MAII access</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-ink-200 p-8 text-center text-sm text-ink-500">No officers matched — try a different search.</div>}
      </div>
    </div>
  )
}
