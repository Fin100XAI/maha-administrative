export interface KnowledgeItem {
  id: string
  title: string
  source: string
  dept: string
  date: string
  type: 'GR' | 'Circular' | 'SOP' | 'FAQ' | 'Note' | 'Policy'
  language: 'English' | 'Marathi' | 'Hindi' | 'Bilingual'
  confidence: number
  related?: string[]
}

export const KNOWLEDGE: KnowledgeItem[] = [
  { id: 'GR-2026-URD-118', title: 'PMAY (Urban) 2.0 — Guidelines for Beneficiary Verification', source: 'gr.maharashtra.gov.in', dept: 'Urban Development', date: '2026-07-04', type: 'GR', language: 'Bilingual', confidence: 92, related: ['GR-2024-URD-074','GR-2025-URD-092'] },
  { id: 'GR-2026-REV-092', title: 'e-Fasal Bima — District-level Grievance Redressal SOP', source: 'gr.maharashtra.gov.in', dept: 'Revenue & Forests', date: '2026-07-02', type: 'GR', language: 'Bilingual', confidence: 88 },
  { id: 'GR-2026-EDU-034', title: 'RTE 25% Admission — Online Verification Timeline', source: 'gr.maharashtra.gov.in', dept: 'School Education', date: '2026-06-29', type: 'GR', language: 'Marathi', confidence: 86 },
  { id: 'GR-2026-HFW-058', title: 'ASHA workforce ration and honorarium revision', source: 'gr.maharashtra.gov.in', dept: 'Public Health', date: '2026-06-25', type: 'GR', language: 'Bilingual', confidence: 90 },
  { id: 'CIR-2026-DIT-014', title: 'MAII AI Workspace — Roll-out Advisory', source: 'DIT internal', dept: 'DIT', date: '2026-07-05', type: 'Circular', language: 'English', confidence: 96 },
  { id: 'CIR-2026-GAD-021', title: 'Marathi drafting standards for note sheets', source: 'GAD internal', dept: 'GAD', date: '2026-06-22', type: 'Circular', language: 'Marathi', confidence: 92 },
  { id: 'SOP-2026-DPO-004', title: 'DPDP Consent Lifecycle SOP', source: 'DPO internal', dept: 'ALL', date: '2026-06-14', type: 'SOP', language: 'English', confidence: 94 },
  { id: 'SOP-2026-AI-002', title: 'Human-in-the-loop SOP for AI outputs', source: 'AI Governance', dept: 'ALL', date: '2026-05-30', type: 'SOP', language: 'English', confidence: 95 },
  { id: 'FAQ-2026-URD-004', title: 'PMAY-U 2.0 — FAQs for District Officers', source: 'UDD internal', dept: 'Urban Development', date: '2026-07-06', type: 'FAQ', language: 'Bilingual', confidence: 90 },
  { id: 'POL-2026-AI-001', title: 'Acceptable-Use of AI Policy', source: 'DIT internal', dept: 'DIT', date: '2026-06-20', type: 'Policy', language: 'English', confidence: 98 },
]
