// Shared sample data for DPDP & Data Governance pages.
// Content is illustrative / demo. Sensitive identifiers are always masked.

// ---------- DPDP Intelligence ----------

export interface DpdpObligation {
  id: string
  section: string
  title: string
  status: 'Compliant' | 'In progress' | 'Gap'
  owner: string
  evidence: string
}

// DPDP Act 2023 — sections 4-13 obligations
export const DPDP_OBLIGATIONS: DpdpObligation[] = [
  { id: 'S4',  section: 'Sec 4',  title: 'Lawful grounds for processing personal data',            status: 'Compliant',   owner: 'DPO Cell · DIT', evidence: 'Grounds register v3.2' },
  { id: 'S5',  section: 'Sec 5',  title: 'Notice to Data Principal in clear plain language',       status: 'Compliant',   owner: 'GAD',            evidence: 'Consent template CN-8241' },
  { id: 'S6',  section: 'Sec 6',  title: 'Consent — free, specific, informed, unconditional',      status: 'In progress', owner: 'GAD + DIT',      evidence: 'Refresh due Q3-2026' },
  { id: 'S7',  section: 'Sec 7',  title: 'Certain legitimate uses (govt scheme delivery)',         status: 'Compliant',   owner: 'MahaDBT',        evidence: 'Scheme mapping v2.1' },
  { id: 'S8',  section: 'Sec 8',  title: 'General obligations of Data Fiduciary',                  status: 'Compliant',   owner: 'CS + AI Gov',    evidence: 'Fiduciary charter' },
  { id: 'S9',  section: 'Sec 9',  title: 'Processing of children\'s personal data',                status: 'Gap',         owner: 'WCD + SED',      evidence: 'Guardian-consent flow WIP' },
  { id: 'S10', section: 'Sec 10', title: 'Additional obligations of Significant Data Fiduciary',   status: 'In progress', owner: 'DIT',            evidence: 'DPIA schedule set' },
  { id: 'S11', section: 'Sec 11', title: 'Right to access & obtain information',                   status: 'Compliant',   owner: 'DPO Cell',       evidence: 'DPR portal live' },
  { id: 'S12', section: 'Sec 12', title: 'Right to correction, completion, update, erasure',       status: 'Compliant',   owner: 'DPO Cell',       evidence: 'Erasure workflow v1.4' },
  { id: 'S13', section: 'Sec 13', title: 'Right of grievance redressal',                           status: 'In progress', owner: 'Aaple Sarkar',   evidence: 'SLA 15 days' },
]

export const DPDP_QUARTERLY_SCORE = [
  { q: 'Q3-24', score: 68 },
  { q: 'Q4-24', score: 71 },
  { q: 'Q1-25', score: 74 },
  { q: 'Q2-25', score: 76 },
  { q: 'Q3-25', score: 79 },
  { q: 'Q4-25', score: 82 },
  { q: 'Q1-26', score: 84 },
  { q: 'Q2-26', score: 87 },
]

export const FIDUCIARY_REG = {
  entity: 'Government of Maharashtra — Directorate of IT (DIT)',
  fiduciaryId: 'MAH-DF-2024-0018',
  significantFlag: true,
  registrationDate: '2024-11-08',
  renewalDate: '2027-11-07',
  dpo: 'Shri S. Kadam · Data Protection Officer',
  grievanceContact: 'dpo-cell (at) maharashtra.gov.in',
  associatedDepts: 12,
}

// DPO rotation — emails masked
export const DPO_ROSTER = [
  { name: 'S. Kadam',    dept: 'HFW · Health',            shift: 'Mon 09:00 – 18:00', contact: 'dpo-h***@maharashtra.gov.in',   phone: '+91-98XXXXXX21' },
  { name: 'A. Deshmukh', dept: 'GAD · General Admin',     shift: 'Tue 09:00 – 18:00', contact: 'dpo-g***@maharashtra.gov.in',   phone: '+91-98XXXXXX44' },
  { name: 'K. Kore',     dept: 'UDD · Urban Dev',         shift: 'Wed 09:00 – 18:00', contact: 'dpo-u***@maharashtra.gov.in',   phone: '+91-98XXXXXX18' },
  { name: 'R. Patil',    dept: 'REV · Revenue',           shift: 'Thu 09:00 – 18:00', contact: 'dpo-r***@maharashtra.gov.in',   phone: '+91-98XXXXXX72' },
  { name: 'M. Jadhav',   dept: 'HOME · Home Affairs',     shift: 'Fri 09:00 – 18:00', contact: 'dpo-ho***@maharashtra.gov.in',  phone: '+91-98XXXXXX09' },
  { name: 'P. Shinde',   dept: 'WCD · Women & Child',     shift: 'Sat 09:00 – 18:00', contact: 'dpo-w***@maharashtra.gov.in',   phone: '+91-98XXXXXX53' },
  { name: 'N. Bhosle',   dept: 'DIT · Directorate of IT', shift: 'Sun · On-call',     contact: 'dpo-cell***@maharashtra.gov.in',phone: '+91-98XXXXXX00' },
]

// ---------- Consent Dashboard ----------

export const CONSENT_PURPOSES = [
  { group: 'Scheme delivery',   items: ['PMAY-U 2.0 eligibility', 'MahaDBT onboarding', 'e-Fasal Bima claim', 'Widow-pension disbursal'] },
  { group: 'Citizen services',  items: ['Aaple Sarkar concierge', 'RTI reply drafting', 'e-KYC re-verification'] },
  { group: 'Health & welfare',  items: ['Vaccination reminder', 'Clinical decision support'] },
  { group: 'Administrative',    items: ['e-HRMS transfer optimiser', 'Note-sheet drafting', 'Payroll advisory'] },
]

export const CONSENT_FUNNEL = [
  { stage: 'Requested', value: 152410 },
  { stage: 'Granted',   value: 138220 },
  { stage: 'Active',    value: 124040 },
  { stage: 'Renewed',   value: 42180 },
  { stage: 'Withdrawn', value: 6420 },
]

// ---------- Sensitive Data Detection ----------

export const DETECTION_ENGINES = [
  { id: 'aadhaar',  name: 'Aadhaar 12-digit pattern', sensitivity: 92, mode: 'Regex + checksum (Verhoeff)', enabled: true  },
  { id: 'pan',      name: 'PAN AAAPL1234C pattern',   sensitivity: 88, mode: 'Regex + issuing-code lookup',  enabled: true  },
  { id: 'bank',     name: 'Bank account + IFSC',      sensitivity: 78, mode: 'Regex + IFSC directory',       enabled: true  },
  { id: 'health',   name: 'ICD-10 / medical entities',sensitivity: 82, mode: 'NER model (on-prem)',          enabled: true  },
  { id: 'gpspatt',  name: 'Geo-coords near sensitive',sensitivity: 55, mode: 'Regex + geofence',             enabled: false },
  { id: 'secret',   name: 'API keys / access tokens', sensitivity: 96, mode: 'Entropy + prefix scan',        enabled: true  },
]

export const DEPT_PII_TREND = [
  { month: 'Feb', HFW: 82, HOME: 74, REV: 63, UDD: 42, GAD: 31 },
  { month: 'Mar', HFW: 84, HOME: 76, REV: 66, UDD: 44, GAD: 33 },
  { month: 'Apr', HFW: 86, HOME: 78, REV: 64, UDD: 46, GAD: 34 },
  { month: 'May', HFW: 83, HOME: 79, REV: 68, UDD: 48, GAD: 36 },
  { month: 'Jun', HFW: 85, HOME: 77, REV: 65, UDD: 47, GAD: 35 },
  { month: 'Jul', HFW: 87, HOME: 78, REV: 66, UDD: 49, GAD: 37 },
]

export const MASK_LIBRARY = [
  { kind: 'Aadhaar',       raw: '12-digit UID',            masked: 'XXXX XXXX 1234',        rule: 'Show last 4 only' },
  { kind: 'PAN',           raw: '10-char PAN',             masked: 'ABCPX XXXX Q',           rule: 'Show first 4 + last 1' },
  { kind: 'Bank account',  raw: 'Account no.',             masked: 'XXXXXXXX7218',           rule: 'Show last 4 only' },
  { kind: 'IFSC',          raw: 'Bank IFSC',               masked: 'SBIN0*****218',          rule: 'Mask middle 5' },
  { kind: 'Email',         raw: 'Officer email',           masked: 'a.desh****@mah.gov.in',  rule: 'Mask local >4 chars' },
  { kind: 'Phone',         raw: 'Mobile',                  masked: '+91-98XXXXXX21',         rule: 'Show cc + last 2' },
  { kind: 'DOB',           raw: 'Date of birth',           masked: '07-***-1971',            rule: 'Mask month + day' },
  { kind: 'File no.',      raw: 'Confidential file no.',   masked: 'DIT/AI/2026/07/***',     rule: 'Mask trailing seq' },
]

export const FP_REVIEW_QUEUE = [
  { id: 'FP-4128', field: 'invoice_no',       sampleMasked: 'AAAPL1234C-like', flaggedAs: 'PAN',     verdict: 'Pending', dept: 'FIN' },
  { id: 'FP-4127', field: 'case_reference',   sampleMasked: 'XXXX XXXX 4218',  flaggedAs: 'Aadhaar', verdict: 'Pending', dept: 'HOME' },
  { id: 'FP-4126', field: 'inventory_code',   sampleMasked: 'ABCPX****Q',      flaggedAs: 'PAN',     verdict: 'False +', dept: 'GAD' },
  { id: 'FP-4125', field: 'test_result_code', sampleMasked: 'E11.**',          flaggedAs: 'ICD10',   verdict: 'Confirm', dept: 'HFW' },
  { id: 'FP-4124', field: 'form_serial',      sampleMasked: 'XXXXXXXX7218',    flaggedAs: 'Bank',    verdict: 'False +', dept: 'REV' },
]

// ---------- Data Classification ----------

export const CLASSIFIER_ACCURACY = [
  { level: 'Public',            accuracy: 98.4, samples: 82420 },
  { level: 'Internal',          accuracy: 94.1, samples: 148230 },
  { level: 'Confidential',      accuracy: 91.6, samples: 42180 },
  { level: 'Secret',            accuracy: 87.2, samples: 6120 },
  { level: 'Highly Restricted', accuracy: 83.8, samples: 1180 },
]

export const DEPT_CLASS_COVERAGE = [
  { dept: 'GAD', coverage: 94 },
  { dept: 'HFW', coverage: 91 },
  { dept: 'HOME', coverage: 88 },
  { dept: 'REV', coverage: 86 },
  { dept: 'UDD', coverage: 84 },
  { dept: 'FIN', coverage: 96 },
  { dept: 'AGR', coverage: 79 },
  { dept: 'WCD', coverage: 82 },
]

export const RECLASS_REQUESTS = [
  { id: 'RC-2041', asset: 'Cabinet note CN-2026-118',  from: 'Confidential',      to: 'Secret',            requester: 'CS Cell',       raised: '2026-07-03' },
  { id: 'RC-2040', asset: 'Beneficiary export dump',   from: 'Internal',          to: 'Confidential',      requester: 'MahaDBT',       raised: '2026-07-02' },
  { id: 'RC-2039', asset: 'HFW clinical registry',     from: 'Confidential',      to: 'Highly Restricted', requester: 'HFW DPO',       raised: '2026-06-30' },
  { id: 'RC-2038', asset: 'Public GR archive 2015-19', from: 'Internal',          to: 'Public',            requester: 'GAD Records',   raised: '2026-06-29' },
  { id: 'RC-2037', asset: 'e-HRMS payroll snapshot',   from: 'Secret',            to: 'Confidential',      requester: 'FIN Payroll',   raised: '2026-06-27' },
]

// ---------- Data Lineage ----------

export interface AssetNode {
  id: string
  name: string
  kind: 'source' | 'ingest' | 'processed' | 'model' | 'output'
  children?: AssetNode[]
}

export const ASSET_TREE: AssetNode[] = [
  {
    id: 'src-mahadbt', name: 'MahaDBT beneficiary registry', kind: 'source', children: [
      { id: 'ing-mahadbt', name: 'Consent-checked ingest v3', kind: 'ingest', children: [
        { id: 'proc-mahadbt', name: 'Normalised beneficiary index', kind: 'processed', children: [
          { id: 'out-mahadbt', name: 'PMAY-U shortlist draft', kind: 'output' },
        ] },
      ] },
    ],
  },
  {
    id: 'src-eoffice', name: 'e-Office GR corpus', kind: 'source', children: [
      { id: 'ing-eoffice', name: 'OCR + classification pipeline', kind: 'ingest', children: [
        { id: 'proc-eoffice', name: 'Vector store (v3)', kind: 'processed', children: [
          { id: 'model-bharat', name: 'BharatGPT v2.4.1 retrieval', kind: 'model', children: [
            { id: 'out-note', name: 'Note-sheet draft DIT/AI/2026/07/118', kind: 'output' },
          ] },
        ] },
      ] },
    ],
  },
  {
    id: 'src-aaple', name: 'Aaple Sarkar service log', kind: 'source', children: [
      { id: 'ing-aaple', name: 'Redacted intent extraction', kind: 'ingest', children: [
        { id: 'out-aaple', name: 'Concierge answer', kind: 'output' },
      ] },
    ],
  },
  {
    id: 'src-hfw', name: 'HFW clinical registry', kind: 'source', children: [
      { id: 'ing-hfw', name: 'PHI-safe ingest (on-prem)', kind: 'ingest', children: [
        { id: 'proc-hfw', name: 'ICD-10 tagged corpus', kind: 'processed' },
      ] },
    ],
  },
  {
    id: 'src-ehrms', name: 'e-HRMS officer register', kind: 'source', children: [
      { id: 'ing-ehrms', name: 'DLP-filtered ingest', kind: 'ingest', children: [
        { id: 'proc-ehrms', name: 'Transfer feature store', kind: 'processed' },
      ] },
    ],
  },
]

export const LINEAGE_IMPACT = [
  { source: 'MahaDBT registry', break: 'PMAY-U shortlist stale',        blastRadius: 'High',   downstream: 'UDD · Aaple Sarkar' },
  { source: 'e-Office corpus',  break: 'Note drafts fall back to base', blastRadius: 'Medium', downstream: 'GAD · All secretariats' },
  { source: 'Aadhaar e-KYC',    break: 'Onboarding queue halts',        blastRadius: 'High',   downstream: 'MahaDBT · e-Fasal' },
  { source: 'HFW registry',     break: 'Clinical support paused',       blastRadius: 'Medium', downstream: 'HFW clinical apps' },
]

export const QUALITY_GATES = [
  { stage: 'Ingestion',  gate: 'Schema + PII scan', pass: 96, fail: 4  },
  { stage: 'Processing', gate: 'OCR confidence ≥ 0.85', pass: 91, fail: 9 },
  { stage: 'AI Use',     gate: 'Grounding score ≥ 0.7', pass: 87, fail: 13 },
  { stage: 'Output',     gate: 'Redaction check', pass: 98, fail: 2 },
  { stage: 'Approval',   gate: 'HITL sign-off',   pass: 94, fail: 6 },
]

// ---------- Data Retention ----------

export const RETENTION_CALENDAR = [
  { day: 'D+3',  category: 'RTI replies (2016 batch)',      count: 22,  policy: '10 yr', owner: 'ALL'      },
  { day: 'D+7',  category: 'Note sheets (2019 Q3)',         count: 148, policy: '7 yr',  owner: 'GAD'      },
  { day: 'D+9',  category: 'Beneficiary records (2021)',    count: 412, policy: '5 yr',  owner: 'MahaDBT'  },
  { day: 'D+14', category: 'Vaccination reminders logs',    count: 96,  policy: '3 yr',  owner: 'HFW'      },
  { day: 'D+18', category: 'Note sheets (2019 Q4)',         count: 194, policy: '7 yr',  owner: 'GAD'      },
  { day: 'D+22', category: 'Draft advisories (2023 pilot)', count: 38,  policy: '3 yr',  owner: 'DIT'      },
  { day: 'D+26', category: 'Payroll ledgers (2021)',        count: 62,  policy: '5 yr',  owner: 'FIN'      },
  { day: 'D+29', category: 'Crop-loss appeals (2021 R1)',   count: 42,  policy: '5 yr',  owner: 'AGR'      },
]

export const LEGAL_HOLDS = [
  { id: 'LH-208', case: 'Bombay HC · WP 4218/2026',   initiator: 'GAD Legal',       date: '2026-05-14', category: 'Cabinet notes' },
  { id: 'LH-207', case: 'CAT · OA 118/2026',           initiator: 'e-HRMS Cell',     date: '2026-04-22', category: 'Officer records' },
  { id: 'LH-206', case: 'RTI Appeal · CIC/2026/0921',  initiator: 'DPO Cell',        date: '2026-03-30', category: 'RTI replies' },
  { id: 'LH-205', case: 'MERC Inquiry · 09/2025',      initiator: 'FIN Audit',       date: '2025-11-10', category: 'Payroll ledgers' },
]

export const DISPOSAL_LOG = [
  { id: 'DP-8811', date: '2026-07-05', category: 'RTI replies (2015)',    count: 18,  approver: 'DPO Cell', method: 'Cryptographic erase' },
  { id: 'DP-8810', date: '2026-07-01', category: 'Note sheets (2018 Q4)', count: 246, approver: 'GAD',      method: 'NIST 800-88 purge' },
  { id: 'DP-8809', date: '2026-06-24', category: 'Beneficiary (2020)',    count: 512, approver: 'MahaDBT',  method: 'Cryptographic erase' },
  { id: 'DP-8808', date: '2026-06-14', category: 'Vaccination logs',      count: 84,  approver: 'HFW',      method: 'NIST 800-88 clear'   },
  { id: 'DP-8807', date: '2026-06-01', category: 'Payroll (2020 H1)',     count: 44,  approver: 'FIN',      method: 'Cryptographic erase' },
  { id: 'DP-8806', date: '2026-05-20', category: 'RTI drafts (2019)',     count: 62,  approver: 'DPO Cell', method: 'Cryptographic erase' },
  { id: 'DP-8805', date: '2026-05-04', category: 'e-HRMS temp exports',   count: 128, approver: 'GAD',      method: 'NIST 800-88 purge'   },
  { id: 'DP-8804', date: '2026-04-27', category: 'Crop-loss (2020)',      count: 32,  approver: 'AGR',      method: 'Cryptographic erase' },
]

// ---------- Purpose Limitation ----------

export const PURPOSE_DRIFT = [
  { month: 'Feb', registered: 24, actual: 26, drift: 2 },
  { month: 'Mar', registered: 24, actual: 28, drift: 4 },
  { month: 'Apr', registered: 26, actual: 31, drift: 5 },
  { month: 'May', registered: 26, actual: 30, drift: 4 },
  { month: 'Jun', registered: 28, actual: 31, drift: 3 },
  { month: 'Jul', registered: 28, actual: 30, drift: 2 },
]

export const PURPOSE_DATA_MAP = [
  { purpose: 'PMAY-U 2.0 verification', datasets: ['MahaDBT registry', 'Aadhaar e-KYC (masked)', 'GR corpus'] },
  { purpose: 'Crop-loss appeals',       datasets: ['e-Fasal Bima log', 'Revenue circle map'] },
  { purpose: 'e-HRMS transfer optimiser', datasets: ['e-HRMS officer register', 'Cadre policy corpus'] },
  { purpose: 'Aaple Sarkar concierge',  datasets: ['Aaple Sarkar service log', 'GR corpus'] },
  { purpose: 'Vaccination reminders',   datasets: ['HFW registry (masked)', 'SMS gateway metadata'] },
  { purpose: 'Health record intelligence', datasets: ['HFW clinical registry', 'ICD-10 taxonomy'] },
]

export const PURPOSE_CONSENT_MATRIX: {
  purpose: string
  consented: Array<'schemeMatch' | 'communications' | 'analytics' | 'thirdParty'>
}[] = [
  { purpose: 'PMAY-U 2.0 verification',   consented: ['schemeMatch', 'communications'] },
  { purpose: 'Crop-loss appeals',         consented: ['schemeMatch'] },
  { purpose: 'e-HRMS transfer optimiser', consented: ['analytics'] },
  { purpose: 'Aaple Sarkar concierge',    consented: ['schemeMatch', 'communications', 'analytics'] },
  { purpose: 'Vaccination reminders',     consented: ['communications'] },
  { purpose: 'Health record intelligence',consented: ['schemeMatch', 'analytics'] },
]

export const VIOLATION_PLAYBOOK = [
  { step: 1, title: 'Detect',   detail: 'Purpose-drift monitor flags query outside registered scope.' },
  { step: 2, title: 'Contain',  detail: 'Auto-block request; freeze downstream export for 30 min.' },
  { step: 3, title: 'Notify',   detail: 'Alert DPO on-call + issuing officer within 15 min.' },
  { step: 4, title: 'Assess',   detail: 'DPO reviews purpose register + intent; classifies severity.' },
  { step: 5, title: 'Remediate',detail: 'Register new purpose, revoke access, or dismiss as false-positive.' },
  { step: 6, title: 'Report',   detail: 'Log to audit ledger; monthly digest to AI Governance Committee.' },
]

// ---------- Privacy Risk ----------

export const PET_ADOPTION = [
  { pet: 'Differential Privacy',    coverage: 32, notes: 'Used on aggregated dashboards + open-data releases' },
  { pet: 'k-Anonymity (k ≥ 5)',      coverage: 58, notes: 'Used on health & beneficiary disclosures' },
  { pet: 'Homomorphic Encryption',  coverage: 12, notes: 'Pilot — cross-dept join without decryption' },
  { pet: 'Tokenisation (HSM)',      coverage: 71, notes: 'Bank accounts, PAN, Aadhaar routed via HSM' },
]

export const STRIDE_GRID = [
  { threat: 'Spoofing',              risk: 'Medium', control: 'Mutual TLS + officer eKYC' },
  { threat: 'Tampering',             risk: 'Low',    control: 'Immutable ledger · WORM archive' },
  { threat: 'Repudiation',           risk: 'Low',    control: 'Signed audit trail per action' },
  { threat: 'Information disclosure',risk: 'High',   control: 'Redaction + PET + classification RBAC' },
  { threat: 'Denial of service',     risk: 'Medium', control: 'Rate limits + circuit breakers' },
  { threat: 'Elevation of privilege',risk: 'Medium', control: 'Break-glass + dual approval' },
]

export const DPIA_SCHEDULE = [
  { q: 'Q3-26', assessment: 'Health record intelligence v2', dept: 'HFW', due: '2026-08-15' },
  { q: 'Q3-26', assessment: 'e-HRMS transfer optimiser',     dept: 'GAD', due: '2026-08-29' },
  { q: 'Q4-26', assessment: 'MahaDBT beneficiary matching',  dept: 'PLN', due: '2026-11-14' },
  { q: 'Q4-26', assessment: 'Aaple Sarkar AI concierge v3',  dept: 'GAD', due: '2026-12-05' },
  { q: 'Q1-27', assessment: 'e-Fasal Bima appeal drafting',  dept: 'AGR', due: '2027-02-10' },
]

export const DPR_SUMMARY = [
  { kind: 'Access',      thisQ: 128, closed: 118, avgDaysToClose: 6.8 },
  { kind: 'Correction',  thisQ: 84,  closed: 79,  avgDaysToClose: 8.1 },
  { kind: 'Erasure',     thisQ: 42,  closed: 34,  avgDaysToClose: 11.4 },
  { kind: 'Portability', thisQ: 18,  closed: 12,  avgDaysToClose: 9.2 },
]
