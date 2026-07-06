// All data here is labelled "Demo dataset — replace with department API during deployment."
// Any card / page that uses this data must show a "Demo" source badge.

export const DASHBOARD_METRICS = {
  officersOnboarded: 48620,
  departmentsConnected: 41,
  aiRequests: 1284560,
  documentsAnalysed: 92450,
  draftsGenerated: 31280,
  pendingApprovals: 148,
  aiRiskAlerts: 12,
  dpdpComplianceScore: 87,
  activeIntegrations: 14,
  securityEvents: 63,
  knowledgeDocs: 218430,
  avgTimeSavedHours: 4.6,
}

export const AI_USAGE_BY_DEPT = [
  { dept: 'Revenue', value: 24800 },
  { dept: 'Home', value: 21200 },
  { dept: 'Health', value: 19400 },
  { dept: 'UDD', value: 17200 },
  { dept: 'RD', value: 15900 },
  { dept: 'Finance', value: 14100 },
  { dept: 'Education', value: 13400 },
  { dept: 'Agriculture', value: 11200 },
]

export const DOCUMENT_INTELLIGENCE_VOLUME = [
  { month: 'Jan', GR: 640, Circular: 820, File: 1220, RTI: 480 },
  { month: 'Feb', GR: 720, Circular: 880, File: 1310, RTI: 510 },
  { month: 'Mar', GR: 690, Circular: 940, File: 1420, RTI: 570 },
  { month: 'Apr', GR: 810, Circular: 990, File: 1580, RTI: 620 },
  { month: 'May', GR: 780, Circular: 1030, File: 1690, RTI: 650 },
  { month: 'Jun', GR: 870, Circular: 1140, File: 1760, RTI: 710 },
  { month: 'Jul', GR: 940, Circular: 1220, File: 1910, RTI: 740 },
]

export const RISK_TREND = [
  { day: 'D-6', risk: 22, incidents: 3 },
  { day: 'D-5', risk: 26, incidents: 4 },
  { day: 'D-4', risk: 19, incidents: 2 },
  { day: 'D-3', risk: 31, incidents: 5 },
  { day: 'D-2', risk: 27, incidents: 3 },
  { day: 'D-1', risk: 24, incidents: 2 },
  { day: 'Today', risk: 18, incidents: 1 },
]

export const APPROVAL_STATUS = [
  { name: 'Awaiting Review', value: 148 },
  { name: 'Under Review', value: 62 },
  { name: 'Approved', value: 4210 },
  { name: 'Rejected', value: 78 },
  { name: 'Escalated', value: 14 },
]

export const SECURITY_ALERTS_BY_SEVERITY = [
  { severity: 'Critical', count: 3 },
  { severity: 'High', count: 12 },
  { severity: 'Medium', count: 28 },
  { severity: 'Low', count: 20 },
]

export const DPDP_HEATMAP = [
  { dept: 'Home', consent: 78, retention: 84, purpose: 88, lineage: 76, class: 90 },
  { dept: 'Health', consent: 92, retention: 88, purpose: 90, lineage: 84, class: 92 },
  { dept: 'Revenue', consent: 84, retention: 80, purpose: 82, lineage: 78, class: 86 },
  { dept: 'UDD', consent: 76, retention: 82, purpose: 84, lineage: 80, class: 84 },
  { dept: 'Finance', consent: 94, retention: 92, purpose: 94, lineage: 90, class: 96 },
  { dept: 'Education', consent: 82, retention: 78, purpose: 84, lineage: 76, class: 82 },
]

export const INTEGRATION_HEALTH = [
  { name: 'e-Office', uptime: 99.6, latency: 240, status: 'Public-source linked' },
  { name: 'RTI', uptime: 99.2, latency: 320, status: 'Public-source linked' },
  { name: 'e-HRMS', uptime: 98.4, latency: 410, status: 'API pending' },
  { name: 'Aaple Sarkar', uptime: 99.4, latency: 280, status: 'Department access required' },
  { name: 'MahaDBT 2.0', uptime: 99.7, latency: 210, status: 'Department access required' },
  { name: 'Email Gateway', uptime: 99.9, latency: 90, status: 'Connected' },
  { name: 'SMS Gateway', uptime: 99.8, latency: 130, status: 'Connected' },
  { name: 'API Gateway', uptime: 99.99, latency: 60, status: 'Connected' },
]

export const RECENT_GR = [
  {
    id: 'GR-2026-URD-118',
    title: 'PMAY (Urban) 2.0 — Guidelines for Beneficiary Verification',
    dept: 'Urban Development',
    date: '2026-07-04',
    impact: 'High',
    summary: 'Revised beneficiary verification workflow for PMAY-U 2.0 with Aadhaar-based e-KYC and Income proof cross-check via MahaDBT.',
  },
  {
    id: 'GR-2026-REV-092',
    title: 'e-Fasal Bima — District-level Grievance Redressal SOP',
    dept: 'Revenue & Forests',
    date: '2026-07-02',
    impact: 'Medium',
    summary: 'District Collector to constitute standing committee within 7 days of GR publication; SOP for crop-loss assessment appeals.',
  },
  {
    id: 'GR-2026-EDU-034',
    title: 'RTE 25% Admission — Online Verification Timeline',
    dept: 'School Education',
    date: '2026-06-29',
    impact: 'Medium',
    summary: 'Timeline for online admission verification, appeal window, and school-wise seat allocation display.',
  },
]

export const RECENT_INCIDENTS = [
  { id: 'INC-4218', title: 'Prompt injection attempt from external RTI upload', severity: 'High', at: '2026-07-06T09:22:00Z' },
  { id: 'INC-4211', title: 'Hallucination flag on note draft — mitigated by reviewer', severity: 'Medium', at: '2026-07-05T18:04:00Z' },
  { id: 'INC-4206', title: 'PII exposure alert in Excel upload — auto-redacted', severity: 'Medium', at: '2026-07-05T13:18:00Z' },
  { id: 'INC-4201', title: 'Model drift on OCR — retraining scheduled', severity: 'Low', at: '2026-07-05T08:45:00Z' },
]
