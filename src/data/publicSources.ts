// Structured public-source references for MAII
// If live API access is not available from a public source, we show "Public-source linked / API pending" — not fake live data.

export type AccessType = 'Public Web' | 'API' | 'Manual Upload' | 'Department API Required'
export type SourceStatus = 'Live' | 'Linked' | 'Pending API' | 'Requires Government Access'
export type Confidence = 'High' | 'Medium' | 'Low'

export interface PublicSource {
  id: string
  name: string
  authority: string
  url: string
  accessType: AccessType
  status: SourceStatus
  lastChecked: string
  confidence: Confidence
  category:
    | 'Governance'
    | 'Welfare & Citizen Services'
    | 'AI & Policy'
    | 'Cyber & Data Protection'
    | 'IT Infrastructure'
    | 'Budget & Finance'
    | 'HR & Administration'
    | 'Right to Information'
  description: string
}

export const TODAY_CHECKED = '2026-07-06'

export const PUBLIC_SOURCES: PublicSource[] = [
  {
    id: 'maha-gov',
    name: 'Government of Maharashtra Portal',
    authority: 'GoM',
    url: 'https://www.maharashtra.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Governance',
    description: 'Official portal of Government of Maharashtra — departments, notifications, orders.',
  },
  {
    id: 'gr-portal',
    name: 'Maharashtra Government Resolutions (GR) Portal',
    authority: 'General Administration Dept, GoM',
    url: 'https://gr.maharashtra.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Governance',
    description: 'Repository of GRs, circulars, and notifications published by GoM departments.',
  },
  {
    id: 'mahadbt',
    name: 'MahaDBT 2.0',
    authority: 'Planning Dept, GoM',
    url: 'https://mahadbt.maharashtra.gov.in/',
    accessType: 'Department API Required',
    status: 'Requires Government Access',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Welfare & Citizen Services',
    description: 'Direct Benefit Transfer platform — scheme-wise disbursements, beneficiaries.',
  },
  {
    id: 'aaple-sarkar',
    name: 'Aaple Sarkar (RTS)',
    authority: 'DIT, GoM',
    url: 'https://aaplesarkar.mahaonline.gov.in/',
    accessType: 'Department API Required',
    status: 'Requires Government Access',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Welfare & Citizen Services',
    description: 'Citizen service delivery under Maharashtra Right to Public Services Act.',
  },
  {
    id: 'rti-online',
    name: 'RTI Online (GoI)',
    authority: 'DoPT, Government of India',
    url: 'https://rtionline.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Right to Information',
    description: 'Central RTI filing portal, reference for RTI response drafting patterns.',
  },
  {
    id: 'e-office',
    name: 'e-Office (NIC)',
    authority: 'National Informatics Centre',
    url: 'https://eoffice.gov.in/',
    accessType: 'Department API Required',
    status: 'Requires Government Access',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'HR & Administration',
    description: 'Digital file movement and note-sheeting platform used by GoM secretariats.',
  },
  {
    id: 'ehrms',
    name: 'e-HRMS 2.0',
    authority: 'DoPT / NIC',
    url: 'https://ehrms.gov.in/',
    accessType: 'Department API Required',
    status: 'Requires Government Access',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'HR & Administration',
    description: 'Government employee master, service book, transfers and promotions.',
  },
  {
    id: 'indiaai',
    name: 'IndiaAI Mission',
    authority: 'MeitY, Government of India',
    url: 'https://indiaai.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'AI & Policy',
    description: 'National AI mission — compute, datasets, foundation models, safety.',
  },
  {
    id: 'meity',
    name: 'MeitY',
    authority: 'Ministry of Electronics & IT',
    url: 'https://www.meity.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'AI & Policy',
    description: 'Policy, standards, and advisories for digital public infrastructure and AI.',
  },
  {
    id: 'dpdp',
    name: 'Digital Personal Data Protection Act, 2023',
    authority: 'MeitY',
    url: 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Cyber & Data Protection',
    description: 'DPDP Act reference — obligations of Data Fiduciaries, consent, DPO duties.',
  },
  {
    id: 'certin',
    name: 'CERT-In',
    authority: 'MeitY',
    url: 'https://www.cert-in.org.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Cyber & Data Protection',
    description: 'Advisories, vulnerability notes, incident reporting timelines.',
  },
  {
    id: 'nic',
    name: 'National Informatics Centre',
    authority: 'MeitY',
    url: 'https://www.nic.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'IT Infrastructure',
    description: 'Technology backbone for e-Governance, hosting, cloud, cybersecurity.',
  },
  {
    id: 'maha-budget',
    name: 'Maharashtra State Budget',
    authority: 'Finance Dept, GoM',
    url: 'https://finance.maharashtra.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Budget & Finance',
    description: 'State budget documents, revenue receipts, capital outlay, department allocations.',
  },
  {
    id: 'mahaonline',
    name: 'MahaOnline',
    authority: 'GoM (JV with TCS)',
    url: 'https://mahaonline.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Welfare & Citizen Services',
    description: 'Common Service Centre and G2C service catalogue.',
  },
  {
    id: 'india-code',
    name: 'India Code — Central Acts',
    authority: 'Legislative Dept, MoLaw',
    url: 'https://www.indiacode.nic.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'Governance',
    description: 'Authoritative digital corpus of Central and State legislation.',
  },
  {
    id: 'niti-aayog',
    name: 'NITI Aayog',
    authority: 'GoI',
    url: 'https://www.niti.gov.in/',
    accessType: 'Public Web',
    status: 'Linked',
    lastChecked: TODAY_CHECKED,
    confidence: 'High',
    category: 'AI & Policy',
    description: 'Policy papers, National Strategy for AI, State Support Mission.',
  },
]

export const PUBLIC_SOURCES_BY_CATEGORY = PUBLIC_SOURCES.reduce<Record<string, PublicSource[]>>((acc, s) => {
  acc[s.category] = acc[s.category] || []
  acc[s.category].push(s)
  return acc
}, {})
