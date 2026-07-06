import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Shield, Bug, Radar, ExternalLink } from 'lucide-react'

const THREATS = [
  { id: 'AIT-2026-014', title: 'Multi-agent tool-abuse via file connectors', sev: 'High' as const, mitre: 'AIT-T1.4' as const, ctrl: 'Deny external connector calls unless approved', source: 'CERT-In advisory 2026/07' },
  { id: 'AIT-2026-013', title: 'Prompt-injection via hidden HTML in scanned PDFs', sev: 'High' as const, mitre: 'AIT-T1.2' as const, ctrl: 'HTML sanitiser before OCR routing', source: 'IndiaAI safety brief' },
  { id: 'AIT-2026-012', title: 'Model abuse via base64 payloads', sev: 'Medium' as const, mitre: 'AIT-T2.1' as const, ctrl: 'Decode+scan input pipeline', source: 'MeitY circular' },
  { id: 'AIT-2026-011', title: 'Data exfil via long-context memorisation', sev: 'Medium' as const, mitre: 'AIT-T3.2' as const, ctrl: 'Enable canaries + DP training', source: 'MAII research' },
  { id: 'AIT-2026-010', title: 'Adversarial audio in voice interface', sev: 'Low' as const, mitre: 'AIT-T4.1' as const, ctrl: 'Voice interface disabled by default', source: 'CERT-In advisory' },
]

const PATTERNS = [
  'Direct override (Ignore prior instructions…)',
  'Delimiter escape (--- END SYSTEM ---)',
  'Encoded payload (base64/URL/hex)',
  'Chained tool loop (recursive tool calling)',
  'Multilingual jailbreak (Marathi/Hindi role-play)',
  'PDF hidden instructions (invisible text)',
]

export function ThreatIntel() {
  return (
    <div>
      <PageHeader
        title="AI Threat Intelligence"
        description="Emerging AI threats, prompt attack patterns, model abuse risks, recommended controls."
        breadcrumb={['Security & AI SOC', 'Threat Intelligence']}
        source="Public-source linked"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
        <Card>
          <CardHeader title="Emerging threats" right={<SourceBadge source="Public-source linked" />} />
          <ul className="space-y-2">
            {THREATS.map((t) => (
              <li key={t.id} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink-800">{t.title}</div>
                    <div className="text-xs text-ink-500">{t.id} · {t.mitre} (MITRE-style mapping placeholder) · Source: {t.source}</div>
                    <div className="mt-1 text-xs text-ink-700"><b>Control:</b> {t.ctrl}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <SeverityBadge level={t.sev} />
                    <StatusBadge status="Active" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Attack pattern taxonomy" right={<Bug className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm text-ink-700">
              {PATTERNS.map((p) => <li key={p} className="rounded-md border border-ink-100 px-3 py-2">{p}</li>)}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Recommended posture" right={<Shield className="h-4 w-4 text-brand-500" />} />
            <ul className="space-y-2 text-sm text-ink-700">
              <li>• Enforce prompt sanitizer at ingress</li>
              <li>• Deny multi-modal tool calling from untrusted inputs</li>
              <li>• Sample outputs into fact-check pipeline</li>
              <li>• Watch model-drift indicators weekly</li>
            </ul>
          </Card>
          <a href="https://www.cert-in.org.in/" target="_blank" rel="noreferrer" className="btn-outline w-full">
            <ExternalLink className="h-4 w-4" /> Subscribe to CERT-In advisories
          </a>
        </div>
      </div>
    </div>
  )
}
