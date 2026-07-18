// Shared sample data for Administrative AI section pages.
// Demo dataset — replace with department API during deployment.

export interface TemplateSection {
  heading: string
  body: string
}

export interface AdminTemplate {
  id: string
  title: string
  description: string
  department: string
  category: string
  updated: string
  // Optional fields let a template pre-fill the drafting form and render its own
  // section layout in the preview. Present on letter templates.
  subject?: string
  recipient?: string
  tone?: string
  language?: 'English' | 'मराठी (Marathi)' | 'हिंदी (Hindi)'
  structure?: TemplateSection[]
}

export const LETTER_TEMPLATES: AdminTemplate[] = [
  {
    id: 'lt-1',
    title: 'Cabinet Note — Cover Letter',
    description: 'Formal cover for cabinet notes with pre-filled routing and enclosures block.',
    department: 'GAD',
    category: 'Cabinet',
    updated: '2026-06-28',
    subject: 'Submission of Cabinet Note for consideration of the Council of Ministers',
    recipient: 'The Principal Secretary, General Administration Department (Cabinet Cell)',
    tone: 'Formal',
    structure: [
      { heading: 'Reference', body: 'The enclosed Cabinet Note is submitted for placement before the Council of Ministers in the ensuing cabinet meeting, in accordance with the Rules of Business of the Government of Maharashtra.' },
      { heading: 'Subject matter', body: 'The Note seeks in-principle approval for the proposal described therein, along with the associated financial and administrative implications set out in the annexures.' },
      { heading: 'Routing & concurrence', body: 'The proposal has been examined by the administrative department and vetted by the Finance and Law & Judiciary Departments. Their concurrence is placed at Annexure-II and Annexure-III respectively.' },
      { heading: 'Approval sought', body: 'It is requested that the Note be included in the cabinet agenda and the decision of the Council of Ministers be communicated to this Department for further action.' },
    ],
  },
  {
    id: 'lt-2',
    title: 'RTS Grievance Response',
    department: 'GAD',
    description: 'Standard reply under the Right to Services Act citing the correct sub-section.',
    category: 'Citizen Services',
    updated: '2026-06-25',
    subject: 'Response to grievance under the Maharashtra Right to Public Services Act, 2015',
    recipient: 'The Applicant (through the designated Public Service Centre)',
    tone: 'Formal',
    structure: [
      { heading: 'Acknowledgement', body: 'This has reference to your application registered under the Maharashtra Right to Public Services Act, 2015. The matter has been examined by the Designated Officer within the notified time limit for the said service.' },
      { heading: 'Applicable provision', body: 'The service applied for is a notified service under Section 3 of the Act, with the stipulated time limit prescribed in the notified schedule. Your application has been processed with reference to the relevant sub-section governing this service.' },
      { heading: 'Decision / redressal', body: 'Based on the examination of records, the requested service is hereby granted / the deficiency noted has been rectified. The relevant document is enclosed for your records.' },
      { heading: 'Right of appeal', body: 'If you are aggrieved by this decision, you may prefer a first appeal before the First Appellate Officer within thirty days, and thereafter a second appeal before the Maharashtra State Commission for Right to Service.' },
    ],
  },
  {
    id: 'lt-3',
    title: 'DPR Submission Cover',
    department: 'PLN',
    description: 'Cover letter for Detailed Project Report submission to Planning Department.',
    category: 'Planning',
    updated: '2026-06-22',
    subject: 'Submission of Detailed Project Report (DPR) for administrative approval',
    recipient: 'The Secretary, Planning Department',
    tone: 'Formal',
    structure: [
      { heading: 'Project reference', body: 'The Detailed Project Report for the captioned project, prepared by the executing agency, is submitted herewith for scrutiny and administrative approval of the Planning Department.' },
      { heading: 'Enclosed components', body: 'The DPR comprises the project rationale, scope of works, technical design and drawings, cost estimates (Annexure-A), implementation schedule (Annexure-B) and the environmental & social safeguards note (Annexure-C).' },
      { heading: 'Financial outlay', body: 'The total estimated project cost, along with the year-wise phasing of funds and the proposed source of financing, is detailed in the abstract of cost enclosed at Annexure-A.' },
      { heading: 'Request for appraisal', body: 'It is requested that the DPR be appraised and administrative approval accorded, so that the tendering and implementation activities may commence within the current financial year.' },
    ],
  },
  {
    id: 'lt-4',
    title: 'Inter-Departmental Reference',
    department: 'DIT',
    description: 'Formal reference between departments seeking inputs on a policy matter.',
    category: 'Administration',
    updated: '2026-07-01',
    subject: 'Reference seeking departmental inputs on a policy matter under examination',
    recipient: 'The Secretary of the concerned Administrative Department',
    tone: 'Formal',
    structure: [
      { heading: 'Context', body: 'A policy matter having inter-departmental implications is under examination in this Department. To arrive at a considered view, the inputs of your Department are necessary.' },
      { heading: 'Inputs sought', body: 'You are requested to furnish your Department’s specific views on the points enumerated in the enclosed statement, together with any precedent, rule position or financial implication that may have a bearing on the matter.' },
      { heading: 'Timeline', body: 'As the proposal is time-bound, it would be appreciated if the inputs are communicated to this Department within fifteen days of receipt of this reference.' },
    ],
  },
  {
    id: 'lt-5',
    title: 'Divisional Commissioner Directive',
    department: 'REV',
    description: 'Directive template used by the Revenue Department to Divisional Commissioners.',
    category: 'Revenue',
    updated: '2026-06-18',
    subject: 'Directive regarding implementation of Revenue Department instructions',
    recipient: 'The Divisional Commissioner (all Divisions)',
    tone: 'Directive',
    structure: [
      { heading: 'Directive', body: 'In exercise of the powers vested in the Revenue Department, you are hereby directed to ensure implementation of the instructions detailed herein across all District Collectorates within your Division.' },
      { heading: 'Action required', body: 'The Collectors under your jurisdiction shall be instructed to carry out the field-level action within the prescribed timeline and to designate a nodal officer for coordination and monitoring.' },
      { heading: 'Reporting requirement', body: 'A consolidated compliance report, division-wise and district-wise, shall be furnished to this Department by the date indicated. Any difficulty in implementation may be brought to notice immediately.' },
    ],
  },
  {
    id: 'lt-6',
    title: 'Public Advisory (Marathi)',
    department: 'GAD',
    description: 'Plain-language citizen advisory template for release in vernacular.',
    category: 'Citizen Services',
    updated: '2026-06-15',
    subject: 'नागरिकांसाठी शासकीय जनजागृती सूचना',
    recipient: 'सर्व संबंधित नागरिक (जिल्हा माहिती कार्यालयामार्फत प्रसिद्धीसाठी)',
    tone: 'Advisory',
    language: 'मराठी (Marathi)',
    structure: [
      { heading: 'सूचनेचा विषय', body: 'शासनाकडून नागरिकांच्या माहितीसाठी ही जनजागृती सूचना प्रसिद्ध करण्यात येत आहे. सदर सूचनेतील बाबी सर्व नागरिकांनी काळजीपूर्वक वाचाव्यात व त्यानुसार कार्यवाही करावी.' },
      { heading: 'नागरिकांनी काय करावे', body: 'पात्र नागरिकांनी विहित मुदतीत आवश्यक कागदपत्रांसह जवळच्या सेवा केंद्रावर अथवा आपले सरकार पोर्टलवर अर्ज सादर करावा. कोणत्याही मध्यस्थास शुल्क देऊ नये.' },
      { heading: 'मदत व संपर्क', body: 'अधिक माहितीसाठी अथवा तक्रारीसाठी नागरिकांनी शासनाच्या टोल-फ्री मदत क्रमांकावर अथवा संबंधित तहसील कार्यालयाशी संपर्क साधावा.' },
    ],
  },
]

export const NOTE_TEMPLATES: AdminTemplate[] = [
  { id: 'nt-1', title: 'Cabinet Note Template', department: 'GAD', description: 'Structured cabinet note with issue, background, options, financials, legal, recommendation.', category: 'Cabinet', updated: '2026-06-29' },
  { id: 'nt-2', title: 'Procurement Note (GFR 2017)', department: 'FIN', description: 'Procurement note aligned with General Financial Rules 2017.', category: 'Procurement', updated: '2026-06-24' },
  { id: 'nt-3', title: 'Policy Amendment Note', department: 'PLN', description: 'Note sheet for proposing a policy amendment with impact analysis.', category: 'Policy', updated: '2026-06-19' },
  { id: 'nt-4', title: 'Vigilance Enquiry Note', department: 'HOME', description: 'Formal note initiating a vigilance enquiry with legal references.', category: 'Vigilance', updated: '2026-06-11' },
  { id: 'nt-5', title: 'CSR Fund Utilisation Note', department: 'IND', description: 'Note sheet for utilisation of Corporate Social Responsibility funds.', category: 'Industries', updated: '2026-06-08' },
  { id: 'nt-6', title: 'Pilot Roll-out Note', department: 'DIT', description: 'Structured note for approval of a technology pilot with risk register.', category: 'Technology', updated: '2026-07-02' },
]

export const PPT_TEMPLATES: AdminTemplate[] = [
  { id: 'pt-1', title: 'Cabinet Briefing Deck', department: 'GAD', description: '12-slide briefing template for cabinet-level presentations.', category: 'Cabinet', updated: '2026-06-27' },
  { id: 'pt-2', title: 'Department Review Deck', department: 'PLN', description: 'Quarterly department review with KPIs, spends and outcomes.', category: 'Review', updated: '2026-06-21' },
  { id: 'pt-3', title: 'District Collectors Conference', department: 'GAD', description: 'Standard deck used at the Collectors\' conference — status, asks, roadmap.', category: 'Districts', updated: '2026-06-14' },
  { id: 'pt-4', title: 'Investor Summit Pitch', department: 'IND', description: 'MMR investor summit sector pitch template.', category: 'Industries', updated: '2026-06-10' },
  { id: 'pt-5', title: 'Sarkar Aplya Dari — District Kit', department: 'GAD', description: 'Public outreach deck for the "Sarkar Aplya Dari" campaign.', category: 'Outreach', updated: '2026-06-06' },
  { id: 'pt-6', title: 'Cyber Incident Post-Mortem', department: 'DIT', description: 'Post-incident briefing template for cyber events.', category: 'Security', updated: '2026-06-03' },
]

export interface ActivityItem {
  id: string
  title: string
  officer: string
  dept: string
  time: string
  status: 'Draft' | 'Approved' | 'Under Review' | 'Rejected' | 'Open' | 'Closed'
}

export const RECENT_LETTERS: ActivityItem[] = [
  { id: 'a-1', title: 'AI Workspace roll-out — Divisional Commissioner (Pune)', officer: 'R. Mahajan', dept: 'DIT', time: '5 min ago', status: 'Draft' },
  { id: 'a-2', title: 'Cabinet Note cover — Sarvam-M adoption', officer: 'A. Deshpande', dept: 'GAD', time: '38 min ago', status: 'Approved' },
  { id: 'a-3', title: 'RTS Advisory to citizens — PMAY-U 2.0', officer: 'S. Kadam', dept: 'UDD', time: '1 hr ago', status: 'Under Review' },
  { id: 'a-4', title: 'DPR cover — Nagpur Metro Phase 3', officer: 'V. Patil', dept: 'UDD', time: '2 hr ago', status: 'Draft' },
  { id: 'a-5', title: 'MoU response — MeitY-GoM DPDP', officer: 'N. Kareer', dept: 'DIT', time: '4 hr ago', status: 'Approved' },
]

export const RECENT_NOTES: ActivityItem[] = [
  { id: 'n-1', title: 'Note — AI Workspace roll-out approval', officer: 'R. Mahajan', dept: 'DIT', time: '2 min ago', status: 'Draft' },
  { id: 'n-2', title: 'Vigilance enquiry initiation — Ratnagiri', officer: 'D. Iyer', dept: 'HOME', time: '32 min ago', status: 'Under Review' },
  { id: 'n-3', title: 'Procurement note — On-prem GPU cluster', officer: 'M. Joshi', dept: 'FIN', time: '55 min ago', status: 'Approved' },
  { id: 'n-4', title: 'Policy amendment — DBT Direct Credit', officer: 'K. Rao', dept: 'PLN', time: '2 hr ago', status: 'Draft' },
  { id: 'n-5', title: 'Note — Cybersecurity awareness roll-out', officer: 'A. Kulkarni', dept: 'DIT', time: '3 hr ago', status: 'Approved' },
]

export const RECENT_FILES: ActivityItem[] = [
  { id: 'f-1', title: 'DIT/AI/2026/07/118 — AI Workspace pilot', officer: 'R. Mahajan', dept: 'DIT', time: '3 min ago', status: 'Under Review' },
  { id: 'f-2', title: 'REV/LAND/2026/07/431 — 7/12 mutation appeals', officer: 'B. Shinde', dept: 'REV', time: '19 min ago', status: 'Draft' },
  { id: 'f-3', title: 'UDD/PMAY/2026/07/088 — grievance rollup', officer: 'S. Kadam', dept: 'UDD', time: '1 hr ago', status: 'Open' },
  { id: 'f-4', title: 'HFW/OB/2026/07/012 — outbreak report Nashik', officer: 'P. Gawde', dept: 'HFW', time: '2 hr ago', status: 'Approved' },
  { id: 'f-5', title: 'HOME/VIG/2026/07/077 — vigilance closure', officer: 'D. Iyer', dept: 'HOME', time: '4 hr ago', status: 'Closed' },
]

export const RECENT_TRANSLATIONS: ActivityItem[] = [
  { id: 't-1', title: 'GR-2026-URD-118 — EN → MR advisory', officer: 'S. Kadam', dept: 'UDD', time: '4 min ago', status: 'Approved' },
  { id: 't-2', title: 'Cabinet note — MR → EN briefing', officer: 'A. Deshpande', dept: 'GAD', time: '22 min ago', status: 'Under Review' },
  { id: 't-3', title: 'HFW advisory — EN → HI + MR', officer: 'P. Gawde', dept: 'HFW', time: '1 hr ago', status: 'Draft' },
  { id: 't-4', title: 'Vigilance enquiry — MR → EN summary', officer: 'D. Iyer', dept: 'HOME', time: '3 hr ago', status: 'Approved' },
  { id: 't-5', title: 'Budget speech excerpts — EN → MR', officer: 'M. Joshi', dept: 'FIN', time: '5 hr ago', status: 'Under Review' },
]

export interface UploadRow {
  id: string
  file: string
  uploader: string
  dept: string
  size: string
  time: string
  status: 'Approved' | 'Under Review' | 'Draft' | 'Rejected' | 'Open'
}

export const GR_UPLOADS: UploadRow[] = [
  { id: 'gru-1', file: 'GR-2026-URD-118.pdf', uploader: 'S. Kadam', dept: 'UDD', size: '2.3 MB', time: '4 min ago', status: 'Under Review' },
  { id: 'gru-2', file: 'GR-2026-REV-076.pdf', uploader: 'B. Shinde', dept: 'REV', size: '1.8 MB', time: '18 min ago', status: 'Approved' },
  { id: 'gru-3', file: 'GR-2026-HFW-042.pdf', uploader: 'P. Gawde', dept: 'HFW', size: '3.1 MB', time: '46 min ago', status: 'Approved' },
  { id: 'gru-4', file: 'GR-2026-AGR-057.pdf', uploader: 'K. Rao', dept: 'AGR', size: '2.6 MB', time: '1 hr ago', status: 'Draft' },
  { id: 'gru-5', file: 'GR-2026-HOME-031.pdf', uploader: 'D. Iyer', dept: 'HOME', size: '4.8 MB', time: '2 hr ago', status: 'Under Review' },
  { id: 'gru-6', file: 'GR-2026-EDU-113.pdf', uploader: 'V. Patil', dept: 'EDU', size: '1.4 MB', time: '3 hr ago', status: 'Approved' },
  { id: 'gru-7', file: 'GR-2026-DIT-118.pdf', uploader: 'R. Mahajan', dept: 'DIT', size: '2.1 MB', time: '4 hr ago', status: 'Approved' },
  { id: 'gru-8', file: 'GR-2026-WCD-025.pdf', uploader: 'N. Ambekar', dept: 'WCD', size: '1.9 MB', time: '5 hr ago', status: 'Rejected' },
]

export const CIRCULAR_UPLOADS: UploadRow[] = [
  { id: 'cu-1', file: 'DIT-CIR-2026-07-22.pdf', uploader: 'R. Mahajan', dept: 'DIT', size: '820 KB', time: '2 min ago', status: 'Under Review' },
  { id: 'cu-2', file: 'GAD-CIR-2026-07-19.pdf', uploader: 'A. Deshpande', dept: 'GAD', size: '640 KB', time: '25 min ago', status: 'Approved' },
  { id: 'cu-3', file: 'FIN-CIR-2026-07-15.pdf', uploader: 'M. Joshi', dept: 'FIN', size: '1.1 MB', time: '55 min ago', status: 'Approved' },
  { id: 'cu-4', file: 'HFW-CIR-2026-07-11.pdf', uploader: 'P. Gawde', dept: 'HFW', size: '920 KB', time: '2 hr ago', status: 'Approved' },
  { id: 'cu-5', file: 'REV-CIR-2026-07-08.pdf', uploader: 'B. Shinde', dept: 'REV', size: '1.4 MB', time: '3 hr ago', status: 'Under Review' },
  { id: 'cu-6', file: 'EDU-CIR-2026-07-05.pdf', uploader: 'V. Patil', dept: 'EDU', size: '740 KB', time: '4 hr ago', status: 'Approved' },
]

export const PDF_UPLOADS: UploadRow[] = [
  { id: 'pu-1', file: 'DPR-Nagpur-Metro-P3.pdf', uploader: 'V. Patil', dept: 'UDD', size: '84 MB', time: '6 min ago', status: 'Under Review' },
  { id: 'pu-2', file: 'CAG-Audit-FY25-Draft.pdf', uploader: 'M. Joshi', dept: 'FIN', size: '52 MB', time: '32 min ago', status: 'Draft' },
  { id: 'pu-3', file: 'MoU-MeitY-DPDP.pdf', uploader: 'R. Mahajan', dept: 'DIT', size: '3.8 MB', time: '1 hr ago', status: 'Approved' },
  { id: 'pu-4', file: 'CSR-Report-Q4-25.pdf', uploader: 'K. Rao', dept: 'IND', size: '11 MB', time: '2 hr ago', status: 'Approved' },
  { id: 'pu-5', file: 'Outbreak-Nashik-report.pdf', uploader: 'P. Gawde', dept: 'HFW', size: '5.6 MB', time: '3 hr ago', status: 'Under Review' },
  { id: 'pu-6', file: 'RTI-Response-Bundle.pdf', uploader: 'A. Deshpande', dept: 'GAD', size: '8.2 MB', time: '4 hr ago', status: 'Approved' },
  { id: 'pu-7', file: 'Vigilance-closure-VG77.pdf', uploader: 'D. Iyer', dept: 'HOME', size: '14 MB', time: '5 hr ago', status: 'Approved' },
]

export const OCR_UPLOADS: UploadRow[] = [
  { id: 'ou-1', file: 'inspection-photo-scan-01.jpg', uploader: 'B. Shinde', dept: 'REV', size: '2.1 MB', time: '8 min ago', status: 'Approved' },
  { id: 'ou-2', file: 'handwritten-margin-notes.pdf', uploader: 'D. Iyer', dept: 'HOME', size: '3.4 MB', time: '30 min ago', status: 'Under Review' },
  { id: 'ou-3', file: 'signed-GR-scan-URD.pdf', uploader: 'S. Kadam', dept: 'UDD', size: '5.8 MB', time: '1 hr ago', status: 'Approved' },
  { id: 'ou-4', file: 'talathi-mutation-request.jpg', uploader: 'B. Shinde', dept: 'REV', size: '1.6 MB', time: '2 hr ago', status: 'Approved' },
  { id: 'ou-5', file: 'ULB-verification-table.png', uploader: 'S. Kadam', dept: 'UDD', size: '2.9 MB', time: '3 hr ago', status: 'Under Review' },
  { id: 'ou-6', file: 'school-inspection-Ahmednagar.pdf', uploader: 'V. Patil', dept: 'EDU', size: '4.2 MB', time: '5 hr ago', status: 'Approved' },
]

export const IMAGE_UPLOADS: UploadRow[] = [
  { id: 'iu-1', file: 'school-Ahmednagar-roof.jpg', uploader: 'V. Patil', dept: 'EDU', size: '2.8 MB', time: '10 min ago', status: 'Approved' },
  { id: 'iu-2', file: 'PMAY-form-photo-218.jpg', uploader: 'S. Kadam', dept: 'UDD', size: '3.1 MB', time: '35 min ago', status: 'Approved' },
  { id: 'iu-3', file: 'road-damage-Ratnagiri.jpg', uploader: 'D. Iyer', dept: 'HOME', size: '4.7 MB', time: '1 hr ago', status: 'Under Review' },
  { id: 'iu-4', file: 'crop-loss-Beed-drone.png', uploader: 'K. Rao', dept: 'AGR', size: '9.2 MB', time: '2 hr ago', status: 'Under Review' },
  { id: 'iu-5', file: 'chart-monthly-disbursements.png', uploader: 'M. Joshi', dept: 'FIN', size: '820 KB', time: '3 hr ago', status: 'Approved' },
  { id: 'iu-6', file: 'ward-boundary-map-Pune.png', uploader: 'S. Kadam', dept: 'UDD', size: '6.3 MB', time: '4 hr ago', status: 'Approved' },
]

export const EXCEL_UPLOADS: UploadRow[] = [
  { id: 'eu-1', file: 'scheme_budget_actuals.xlsx', uploader: 'M. Joshi', dept: 'FIN', size: '1.8 MB', time: '4 min ago', status: 'Approved' },
  { id: 'eu-2', file: 'PMAY-U-beneficiary-list.xlsx', uploader: 'S. Kadam', dept: 'UDD', size: '11 MB', time: '22 min ago', status: 'Under Review' },
  { id: 'eu-3', file: 'HFW-outbreak-cases.csv', uploader: 'P. Gawde', dept: 'HFW', size: '820 KB', time: '58 min ago', status: 'Approved' },
  { id: 'eu-4', file: 'AGR-crop-loss-Beed.xlsx', uploader: 'K. Rao', dept: 'AGR', size: '2.4 MB', time: '2 hr ago', status: 'Approved' },
  { id: 'eu-5', file: 'DIT-officer-onboarding.xlsx', uploader: 'R. Mahajan', dept: 'DIT', size: '640 KB', time: '3 hr ago', status: 'Approved' },
  { id: 'eu-6', file: 'EDU-inspection-scores.xlsx', uploader: 'V. Patil', dept: 'EDU', size: '1.2 MB', time: '4 hr ago', status: 'Under Review' },
]

export interface BatchJob {
  id: string
  name: string
  count: number
  progress: number // 0-100
  eta: string
  state: 'Queued' | 'Running' | 'Completed' | 'Paused' | 'Failed'
  dept: string
}

export const OCR_BATCH: BatchJob[] = [
  { id: 'b-o1', name: 'Talathi mutation register — batch 42', count: 320, progress: 68, eta: '4 min', state: 'Running', dept: 'REV' },
  { id: 'b-o2', name: 'ULB PMAY forms — Pune ward 12', count: 180, progress: 100, eta: 'Done', state: 'Completed', dept: 'UDD' },
  { id: 'b-o3', name: 'Handwritten margin notes — vigilance', count: 46, progress: 12, eta: '18 min', state: 'Running', dept: 'HOME' },
  { id: 'b-o4', name: 'School inspection sheets — Ahmednagar', count: 92, progress: 0, eta: 'Queued', state: 'Queued', dept: 'EDU' },
  { id: 'b-o5', name: 'Field inspection — road damages', count: 58, progress: 34, eta: 'Paused', state: 'Paused', dept: 'HOME' },
  { id: 'b-o6', name: 'RTI response scans — GAD Q1', count: 214, progress: 100, eta: 'Done', state: 'Completed', dept: 'GAD' },
]

export const PDF_BATCH: BatchJob[] = [
  { id: 'b-p1', name: 'GR pack — Urban Development Q2', count: 42, progress: 74, eta: '3 min', state: 'Running', dept: 'UDD' },
  { id: 'b-p2', name: 'CAG audit annexures — bulk extract', count: 118, progress: 100, eta: 'Done', state: 'Completed', dept: 'FIN' },
  { id: 'b-p3', name: 'Vigilance closures — bulk summary', count: 26, progress: 41, eta: '9 min', state: 'Running', dept: 'HOME' },
  { id: 'b-p4', name: 'Cabinet notes — May archive', count: 74, progress: 0, eta: 'Queued', state: 'Queued', dept: 'GAD' },
  { id: 'b-p5', name: 'DPR pack — Nagpur Metro P3', count: 12, progress: 88, eta: '1 min', state: 'Running', dept: 'UDD' },
  { id: 'b-p6', name: 'RTI batch — Home Q1', count: 210, progress: 100, eta: 'Done', state: 'Completed', dept: 'HOME' },
]

export const EXCEL_BATCH: BatchJob[] = [
  { id: 'b-e1', name: 'District-wise beneficiary rollup — PMAY-U', count: 36, progress: 62, eta: '5 min', state: 'Running', dept: 'UDD' },
  { id: 'b-e2', name: 'Budget variance — all schemes FY26', count: 84, progress: 100, eta: 'Done', state: 'Completed', dept: 'FIN' },
  { id: 'b-e3', name: 'Crop-loss aggregation — Beed', count: 22, progress: 27, eta: '11 min', state: 'Running', dept: 'AGR' },
  { id: 'b-e4', name: 'HR service book — DIT audit', count: 480, progress: 0, eta: 'Queued', state: 'Queued', dept: 'DIT' },
  { id: 'b-e5', name: 'Outbreak dashboard — HFW rollup', count: 12, progress: 100, eta: 'Done', state: 'Completed', dept: 'HFW' },
]

// 7-day processing volume for insights charts
export interface VolumePoint { day: string; volume: number; success: number }

export const OCR_VOLUME_7D: VolumePoint[] = [
  { day: 'Mon', volume: 412, success: 386 },
  { day: 'Tue', volume: 468, success: 431 },
  { day: 'Wed', volume: 502, success: 471 },
  { day: 'Thu', volume: 448, success: 419 },
  { day: 'Fri', volume: 596, success: 561 },
  { day: 'Sat', volume: 214, success: 202 },
  { day: 'Sun', volume: 128, success: 120 },
]

export const PDF_VOLUME_7D: VolumePoint[] = [
  { day: 'Mon', volume: 128, success: 121 },
  { day: 'Tue', volume: 142, success: 136 },
  { day: 'Wed', volume: 168, success: 158 },
  { day: 'Thu', volume: 156, success: 148 },
  { day: 'Fri', volume: 204, success: 191 },
  { day: 'Sat', volume: 62, success: 60 },
  { day: 'Sun', volume: 41, success: 39 },
]

export const EXCEL_VOLUME_7D: VolumePoint[] = [
  { day: 'Mon', volume: 84, success: 82 },
  { day: 'Tue', volume: 92, success: 89 },
  { day: 'Wed', volume: 118, success: 114 },
  { day: 'Thu', volume: 106, success: 101 },
  { day: 'Fri', volume: 138, success: 132 },
  { day: 'Sat', volume: 28, success: 27 },
  { day: 'Sun', volume: 18, success: 17 },
]

// Translation quality matrix — EN, MR, HI (sample BLEU-like scores)
export const TRANSLATION_MATRIX: { from: string; to: string; score: number; note: string }[] = [
  { from: 'English', to: 'English', score: 100, note: 'Identity' },
  { from: 'English', to: 'Marathi', score: 92, note: 'Sarvam-M v1.8' },
  { from: 'English', to: 'Hindi', score: 94, note: 'Sarvam-M v1.8' },
  { from: 'Marathi', to: 'English', score: 89, note: 'Formal register' },
  { from: 'Marathi', to: 'Marathi', score: 100, note: 'Identity' },
  { from: 'Marathi', to: 'Hindi', score: 87, note: 'Sarvam-M v1.8' },
  { from: 'Hindi', to: 'English', score: 91, note: 'Formal register' },
  { from: 'Hindi', to: 'Marathi', score: 88, note: 'Sarvam-M v1.8' },
  { from: 'Hindi', to: 'Hindi', score: 100, note: 'Identity' },
]

// Prompt versioning history — keyed by prompt id
export interface PromptVersion { version: string; at: string; by: string; note: string }

export const PROMPT_HISTORY: Record<string, PromptVersion[]> = {
  p1: [
    { version: 'v3', at: '2026-06-24', by: 'A. Deshpande', note: 'Tightened bullet count and citation style.' },
    { version: 'v2', at: '2026-04-11', by: 'R. Mahajan', note: 'Added Marathi register support.' },
    { version: 'v1', at: '2026-02-02', by: 'MAII AI', note: 'Initial draft.' },
  ],
  p2: [
    { version: 'v4', at: '2026-06-30', by: 'R. Mahajan', note: 'Recommended DPDP citation format.' },
    { version: 'v3', at: '2026-05-14', by: 'MAII AI', note: 'Added financial-implication bullet.' },
    { version: 'v2', at: '2026-03-01', by: 'A. Deshpande', note: 'Refined tone to formal.' },
    { version: 'v1', at: '2026-01-19', by: 'MAII AI', note: 'Initial draft.' },
  ],
  p3: [
    { version: 'v2', at: '2026-06-12', by: 'S. Kadam', note: 'Refined Marathi vernacular register.' },
    { version: 'v1', at: '2026-03-22', by: 'MAII AI', note: 'Initial draft.' },
  ],
  p10: [
    { version: 'v1', at: '2026-04-08', by: 'D. Iyer', note: 'Initial high-risk draft — PII redaction gates.' },
  ],
}

// Research-related resources
export const RELATED_DEPARTMENTS = [
  { code: 'UDD', name: 'Urban Development', why: 'PMAY-U 2.0 policy owner' },
  { code: 'REV', name: 'Revenue & Forests', why: 'Land records & domicile validation' },
  { code: 'DIT', name: 'Directorate of IT', why: 'DPDP / MahaDBT integration owner' },
  { code: 'GAD', name: 'General Administration', why: 'Cabinet policy coordination' },
  { code: 'PLN', name: 'Planning', why: 'Scheme outlay & inter-state comparison' },
]

export const SIMILAR_RESEARCH = [
  { id: 'r-1', title: 'Direct Benefit Transfer verification — states comparison', by: 'MAII AI', when: '2026-05-18', tags: ['DBT', 'Verification'] },
  { id: 'r-2', title: 'Consent frameworks under DPDP Act — implementation notes', by: 'MAII AI', when: '2026-04-30', tags: ['DPDP', 'Consent'] },
  { id: 'r-3', title: 'Urban housing schemes — international benchmarks', by: 'MAII AI', when: '2026-04-05', tags: ['Housing', 'Benchmark'] },
  { id: 'r-4', title: 'Grievance redressal SLA — state vs national', by: 'MAII AI', when: '2026-03-14', tags: ['Grievance', 'SLA'] },
]
