import {
  FileSearch, Languages, PenLine, FileText, Scale, GitCompare, ShieldCheck, Landmark,
  ClipboardList, IndianRupee, Gavel, MessageSquareWarning, Package, BadgeCheck,
} from 'lucide-react'
import type { ModelEntry } from '@/data/models'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AttachmentKind = 'text' | 'binary'

export type CopilotAttachment = {
  id: string
  name: string
  size: number
  mime: string
  kind: AttachmentKind
  /** Full text for readable formats — used to ground the answer. */
  text?: string
}

export type CopilotMsg = {
  id: string
  role: 'user' | 'ai'
  text: string
  /** characters of `text` currently revealed while streaming; undefined = fully shown */
  shown?: number
  confidence?: number
  sources?: string[]
  feedback?: 'up' | 'down'
  /** reply template key — drives contextual follow-up suggestions */
  key?: string
  /** epoch ms when the message was created */
  ts?: number
  /** wall-clock generation time (pipeline + streaming) for AI answers */
  latencyMs?: number
  /** model that produced the answer / classification the prompt ran under */
  model?: string
  secClass?: string
  /** files carried with a user prompt */
  attachments?: CopilotAttachment[]
  /** true once the officer has routed this answer into an approval workflow */
  approvalId?: string
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
  { cmd: '/court', label: 'Court case brief', icon: Gavel, template: 'Prepare a brief on WP 4471/2026 with the last order, our compliance status and the next hearing exposure.' },
  { cmd: '/grievance', label: 'Grievance analysis', icon: MessageSquareWarning, template: 'Analyse Aaple Sarkar grievance volumes for this month — top categories, ageing and districts breaching SLA.' },
  { cmd: '/tender', label: 'Tender / procurement check', icon: Package, template: 'Review the draft tender for GPU capacity expansion against GFR and the state procurement manual.' },
  { cmd: '/audit', label: 'Audit para reply', icon: BadgeCheck, template: 'Draft a reply to AG audit para 12 of 2025-26 on utilisation certificate pendency.' },
]

export const CAPABILITIES = [
  { icon: FileSearch, title: 'Analyse GRs & circulars', desc: 'Clause-level summaries, conflicts and compliance checklists — every claim cited.', prompt: 'Summarise GR-2026-URD-118 with key clauses, financial implication and compliance checklist.' },
  { icon: PenLine, title: 'Draft letters & notes', desc: 'Official formats, approval hierarchy and annexure checks — ready for e-Office.', prompt: 'Draft an official letter to all Divisional Commissioners regarding MAII rollout readiness.' },
  { icon: Languages, title: 'Formal Marathi & Hindi', desc: 'Government-register translation tuned on state corpora, not consumer slang.', prompt: 'Translate the attached letter to formal Marathi (शासकीय मराठी).' },
  { icon: Scale, title: 'RTI & policy replies', desc: 'Grounded replies citing sections, precedents and applicable exemptions.', prompt: 'Draft an RTI reply for application RTI/2026/DIT/0341 citing the relevant clauses.' },
  { icon: IndianRupee, title: 'Budget & scheme reads', desc: 'Head-wise utilisation against benchmark, with the laggards flagged for review.', prompt: 'Show head-wise budget utilisation for Urban Development heads this quarter.' },
  { icon: Gavel, title: 'Court & audit exposure', desc: 'Case briefs, compliance status and audit-para replies with the paper trail.', prompt: 'Prepare a brief on WP 4471/2026 with the last order and our compliance status.' },
]

/* ------------------------------------------------------------------ */
/* Answer templates                                                    */
/* ------------------------------------------------------------------ */

export const RESPONSES: Record<string, string> = {
  gr: `**GR Summary — GR-2026-URD-118**\n\n- **Subject:** PMAY-U 2.0 Beneficiary Verification Guidelines\n- **Effective from:** 04-Jul-2026\n- **Owner:** Urban Development Department\n\n**Key clauses**\n1. Aadhaar-based e-KYC becomes mandatory for beneficiary listing.\n2. Income proof cross-verified against MahaDBT records within 15 days.\n3. Grievance redressal committee to be notified by District Collector within 7 days of publication.\n\n**Financial implication:** Neutral within FY 2026-27 outlay (₹2,140 Cr already provisioned under Urban Housing head).\n\n**Compliance checklist**\n- [ ] District nodal officer nominated\n- [ ] MahaDBT API access confirmed\n- [ ] SOP circulated to ULB commissioners\n\n**Risk flag:** Medium — pending clarity on rural-migrant applicants.\n\n*Sources: gr.maharashtra.gov.in (public), MahaDBT reference tables (department API pending).*`,
  note: `**Note for Approval — File No. DIT/AI/2026/44**\n\n**Subject:** Adoption of Sarvam-M for Marathi drafting across GAD desks.\n\n**Background:** Marathi drafting via general-purpose LLMs shows persistent formal-register drift. Sarvam-M evaluation (three-district pilot, May-Jun 2026) shows 22% error reduction and 34% time saving.\n\n**Financial implication:** ₹0 additional CapEx; hosted on existing GPU cluster (Mumbai DC). Estimated OpEx ₹18 L / year for maintenance.\n\n**Legal implication:** No fresh MoU required — covered under DIT Master AI SLA (2025).\n\n**Recommendation:** Approve production roll-out to GAD, Home, Revenue, UDD.\n\n**Approval hierarchy:** Section Officer → Under Secretary → Deputy Secretary → Principal Secretary (DIT).`,
  letter: `**Draft Letter — No. DIT/MAII/2026/117**\n\nTo,\nAll Divisional Commissioners,\nGovernment of Maharashtra.\n\n**Subject:** Nomination of nodal officers for MAII rollout readiness.\n\nSir/Madam,\n\nAs part of the state-wide rollout of the Maha Administrative Intelligence Infrastructure (MAII), each Division is requested to nominate a nodal officer (not below the rank of Deputy Secretary / Additional Collector) to coordinate readiness assessment, training and go-live activities.\n\nThe nomination may please be communicated to this office within **10 working days** of receipt of this letter.\n\n**Enclosures:** Rollout schedule (Annexure-A), readiness checklist (Annexure-B).\n\nYours faithfully,\n(Principal Secretary, DIT)`,
  rti: `**RTI Reply Draft — RTI/2026/DIT/0341**\n\n**Point-wise reply**\n1. The information sought under point (a) is available in GR-2026-URD-118, published on gr.maharashtra.gov.in — copy enclosed.\n2. Point (b) pertains to beneficiary-level data containing Aadhaar-linked records; disclosure is exempt under **Section 8(1)(j)** of the RTI Act read with the **DPDP Act, 2023**.\n3. Point (c): the file noting sheet (pages 4-9) is enclosed after severance of exempt portions under **Section 10**.\n\n**Timeline:** reply due within 30 days of receipt — **11 days remaining**.\n\n**First Appellate Authority:** Deputy Secretary (IT), Mantralaya, Mumbai.\n\n*Reply verified against the RTI SOP v3 and the department disclosure register.*`,
  compare: `**Circular comparison — DIT/CIR/2026/09 vs DIT/CIR/2025/31**\n\n**Conflicts detected**\n1. **Timeline:** 2026/09 requires quarterly security audits; 2025/31 mandated half-yearly. The later circular prevails — flag for consolidation.\n2. **Scope:** 2026/09 extends coverage to ULB-hosted applications; 2025/31 was Mantralaya-only.\n3. **Clause 5.2** of 2026/09 conflicts with the grievance SOP timeline in GR-2025-URD-092.\n\n**Unchanged obligations:** incident reporting within 6 hours; CISO sign-off for new deployments.\n\n**Recommendation:** issue a consolidated circular superseding 2025/31 and align Clause 5.2 with the grievance SOP.`,
  translate: `**अनुवाद (Marathi — औपचारिक शैली):**\n\nमहोदय,\n\nप्रधानमंत्री आवास योजना (शहरी) २.० अंतर्गत लाभार्थ्यांच्या पडताळणीसाठी नवीन कार्यपद्धती दिनांक ०४ जुलै २०२६ पासून अंमलात येत आहे. सर्व संबंधित जिल्हाधिकाऱ्यांनी प्रसिद्धीच्या दिनांकापासून ०७ दिवसांच्या आत तक्रार निवारण समितीची स्थापना करावी, ही विनंती.\n\nआपला विश्वासू,\n(प्रधान सचिव, माहिती तंत्रज्ञान विभाग)\n\n*Register: शासकीय मराठी · Terminology aligned to the state administrative glossary (राज्य प्रशासकीय शब्दावली).*`,
  risk: `**Compliance risk assessment**\n\n**High**\n- Clause 3.1 lacks explicit consent language per DPDP Section 6 — remediation: insert consent notice reference before publication.\n\n**Medium**\n- Retention period for beneficiary documents is unspecified; the retention schedule defaults to 8 years — confirm with DPO.\n- Aadhaar numbers appear unmasked in Annexure-C — auto-masking recommended on ingest.\n\n**Low**\n- Grievance SLA (7 days) is tighter than the standard SOP (10 days) — operationally fine, note the delta.\n\n*Checked against: DPDP Act 2023, AI Acceptable-Use Policy v2, retention schedule R-2026.*`,
  mom: `**Minutes of Meeting — MAII Rollout Review**\n\n- **Date & time:** 07-Jul-2026, 11:00 AM · Committee Room 3, Mantralaya\n- **Chair:** Principal Secretary (DIT) · **Attendees:** 14 (list at Annexure-A)\n\n**Decisions taken**\n1. Phase-2 go-live confirmed for **01-Aug-2026** across six divisions.\n2. Sarvam-M approved for Marathi drafting on GAD desks; usage audited weekly.\n3. District training calendar to be finalised and circulated by 15-Jul-2026.\n\n**Action items**\n- [ ] Nodal officer nominations — Divisional Commissioners — due 18-Jul\n- [ ] GPU capacity & failover report — Director (IT Infra) — due 21-Jul\n- [x] DPDP compliance sign-off — DPO — completed 04-Jul\n\n**Next review:** 28-Jul-2026, 11:00 AM, same venue.\n\n*Drafted from officer notes — verify names, designations and dates before circulation.*`,
  budget: `**Budget utilisation — Urban Development heads (FY 2026-27 · Q1)**\n\n| Head | Allocation (₹ Cr) | Utilised (₹ Cr) | Utilised % |\n| --- | --- | --- | --- |\n| 2217 — Urban Housing (PMAY-U 2.0) | 2,140.0 | 486.2 | 22.7% |\n| 3604 — ULB Grants (15th FC) | 1,820.0 | 512.4 | 28.2% |\n| 2215 — Water Supply & Sanitation | 960.0 | 148.9 | 15.5% |\n| 5054 — Urban Roads (CapEx) | 730.0 | 96.1 | 13.2% |\n\n**Reading**\n- Q1 pro-rata benchmark is 25% — **Water Supply** and **Urban Roads** are trailing; flag to the expenditure review committee.\n- ULB Grants are on track, but UC pendency at 4 ULBs may hold the Q2 tranche.\n\n**Recommendation:** issue a utilisation advisory to trailing heads and seek revised procurement timelines by 25-Jul-2026.\n\n*Figures from BEAMS extract dated 30-Jun-2026 (demo data).*`,
  cabinet: `**Cabinet Note Summary — MAII State-wide Rollout**\n\n- **Proposing department:** Directorate of Information Technology\n- **Concurrence obtained:** Finance (04-Jul-2026), Law & Judiciary (28-Jun-2026), GAD (02-Jul-2026)\n\n**Proposal**\n1. Extend MAII to all 36 districts and 18 secretariat departments in three phases ending 31-Mar-2027.\n2. Sanction a sovereign GPU capacity expansion at the Mumbai and Nagpur data centres.\n3. Constitute a state AI Governance Council chaired by the Chief Secretary.\n\n**Financial implication:** ₹412 Cr over three years — ₹168 Cr CapEx, ₹244 Cr OpEx. Provisioned under demand DIT-2026/IT-Infra.\n\n**Legal & policy implication:** Consistent with the DPDP Act 2023 and the state AI Acceptable-Use Policy v2. No fresh legislation required.\n\n**Points for Cabinet decision**\n- Approval of the phased rollout and the outlay.\n- Approval to constitute the AI Governance Council.\n\n*Prepared for the Cabinet Secretariat — verify concurrence dates against the file before submission.*`,
  court: `**Case Brief — WP 4471/2026 (Bombay High Court)**\n\n- **Parties:** Petitioner association vs State of Maharashtra & Ors.\n- **Subject:** Beneficiary exclusion under PMAY-U 2.0 verification norms.\n- **Last order:** 12-Jun-2026 — State directed to file a reply affidavit within eight weeks.\n\n**Compliance status**\n1. Draft reply affidavit prepared by UDD; pending vetting by Law & Judiciary.\n2. Beneficiary rejection data for 4 ULBs still awaited — this is the critical path.\n3. Government Pleader briefed on 28-Jun-2026.\n\n**Exposure**\n- **Deadline:** reply affidavit due **07-Aug-2026** — 16 days remaining.\n- **Risk:** adverse cost order if the affidavit is not filed in time; contempt exposure is low at this stage.\n\n**Recommended action:** escalate the pending ULB data to the Divisional Commissioner and seek Law & Judiciary vetting on priority.\n\n*Sources: e-Courts cause list, department legal register, Law & Judiciary file LJD/WP/2026/221.*`,
  grievance: `**Grievance Intelligence — Aaple Sarkar (July 2026)**\n\n| Category | Received | Disposed | Pending | Avg. days |\n| --- | --- | --- | --- | --- |\n| Revenue — land records | 4,820 | 3,910 | 910 | 12.4 |\n| Urban — water supply | 3,140 | 2,760 | 380 | 9.1 |\n| Health — facility service | 2,270 | 2,090 | 180 | 7.6 |\n| Education — admissions | 1,650 | 1,180 | 470 | 16.8 |\n\n**SLA breaches**\n- **Education — admissions** is the worst performer at 16.8 days against a 10-day SLA.\n- Districts breaching SLA: **Nanded, Yavatmal, Gadchiroli, Jalna**.\n\n**Ageing:** 1,940 grievances are older than 30 days; 312 are older than 60 days and qualify for automatic escalation.\n\n**Recommended action:** issue an ageing advisory to the four districts and route 60-day cases to the Divisional Commissioner dashboard.\n\n*Figures from the Aaple Sarkar extract dated 20-Jul-2026 (demo data).*`,
  tender: `**Procurement Review — GPU capacity expansion**\n\n**Compliant**\n- Estimated cost placed before the competent authority; sanction traceable to the approved outlay.\n- e-Tendering through the state portal with a 21-day bid window — meets GFR Rule 161.\n\n**Needs correction**\n1. **Technical specification** names a single OEM accelerator — restrictive; rewrite as performance-based specs per GFR Rule 173(i).\n2. **EMD clause** is silent on exemption for MSE bidders — insert the standard exemption per the state procurement manual.\n3. **Evaluation matrix** weights are not disclosed in the bid document — publish the QCBS split before opening.\n\n**Risk:** Medium — restrictive specification is the most common ground for pre-award challenge.\n\n**Recommended action:** re-issue the technical annexure with performance-based specs and extend the bid window by 7 days.\n\n*Checked against: GFR 2017, Maharashtra Procurement Manual (2024 revision).*`,
  audit: `**Audit Para Reply — AG Para 12 of 2025-26**\n\n**Para subject:** Pendency of utilisation certificates against grants released to ULBs.\n\n**Departmental reply**\n1. Of the 214 UCs flagged, **166 have since been received and reconciled** (position as on 30-Jun-2026); documentary evidence at Annexure-A.\n2. For the balance 48, recovery-cum-adjustment notices were issued on 18-Jun-2026 with a 30-day compliance window.\n3. A standing instruction now blocks the next tranche where a UC is pending beyond 90 days — circular DIT/CIR/2026/09 refers.\n\n**Systemic correction:** UC status is now a mandatory field in BEAMS; the quarterly review is chaired by the Principal Secretary (Finance).\n\n**Request:** the para may kindly be treated as settled to the extent of the 166 reconciled UCs, with the balance placed under monitoring.\n\n*Prepared per the AG reply format — attach Annexure-A before submission.*`,
  default: `I've analysed the request under Zero Trust guardrails. This response is generated on your **sovereign on-prem inference stack** — no data leaves the state data centre.\n\n- Data classification respected: prompt handled at the classification set for this session.\n- Human review: **required if the recommendation touches disbursements over ₹5 Cr** or any personnel action.\n- Every prompt, answer and citation on this thread is written to the immutable audit log.\n\nTo get a structured, citable output, tell me the artefact you need — or use a command like **/gr**, **/letter**, **/rti** or **/budget**. You can also attach a document and I will ground the answer in it.`,
}

const SOURCES: Record<string, string[]> = {
  gr: ['gr.maharashtra.gov.in — GR 118/2026', 'MahaDBT reference tables (API pending)', 'MAII KB — DIT/SOP/012'],
  note: ['Sarvam-M pilot report (May-Jun 2026)', 'DIT Master AI SLA (2025)', 'MAII KB — DIT/SOP/012'],
  letter: ['MAII rollout schedule (Annexure-A)', 'e-Office letter format registry'],
  rti: ['RTI Act 2005 — Sections 8(1)(j), 10', 'DPDP Act 2023', 'Department disclosure register'],
  compare: ['DIT/CIR/2026/09', 'DIT/CIR/2025/31', 'GR-2025-URD-092'],
  translate: ['MR-Corpus v1 — government register', 'राज्य प्रशासकीय शब्दावली', 'Translation SOP v2'],
  risk: ['DPDP Act 2023', 'AI Acceptable-Use Policy v2', 'Retention schedule R-2026'],
  mom: ['Officer notes — 07-Jul-2026 review', 'e-Office meeting register', 'MAII rollout schedule (Annexure-A)'],
  budget: ['BEAMS extract — 30-Jun-2026', 'Budget publication FY 2026-27 (UDD)', 'Expenditure review SOP v4'],
  cabinet: ['Cabinet Secretariat note format', 'Finance concurrence — 04-Jul-2026', 'AI Acceptable-Use Policy v2'],
  court: ['e-Courts cause list — Bombay HC', 'Law & Judiciary file LJD/WP/2026/221', 'Department legal register'],
  grievance: ['Aaple Sarkar extract — 20-Jul-2026', 'Grievance SOP v3', 'District SLA register'],
  tender: ['GFR 2017 — Rules 161, 173', 'Maharashtra Procurement Manual (2024)', 'e-Tendering portal record'],
  audit: ['AG audit report 2025-26', 'BEAMS UC register', 'DIT/CIR/2026/09'],
  file: ['Attached document — officer upload', 'MAII KB — department knowledge base', 'DLP scan record'],
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
  budget: ['Draft utilisation advisory to trailing heads', 'Prepare a note for the expenditure review committee', 'Draft a reply to the AG audit para on UC pendency'],
  cabinet: ['Draft the covering letter to the Cabinet Secretariat', 'Run a compliance risk check on the proposal', 'Summarise the financial implication head-wise'],
  court: ['Draft the reply affidavit outline', 'Prepare a note for approval to engage senior counsel', 'Summarise the GR under challenge'],
  grievance: ['Draft an ageing advisory to the four districts', 'Compare with last month’s disposal rate', 'Prepare a note for approval on escalation rules'],
  tender: ['Rewrite the technical specification as performance-based', 'Prepare a note for approval on re-issue', 'Run a compliance risk check under GFR'],
  audit: ['Draft the covering letter to the Accountant General', 'Show UC pendency head-wise this quarter', 'Prepare a note for approval on the systemic fix'],
  file: ['Summarise this document in formal Marathi', 'Run a compliance risk check on it', 'Draft a note for approval based on it'],
  default: ['Summarise GR-2026-URD-118 with a checklist', 'Show head-wise budget utilisation this quarter', 'Draft an official letter on MAII rollout readiness'],
}

/* ------------------------------------------------------------------ */
/* Intent matching                                                     */
/* ------------------------------------------------------------------ */

/** Slash commands take absolute precedence over keyword matching. */
const SLASH_TO_KEY: Record<string, string> = {
  '/gr': 'gr', '/note': 'note', '/letter': 'letter', '/rti': 'rti', '/compare': 'compare',
  '/translate': 'translate', '/risk': 'risk', '/mom': 'mom', '/budget': 'budget',
  '/cabinet': 'cabinet', '/court': 'court', '/grievance': 'grievance', '/tender': 'tender',
  '/audit': 'audit',
}

/**
 * Scored intent match. Every pattern that hits adds its weight, and the highest
 * total wins — so "translate the GR summary to Marathi" resolves to `translate`
 * rather than whichever rule happened to be evaluated last.
 */
const INTENTS: { key: string; patterns: [RegExp, number][] }[] = [
  { key: 'translate', patterns: [[/\btranslat/, 5], [/\bmarathi\b|\bhindi\b|मराठी|हिंदी|अनुवाद/, 4], [/formal register|शासकीय/, 2]] },
  { key: 'rti', patterns: [[/\brti\b/, 6], [/right to information|appellate authority|section 8\(1\)/, 4]] },
  { key: 'court', patterns: [[/\bwrit\b|\bwp\b\s*\d|\bpil\b|high court|supreme court|affidavit|hearing|contempt/, 5], [/\bcase\b.*\bbrief\b|cause list/, 4]] },
  { key: 'grievance', patterns: [[/grievance|aaple sarkar|complaint/, 5], [/\bsla\b.*breach|ageing|pendency.*citizen/, 3]] },
  { key: 'tender', patterns: [[/tender|procure|\bgfr\b|\bbid\b|\bemd\b|\brfp\b/, 5]] },
  { key: 'audit', patterns: [[/audit para|\bag\b audit|accountant general|utilisation certificate|\buc\b pendency/, 5], [/\baudit\b/, 3]] },
  { key: 'cabinet', patterns: [[/cabinet/, 6], [/council of ministers|concurrence/, 3]] },
  { key: 'budget', patterns: [[/budget|utilisation|utilization|expenditure|beams|head-wise|outlay|\bcrore\b|₹/, 5]] },
  { key: 'mom', patterns: [[/minutes|\bmom\b|meeting/, 5], [/action item|next review/, 3]] },
  { key: 'compare', patterns: [[/\bcompare\b|difference between|conflict/, 5], [/circular/, 3]] },
  { key: 'risk', patterns: [[/\brisk\b|compliance|\bdpdp\b|privacy/, 5]] },
  { key: 'letter', patterns: [[/\bletter\b|\bdraft\b.*\bto all\b|covering letter|advisory/, 5]] },
  { key: 'note', patterns: [[/note for approval|noting|\bnote\b/, 5], [/approval hierarchy/, 3]] },
  { key: 'gr', patterns: [[/\bgr\b|government resolution|\bgr-\d|शासन निर्णय/, 5], [/summar/, 3]] },
]

/** Roughly four characters per token — good enough for a live usage meter. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().length / 4))
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Build a grounded answer from what was actually uploaded. Text formats are
 * parsed for real (lines, words, headings, dates, money, Aadhaar-shaped runs);
 * binaries are reported honestly as metadata-only.
 */
function analyseAttachments(atts: CopilotAttachment[]): string {
  const parts: string[] = ['**Document analysis — officer upload**', '']

  atts.forEach((a, i) => {
    parts.push(`**${i + 1}. ${a.name}** · ${humanSize(a.size)} · ${a.mime || 'unknown type'}`)

    if (a.kind !== 'text' || !a.text) {
      parts.push('- Binary format — text layer not extractable in-browser. Route through **OCR Intelligence** for a full read.')
      parts.push('- Metadata recorded in the audit log; the file itself never left this session.')
      parts.push('')
      return
    }

    const text = a.text
    const lines = text.split('\n')
    const words = text.split(/\s+/).filter(Boolean)
    const nonEmpty = lines.filter((l) => l.trim())
    const dates = [...new Set(text.match(/\b\d{1,2}[-/](?:\d{1,2}|[A-Za-z]{3})[-/]\d{2,4}\b/g) ?? [])]
    const money = [...new Set(text.match(/₹\s?[\d,]+(?:\.\d+)?\s?(?:Cr|Lakh|L|crore|lakh)?/gi) ?? [])]
    const refs = [...new Set(text.match(/\b(?:GR|CIR|RTI|WP|SOP)[-/][A-Z0-9/-]+/gi) ?? [])]
    const aadhaarLike = (text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/g) ?? []).length
    const head = nonEmpty.slice(0, 3).map((l) => l.trim().slice(0, 110))

    parts.push(`- **Extent:** ${lines.length} lines · ${words.length} words · ~${estimateTokens(text)} tokens`)
    if (head.length) parts.push(`- **Opening:** ${head.join(' / ')}`)
    if (refs.length) parts.push(`- **References cited:** ${refs.slice(0, 6).join(', ')}`)
    if (dates.length) parts.push(`- **Dates found:** ${dates.slice(0, 6).join(', ')}`)
    if (money.length) parts.push(`- **Financial figures:** ${money.slice(0, 6).join(', ')}`)
    parts.push(
      aadhaarLike > 0
        ? `- **DLP flag:** ${aadhaarLike} Aadhaar-shaped number(s) detected — masked before model input, per DPDP Section 8.`
        : '- **DLP flag:** no Aadhaar-shaped identifiers detected in the extracted text.'
    )
    parts.push('')
  })

  parts.push('**Suggested next steps**')
  parts.push('1. Ask for a clause-level summary, a compliance risk check, or a formal Marathi rendering of this document.')
  parts.push('2. Route the output to approval once the officer has verified figures against the source file.')
  parts.push('')
  parts.push('*Read entirely in-browser on your session — the upload was not transmitted to any external service.*')

  return parts.join('\n')
}

export function pickReply(
  text: string,
  attachments: CopilotAttachment[] = []
): { key: string; text: string; sources: string[] } {
  const t = text.trim().toLowerCase()

  const slash = t.match(/^\/[a-z]+/)?.[0]
  const slashKey = slash ? SLASH_TO_KEY[slash] : undefined

  if (slashKey) {
    return { key: slashKey, text: RESPONSES[slashKey], sources: SOURCES[slashKey] }
  }

  let best: { key: string; score: number } | null = null
  for (const intent of INTENTS) {
    const score = intent.patterns.reduce((sum, [re, w]) => (re.test(t) ? sum + w : sum), 0)
    if (score > 0 && (!best || score > best.score)) best = { key: intent.key, score }
  }

  // An upload with no clear artefact request means "read this for me".
  if (attachments.length > 0 && (!best || best.score < 5)) {
    return {
      key: 'file',
      text: analyseAttachments(attachments),
      sources: [...attachments.map((a) => `${a.name} — officer upload`), ...SOURCES.file.slice(1)],
    }
  }

  const key = best?.key ?? 'default'
  return { key, text: RESPONSES[key] ?? RESPONSES.default, sources: SOURCES[key] ?? SOURCES.default }
}

/* ------------------------------------------------------------------ */
/* Policy routing — classification decides which models may be used    */
/* ------------------------------------------------------------------ */

export type PolicyVerdict = { allowed: boolean; reason: string }

/**
 * Whether a model may serve a prompt at the given classification.
 * Secret never leaves the state data centre; Confidential never goes to a
 * cloud endpoint; everything else follows the model's approval list.
 */
export function modelPolicy(model: ModelEntry, secClass: string): PolicyVerdict {
  if (secClass === 'Secret') {
    return model.hosting === 'On-Prem'
      ? { allowed: true, reason: 'On-prem inference — Secret data stays in the state data centre.' }
      : { allowed: false, reason: 'Secret prompts may not leave the state data centre — cloud and hybrid endpoints are blocked.' }
  }
  if (secClass === 'Confidential') {
    if (model.hosting === 'Cloud') {
      return { allowed: false, reason: 'Confidential prompts may not be sent to a cloud-hosted model.' }
    }
    return model.approvedFor.includes('Confidential')
      ? { allowed: true, reason: 'Approved for Confidential workloads by the AI Governance Council.' }
      : { allowed: false, reason: 'Model is not on the approved list for Confidential workloads.' }
  }
  const approved = model.approvedFor.some((a) => a.toLowerCase().startsWith(secClass.toLowerCase()))
  return approved
    ? { allowed: true, reason: `Approved for ${secClass} workloads.` }
    : { allowed: false, reason: `Model is not approved for ${secClass} workloads.` }
}

/**
 * Keep the officer's chosen model when policy permits it, otherwise fall back
 * to the highest-assurance on-prem model that is allowed.
 */
export function routeModel(models: ModelEntry[], currentId: string, secClass: string): ModelEntry {
  const current = models.find((m) => m.id === currentId)
  if (current && modelPolicy(current, secClass).allowed) return current
  const fallback = models.find((m) => modelPolicy(m, secClass).allowed && m.hosting === 'On-Prem')
  return fallback ?? models.find((m) => modelPolicy(m, secClass).allowed) ?? models[0]
}

/* ------------------------------------------------------------------ */
/* Markdown conversion — for clipboard and Word export                 */
/* ------------------------------------------------------------------ */

/** Strip markdown markers for plain-text clipboard copy. */
export function mdToPlain(md: string): string {
  return md
    .split('\n')
    .map((l) =>
      l
        .replace(/^#{1,3}\s+/, '')
        .replace(/^- \[x\] /i, '✓ ')
        .replace(/^- \[ \] /, '□ ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
    )
    .join('\n')
}

function inlineHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/** Convert the answer subset of markdown to Word-friendly HTML. */
export function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false
  let inTable = false

  const closeList = () => { if (inList) { out.push('</ul>'); inList = false } }
  const closeTable = () => { if (inTable) { out.push('</table>'); inTable = false } }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\s*\|.*\|\s*$/.test(line)) {
      if (/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line)) continue // separator row
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      closeList()
      if (!inTable) {
        out.push('<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;">')
        inTable = true
        out.push('<tr>' + cells.map((c) => `<th align="left">${inlineHtml(c)}</th>`).join('') + '</tr>')
        continue
      }
      out.push('<tr>' + cells.map((c) => `<td>${inlineHtml(c)}</td>`).join('') + '</tr>')
      continue
    }
    closeTable()

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      closeList()
      const level = Math.min(3, heading[1].length) + 1
      out.push(`<h${level}>${inlineHtml(heading[2])}</h${level}>`)
      continue
    }

    const check = line.match(/^- \[( |x)\] (.*)$/i)
    if (check) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${check[1].toLowerCase() === 'x' ? '✓' : '□'} ${inlineHtml(check[2])}</li>`)
      continue
    }

    const bullet = line.match(/^- (.*)$/)
    if (bullet) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inlineHtml(bullet[1])}</li>`)
      continue
    }

    const ordered = line.match(/^\d+\. (.*)$/)
    if (ordered) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inlineHtml(ordered[1])}</li>`)
      continue
    }

    closeList()
    if (line.trim() === '') { out.push('<p></p>'); continue }
    out.push(`<p>${inlineHtml(line)}</p>`)
  }

  closeList()
  closeTable()
  return out.join('\n')
}

/* ------------------------------------------------------------------ */
/* Conversation history — persisted sessions (localStorage, capped)    */
/* ------------------------------------------------------------------ */

export type CopilotSession = {
  id: string
  title: string
  updatedAt: number
  messages: CopilotMsg[]
  pinned?: boolean
}

const SESSIONS_KEY = 'maii-copilot-sessions'
export const MAX_SESSIONS = 40

/** Load persisted sessions, newest first. Never throws — private mode degrades to []. */
export function loadSessions(): CopilotSession[] {
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is CopilotSession =>
        !!s && typeof s.id === 'string' && typeof s.title === 'string' && Array.isArray(s.messages))
      .sort(sessionOrder)
      .slice(0, MAX_SESSIONS)
  } catch {
    return []
  }
}

/** Pinned sessions float to the top, then most-recent first. */
function sessionOrder(a: CopilotSession, b: CopilotSession): number {
  if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
  return b.updatedAt - a.updatedAt
}

/** Persist sessions (pinned first, capped). Never throws. */
export function saveSessions(list: CopilotSession[]): void {
  try {
    const capped = [...list].sort(sessionOrder).slice(0, MAX_SESSIONS)
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(capped))
  } catch {
    /* quota exceeded / private mode — non-fatal */
  }
}

/* ------------------------------------------------------------------ */
/* Approval workflow — answers routed into the e-Office chain          */
/* ------------------------------------------------------------------ */

export type ApprovalRecord = {
  id: string
  fileNo: string
  subject: string
  approver: string
  note: string
  body: string
  createdAt: number
  status: 'Pending' | 'Approved' | 'Returned'
}

const APPROVALS_KEY = 'maii-copilot-approvals'
export const APPROVERS = [
  'Under Secretary (DIT)',
  'Deputy Secretary (DIT)',
  'Joint Secretary (GAD)',
  'Principal Secretary (DIT)',
  'Chief Secretary',
]

export function loadApprovals(): ApprovalRecord[] {
  try {
    const raw = window.localStorage.getItem(APPROVALS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveApprovals(list: ApprovalRecord[]): void {
  try {
    window.localStorage.setItem(APPROVALS_KEY, JSON.stringify(list.slice(0, 50)))
  } catch {
    /* non-fatal */
  }
}

/** Sequential-looking file number for a newly raised approval. */
export function nextFileNo(existing: ApprovalRecord[]): string {
  const year = new Date().getFullYear()
  return `DIT/MAII/${year}/${String(existing.length + 101).padStart(3, '0')}`
}

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

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

export { humanSize }
