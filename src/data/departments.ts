export interface Department {
  code: string
  name: string
  officers: number
  aiUsage: number
  complianceScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

export const DEPARTMENTS: Department[] = [
  { code: 'GAD', name: 'General Administration', officers: 1220, aiUsage: 84, complianceScore: 92, riskLevel: 'Low' },
  { code: 'HOME', name: 'Home Department', officers: 3410, aiUsage: 62, complianceScore: 87, riskLevel: 'Medium' },
  { code: 'FIN', name: 'Finance', officers: 940, aiUsage: 78, complianceScore: 94, riskLevel: 'Low' },
  { code: 'REV', name: 'Revenue & Forests', officers: 5250, aiUsage: 71, complianceScore: 86, riskLevel: 'Medium' },
  { code: 'RD', name: 'Rural Development', officers: 4180, aiUsage: 66, complianceScore: 83, riskLevel: 'Medium' },
  { code: 'UDD', name: 'Urban Development', officers: 2810, aiUsage: 74, complianceScore: 88, riskLevel: 'Medium' },
  { code: 'HFW', name: 'Public Health', officers: 6320, aiUsage: 80, complianceScore: 90, riskLevel: 'Low' },
  { code: 'AGR', name: 'Agriculture', officers: 3910, aiUsage: 58, complianceScore: 81, riskLevel: 'Medium' },
  { code: 'EDU', name: 'School Education', officers: 4600, aiUsage: 69, complianceScore: 85, riskLevel: 'Low' },
  { code: 'HTE', name: 'Higher & Technical Education', officers: 1740, aiUsage: 63, complianceScore: 84, riskLevel: 'Low' },
  { code: 'WCD', name: 'Women & Child Development', officers: 2260, aiUsage: 55, complianceScore: 82, riskLevel: 'Medium' },
  { code: 'SJSA', name: 'Social Justice', officers: 1980, aiUsage: 60, complianceScore: 83, riskLevel: 'Medium' },
  { code: 'LAB', name: 'Labour', officers: 1130, aiUsage: 52, complianceScore: 79, riskLevel: 'High' },
  { code: 'IND', name: 'Industries', officers: 1420, aiUsage: 67, complianceScore: 86, riskLevel: 'Medium' },
  { code: 'ENR', name: 'Energy', officers: 970, aiUsage: 70, complianceScore: 88, riskLevel: 'Low' },
  { code: 'WRD', name: 'Water Resources', officers: 2530, aiUsage: 61, complianceScore: 80, riskLevel: 'Medium' },
  { code: 'DIT', name: 'DIT — Directorate of IT', officers: 480, aiUsage: 92, complianceScore: 96, riskLevel: 'Low' },
  { code: 'PLN', name: 'Planning', officers: 720, aiUsage: 75, complianceScore: 91, riskLevel: 'Low' },
]

export const DISTRICTS_MAHARASHTRA = [
  'Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana','Chandrapur','Dhule','Gadchiroli',
  'Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded',
  'Nandurbar','Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg',
  'Solapur','Thane','Wardha','Washim','Yavatmal',
]

export const LANGUAGES = ['English', 'मराठी (Marathi)', 'हिंदी (Hindi)'] as const
export type LanguageOption = typeof LANGUAGES[number]

export const ROLES = [
  // Apex leadership
  'Chief Secretary',
  'Additional Chief Secretary',
  // Secretariat
  'Principal Secretary',
  'Secretary',
  'Deputy Secretary',
  'Under Secretary',
  // Field administration
  'Divisional Commissioner',
  'District Collector',
  'Municipal Commissioner',
  'CEO, Zilla Parishad',
  // Operational
  'Department Officer',
  'Section Officer',
  'Desk Officer',
  // Specialist
  'IT Admin',
  'AI Governance Officer',
  'Security Officer',
  'Data Protection Officer',
] as const

export type RoleOption = typeof ROLES[number]

/**
 * Avatar initials for a designation — officers are identified by post, never by
 * name, so the monogram is derived from the post too. Existing acronyms in the
 * title win ("CEO, Zilla Parishad" → CEO, "IT Admin" → IT); otherwise the
 * initial of each word is used ("Principal Secretary" → PS).
 */
export function postInitials(designation: string): string {
  const words = designation.replace(/[,.]/g, ' ').split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'GoM'
  const acronym = words.find((w) => w.length > 1 && w === w.toUpperCase())
  if (acronym) return acronym.slice(0, 3)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 3)
}

/** Roles grouped by administrative tier — drives the grouped designation picker. */
export const ROLE_TIERS: { tier: string; roles: RoleOption[] }[] = [
  { tier: 'Apex Leadership', roles: ['Chief Secretary', 'Additional Chief Secretary'] },
  { tier: 'Secretariat', roles: ['Principal Secretary', 'Secretary', 'Deputy Secretary', 'Under Secretary'] },
  { tier: 'Field Administration', roles: ['Divisional Commissioner', 'District Collector', 'Municipal Commissioner', 'CEO, Zilla Parishad'] },
  { tier: 'Operational', roles: ['Department Officer', 'Section Officer', 'Desk Officer'] },
  { tier: 'Specialist', roles: ['IT Admin', 'AI Governance Officer', 'Security Officer', 'Data Protection Officer'] },
]

/** Tier label for a role (for badges / access-layer hints). */
export function tierOf(role: RoleOption): string {
  return ROLE_TIERS.find((t) => t.roles.includes(role))?.tier ?? 'Officer'
}

/** A signed-in officer identity. Its `designation` is the RBAC role that the
 *  session runs under, so signing in as a profile applies that role's access layer. */
export interface OfficerProfile {
  id: string
  name: string
  designation: RoleOption
  posting: string
  initials: string
}

/** Demo officer directory shown on the sign-in screen — one per designation so the
 *  full role hierarchy is exercisable. All profiles share the demo password. */
export const OFFICER_PROFILES: OfficerProfile[] = [
  { id: 'off-cs', name: 'Sujata Saunik', designation: 'Chief Secretary', posting: 'General Administration', initials: 'SS' },
  { id: 'off-acs', name: 'Rajesh Kumar', designation: 'Additional Chief Secretary', posting: 'Home Department', initials: 'RK' },
  { id: 'off-ps', name: 'Anita Deshpande', designation: 'Principal Secretary', posting: 'Finance', initials: 'AD' },
  { id: 'off-sec', name: 'Vikram Patil', designation: 'Secretary', posting: 'Urban Development', initials: 'VP' },
  { id: 'off-ds', name: 'Meera Joshi', designation: 'Deputy Secretary', posting: 'Revenue & Forests', initials: 'MJ' },
  { id: 'off-us', name: 'Sanjay More', designation: 'Under Secretary', posting: 'Rural Development', initials: 'SM' },
  { id: 'off-divc', name: 'Prakash Gaikwad', designation: 'Divisional Commissioner', posting: 'Pune Division', initials: 'PG' },
  { id: 'off-col', name: 'Nilesh Kulkarni', designation: 'District Collector', posting: 'Nashik District', initials: 'NK' },
  { id: 'off-mc', name: 'Radhika Iyer', designation: 'Municipal Commissioner', posting: 'Pune Municipal Corporation', initials: 'RI' },
  { id: 'off-ceo', name: 'Amol Shinde', designation: 'CEO, Zilla Parishad', posting: 'Nagpur Zilla Parishad', initials: 'AS' },
  { id: 'off-do', name: 'Sunil Pawar', designation: 'Department Officer', posting: 'Agriculture', initials: 'SP' },
  { id: 'off-so', name: 'Kavita Bhosale', designation: 'Section Officer', posting: 'School Education', initials: 'KB' },
  { id: 'off-desk', name: 'Ganesh Jadhav', designation: 'Desk Officer', posting: 'Labour', initials: 'GJ' },
  { id: 'off-it', name: 'Rohit Sharma', designation: 'IT Admin', posting: 'DIT — Directorate of IT', initials: 'RS' },
  { id: 'off-aigo', name: 'Neha Kulkarni', designation: 'AI Governance Officer', posting: 'DIT — Directorate of IT', initials: 'NK' },
  { id: 'off-seco', name: 'Arjun Naik', designation: 'Security Officer', posting: 'DIT — Directorate of IT', initials: 'AN' },
  { id: 'off-dpo', name: 'Priya Menon', designation: 'Data Protection Officer', posting: 'DIT — Directorate of IT', initials: 'PM' },
]

export const SECURITY_CLASSES = ['Public', 'Internal', 'Confidential', 'Secret'] as const
export type SecurityClass = typeof SECURITY_CLASSES[number]
