import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { SeverityBadge, SourceBadge, StatusBadge } from '@/components/ui/Badges'
import { Shield, Bug, ExternalLink, Rss, Fingerprint, Wrench } from 'lucide-react'
import { AI_ATTACK_TECHNIQUES, THREAT_FEEDS, IOC_SAMPLES, COUNTERMEASURES } from '@/data/securitySamples'

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

const SEV_FILTERS = ['All', 'High', 'Medium', 'Low'] as const

export function ThreatIntel() {
  const [sev, setSev] = useState<(typeof SEV_FILTERS)[number]>('All')
  const threats = useMemo(
    () => (sev === 'All' ? THREATS : THREATS.filter((t) => t.sev === sev)),
    [sev],
  )
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
          <CardHeader
            title="Emerging threats"
            right={<div className="flex items-center gap-2">
              <select className="input h-8 w-auto py-1 text-xs" value={sev} onChange={(e) => setSev(e.target.value as any)} aria-label="Filter by severity">
                {SEV_FILTERS.map((s) => <option key={s}>{s === 'All' ? 'All severities' : s}</option>)}
              </select>
              <SourceBadge source="Public-source linked" />
            </div>}
          />
          <ul className="space-y-2">
            {threats.map((t) => (
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
            {threats.length === 0 && (
              <li className="rounded-xl border border-dashed border-ink-200 p-4 text-center text-xs text-ink-500">
                No {sev.toLowerCase()}-severity threats currently tracked.
              </li>
            )}
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

      {/* AI-specific attack techniques (MITRE ATLAS-style) */}
      <Card className="mt-6">
        <CardHeader
          title="AI-specific attack techniques"
          subtitle="MITRE ATLAS-style catalog"
          right={<SourceBadge source="Public-source linked" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['ATLAS ID', 'Technique', 'Tactic', 'Severity'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {AI_ATTACK_TECHNIQUES.map((t) => (
                <tr key={t.id}>
                  <td className="table-td font-mono text-xs">{t.id}</td>
                  <td className="table-td font-medium text-ink-800">{t.name}</td>
                  <td className="table-td text-ink-700">{t.tactic}</td>
                  <td className="table-td"><SeverityBadge level={t.sev} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Threat-feed subscription list + IOC samples */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Threat-feed subscriptions"
            subtitle="External + internal sources"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><Rss className="h-3 w-3" /> Feeds</span>}
          />
          <ul className="space-y-2 text-sm">
            {THREAT_FEEDS.map((f) => (
              <li key={f.name} className="flex items-center justify-between gap-2 rounded-md border border-ink-100 px-3 py-2">
                <div className="min-w-0">
                  <div className="font-medium text-ink-800 truncate">{f.name}</div>
                  <div className="text-xs text-ink-500">{f.iocs.toLocaleString()} IOCs · refresh {f.freq}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={f.status} />
                  {f.url && f.url !== '#' && (
                    <a href={f.url} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800" title={`Open ${f.name}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Indicators of Compromise (IOC)"
            subtitle="Sample — 8 recent entries"
            right={<span className="chip border bg-ink-100 text-ink-700 border-ink-200"><Fingerprint className="h-3 w-3" /> IOC</span>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>{['Type', 'Indicator', 'Seen', 'Source', 'Sev'].map((h) => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {IOC_SAMPLES.map((i) => (
                  <tr key={i.ioc}>
                    <td className="table-td"><span className="chip border bg-ink-100 text-ink-700 border-ink-200">{i.type}</span></td>
                    <td className="table-td font-mono text-xs text-ink-800 truncate max-w-[200px]">{i.ioc}</td>
                    <td className="table-td text-xs">{i.seen}</td>
                    <td className="table-td text-xs text-ink-700">{i.src}</td>
                    <td className="table-td"><SeverityBadge level={i.sev} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Countermeasure library */}
      <Card className="mt-6">
        <CardHeader
          title="Countermeasure library"
          subtitle="Controls mapped to attack techniques"
          right={<span className="chip border bg-emerald-50 text-emerald-700 border-emerald-200"><Wrench className="h-3 w-3" /> Controls</span>}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTERMEASURES.map((c) => (
            <div key={c.name} className="rounded-xl border border-ink-100 bg-brand-soft/30 p-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-600" />
                <span className="text-sm font-semibold text-ink-800">{c.name}</span>
              </div>
              <p className="mt-1 text-xs text-ink-600 line-clamp-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
