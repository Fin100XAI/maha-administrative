import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, PencilLine, FileText, FileSearch, FileStack, ScanText, Files, ImageIcon, Presentation,
  Table2, BookOpen, Library, Shuffle, Languages, Sparkles, Boxes, GitBranch, ClipboardCheck, Scale, AlertTriangle,
  Eye, GaugeCircle, ShieldCheck, UserCheck, Bug, Radar, Radio, ShieldAlert, Cpu, Activity, Fingerprint, KeyRound,
  Lock, Cookie, EyeOff, Layers, Route, Timer, Target, Waves, Database, Building2, Library as LibIcon, Scroll,
  BookText, MessagesSquare, SearchCode, Mail, Send, Network, Users, KeyRound as Auth, ShieldQuestion,
  ClipboardList, Server, HeartPulse, Landmark, ChevronRight, BadgeCheck,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavItem { to: string; label: string; icon: any }
interface NavGroup { title: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    title: 'Administrative AI',
    items: [
      { to: '/workspace', label: 'AI Workspace', icon: MessageSquare },
      { to: '/letter-drafting', label: 'Letter Drafting', icon: PencilLine },
      { to: '/note-drafting', label: 'Note Drafting', icon: FileText },
      { to: '/gr-analysis', label: 'GR Analysis', icon: FileSearch },
      { to: '/circular-analysis', label: 'Circular Analysis', icon: FileStack },
      { to: '/file-summarization', label: 'File Summarization', icon: Files },
      { to: '/translation', label: 'Translation', icon: Languages },
      { to: '/ocr', label: 'OCR Intelligence', icon: ScanText },
      { to: '/pdf', label: 'PDF Intelligence', icon: FileText },
      { to: '/image', label: 'Image Understanding', icon: ImageIcon },
      { to: '/ppt', label: 'PPT Generation', icon: Presentation },
      { to: '/excel', label: 'Excel Analysis', icon: Table2 },
      { to: '/research', label: 'Research Assistant', icon: BookOpen },
      { to: '/prompt-library', label: 'Prompt Library', icon: Library },
    ],
  },
  {
    title: 'Governance & Responsible AI',
    items: [
      { to: '/governance', label: 'AI Governance', icon: Sparkles },
      { to: '/model-registry', label: 'Model Registry', icon: Boxes },
      { to: '/model-versioning', label: 'Model Versioning', icon: GitBranch },
      { to: '/prompt-registry', label: 'Prompt Registry', icon: ClipboardList },
      { to: '/prompt-approval', label: 'Prompt Approval', icon: ClipboardCheck },
      { to: '/ai-policy', label: 'AI Policy', icon: Scale },
      { to: '/risk-register', label: 'AI Risk Register', icon: AlertTriangle },
      { to: '/bias', label: 'Bias Detection', icon: Scale },
      { to: '/hallucination', label: 'Hallucination Monitoring', icon: Eye },
      { to: '/explainability', label: 'Explainability', icon: GaugeCircle },
      { to: '/human-approval', label: 'Human Approval', icon: UserCheck },
      { to: '/ai-incidents', label: 'AI Incident Mgmt', icon: Bug },
    ],
  },
  {
    title: 'Security & AI SOC',
    items: [
      { to: '/security', label: 'Security Operations', icon: ShieldCheck },
      { to: '/ai-soc', label: 'AI SOC', icon: Radar },
      { to: '/prompt-injection', label: 'Prompt Injection', icon: ShieldAlert },
      { to: '/data-leakage', label: 'Data Leakage', icon: Radio },
      { to: '/zero-trust', label: 'Zero Trust', icon: Fingerprint },
      { to: '/api-security', label: 'API Security', icon: Cpu },
      { to: '/uba', label: 'User Behaviour Analytics', icon: Activity },
      { to: '/threat-intel', label: 'AI Threat Intelligence', icon: Radar },
    ],
  },
  {
    title: 'DPDP & Data Governance',
    items: [
      { to: '/dpdp', label: 'DPDP Intelligence', icon: ShieldCheck },
      { to: '/consent', label: 'Consent Dashboard', icon: Cookie },
      { to: '/sensitive-data', label: 'Sensitive Data', icon: EyeOff },
      { to: '/classification', label: 'Data Classification', icon: Layers },
      { to: '/lineage', label: 'Data Lineage', icon: Route },
      { to: '/retention', label: 'Data Retention', icon: Timer },
      { to: '/purpose', label: 'Purpose Limitation', icon: Target },
      { to: '/privacy-risk', label: 'Privacy Risk', icon: Waves },
    ],
  },
  {
    title: 'Knowledge Brain',
    items: [
      { to: '/knowledge', label: 'Department Knowledge', icon: Database },
      { to: '/gr-repo', label: 'GR Repository', icon: LibIcon },
      { to: '/circular-repo', label: 'Circular Repository', icon: Scroll },
      { to: '/sop-repo', label: 'SOP Repository', icon: BookText },
      { to: '/faq', label: 'FAQ', icon: MessagesSquare },
      { to: '/officer-search', label: 'Officer Knowledge Search', icon: SearchCode },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { to: '/integrations', label: 'Integrations Dashboard', icon: Network },
      { to: '/integrations/e-office', label: 'e-Office', icon: Building2 },
      { to: '/integrations/rti', label: 'RTI', icon: FileText },
      { to: '/integrations/e-hrms', label: 'e-HRMS', icon: Users },
      { to: '/integrations/aaple-sarkar', label: 'Aaple Sarkar', icon: Landmark },
      { to: '/integrations/mahadbt', label: 'MahaDBT 2.0', icon: Landmark },
      { to: '/integrations/email', label: 'Email', icon: Mail },
      { to: '/integrations/sms', label: 'SMS', icon: Send },
      { to: '/integrations/dms', label: 'Document Management', icon: Files },
      { to: '/integrations/api-gateway', label: 'API Gateway', icon: Cpu },
    ],
  },
  {
    title: 'Platform Admin',
    items: [
      { to: '/login-info', label: 'Secure Login', icon: Auth },
      { to: '/rbac', label: 'RBAC', icon: ShieldQuestion },
      { to: '/audit-logs', label: 'Audit Logs', icon: ClipboardList },
      { to: '/encryption', label: 'Encryption', icon: Lock },
      { to: '/on-prem', label: 'On-Prem Deployment', icon: Server },
      { to: '/system-health', label: 'System Health', icon: HeartPulse },
    ],
  },
]

// Group theme colors — a small dot before each group title
const GROUP_DOT: Record<string, string> = {
  'Administrative AI': 'bg-brand-500',
  'Governance & Responsible AI': 'bg-purple-500',
  'Security & AI SOC': 'bg-red-500',
  'DPDP & Data Governance': 'bg-amber-500',
  'Knowledge Brain': 'bg-sky-500',
  'Integrations': 'bg-emerald-500',
  'Platform Admin': 'bg-ink-700',
}

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <aside
      className={cn(
        'sticky top-0 h-screen shrink-0 border-r border-ink-100 bg-white/80 backdrop-blur-lg transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Brand header */}
      <div className="flex h-16 items-center gap-3 border-b border-ink-100 px-4">
        <div className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-brand-gradient text-white shadow-glow ring-1 ring-white/30">
          {/* inner shine */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              background:
                'linear-gradient(140deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0) 60%)',
            }}
          />
          <span className="relative text-sm font-bold tracking-tight">M</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-ink-900">MAII</div>
            <div className="flex items-center gap-1 truncate text-[10px] leading-tight text-ink-500">
              <span className="truncate">Sovereign · GoM</span>
              <span
                title="Government of Maharashtra verified"
                className="inline-flex items-center gap-0.5 rounded-full bg-brand-soft px-1 py-[1px] text-[8px] font-semibold uppercase tracking-wider text-brand-700"
              >
                <BadgeCheck className="h-2.5 w-2.5" />
                GoM
              </span>
            </div>
          </div>
        )}
      </div>

      <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-2 py-3">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
              isActive
                ? 'bg-brand-soft text-brand-700 font-medium shadow-[0_2px_10px_-4px_rgba(216,27,96,0.25)]'
                : 'text-ink-700 hover:bg-ink-50 hover:shadow-[0_2px_8px_-4px_rgba(216,27,96,0.15)]'
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-brand-gradient"
                />
              )}
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Command Dashboard</span>}
              {!collapsed && isActive && (
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-500" />
              )}
            </>
          )}
        </NavLink>

        <div className="mt-2 space-y-1">
          {NAV.map((group) => (
            <div key={group.title} className="mt-3">
              {!collapsed && (
                <div className="mb-1 px-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={cn('h-1.5 w-1.5 rounded-full', GROUP_DOT[group.title] ?? 'bg-brand-500')}
                    />
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                      {group.title}
                    </div>
                  </div>
                  {/* gradient underline: 60% width, 2px */}
                  <div
                    aria-hidden
                    className="mt-1 h-[2px] w-[60%] rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #D81B60 0%, #4A148C 100%)',
                      opacity: 0.65,
                    }}
                  />
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    title={item.label}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                        isActive
                          ? 'bg-brand-soft text-brand-700 font-medium shadow-[0_2px_10px_-4px_rgba(216,27,96,0.25)]'
                          : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900 hover:shadow-[0_2px_8px_-4px_rgba(216,27,96,0.15)]'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-brand-gradient"
                          />
                        )}
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && isActive && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-brand-500" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!collapsed && (
          <div className="relative mt-6 overflow-hidden rounded-xl p-[1.5px]">
            {/* Animated gradient border */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  'conic-gradient(from 0deg, #D81B60, #4A148C, #D81B60, #4A148C, #D81B60)',
                filter: 'blur(0.5px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative rounded-[11px] bg-white/95 p-3 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                  MAII Readiness
                </div>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-[1px] text-[8px] font-semibold uppercase tracking-wider text-emerald-700">
                  Live
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <div className="text-2xl font-bold leading-none text-ink-900">82</div>
                <div className="text-xs font-medium text-ink-400">/ 100</div>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-[82%] rounded-full bg-brand-gradient shadow-[0_0_8px_rgba(216,27,96,0.5)]" />
              </div>
              {/* Mini sparkline */}
              <svg
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className="mt-2 h-6 w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="sparkStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D81B60" />
                    <stop offset="100%" stopColor="#4A148C" />
                  </linearGradient>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D81B60" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#4A148C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* 6 fake data points: 64, 68, 72, 70, 78, 82 (normalized to 24px) */}
                <path
                  d="M0,17 L20,15 L40,12 L60,13 L80,8 L100,5 L100,24 L0,24 Z"
                  fill="url(#sparkFill)"
                />
                <path
                  d="M0,17 L20,15 L40,12 L60,13 L80,8 L100,5"
                  fill="none"
                  stroke="url(#sparkStroke)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="100" cy="5" r="1.8" fill="#D81B60" />
              </svg>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-500">
                <span>Public-source · Demo</span>
                <span className="font-medium text-emerald-600">+4.2%</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}
