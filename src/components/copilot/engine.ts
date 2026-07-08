import {
  FileSearch, Languages, PenLine, FileText, Scale, GitCompare, ShieldCheck, Landmark,
  ClipboardList, IndianRupee,
} from 'lucide-react'

export type CopilotMsg = {
  id: string
  role: 'user' | 'ai'
  text: string
  /** characters of `text` currently revealed while streaming; undefined = fully shown */
  shown?: number
  confidence?: number
  sources?: string[]
  feedback?: 'up' | 'down'
  flagged?: boolean
  /** reply template key — drives contextual follow-up suggestions */
  key?: string
  /** epoch ms when the message was created */
  ts?: number
  /** wall-clock generation time (pipeline + streaming) for AI answers */
  latencyMs?: number
}

export type PipelineStage = { key: string; label: string }

/** The sovereign guardrail pipeline every prompt passes through (simulated). */
export const PIPELINE: PipelineStage[] = [
  { key: 'dlp', label: 'DLP scan' },
  { key: 'class', label: 'Classification' },
  { key: 'route', label: 'Policy routing' },
  { key: 'retrieve', label: 'Knowledge retrieval' },
  { key: 'draft', label: 'Drafting' },
  { key: 'cite', label: 'Citations & audit' },
]

export const SLASH_COMMANDS = [
  { cmd: '/letter', label: 'Draft official letter', icon: PenLine, template: 'Draft an official letter to all Divisional Commissioners regarding MAII rollout readiness, nominating nodal officers within 10 working days.' },
  { cmd: '/note', label: 'Note for approval', icon: FileText, template: 'Prepare a note for approval on adopting Sarvam-M for Marathi drafting across GAD desks.' },
  { cmd: '/gr', label: 'Summarise a GR', icon: FileSearch, template: 'Summarise GR-2026-URD-118 with key clauses, financial implication and compliance checklist.' },
  { cmd: '/translate', label: 'Translate to formal Marathi', icon: Languages, template: 'Translate the attached letter to formal Marathi (शासकीय मराठी).' },
  { cmd: '/rti', label: 'Draft RTI reply', icon: Scale, template: 'Draft an RTI reply for application RTI/2026/DIT/0341 citing the relevant GR clauses and exemptions if any.' },
  { cmd: '/compare', label: 'Compare two circulars', icon: GitCompare, template: 'Compare circular DIT/CIR/2026/09 with DIT/CIR/2025/31 and highlight conflicting clauses and timelines.' },
  { cmd: '/risk', label: 'Compliance risk check', icon: ShieldCheck, template: 'Identify compliance risk in this document under DPDP and the AI Acceptable-Use Policy.' },
  { cmd: '/mom', label: 'Minutes of meeting', icon: ClipboardList, template: 'Prepare minutes of the MAII rollout review meeting from my notes — decisions, action items with owners, and next review date.' },
  { cmd: '/budget', label: 'Budget utilisation query', icon: IndianRupee, template: 'Show head-wise budget utilisation for Urban Development heads this quarter and flag heads trailing the benchmark.' },
  { cmd: '/cabinet', label: 'Cabinet note summary', icon: Landmark, template: 'Prepare a cabinet note summary for the MAII state-wide rollout proposal.' },
]

export const CAPABILITIES = [
  { icon: FileSearch, title: 'Analyse GRs & circulars', desc: 'Clause-level summaries, conflicts, compliance checklists with citations.' },
  { icon: PenLine, title: 'Draft letters & notes', desc: 'Official formats, approval hierarchy, annexure checks — ready for e-Office.' },
  { icon: Languages, title: 'Formal Marathi & Hindi', desc: 'Government-register translation tuned on state corpora.' },
  { icon: Scale, title: 'RTI & policy replies', desc: 'Grounded replies citing sections, precedents and exemptions.' },
]

export const RESPONSES: Record<string, string> = {
  gr: `**GR Summary — GR-2026-URD-118**\n\n- **Subject:** PMAY-U 2.0 Beneficiary Verification Guidelines\n- **Effective from:** 04-Jul-2026\n- **Owner:** Urban Development Department\n\n**Key clauses**\n1. Aadhaar-based e-KYC becomes mandatory for beneficiary listing.\n2. Income proof cross-verified against MahaDBT records within 15 days.\n3. Grievance redressal committee to be notified by District Collector within 7 days of publication.\n\n**Financial implication:** Neutral within FY 2026-27 outlay (₹2,140 Cr already provisioned under Urban Housing head).\n\n**Compliance checklist**\n- [ ] District nodal officer nominated\n- [ ] MahaDBT API access confirmed\n- [ ] SOP circulated to ULB commissioners\n\n**Risk flag:** Medium — pending clarity on rural-migrant applicants.\n\n*Sources: gr.maharashtra.gov.in (public), MahaDBT reference tables (department API pending).*`,
  note: `**Note for Approval — File No. DIT/AI/2026/44**\n\n**Subject:** Adoption of Sarvam-M for Marathi drafting across GAD desks.\n\n**Background:** Marathi drafting via general-purpose LLMs shows persistent formal-register drift. Sarvam-M evaluation (three-district pilot, May-Jun 2026) shows 22% error reduction and 34% time saving.\n\n**Financial implication:** ₹0 additional CapEx; hosted on existing GPU cluster (Mumbai DC). Estimated OpEx ₹18 L / year for maintenance.\n\n**Legal implication:** No fresh MoU required — covered under DIT Master AI SLA (2025).\n\n**Recommendation:** Approve production roll-out to GAD, Home, Revenue, UDD.\n\n**Approval hierarchy:** Section Officer → Under Secretary → Deputy Secretary → Principal Secretary (DIT).`,
  letter: `**Draft Letter — No. DIT/MAII/2026/117**\n\nTo,\nAll Divisional Commissioners,\nGovernment of Maharashtra.\n\n**Subject:** Nomination of nodal officers for MAII rollout readiness.\n\nSir/Madam,\n\nAs part of the state-wide rollout of the Maha Administrative Intelligence Infrastructure (MAII), each Division is requested to nominate a nodal officer (not below the rank of Deputy Secretary / Additional Collector) to coordinate readiness assessment, training and go-live activities.\n\nThe nomination may please be communicated to this office within **10 working days** of receipt of this letter.\n\n**Enclosures:** Rollout schedule (Annexure-A), readiness checklist (Annexure-B).\n\nYours faithfully,\n(Principal Secretary, DIT)`,
  rti: `**RTI Reply Draft — RTI/2026/DIT/0341**\n\n**Point-wise reply**\n1. The information sought under point (a) is available in GR-2026-URD-118, published on gr.maharashtra.gov.in — copy enclosed.\n2. Point (b) pertains to beneficiary-level data containing Aadhaar-linked records; disclosure is exempt under **Section 8(1)(j)** of the RTI Act read with the **DPDP Act, 2023**.\n3. Point (c): the file noting sheet (pages 4-9) is enclosed after severance of exempt portions under **Section 10**.\n\n**First Appellate Authority:** Deputy Secretary (IT), Mantralaya, Mumbai.\n\n*Reply verified against the RTI SOP v3 and the department disclosure register.*`,
  compare: `**Circular comparison — DIT/CIR/2026/09 vs DIT/CIR/2025/31**\n\n**Conflicts detected**\n1. **Timeline:** 2026/09 requires quarterly security audits; 2025/31 mandated half-yearly. The later circular prevails — flag for consolidation.\n2. **Scope:** 2026/09 extends coverage to ULB-hosted applications; 2025/31 was Mantralaya-only.\n3. **Clause 5.2** of 2026/09 conflicts with the grievance SOP timeline in GR-2025-URD-092.\n\n**Unchanged obligations:** incident reporting within 6 hours; CISO sign-off for new deployments.\n\n**Recommendation:** issue a consolidated circular superseding 2025/31 and align Clause 5.2 with the grievance SOP.`,
  translate: `**अनुवाद (Marathi — औपचारिक शैली):**\n\nमहोदय,\nप्रधानमंत्री आवास योजना (शहरी) २.० अंतर्गत लाभार्थ्यांच्या पडताळणीसाठी नवीन कार्यपद्धती दिनांक ०४ जुलै २०२६ पासून अंमलात येत आहे. संबंधित जिल्हाधिकाऱ्यांनी ०७ दिवसांच्या आत तक्रार निवारण समितीची स्थापना करावी.\n\nधन्यवाद,\n(हस्ताक्षर)`,
  risk: `**Compliance risk assessment**\n\n**High**\n- Clause 3.1 lacks explicit consent language per DPDP Section 6 — remediation: insert consent notice reference before publication.\n\n**Medium**\n- Retention period for beneficiary documents is unspecified; the retention schedule defaults to 8 years — confirm with DPO.\n- Aadhaar numbers appear unmasked in Annexure-C — auto-masking recommended on ingest.\n\n**Low**\n- Grievance SLA (7 days) is tighter than the standard SOP (10 days) — operationally fine, note the delta.\n\n*Checked against: DPDP Act 2023, AI Acceptable-Use Policy v2, retention schedule R-2026.*`,
  mom: `**Minutes of Meeting — MAII Rollout Review**\n\n- **Date & time:** 07-Jul-2026, 11:00 AM · Committee Room 3, Mantralaya\n- **Chair:** Principal Secretary (DIT) · **Attendees:** 14 (list at Annexure-A)\n\n**Decisions taken**\n1. Phase-2 go-live confirmed for **01-Aug-2026** across six divisions.\n2. Sarvam-M approved for Marathi drafting on GAD desks; usage audited weekly.\n3. District training calendar to be finalised and circulated by 15-Jul-2026.\n\n**Action items**\n- [ ] Nodal officer nominations — Divisional Commissioners — due 18-Jul\n- [ ] GPU capacity & failover report — Director (IT Infra) — due 21-Jul\n- [x] DPDP compliance sign-off — DPO — completed 04-Jul\n\n**Next review:** 28-Jul-2026, 11:00 AM, same venue.\n\n*Drafted from officer notes — verify names, designations and dates before circulation.*`,
  budget: `**Budget utilisation — Urban Development heads (FY 2026-27 · Q1)**\n\n| Head | Allocation (₹ Cr) | Utilised (₹ Cr) | Utilised % |\n| --- | --- | --- | --- |\n| 2217 — Urban Housing (PMAY-U 2.0) | 2,140.0 | 486.2 | 22.7% |\n| 3604 — ULB Grants (15th FC) | 1,820.0 | 512.4 | 28.2% |\n| 2215 — Water Supply & Sanitation | 960.0 | 148.9 | 15.5% |\n| 5054 — Urban Roads (CapEx) | 730.0 | 96.1 | 13.2% |\n\n**Reading**\n- Q1 pro-rata benchmark is 25% — **Water Supply** and **Urban Roads** are trailing; flag to the expenditure review committee.\n- ULB Grants are on track, but UC pendency at 4 ULBs may hold the Q2 tranche.\n\n**Recommendation:** issue a utilisation advisory to trailing heads and seek revised procurement timelines by 25-Jul-2026.\n\n*Figures from BEAMS extract dated 30-Jun-2026 (demo data).*`,
  default: `I've analysed the request under Zero Trust guardrails. This response is generated on your **sovereign on-prem inference stack** — no data leaves the state data centre.\n\n- Confidence: **91%**\n- Data classification respected: **Internal**\n- Human review: **required if the recommendation touches disbursements over ₹5 Cr**\n\nYou can refine the request, attach a document for grounded analysis, or use a slash command like **/gr**, **/letter** or **/rti** for a structured task.`,
}

const SOURCES: Record<string, string[]> = {
  gr: ['gr.maharashtra.gov.in — GR 118/2026', 'MahaDBT reference tables (API pending)', 'MAII KB — DIT/SOP/012'],
  note: ['Sarvam-M pilot report (May-Jun 2026)', 'DIT Master AI SLA (2025)', 'MAII KB — DIT/SOP/012'],
  letter: ['MAII rollout schedule (Annexure-A)', 'e-Office letter format registry'],
  rti: ['RTI Act 2005 — Sections 8(1)(j), 10', 'DPDP Act 2023', 'Department disclosure register'],
  compare: ['DIT/CIR/2026/09', 'DIT/CIR/2025/31', 'GR-2025-URD-092'],
  translate: ['MR-Corpus v1 — government register', 'Translation SOP v2'],
  risk: ['DPDP Act 2023', 'AI Acceptable-Use Policy v2', 'Retention schedule R-2026'],
  mom: ['Officer notes — 07-Jul-2026 review', 'e-Office meeting register', 'MAII rollout schedule (Annexure-A)'],
  budget: ['BEAMS extract — 30-Jun-2026', 'Budget publication FY 2026-27 (UDD)', 'Expenditure review SOP v4'],
  default: ['MAII KB — department knowledge base', 'Zero Trust session policy'],
}

/** Contextual follow-up suggestions per reply key — rendered as chips under the latest answer. */
export const FOLLOWUPS: Record<string, string[]> = {
  gr: ['Draft compliance letter to ULB commissioners', 'Compare with GR-2025-URD-092', 'Translate summary to Marathi'],
  note: ['Draft the covering letter for this note', 'Run a compliance risk check on the note', 'Summarise the Sarvam-M pilot GR'],
  letter: ['Translate this letter to formal Marathi', 'Prepare a note for approval to issue it', 'Draft minutes for the rollout review meeting'],
  rti: ['Run a compliance risk check under DPDP', 'Summarise the GR cited in this reply', 'Draft the covering letter to the applicant'],
  compare: ['Draft a consolidated circular superseding 2025/31', 'Summarise GR-2025-URD-092', 'Run a compliance risk check on Clause 5.2'],
  translate: ['Draft the official letter using this translation', 'Translate the same text to formal Hindi', 'Prepare a note for approval to circulate it'],
  risk: ['Draft remediation letter for the High finding', 'Summarise the GR behind Clause 3.1', 'Prepare a note for approval on the fixes'],
  mom: ['Draft follow-up letter to Divisional Commissioners', 'Prepare a note for approval on the decisions', 'Translate the minutes to formal Marathi'],
  budget: ['Draft utilisation advisory to trailing heads', 'Compare utilisation with FY 2025-26 Q1', 'Prepare a note for the expenditure review committee'],
  default: ['Summarise GR-2026-URD-118 with a checklist', 'Show head-wise budget utilisation this quarter', 'Draft an official letter on MAII rollout readiness'],
}

/** Slash commands take absolute precedence over keyword matching. */
const SLASH_TO_KEY: Record<string, string> = {
  '/gr': 'gr', '/note': 'note', '/letter': 'letter', '/rti': 'rti', '/compare': 'compare',
  '/translate': 'translate', '/risk': 'risk', '/mom': 'mom', '/budget': 'budget', '/cabinet': 'note',
}

export function pickReply(text: string): { key: string; text: string; sources: string[] } {
  const t = text.trim().toLowerCase()
  let key: string | undefined

  const slash = t.match(/^\/[a-z]+/)?.[0]
  if (slash && SLASH_TO_KEY[slash]) key = SLASH_TO_KEY[slash]

  if (!key) {
    if (/\bgr\b|resolution|summar/.test(t)) key = 'gr'
    if (/note for approval|\bnote\b|cabinet/.test(t)) key = 'note'
    if (/letter/.test(t)) key = 'letter'
    if (/\brti\b/.test(t)) key = 'rti'
    if (/compare|circular/.test(t)) key = 'compare'
    if (/translate|marathi|hindi|अनुवाद/.test(t)) key = 'translate'
    if (/\brisk\b|compliance|dpdp/.test(t)) key = 'risk'
    if (/minutes|\bmom\b|meeting/.test(t)) key = 'mom'
    if (/budget|utilisation|utilization|expenditure|beams|head-wise/.test(t)) key = 'budget'
  }

  key = key ?? 'default'
  return { key, text: RESPONSES[key] ?? RESPONSES.default, sources: SOURCES[key] ?? SOURCES.default }
}

/* ------------------------------------------------------------------ */
/* Conversation history — persisted sessions (localStorage, capped)    */
/* ------------------------------------------------------------------ */

export type CopilotSession = {
  id: string
  title: string
  updatedAt: number
  messages: CopilotMsg[]
}

const SESSIONS_KEY = 'maii-copilot-sessions'
export const MAX_SESSIONS = 20

/** Load persisted sessions. Never throws — private mode / quota issues degrade to []. */
export function loadSessions(): CopilotSession[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is CopilotSession =>
        !!s && typeof s.id === 'string' && typeof s.title === 'string' && Array.isArray(s.messages))
      .slice(0, MAX_SESSIONS)
  } catch {
    return []
  }
}

/** Persist sessions (newest first, capped). Never throws. */
export function saveSessions(list: CopilotSession[]): void {
  try {
    const capped = [...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SESSIONS)
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(capped))
  } catch {
    /* quota exceeded / private mode — non-fatal */
  }
}

/** Compact relative-time label for session lists. */
export function relativeTime(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString([], { day: 'numeric', month: 'short' })
}
