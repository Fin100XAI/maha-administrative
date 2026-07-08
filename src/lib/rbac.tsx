import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { ROLES, RoleOption } from '@/data/departments'

/**
 * Role-based access control (demo-grade, front-end enforced).
 * Access is granted per sidebar group, with per-path extras for items that
 * cut across groups (e.g. every officer gets their personal workspace).
 */

const STORAGE_KEY = 'maii-role'
const DEFAULT_ROLE: RoleOption = 'Principal Secretary'

/** Sidebar group titles each role may see. 'all' = unrestricted. */
export const GROUP_ACCESS: Record<RoleOption, 'all' | string[]> = {
  'Chief Secretary': 'all',
  'Additional Chief Secretary': 'all',
  'Principal Secretary': 'all',
  'District Collector': ['Administrative AI', 'Administrative Intelligence', 'Knowledge Brain', 'Governance & Responsible AI', 'DPDP & Data Governance', 'Integrations'],
  'Municipal Commissioner': ['Administrative AI', 'Administrative Intelligence', 'Knowledge Brain', 'Governance & Responsible AI', 'DPDP & Data Governance', 'Integrations'],
  'Department Officer': ['Administrative AI', 'Knowledge Brain'],
  'Section Officer': ['Administrative AI', 'Knowledge Brain'],
  'IT Admin': ['Administrative AI', 'Knowledge Brain', 'Security & AI SOC', 'Integrations', 'Platform Admin'],
  'AI Governance Officer': ['Administrative AI', 'Administrative Intelligence', 'Knowledge Brain', 'Governance & Responsible AI', 'DPDP & Data Governance'],
  'Security Officer': ['Administrative AI', 'Knowledge Brain', 'Security & AI SOC', 'Integrations', 'Platform Admin'],
  'Data Protection Officer': ['Administrative AI', 'Knowledge Brain', 'Governance & Responsible AI', 'DPDP & Data Governance'],
}

/** Paths every signed-in role can open regardless of group access. */
const UNIVERSAL_PATHS = ['/', '/workspace', '/settings', '/login']

/** Per-role path grants that cut across hidden groups. */
export const EXTRA_PATHS: Partial<Record<RoleOption, string[]>> = {
  'Department Officer': ['/administrative-intelligence/officer-workspace'],
  'Section Officer': ['/administrative-intelligence/officer-workspace'],
  'IT Admin': ['/administrative-intelligence/officer-workspace'],
  'Data Protection Officer': ['/administrative-intelligence/officer-workspace'],
  'Security Officer': ['/administrative-intelligence/officer-workspace'],
  'AI Governance Officer': ['/administrative-intelligence/officer-workspace'],
}

export function groupAllowed(role: RoleOption, groupTitle: string): boolean {
  const access = GROUP_ACCESS[role]
  return access === 'all' || access.includes(groupTitle)
}

export function itemAllowed(role: RoleOption, groupTitle: string, to: string): boolean {
  if (UNIVERSAL_PATHS.includes(to)) return true
  if (groupAllowed(role, groupTitle)) return true
  return (EXTRA_PATHS[role] ?? []).includes(to)
}

/**
 * Route-level check. `nav` is the sidebar NAV structure (passed in to avoid
 * an import cycle with Sidebar).
 */
export function canAccessPath(
  role: RoleOption,
  pathname: string,
  nav: { title: string; items: { to: string }[] }[]
): boolean {
  if (UNIVERSAL_PATHS.includes(pathname)) return true
  if ((EXTRA_PATHS[role] ?? []).some((p) => pathname === p || pathname.startsWith(p + '/'))) return true
  // Longest-prefix match so /integrations/:slug resolves to the Integrations group
  let best: { title: string; len: number } | null = null
  for (const group of nav) {
    for (const item of group.items) {
      if ((pathname === item.to || pathname.startsWith(item.to + '/')) && (!best || item.to.length > best.len)) {
        best = { title: group.title, len: item.to.length }
      }
    }
  }
  if (!best) return true // unknown paths fall through to the router
  return groupAllowed(role, best.title)
}

interface RoleContextValue {
  role: RoleOption
  setRole: (r: RoleOption) => void
}

const RoleContext = createContext<RoleContextValue>({ role: DEFAULT_ROLE, setRole: () => {} })

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleOption>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (ROLES as readonly string[]).includes(saved ?? '') ? (saved as RoleOption) : DEFAULT_ROLE
  })
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, role)
  }, [role])
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  return useContext(RoleContext)
}
