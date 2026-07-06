import type { ModelEntry } from './models'

/**
 * Extra model rows used only by the Governance section — additive to
 * @/data/models. Kept here so we do not have to touch models.ts.
 */
export const EXTRA_MODELS: ModelEntry[] = [
  {
    id: 'krutrim-pro',
    name: 'Krutrim Pro — Indic',
    provider: 'Ola Krutrim',
    version: '1.6',
    hosting: 'Hybrid',
    approvedFor: ['Internal', 'Public'],
    riskClass: 'Medium',
    accuracy: 87,
    latencyMs: 540,
    lastEvaluation: '2026-06-05',
    owner: 'DIT — Language Lab',
    status: 'Under Review',
    costPer1K: 0.4,
    languageStrength: 94,
    documentStrength: 80,
    securityRating: 'A',
    useCases: ['Marathi/Hindi Q&A', 'Citizen chatbots'],
    failover: 'Sarvam-M',
    deploymentMode: 'Hybrid — on-prem inference, cloud fine-tune',
  },
  {
    id: 'phi-4-sarkar',
    name: 'Phi-4 Sarkar-Tiny',
    provider: 'Microsoft (fine-tuned)',
    version: '4.0-DIT',
    hosting: 'On-Prem',
    approvedFor: ['Internal', 'Public'],
    riskClass: 'Low',
    accuracy: 84,
    latencyMs: 180,
    lastEvaluation: '2026-06-22',
    owner: 'DIT AI Lab',
    status: 'Approved',
    costPer1K: 0.0,
    languageStrength: 82,
    documentStrength: 78,
    securityRating: 'A+',
    useCases: ['Edge OCR', 'Tehsil-level summary'],
    failover: 'Gemma 2 9B',
    deploymentMode: 'Edge — Taluka offices',
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral (via Sarkar Cloud proxy)',
    version: '2.1',
    hosting: 'Cloud',
    approvedFor: ['Public'],
    riskClass: 'Medium',
    accuracy: 91,
    latencyMs: 460,
    lastEvaluation: '2026-06-08',
    owner: 'DIT — External Models',
    status: 'Under Review',
    costPer1K: 3.0,
    languageStrength: 80,
    documentStrength: 88,
    securityRating: 'B',
    useCases: ['French/EU liaison notes', 'Trade doc parsing'],
    failover: 'GPT-4o',
    deploymentMode: 'Cloud proxy with DLP filter',
  },
  {
    id: 'legacy-t5',
    name: 'IndicT5 Legacy',
    provider: 'AI4Bharat',
    version: '1.2',
    hosting: 'On-Prem',
    approvedFor: ['Internal'],
    riskClass: 'High',
    accuracy: 74,
    latencyMs: 340,
    lastEvaluation: '2025-11-15',
    owner: 'DIT — Language Lab',
    status: 'Retired',
    costPer1K: 0.0,
    languageStrength: 78,
    documentStrength: 62,
    securityRating: 'B',
    useCases: ['Legacy translation'],
    failover: 'Sarvam-M',
    deploymentMode: 'On-prem archived pod',
  },
]

/** Extra prompts for PromptRegistry filter bar demo. */
export interface PromptRow {
  name: string
  department: string
  version: string
  risk: 'Low' | 'Medium' | 'High'
  createdBy: string
  approvedBy: string
  status: 'Draft' | 'Approved' | 'Deprecated' | 'Needs Review'
  updated: string
}
export const EXTRA_PROMPTS: PromptRow[] = [
  { name: 'Tehsil grievance triage', department: 'REV', version: 'v1', risk: 'Medium', createdBy: 'M. Kore', approvedBy: '—', status: 'Draft', updated: '2026-07-04' },
  { name: 'Panchayat resolution summary', department: 'RDD', version: 'v2', risk: 'Low', createdBy: 'S. Jadhav', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-29' },
  { name: 'Health advisory (Marathi)', department: 'HFW', version: 'v2', risk: 'Medium', createdBy: 'P. Naik', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-22' },
  { name: 'Budget line-item explain', department: 'FIN', version: 'v1', risk: 'High', createdBy: 'R. Bhosale', approvedBy: '—', status: 'Needs Review', updated: '2026-07-05' },
  { name: 'Scheme eligibility chat', department: 'WCD', version: 'v3', risk: 'Medium', createdBy: 'S. Mahale', approvedBy: 'AI Gov Officer', status: 'Approved', updated: '2026-06-30' },
  { name: 'Court order digest', department: 'LAW', version: 'v1', risk: 'High', createdBy: 'K. Rao', approvedBy: '—', status: 'Draft', updated: '2026-07-05' },
]

/** Additional risk register entries. */
export interface RiskRow {
  id: string
  useCase: string
  department: string
  type: string
  severity: 'Low' | 'Medium' | 'High'
  probability: number
  mitigation: string
  owner: string
  status: 'Open' | 'Under Review' | 'Approved' | 'Closed'
  reviewDate: string
}
export const EXTRA_RISKS: RiskRow[] = [
  { id: 'RISK-010', useCase: 'Chatbot citizen advisory', department: 'HFW', type: 'Wrong Recommendation', severity: 'Medium', probability: 24, mitigation: 'Disclaimer + escalation route', owner: 'AI Gov Officer', status: 'Approved', reviewDate: '2026-08-15' },
  { id: 'RISK-011', useCase: 'Vendor invoice extraction', department: 'FIN', type: 'OCR Error', severity: 'Low', probability: 30, mitigation: 'Dual-model consensus + human check > ₹10L', owner: 'CFO Cell', status: 'Approved', reviewDate: '2026-09-01' },
  { id: 'RISK-012', useCase: 'HR performance triage', department: 'GAD', type: 'Bias', severity: 'High', probability: 20, mitigation: 'Fairness audit each cycle', owner: 'AI Gov Officer', status: 'Under Review', reviewDate: '2026-07-30' },
  { id: 'RISK-013', useCase: 'Public grievance tagging', department: 'ALL', type: 'Hallucination', severity: 'Medium', probability: 18, mitigation: 'Retrieval-augmented + tag whitelist', owner: 'AI SOC', status: 'Approved', reviewDate: '2026-08-20' },
  { id: 'RISK-014', useCase: 'Compliance clause suggest', department: 'LAW', type: 'Policy Non-Compliance', severity: 'High', probability: 12, mitigation: 'Statute reference required', owner: 'DPO', status: 'Open', reviewDate: '2026-07-28' },
  { id: 'RISK-015', useCase: 'Auto-translate portal', department: 'ALL', type: 'Language Drift', severity: 'Low', probability: 26, mitigation: 'Quarterly reviewer panel', owner: 'Language Lab', status: 'Closed', reviewDate: '2026-06-30' },
]

/** Approval queue expanded set. */
export interface ApprovalItem {
  id: string
  title: string
  dept: string
  officer: string
  due: string
  risk: 'Low' | 'Medium' | 'High'
  col: 'Awaiting Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated'
}
export const EXTRA_APPROVALS: ApprovalItem[] = [
  { id: 'AP-409', title: 'Scheme eligibility chat (v3)', dept: 'WCD', officer: 'S. Mahale', due: '2026-07-08', risk: 'Medium', col: 'Awaiting Review' },
  { id: 'AP-410', title: 'Budget line-item explain', dept: 'FIN', officer: 'R. Bhosale', due: '2026-07-09', risk: 'High', col: 'Under Review' },
  { id: 'AP-411', title: 'Court order digest', dept: 'LAW', officer: 'K. Rao', due: '2026-07-07', risk: 'High', col: 'Escalated' },
  { id: 'AP-412', title: 'Health advisory (MR)', dept: 'HFW', officer: 'P. Naik', due: '2026-07-12', risk: 'Medium', col: 'Approved' },
  { id: 'AP-413', title: 'Panchayat resolution summary', dept: 'RDD', officer: 'S. Jadhav', due: '2026-07-11', risk: 'Low', col: 'Approved' },
  { id: 'AP-414', title: 'Tehsil grievance triage', dept: 'REV', officer: 'M. Kore', due: '2026-07-10', risk: 'Medium', col: 'Awaiting Review' },
  { id: 'AP-415', title: 'Vendor invoice audit', dept: 'FIN', officer: 'R. Bhosale', due: '2026-07-14', risk: 'Medium', col: 'Under Review' },
]

export const REVIEWERS = [
  { name: 'Nikhil Deshpande', role: 'Deputy Secretary (DIT)', queue: 8, avg: '3.4h', initials: 'ND' },
  { name: 'Aarti Deshmukh', role: 'AI Governance Officer', queue: 12, avg: '2.1h', initials: 'AD' },
  { name: 'Vikas Patil', role: 'GAD Reviewer', queue: 5, avg: '4.2h', initials: 'VP' },
  { name: 'Kavita Kore', role: 'UDD Reviewer', queue: 7, avg: '3.0h', initials: 'KK' },
  { name: 'Sagar Jadhav', role: 'AGR Reviewer', queue: 4, avg: '5.6h', initials: 'SJ' },
  { name: 'Meera Rao', role: 'DPO — GoM', queue: 9, avg: '2.8h', initials: 'MR' },
]

export const POLICY_HISTORY: Record<string, { v: string; at: string; note: string }[]> = {
  'Acceptable-Use of AI': [
    { v: 'v3.1', at: '2026-06-20', note: 'Prompt-injection clause tightened' },
    { v: 'v3.0', at: '2026-02-12', note: 'DPDP Act 2023 alignment' },
    { v: 'v2.9', at: '2025-09-04', note: 'HITL threshold set to ₹5 Cr' },
  ],
  'Prompt Governance': [
    { v: 'v2.4', at: '2026-05-14', note: 'Registry mandatory before deploy' },
    { v: 'v2.3', at: '2026-01-20', note: 'Risk-class field added' },
    { v: 'v2.2', at: '2025-10-11', note: 'Multi-reviewer for High risk' },
  ],
  'Model Risk': [
    { v: 'v1.8', at: '2026-07-01', note: 'Canary rollout required' },
    { v: 'v1.7', at: '2026-03-15', note: 'Rollback plan filing' },
    { v: 'v1.6', at: '2025-12-04', note: 'Third-party proxy DLP' },
  ],
  'DPDP for AI': [
    { v: 'v2.0', at: '2026-06-11', note: 'Consent tokens embedded' },
    { v: 'v1.9', at: '2026-02-08', note: 'PII lineage tracking' },
    { v: 'v1.8', at: '2025-11-22', note: 'Data-fiduciary catalogue' },
  ],
  'Human-in-the-loop': [
    { v: 'v1.5', at: '2026-06-18', note: 'SLA countdown chips introduced' },
    { v: 'v1.4', at: '2026-03-02', note: 'Escalation matrix v2' },
    { v: 'v1.3', at: '2025-12-10', note: 'Kanban workflow' },
  ],
  'Third-party Model Use': [
    { v: 'v1.2', at: '2026-07-03', note: 'VAPT before allow-list' },
    { v: 'v1.1', at: '2026-04-04', note: 'DLP proxy mandatory' },
    { v: 'v1.0', at: '2026-01-06', note: 'Baseline' },
  ],
  'On-Prem Deployment': [
    { v: 'v2.1', at: '2026-06-05', note: 'MeghRaj GPU pod SOP' },
    { v: 'v2.0', at: '2026-01-19', note: 'Air-gap requirement' },
    { v: 'v1.9', at: '2025-10-08', note: 'Rack-level access log' },
  ],
  'Incident Reporting': [
    { v: 'v1.4', at: '2026-06-22', note: 'Auto-triage severity' },
    { v: 'v1.3', at: '2026-02-28', note: 'RCA within 72h' },
    { v: 'v1.2', at: '2025-11-01', note: 'Baseline SLA matrix' },
  ],
}

export const ATTESTATION_OFFICERS = [
  { name: 'A. Deshmukh', role: 'AI Governance Officer', at: '2026-06-24' },
  { name: 'N. Deshpande', role: 'Deputy Secretary (DIT)', at: '2026-06-20' },
  { name: 'M. Rao', role: 'DPO — GoM', at: '2026-06-18' },
  { name: 'K. Kore', role: 'UDD Reviewer', at: '2026-06-15' },
  { name: 'V. Patil', role: 'GAD Reviewer', at: '2026-06-12' },
  { name: 'S. Jadhav', role: 'AGR Reviewer', at: '2026-06-10' },
]
