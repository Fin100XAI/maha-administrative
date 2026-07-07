/**
 * Shared demo data for the Administrative Intelligence section.
 * Structured so a real API can replace each export later — pages must not
 * hard-code these numbers, only read them from here (page-specific rows may
 * live beside each page, but shared dimensions come from this module).
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface DeptMetrics {
  code: string
  name: string
  score: number
  sla: number
  filesDisposed: number
  avgDisposalDays: number
  grievanceResolution: number
  dpdp: number
  aiAdoption: number
  risk: RiskLevel
  pendingFiles: number
  slaBreaches: number
}

export const AI_DEPARTMENTS: DeptMetrics[] = [
  { code: 'REV', name: 'Revenue', score: 78, sla: 81, filesDisposed: 4820, avgDisposalDays: 9.4, grievanceResolution: 84, dpdp: 86, aiAdoption: 74, risk: 'High', pendingFiles: 612, slaBreaches: 9 },
  { code: 'HOME', name: 'Home', score: 84, sla: 88, filesDisposed: 3910, avgDisposalDays: 7.1, grievanceResolution: 86, dpdp: 90, aiAdoption: 71, risk: 'Medium', pendingFiles: 388, slaBreaches: 4 },
  { code: 'HFW', name: 'Health', score: 89, sla: 92, filesDisposed: 3450, avgDisposalDays: 5.8, grievanceResolution: 91, dpdp: 92, aiAdoption: 83, risk: 'Low', pendingFiles: 214, slaBreaches: 2 },
  { code: 'UDD', name: 'Urban Development', score: 76, sla: 79, filesDisposed: 2980, avgDisposalDays: 10.2, grievanceResolution: 79, dpdp: 84, aiAdoption: 77, risk: 'High', pendingFiles: 545, slaBreaches: 8 },
  { code: 'RDD', name: 'Rural Development', score: 82, sla: 86, filesDisposed: 2610, avgDisposalDays: 7.9, grievanceResolution: 85, dpdp: 87, aiAdoption: 69, risk: 'Medium', pendingFiles: 301, slaBreaches: 3 },
  { code: 'FIN', name: 'Finance', score: 87, sla: 90, filesDisposed: 3140, avgDisposalDays: 6.3, grievanceResolution: 88, dpdp: 91, aiAdoption: 81, risk: 'Low', pendingFiles: 189, slaBreaches: 2 },
  { code: 'EDU', name: 'Education', score: 80, sla: 84, filesDisposed: 2870, avgDisposalDays: 8.6, grievanceResolution: 82, dpdp: 83, aiAdoption: 72, risk: 'Medium', pendingFiles: 402, slaBreaches: 5 },
  { code: 'AGR', name: 'Agriculture', score: 83, sla: 87, filesDisposed: 2450, avgDisposalDays: 7.4, grievanceResolution: 87, dpdp: 88, aiAdoption: 70, risk: 'Medium', pendingFiles: 276, slaBreaches: 3 },
  { code: 'WR', name: 'Water Resources', score: 79, sla: 83, filesDisposed: 1980, avgDisposalDays: 9.1, grievanceResolution: 81, dpdp: 85, aiAdoption: 66, risk: 'Medium', pendingFiles: 331, slaBreaches: 4 },
  { code: 'IND', name: 'Industries', score: 86, sla: 89, filesDisposed: 2210, avgDisposalDays: 6.7, grievanceResolution: 89, dpdp: 89, aiAdoption: 79, risk: 'Low', pendingFiles: 168, slaBreaches: 1 },
  { code: 'TRN', name: 'Transport', score: 81, sla: 85, filesDisposed: 2340, avgDisposalDays: 8.1, grievanceResolution: 83, dpdp: 86, aiAdoption: 73, risk: 'Medium', pendingFiles: 289, slaBreaches: 3 },
  { code: 'WCD', name: 'Women & Child Development', score: 85, sla: 88, filesDisposed: 1890, avgDisposalDays: 6.9, grievanceResolution: 90, dpdp: 90, aiAdoption: 75, risk: 'Low', pendingFiles: 152, slaBreaches: 2 },
  { code: 'SJ', name: 'Social Justice', score: 82, sla: 86, filesDisposed: 1760, avgDisposalDays: 7.6, grievanceResolution: 86, dpdp: 87, aiAdoption: 68, risk: 'Medium', pendingFiles: 198, slaBreaches: 2 },
]

export interface DistrictMetrics {
  name: string
  grievances: number
  resolved: number
  slaCompliance: number
  inspectionScore: number
  complianceScore: number
}

export const AI_DISTRICTS: DistrictMetrics[] = [
  { name: 'Mumbai', grievances: 4820, resolved: 4291, slaCompliance: 89, inspectionScore: 91, complianceScore: 92 },
  { name: 'Pune', grievances: 4130, resolved: 3676, slaCompliance: 88, inspectionScore: 89, complianceScore: 90 },
  { name: 'Thane', grievances: 3660, resolved: 3184, slaCompliance: 86, inspectionScore: 87, complianceScore: 88 },
  { name: 'Nagpur', grievances: 3120, resolved: 2714, slaCompliance: 87, inspectionScore: 88, complianceScore: 89 },
  { name: 'Nashik', grievances: 2840, resolved: 2414, slaCompliance: 85, inspectionScore: 86, complianceScore: 87 },
  { name: 'Chhatrapati Sambhajinagar', grievances: 2510, resolved: 2083, slaCompliance: 83, inspectionScore: 84, complianceScore: 85 },
  { name: 'Kolhapur', grievances: 2130, resolved: 1832, slaCompliance: 86, inspectionScore: 87, complianceScore: 87 },
  { name: 'Solapur', grievances: 1980, resolved: 1663, slaCompliance: 84, inspectionScore: 84, complianceScore: 85 },
  { name: 'Jalgaon', grievances: 1770, resolved: 1451, slaCompliance: 82, inspectionScore: 83, complianceScore: 84 },
  { name: 'Nanded', grievances: 1650, resolved: 1336, slaCompliance: 81, inspectionScore: 82, complianceScore: 83 },
  { name: 'Amravati', grievances: 1540, resolved: 1279, slaCompliance: 83, inspectionScore: 84, complianceScore: 84 },
  { name: 'Satara', grievances: 1410, resolved: 1198, slaCompliance: 85, inspectionScore: 86, complianceScore: 86 },
  { name: 'Sangli', grievances: 1330, resolved: 1117, slaCompliance: 84, inspectionScore: 85, complianceScore: 85 },
  { name: 'Ahmednagar', grievances: 1290, resolved: 1071, slaCompliance: 83, inspectionScore: 83, complianceScore: 84 },
  { name: 'Chandrapur', grievances: 1120, resolved: 918, slaCompliance: 82, inspectionScore: 82, complianceScore: 83 },
]

export const AI_ROLES = [
  'Chief Secretary', 'Principal Secretary', 'Commissioner', 'District Collector',
  'Municipal Commissioner', 'CEO Zilla Parishad', 'Department Director', 'Desk Officer', 'Section Officer',
] as const

/** Administrative Intelligence Index — headline + weighted sub-scores. */
export const INDEX_SCORES = {
  overall: 91,
  subs: [
    { key: 'governance', label: 'Governance Efficiency', score: 88, weight: 0.15 },
    { key: 'disposal', label: 'File Disposal Speed', score: 82, weight: 0.12 },
    { key: 'citizen', label: 'Citizen Service Assurance', score: 87, weight: 0.13 },
    { key: 'compliance', label: 'Compliance & DPDP', score: 89, weight: 0.12 },
    { key: 'security', label: 'Security & AI SOC', score: 94, weight: 0.10 },
    { key: 'adoption', label: 'AI Adoption', score: 86, weight: 0.10 },
    { key: 'performance', label: 'Department Performance', score: 84, weight: 0.12 },
    { key: 'risk', label: 'Risk Readiness', score: 81, weight: 0.08 },
    { key: 'mission', label: 'Mission Alignment', score: 90, weight: 0.08 },
  ],
}

export const INDEX_TREND = [
  { m: 'Aug', v: 84 }, { m: 'Sep', v: 84 }, { m: 'Oct', v: 85 }, { m: 'Nov', v: 86 },
  { m: 'Dec', v: 86 }, { m: 'Jan', v: 87 }, { m: 'Feb', v: 88 }, { m: 'Mar', v: 88 },
  { m: 'Apr', v: 89 }, { m: 'May', v: 90 }, { m: 'Jun', v: 90 }, { m: 'Jul', v: 91 },
]

export interface SlaWorkflow {
  name: string
  slaDays: number
  compliance: number
  breaches: number
  tatDays: number
  citizenFacing: boolean
  trend: 'improving' | 'stable' | 'worsening'
}

export const SLA_WORKFLOWS: SlaWorkflow[] = [
  { name: 'GR approval', slaDays: 15, compliance: 88, breaches: 6, tatDays: 11.2, citizenFacing: false, trend: 'improving' },
  { name: 'Circular approval', slaDays: 10, compliance: 91, breaches: 3, tatDays: 7.4, citizenFacing: false, trend: 'stable' },
  { name: 'RTI response', slaDays: 30, compliance: 86, breaches: 9, tatDays: 22.6, citizenFacing: true, trend: 'worsening' },
  { name: 'Citizen grievance', slaDays: 21, compliance: 87, breaches: 8, tatDays: 14.8, citizenFacing: true, trend: 'improving' },
  { name: 'Procurement approval', slaDays: 45, compliance: 84, breaches: 5, tatDays: 36.1, citizenFacing: false, trend: 'stable' },
  { name: 'HR transfer', slaDays: 30, compliance: 82, breaches: 4, tatDays: 26.3, citizenFacing: false, trend: 'stable' },
  { name: 'Welfare benefit processing', slaDays: 21, compliance: 85, breaches: 7, tatDays: 16.9, citizenFacing: true, trend: 'improving' },
  { name: 'Cabinet note movement', slaDays: 7, compliance: 90, breaches: 2, tatDays: 5.1, citizenFacing: false, trend: 'improving' },
  { name: 'Audit compliance response', slaDays: 30, compliance: 80, breaches: 6, tatDays: 27.8, citizenFacing: false, trend: 'worsening' },
]

export interface AIOfficer {
  role: string
  desc: string
  activeTasks: number
  confidence: number
  humanApproval: boolean
  lastUsed: string
  risk: RiskLevel
}

export const AI_WORKFORCE: AIOfficer[] = [
  { role: 'Finance AI Officer', desc: 'Budget notes, expenditure checks, financial concurrence drafts.', activeTasks: 14, confidence: 91, humanApproval: true, lastUsed: '12 min ago', risk: 'Medium' },
  { role: 'Legal AI Officer', desc: 'Case summaries, affidavit outlines, legal vetting support.', activeTasks: 9, confidence: 88, humanApproval: true, lastUsed: '25 min ago', risk: 'High' },
  { role: 'Procurement AI Officer', desc: 'Tender scrutiny, comparative statements, GFR compliance checks.', activeTasks: 7, confidence: 87, humanApproval: true, lastUsed: '1 hr ago', risk: 'High' },
  { role: 'HR AI Officer', desc: 'Transfer lists, seniority checks, service record summaries.', activeTasks: 11, confidence: 89, humanApproval: true, lastUsed: '38 min ago', risk: 'Medium' },
  { role: 'Cabinet AI Officer', desc: 'Cabinet note drafts, follow-up tracking, implementation briefs.', activeTasks: 5, confidence: 90, humanApproval: true, lastUsed: '2 hr ago', risk: 'High' },
  { role: 'Policy AI Officer', desc: 'Policy comparisons, impact notes, inter-state benchmarking.', activeTasks: 6, confidence: 86, humanApproval: true, lastUsed: '3 hr ago', risk: 'Medium' },
  { role: 'Budget AI Officer', desc: 'Head-wise utilisation, re-appropriation drafts, budget briefs.', activeTasks: 8, confidence: 90, humanApproval: true, lastUsed: '52 min ago', risk: 'Medium' },
  { role: 'Audit AI Officer', desc: 'Audit para replies, compliance tracking, exposure summaries.', activeTasks: 10, confidence: 88, humanApproval: true, lastUsed: '1 hr ago', risk: 'Medium' },
  { role: 'RTI AI Officer', desc: 'RTI reply drafts, exemption checks, disclosure register lookup.', activeTasks: 16, confidence: 89, humanApproval: true, lastUsed: '8 min ago', risk: 'Medium' },
  { role: 'Translation AI Officer', desc: 'Formal Marathi/Hindi translation in government register.', activeTasks: 21, confidence: 93, humanApproval: false, lastUsed: '4 min ago', risk: 'Low' },
  { role: 'Drafting AI Officer', desc: 'Letters, notes, memos and office orders in official format.', activeTasks: 24, confidence: 92, humanApproval: true, lastUsed: '2 min ago', risk: 'Low' },
  { role: 'Compliance AI Officer', desc: 'DPDP checks, retention flags, consent verification.', activeTasks: 12, confidence: 90, humanApproval: true, lastUsed: '31 min ago', risk: 'Medium' },
  { role: 'Citizen Service AI Officer', desc: 'Grievance classification, response drafts, escalation routing.', activeTasks: 19, confidence: 88, humanApproval: true, lastUsed: '6 min ago', risk: 'Medium' },
  { role: 'District AI Officer', desc: 'District briefs, scheme rollout tracking, collectorate support.', activeTasks: 9, confidence: 87, humanApproval: true, lastUsed: '47 min ago', risk: 'Medium' },
  { role: 'Planning AI Officer', desc: 'Annual plan analysis, outcome mapping, scheme convergence.', activeTasks: 6, confidence: 86, humanApproval: true, lastUsed: '2 hr ago', risk: 'Medium' },
  { role: 'Security AI Officer', desc: 'AI SOC triage, prompt-injection review, access anomaly notes.', activeTasks: 8, confidence: 91, humanApproval: true, lastUsed: '15 min ago', risk: 'High' },
]

export const OUTCOME_METRICS = [
  { label: 'Officer hours saved (monthly)', value: '41,200 hrs', delta: 12.4 },
  { label: 'Files disposed faster', value: '+23%', delta: 23 },
  { label: 'SLA improvement', value: '+8.6 pts', delta: 8.6 },
  { label: 'Citizen satisfaction improvement', value: '+11%', delta: 11 },
  { label: 'Paper saved', value: '2.8 Cr pages', delta: 34 },
  { label: 'Administrative cost saved', value: '₹64 Cr', delta: 18 },
  { label: 'Risk reduction', value: '-31% incidents', delta: 31 },
  { label: 'Compliance improvement', value: '+9 pts DPDP', delta: 9 },
]

/** Confidence tier helper — High ≥85, Medium 70-84, Low <70. */
export function confidenceTier(score: number): 'High' | 'Medium' | 'Low' {
  return score >= 85 ? 'High' : score >= 70 ? 'Medium' : 'Low'
}

export const RISK_CLASS: Record<RiskLevel, string> = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
}
