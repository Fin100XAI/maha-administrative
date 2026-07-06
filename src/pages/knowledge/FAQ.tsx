import { useState } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SourceBadge } from '@/components/ui/Badges'

const FAQS = [
  { q: 'How do I upload a GR for analysis?', a: 'Go to Administrative AI → GR Analysis, drop the GR PDF or paste a public GR link from gr.maharashtra.gov.in. MAII will extract clauses, effective date and compliance obligations.' },
  { q: 'What is the difference between BharatGPT and Sarvam-M?', a: 'BharatGPT is a sovereign Council-owned model deployed on-prem for confidential workloads. Sarvam-M is optimised for Marathi drafting and citizen communication in bilingual scenarios.' },
  { q: 'How is my prompt kept confidential?', a: 'Prompts classified as Confidential or Secret are routed only to on-prem models. All prompts are DLP-scanned, logged and audited under Zero Trust.' },
  { q: 'How do I raise a DPO concern?', a: 'From DPDP → Privacy Risk, click "New PIA". The workflow will route to the DPO of your department.' },
  { q: 'Can I use MAII on my mobile device?', a: 'Yes, but only from a managed device with MFA. BYOD access is restricted to Public and Internal classifications.' },
  { q: 'Where can I see who approved my note?', a: 'Every draft carries a decision trace under Governance → Explainability.' },
  { q: 'What happens during an AI incident?', a: 'An incident opens under Governance → AI Incident Management. AI SOC investigates, applies mitigation, and updates the risk register.' },
  { q: 'How is Marathi translation quality verified?', a: 'Sarvam-M is fine-tuned on the GAD Marathi corpus. Legal phrasing is human-reviewed by the Language Lab before publish.' },
]

export function FAQ() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<number | null>(0)
  const filtered = FAQS.filter((f) => f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Frequently asked questions by officers using MAII."
        breadcrumb={['Knowledge Brain', 'FAQ']}
        source="Demo"
      />
      <Card className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search FAQs…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <div key={f.q} className="card">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between text-left">
              <span className="text-sm font-medium text-ink-800">{f.q}</span>
              {open === i ? <ChevronDown className="h-4 w-4 text-ink-400" /> : <ChevronRight className="h-4 w-4 text-ink-400" />}
            </button>
            {open === i && (
              <div className="mt-2 text-sm text-ink-700">
                {f.a}
                <div className="mt-2"><SourceBadge source="Demo" /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
