import { FileSearch, Languages, PenLine, FileText, Scale, GitCompare, ShieldCheck, Landmark } from 'lucide-react'

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
  default: `I've analysed the request under Zero Trust guardrails. This response is generated on your **sovereign on-prem inference stack** — no data leaves the state data centre.\n\n- Confidence: **91%**\n- Data classification respected: **Internal**\n- Human review: **required if the recommendation touches disbursements over ₹5 Cr**\n\nYou can refine the request, attach a document for grounded analysis, or use a slash command like **/gr**, **/letter** or **/rti** for a structured task.`,
}

export function pickReply(text: string): { key: string; text: string; sources: string[] } {
  const t = text.toLowerCase()
  let key = 'default'
  if (/\/gr|\bgr\b|resolution|summar/i.test(t)) key = 'gr'
  if (/\/note|note for approval|\bnote\b/.test(t)) key = 'note'
  if (/\/letter|letter/.test(t)) key = 'letter'
  if (/\/rti|rti/.test(t)) key = 'rti'
  if (/\/compare|compare|circular/.test(t)) key = 'compare'
  if (/\/translate|translate|marathi|hindi/.test(t)) key = 'translate'
  if (/\/risk|risk|compliance|dpdp/.test(t)) key = 'risk'
  const SOURCES: Record<string, string[]> = {
    gr: ['gr.maharashtra.gov.in — GR 118/2026', 'MahaDBT reference tables (API pending)', 'MAII KB — DIT/SOP/012'],
    note: ['Sarvam-M pilot report (May-Jun 2026)', 'DIT Master AI SLA (2025)', 'MAII KB — DIT/SOP/012'],
    letter: ['MAII rollout schedule (Annexure-A)', 'e-Office letter format registry'],
    rti: ['RTI Act 2005 — Sections 8(1)(j), 10', 'DPDP Act 2023', 'Department disclosure register'],
    compare: ['DIT/CIR/2026/09', 'DIT/CIR/2025/31', 'GR-2025-URD-092'],
    translate: ['MR-Corpus v1 — government register', 'Translation SOP v2'],
    risk: ['DPDP Act 2023', 'AI Acceptable-Use Policy v2', 'Retention schedule R-2026'],
    default: ['MAII KB — department knowledge base', 'Zero Trust session policy'],
  }
  return { key, text: RESPONSES[key], sources: SOURCES[key] }
}
