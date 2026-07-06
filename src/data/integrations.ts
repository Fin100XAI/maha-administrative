export interface Integration {
  slug: string
  name: string
  category: string
  status: 'Connected' | 'Public-source linked' | 'API pending' | 'Department access required' | 'In development'
  accessType: string
  lastSync: string
  apiHealth: number
  securityStatus: string
  dataOwner: string
  requiredApprovals: string[]
  connectorReadiness: number
  url?: string
  description: string
}

export const INTEGRATIONS: Integration[] = [
  { slug: 'e-office', name: 'e-Office', category: 'Workflow', status: 'Public-source linked', accessType: 'Department API Required', lastSync: '2026-07-07 08:22', apiHealth: 92, securityStatus: 'A · mTLS', dataOwner: 'GAD', requiredApprovals: ['GAD approval', 'DIT security review'], connectorReadiness: 78, url: 'https://eoffice.gov.in/', description: 'NIC e-Office file movement & note-sheeting.' },
  { slug: 'rti', name: 'RTI Online', category: 'Citizen', status: 'Public-source linked', accessType: 'Public Web', lastSync: '2026-07-07 09:14', apiHealth: 88, securityStatus: 'B · public web', dataOwner: 'DoPT', requiredApprovals: ['—'], connectorReadiness: 92, url: 'https://rtionline.gov.in/', description: 'RTI request pattern reference.' },
  { slug: 'e-hrms', name: 'e-HRMS 2.0', category: 'HR', status: 'API pending', accessType: 'Department API Required', lastSync: '—', apiHealth: 0, securityStatus: '—', dataOwner: 'GAD + NIC', requiredApprovals: ['NIC MoU'], connectorReadiness: 42, url: 'https://ehrms.gov.in/', description: 'Employee master and service book.' },
  { slug: 'aaple-sarkar', name: 'Aaple Sarkar', category: 'Citizen', status: 'Department access required', accessType: 'Department API Required', lastSync: '—', apiHealth: 0, securityStatus: '—', dataOwner: 'DIT', requiredApprovals: ['DIT approval', 'DPO review'], connectorReadiness: 58, url: 'https://aaplesarkar.mahaonline.gov.in/', description: 'Right to Public Services delivery platform.' },
  { slug: 'mahadbt', name: 'MahaDBT 2.0', category: 'Welfare', status: 'Department access required', accessType: 'Department API Required', lastSync: '—', apiHealth: 0, securityStatus: '—', dataOwner: 'Planning', requiredApprovals: ['Planning approval', 'DPO review'], connectorReadiness: 62, url: 'https://mahadbt.maharashtra.gov.in/', description: 'DBT platform for scheme disbursement.' },
  { slug: 'email', name: 'Email Gateway (gom.gov.in)', category: 'Communication', status: 'Connected', accessType: 'API', lastSync: '2026-07-07 09:28', apiHealth: 99, securityStatus: 'A · TLS 1.3', dataOwner: 'DIT', requiredApprovals: ['—'], connectorReadiness: 100, description: 'Government e-mail relay.' },
  { slug: 'sms', name: 'SMS Gateway', category: 'Communication', status: 'Connected', accessType: 'API', lastSync: '2026-07-07 09:29', apiHealth: 99, securityStatus: 'A · TLS 1.3', dataOwner: 'DIT', requiredApprovals: ['—'], connectorReadiness: 100, description: 'DLT-registered SMS delivery.' },
  { slug: 'dms', name: 'Document Management System', category: 'Storage', status: 'Connected', accessType: 'API', lastSync: '2026-07-07 09:31', apiHealth: 98, securityStatus: 'A · mTLS + AES-256', dataOwner: 'DIT', requiredApprovals: ['—'], connectorReadiness: 96, description: 'Enterprise DMS for MAII documents.' },
  { slug: 'api-gateway', name: 'API Gateway', category: 'Platform', status: 'Connected', accessType: 'Internal', lastSync: '2026-07-07 09:32', apiHealth: 99, securityStatus: 'A+ · mTLS + JWT', dataOwner: 'DIT', requiredApprovals: ['—'], connectorReadiness: 100, description: 'MAII edge gateway — auth, rate-limit, WAF.' },
]
