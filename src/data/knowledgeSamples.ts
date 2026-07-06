// Sample data for enriched Knowledge Brain pages.
// Do NOT touch src/data/knowledge.ts — extend everything from here.

export interface TrendingQuery {
  q: string
  count: number
  delta: number
}

export const TRENDING_QUERIES: TrendingQuery[] = [
  { q: 'PMAY-U 2.0 beneficiary verification checklist', count: 412, delta: 22.4 },
  { q: 'DPDP consent lifecycle SOP', count: 388, delta: 18.1 },
  { q: 'Marathi drafting standards for note sheets', count: 341, delta: 12.6 },
  { q: 'RTE 25% admission verification timeline', count: 307, delta: 9.2 },
  { q: 'MAII acceptable-use policy', count: 289, delta: 7.8 },
  { q: 'ASHA honorarium revision GR', count: 254, delta: -4.1 },
  { q: 'e-Fasal Bima district grievance SOP', count: 231, delta: 5.5 },
  { q: 'Human-in-the-loop SOP for AI outputs', count: 209, delta: 14.9 },
]

export interface DeptCoverage {
  code: string
  name: string
  coverage: number
  indexed: number
}

export const DEPT_COVERAGE_LEADERBOARD: DeptCoverage[] = [
  { code: 'DIT', name: 'Directorate of IT', coverage: 96, indexed: 4820 },
  { code: 'GAD', name: 'General Administration', coverage: 92, indexed: 3910 },
  { code: 'FIN', name: 'Finance', coverage: 89, indexed: 2740 },
  { code: 'UDD', name: 'Urban Development', coverage: 87, indexed: 3120 },
  { code: 'HFW', name: 'Public Health', coverage: 84, indexed: 2960 },
  { code: 'REV', name: 'Revenue & Forests', coverage: 81, indexed: 3540 },
]

export interface GraphNode {
  id: string
  label: string
  kind: 'GR' | 'SOP' | 'Circular' | 'Policy'
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  label: string
}

// 6 nodes / 7 edges — laid out for a 640×280 SVG viewBox.
export const KNOWLEDGE_GRAPH: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [
    { id: 'GR-URD-118', label: 'PMAY-U 2.0 Guidelines', kind: 'GR', x: 320, y: 40 },
    { id: 'GR-URD-092', label: 'Grievance SOP GR', kind: 'GR', x: 110, y: 130 },
    { id: 'GR-URD-074', label: 'Housing Data Standards', kind: 'GR', x: 530, y: 130 },
    { id: 'SOP-DPO-004', label: 'DPDP Consent SOP', kind: 'SOP', x: 200, y: 240 },
    { id: 'CIR-DIT-014', label: 'MAII Roll-out Advisory', kind: 'Circular', x: 440, y: 240 },
    { id: 'POL-AI-001', label: 'Acceptable-Use of AI', kind: 'Policy', x: 320, y: 165 },
  ],
  edges: [
    { from: 'GR-URD-118', to: 'GR-URD-092', label: 'references' },
    { from: 'GR-URD-118', to: 'GR-URD-074', label: 'supersedes clauses' },
    { from: 'GR-URD-118', to: 'POL-AI-001', label: 'invokes' },
    { from: 'GR-URD-092', to: 'SOP-DPO-004', label: 'binds' },
    { from: 'GR-URD-074', to: 'CIR-DIT-014', label: 'notified via' },
    { from: 'POL-AI-001', to: 'SOP-DPO-004', label: 'depends on' },
    { from: 'POL-AI-001', to: 'CIR-DIT-014', label: 'roll-out' },
  ],
}

export interface GRYearBucket {
  year: number
  count: number
}

export const GR_BY_YEAR: GRYearBucket[] = [
  { year: 2022, count: 4820 },
  { year: 2023, count: 5310 },
  { year: 2024, count: 6120 },
  { year: 2025, count: 6740 },
  { year: 2026, count: 3480 },
]

export interface GRDeptCount {
  dept: string
  grs: number
}

export const GR_TOP_DEPTS: GRDeptCount[] = [
  { dept: 'REV', grs: 1240 },
  { dept: 'UDD', grs: 1085 },
  { dept: 'HFW', grs: 960 },
  { dept: 'EDU', grs: 812 },
  { dept: 'RD', grs: 774 },
  { dept: 'FIN', grs: 690 },
  { dept: 'HOME', grs: 612 },
  { dept: 'AGR', grs: 588 },
]

export interface RecentGR {
  id: string
  title: string
  dept: string
  date: string
}

export const NEW_GRS_7D: RecentGR[] = [
  { id: 'GR-2026-URD-118', title: 'PMAY (Urban) 2.0 — Beneficiary Verification Guidelines', dept: 'UDD', date: '2026-07-04' },
  { id: 'GR-2026-REV-098', title: 'Land Revenue Adalat — Quarterly Cadence Notification', dept: 'REV', date: '2026-07-04' },
  { id: 'GR-2026-HFW-063', title: 'District Hospital Empanelment — Revised Rate List', dept: 'HFW', date: '2026-07-03' },
  { id: 'GR-2026-DIT-027', title: 'Sovereign LLM Procurement Framework — Amendment II', dept: 'DIT', date: '2026-07-02' },
  { id: 'GR-2026-EDU-041', title: 'RTE Online Verification — Extended Timeline', dept: 'EDU', date: '2026-07-01' },
  { id: 'GR-2026-WCD-019', title: 'Anganwadi Nutrition Grant — Revised Norms', dept: 'WCD', date: '2026-06-30' },
  { id: 'GR-2026-LAB-011', title: 'Gig-worker Registration SOP', dept: 'LAB', date: '2026-06-29' },
]

export interface Amendment {
  parent: string
  amends: string
  status: 'Supersedes' | 'Amends' | 'Clarifies' | 'Withdrawn'
  effective: string
  summary: string
}

export const AMENDMENT_TRACKER: Amendment[] = [
  {
    parent: 'GR-2026-URD-118',
    amends: 'GR-2024-URD-074',
    status: 'Supersedes',
    effective: '2026-07-04',
    summary: 'Beneficiary verification checklist replaces Housing Data Standards clauses 4.2–4.9.',
  },
  {
    parent: 'GR-2026-REV-092',
    amends: 'GR-2023-REV-051',
    status: 'Amends',
    effective: '2026-07-02',
    summary: 'District-level e-Fasal Bima grievance escalation window reduced from 21 to 14 days.',
  },
  {
    parent: 'GR-2026-HFW-058',
    amends: 'GR-2022-HFW-088',
    status: 'Amends',
    effective: '2026-06-25',
    summary: 'ASHA honorarium revised; ration allowance re-scoped to talukas with GP coverage below 60%.',
  },
  {
    parent: 'GR-2026-EDU-034',
    amends: 'GR-2025-EDU-020',
    status: 'Clarifies',
    effective: '2026-06-29',
    summary: 'Clarifies RTE 25% verification cutoff — deputy-collector countersign now mandatory.',
  },
  {
    parent: 'GR-2026-DIT-027',
    amends: 'GR-2025-DIT-014',
    status: 'Amends',
    effective: '2026-07-02',
    summary: 'Sovereign LLM procurement — adds mandatory red-team clause and DPDP DPO sign-off.',
  },
]

export interface CircularCategoryRow {
  category: 'Operational' | 'Advisory' | 'Directive' | 'Clarificatory'
  count: number
  color: string
}

export const CIRCULAR_CATEGORIES: CircularCategoryRow[] = [
  { category: 'Operational', count: 46, color: '#D81B60' },
  { category: 'Advisory', count: 32, color: '#EC407A' },
  { category: 'Directive', count: 21, color: '#6A1B9A' },
  { category: 'Clarificatory', count: 18, color: '#4A148C' },
]

export interface AckItem {
  id: string
  title: string
  dept: string
  due: string
  officers: number
  ackd: number
}

export const ACKNOWLEDGEMENT_QUEUE: AckItem[] = [
  { id: 'CIR-2026-DIT-014', title: 'MAII AI Workspace — Roll-out Advisory', dept: 'DIT', due: '2026-07-12', officers: 480, ackd: 291 },
  { id: 'CIR-2026-GAD-021', title: 'Marathi drafting standards for note sheets', dept: 'GAD', due: '2026-07-15', officers: 1220, ackd: 812 },
  { id: 'CIR-2026-HOME-009', title: 'Cyber-hygiene refresher — mandatory training', dept: 'HOME', due: '2026-07-18', officers: 3410, ackd: 1204 },
  { id: 'CIR-2026-HFW-013', title: 'ORS+ ORS kit distribution — monsoon SOP', dept: 'HFW', due: '2026-07-20', officers: 6320, ackd: 3011 },
  { id: 'CIR-2026-FIN-006', title: 'Quarter-end expenditure certification', dept: 'FIN', due: '2026-07-10', officers: 940, ackd: 704 },
]

export interface CircularSOPLink {
  circular: string
  circularTitle: string
  sops: string[]
}

export const CIRCULAR_SOP_LINKS: CircularSOPLink[] = [
  {
    circular: 'CIR-2026-DIT-014',
    circularTitle: 'MAII Roll-out Advisory',
    sops: ['SOP-2026-AI-002 · Human-in-the-loop', 'SOP-2026-DPO-004 · DPDP Consent'],
  },
  {
    circular: 'CIR-2026-GAD-021',
    circularTitle: 'Marathi drafting standards',
    sops: ['SOP-2026-GAD-003 · Note-sheeting style', 'SOP-2026-GAD-005 · Bilingual publish'],
  },
  {
    circular: 'CIR-2026-HFW-013',
    circularTitle: 'ORS kit distribution monsoon SOP',
    sops: ['SOP-2026-HFW-011 · Cold-chain', 'SOP-2026-HFW-012 · Field reporting'],
  },
  {
    circular: 'CIR-2026-FIN-006',
    circularTitle: 'Quarter-end expenditure certification',
    sops: ['SOP-2026-FIN-002 · UC generation', 'SOP-2026-FIN-004 · DDO reconciliation'],
  },
]

export interface SOPReviewRow {
  id: string
  title: string
  owner: string
  due: string
  freshness: number // 0..100
}

export const SOP_REVIEW_CALENDAR: SOPReviewRow[] = [
  { id: 'SOP-2026-DPO-004', title: 'DPDP Consent Lifecycle', owner: 'DPO Office', due: '2026-07-14', freshness: 92 },
  { id: 'SOP-2026-AI-002', title: 'Human-in-the-loop for AI outputs', owner: 'AI Governance', due: '2026-07-21', freshness: 88 },
  { id: 'SOP-2026-FIN-002', title: 'Utilization Certificate generation', owner: 'Finance – DDO cell', due: '2026-08-02', freshness: 74 },
  { id: 'SOP-2026-GAD-003', title: 'Marathi note-sheeting style', owner: 'GAD Language Lab', due: '2026-08-09', freshness: 66 },
  { id: 'SOP-2026-REV-007', title: 'e-Fasal Bima district redressal', owner: 'Revenue – Grievance cell', due: '2026-08-19', freshness: 58 },
  { id: 'SOP-2026-HFW-011', title: 'Cold-chain SOP for vaccines', owner: 'Public Health', due: '2026-08-24', freshness: 47 },
]

export interface SOPStep {
  step: number
  title: string
  actor: string
  minutes: number
  requires?: string
}

export const SOP_PREVIEW = {
  id: 'SOP-2026-DPO-004',
  title: 'DPDP Consent Lifecycle SOP',
  owner: 'DPO Office',
  version: '1.4',
  effective: '2026-06-14',
  steps: [
    { step: 1, title: 'Identify processing purpose & lawful basis', actor: 'Data Fiduciary', minutes: 15 },
    { step: 2, title: 'Draft plain-language consent notice (bilingual)', actor: 'Programme Officer', minutes: 45, requires: 'Marathi copy' },
    { step: 3, title: 'DPO review and approval', actor: 'Department DPO', minutes: 30 },
    { step: 4, title: 'Publish notice + record consent artefact', actor: 'IT Admin', minutes: 20 },
    { step: 5, title: 'Track withdrawal & purge on request', actor: 'Data Fiduciary', minutes: 15 },
    { step: 6, title: 'Quarterly audit + reporting to State DPO', actor: 'Governance', minutes: 60 },
  ] as SOPStep[],
}

export interface SOPPopularity {
  id: string
  title: string
  dept: string
  views: number
  delta: number
}

export const SOP_MOST_VIEWED: SOPPopularity[] = [
  { id: 'SOP-2026-DPO-004', title: 'DPDP Consent Lifecycle', dept: 'DPO', views: 12480, delta: 18.4 },
  { id: 'SOP-2026-AI-002', title: 'Human-in-the-loop for AI outputs', dept: 'AI Gov', views: 9820, delta: 12.1 },
  { id: 'SOP-2026-GAD-003', title: 'Marathi note-sheeting style', dept: 'GAD', views: 7410, delta: 8.7 },
  { id: 'SOP-2026-FIN-002', title: 'Utilization Certificate generation', dept: 'FIN', views: 6120, delta: 4.3 },
  { id: 'SOP-2026-REV-007', title: 'e-Fasal Bima district redressal', dept: 'REV', views: 4890, delta: -2.9 },
]

// Extended FAQ set — 24 items across categories.
export type FAQCategory =
  | 'Platform'
  | 'Security'
  | 'DPDP'
  | 'Drafting'
  | 'Models'
  | 'Integrations'
  | 'RBAC'
  | 'On-prem'
  | 'Incidents'

export interface FAQRow {
  q: string
  a: string
  category: FAQCategory
  views: number
}

export const FAQ_ROWS: FAQRow[] = [
  { category: 'Platform', views: 2410, q: 'How do I upload a GR for analysis?', a: 'Go to Administrative AI → GR Analysis, drop the GR PDF or paste a public GR link from gr.maharashtra.gov.in. MAII will extract clauses, effective date and compliance obligations.' },
  { category: 'Platform', views: 1980, q: 'Can I use MAII on my mobile device?', a: 'Yes, but only from a managed device with MFA. BYOD access is restricted to Public and Internal classifications.' },
  { category: 'Platform', views: 1540, q: 'Where can I see who approved my note?', a: 'Every draft carries a decision trace under Governance → Explainability, including each approver, timestamp, and model prompt.' },
  { category: 'Platform', views: 1210, q: 'Does MAII work offline?', a: 'Partially — cached knowledge and draft SOPs are available offline in the field app; new inference requires network access to the on-prem cluster.' },
  { category: 'Security', views: 2860, q: 'How is my prompt kept confidential?', a: 'Prompts classified as Confidential or Secret are routed only to on-prem models. All prompts are DLP-scanned, logged and audited under Zero Trust.' },
  { category: 'Security', views: 1970, q: 'Are prompts and responses encrypted?', a: 'Yes — TLS 1.3 in transit, AES-256 at rest. Session keys are rotated per-request for Confidential and above.' },
  { category: 'Security', views: 1420, q: 'Can I paste Aadhaar into a prompt?', a: 'No. The DLP layer will redact Aadhaar, PAN, and phone numbers before the prompt reaches the model, and log a policy hit.' },
  { category: 'DPDP', views: 2620, q: 'How do I raise a DPO concern?', a: 'From DPDP → Privacy Risk, click "New PIA". The workflow will route to the DPO of your department with SLA tracking.' },
  { category: 'DPDP', views: 2130, q: 'What consent record does MAII keep?', a: 'For every citizen touchpoint, MAII stores the notice text, language, timestamp, purpose, and withdrawal state — retrievable under DPDP → Consent Ledger.' },
  { category: 'DPDP', views: 1660, q: 'How is data retention enforced?', a: 'Retention policies are attached at ingest. Records past their retention window are purged nightly and a signed erase-manifest is produced.' },
  { category: 'Drafting', views: 2340, q: 'How is Marathi translation quality verified?', a: 'Sarvam-M is fine-tuned on the GAD Marathi corpus. Legal phrasing is human-reviewed by the Language Lab before publish.' },
  { category: 'Drafting', views: 1720, q: 'Can MAII draft a full GR from bullet points?', a: 'Yes — use Administrative AI → GR Drafting. It produces a draft with clause numbering, citations to prior GRs, and a Marathi companion.' },
  { category: 'Drafting', views: 1290, q: 'How do I add a template for RTI replies?', a: 'Templates live in Knowledge Brain → SOP. Upload the template, tag it "RTI Reply", and it becomes available in the drafting assistant.' },
  { category: 'Models', views: 2480, q: 'What is the difference between BharatGPT and Sarvam-M?', a: 'BharatGPT is a sovereign Council-owned model deployed on-prem for confidential workloads. Sarvam-M is optimised for Marathi drafting and citizen communication in bilingual scenarios.' },
  { category: 'Models', views: 1880, q: 'How is the routing decision made?', a: 'The router looks at classification, department policy, latency budget and language, then picks the cheapest compliant model.' },
  { category: 'Models', views: 1350, q: 'Can I pin a specific model for my workflow?', a: 'Section Officers and above can pin a preferred model per workflow; the pin is honoured unless it violates the classification policy.' },
  { category: 'Integrations', views: 1720, q: 'Does MAII integrate with e-Office?', a: 'Yes — via the NIC e-Office API. File movements and note sheets can be imported into MAII with the same access controls.' },
  { category: 'Integrations', views: 1210, q: 'Can we ingest Aaple Sarkar tickets?', a: 'Aaple Sarkar exposure requires a Department API key. Once linked, RTS grievances flow into the Grievance Copilot with SLA tracking.' },
  { category: 'RBAC', views: 1930, q: 'How are roles managed?', a: 'Roles map to e-HRMS designations. Escalations, cross-department views, and DPO-only screens are gated by attribute-based rules.' },
  { category: 'RBAC', views: 1420, q: 'Can I delegate access when I am on leave?', a: 'Yes — delegation is time-bound, requires the delegatee to be same-department, and produces an audit trail.' },
  { category: 'On-prem', views: 1610, q: 'Where does the on-prem cluster run?', a: 'The sovereign cluster runs on the State Data Centre in Mumbai with a DR site in Nagpur. Confidential/Secret workloads never leave the cluster.' },
  { category: 'On-prem', views: 1240, q: 'How large is the on-prem GPU pool?', a: 'The current pool supports Council-scale inference for BharatGPT and Sarvam-M. Capacity dashboards live under Platform → Compute.' },
  { category: 'Incidents', views: 2010, q: 'What happens during an AI incident?', a: 'An incident opens under Governance → AI Incident Management. AI SOC investigates, applies mitigation, and updates the risk register.' },
  { category: 'Incidents', views: 1490, q: 'Whom do I contact for a suspected prompt leak?', a: 'Raise a Security → Incident with category "Prompt exfiltration". The AI SOC pages the DPO and freezes the affected session within 60 seconds.' },
]

export const FAQ_POPULAR_THIS_WEEK: { q: string; views: number; delta: number }[] = [
  { q: 'How is my prompt kept confidential?', views: 2860, delta: 24.1 },
  { q: 'What is the difference between BharatGPT and Sarvam-M?', views: 2480, delta: 18.7 },
  { q: 'How do I raise a DPO concern?', views: 2620, delta: 14.3 },
  { q: 'How do I upload a GR for analysis?', views: 2410, delta: 9.8 },
  { q: 'How is Marathi translation quality verified?', views: 2340, delta: 7.6 },
]

// Extended officer roster — 18 entries.
export type ServiceType = 'IAS' | 'MPSC' | 'IPS' | 'IFS' | 'Contract'
export type Region = 'Konkan' | 'Vidarbha' | 'Marathwada' | 'Western Maharashtra' | 'North Maharashtra'

export interface OfficerRow {
  name: string
  role: string
  dept: string
  posting: string
  service: string
  serviceType: ServiceType
  region: Region
  reportsTo?: string
}

export const OFFICERS_EXT: OfficerRow[] = [
  { name: 'Nitin Kareer', role: 'Chief Secretary', dept: 'GAD', posting: 'Mantralaya, Mumbai', service: 'IAS-1985-MH-0021', serviceType: 'IAS', region: 'Konkan' },
  { name: 'Sujata Saunik', role: 'Additional Chief Secretary (Home)', dept: 'HOME', posting: 'Mantralaya, Mumbai', service: 'IAS-1987-MH-0042', serviceType: 'IAS', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'Rajesh Mahajan', role: 'Principal Secretary (IT)', dept: 'DIT', posting: 'Mantralaya, Mumbai', service: 'IAS-2011-MH-0182', serviceType: 'IAS', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'Milind Mhaiskar', role: 'Principal Secretary (UDD)', dept: 'UDD', posting: 'Mantralaya, Mumbai', service: 'IAS-1993-MH-0058', serviceType: 'IAS', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'V. Radha', role: 'Principal Secretary (Finance)', dept: 'FIN', posting: 'Mantralaya, Mumbai', service: 'IAS-1995-MH-0067', serviceType: 'IAS', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'Manisha Mhaiskar', role: 'Principal Secretary (Public Health)', dept: 'HFW', posting: 'Mantralaya, Mumbai', service: 'IAS-1996-MH-0071', serviceType: 'IAS', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'Praveen Darade', role: 'District Collector', dept: 'REV', posting: 'Aurangabad', service: 'IAS-2013-MH-0244', serviceType: 'IAS', region: 'Marathwada', reportsTo: 'V. Radha' },
  { name: 'Ashutosh Salil', role: 'Municipal Commissioner', dept: 'UDD', posting: 'Nashik', service: 'IAS-2014-MH-0273', serviceType: 'IAS', region: 'North Maharashtra', reportsTo: 'Milind Mhaiskar' },
  { name: 'Rahul Rekhawar', role: 'District Collector', dept: 'REV', posting: 'Kolhapur', service: 'IAS-2015-MH-0298', serviceType: 'IAS', region: 'Western Maharashtra', reportsTo: 'V. Radha' },
  { name: 'Neha Bhosle', role: 'CEO Zilla Parishad', dept: 'RD', posting: 'Nagpur', service: 'IAS-2016-MH-0311', serviceType: 'IAS', region: 'Vidarbha', reportsTo: 'Nitin Kareer' },
  { name: 'S. Kadam', role: 'Data Protection Officer', dept: 'HFW', posting: 'Pune', service: 'MPSC-2014-0812', serviceType: 'MPSC', region: 'Western Maharashtra', reportsTo: 'Manisha Mhaiskar' },
  { name: 'A. Deshmukh', role: 'AI Governance Officer', dept: 'DIT', posting: 'Mumbai', service: 'MPSC-2016-0921', serviceType: 'MPSC', region: 'Konkan', reportsTo: 'Rajesh Mahajan' },
  { name: 'K. Patil', role: 'Section Officer (Drafting)', dept: 'GAD', posting: 'Mumbai', service: 'MPSC-2018-1104', serviceType: 'MPSC', region: 'Konkan', reportsTo: 'Nitin Kareer' },
  { name: 'R. More', role: 'Deputy Commissioner (Cyber)', dept: 'HOME', posting: 'Pune', service: 'IPS-2012-MH-0064', serviceType: 'IPS', region: 'Western Maharashtra', reportsTo: 'Sujata Saunik' },
  { name: 'P. Jadhav', role: 'Superintendent of Police', dept: 'HOME', posting: 'Amravati', service: 'IPS-2015-MH-0088', serviceType: 'IPS', region: 'Vidarbha', reportsTo: 'Sujata Saunik' },
  { name: 'D. Rathod', role: 'Divisional Forest Officer', dept: 'REV', posting: 'Gadchiroli', service: 'IFS-2013-MH-0032', serviceType: 'IFS', region: 'Vidarbha', reportsTo: 'V. Radha' },
  { name: 'S. Iyer', role: 'IT Admin (State Data Centre)', dept: 'DIT', posting: 'Mumbai', service: 'Contract-DIT-2024-0071', serviceType: 'Contract', region: 'Konkan', reportsTo: 'A. Deshmukh' },
  { name: 'M. Naik', role: 'Language Lab Lead', dept: 'GAD', posting: 'Ratnagiri', service: 'MPSC-2019-1189', serviceType: 'MPSC', region: 'Konkan', reportsTo: 'K. Patil' },
]

export const RECENTLY_VIEWED_OFFICERS = [
  'Rajesh Mahajan',
  'Milind Mhaiskar',
  'Praveen Darade',
  'S. Kadam',
  'A. Deshmukh',
]
