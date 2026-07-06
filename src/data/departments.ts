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
  'Chief Secretary',
  'Additional Chief Secretary',
  'Principal Secretary',
  'District Collector',
  'Municipal Commissioner',
  'Department Officer',
  'Section Officer',
  'IT Admin',
  'AI Governance Officer',
  'Security Officer',
  'Data Protection Officer',
] as const

export type RoleOption = typeof ROLES[number]

export const SECURITY_CLASSES = ['Public', 'Internal', 'Confidential', 'Secret'] as const
export type SecurityClass = typeof SECURITY_CLASSES[number]
