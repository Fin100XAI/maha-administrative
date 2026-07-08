import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  User,
  ShieldCheck,
  Languages,
  Cpu,
  Bell,
  KeyRound,
  Database,
  Info,
  CheckCircle2,
  Lock,
  Clock,
  Monitor,
  Smartphone,
  Laptop,
  LogOut,
  Download,
  Mail,
  FileText,
  AlertTriangle,
  Siren,
  BellOff,
  Server,
  Activity,
  ScrollText,
  Fingerprint,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useRole, GROUP_ACCESS } from '@/lib/rbac'
import { useLanguage, LANGS } from '@/i18n/LanguageContext'
import { ROLES, DEPARTMENTS, SECURITY_CLASSES, SecurityClass, RoleOption } from '@/data/departments'
import { MODELS } from '@/data/models'

/* ------------------------------------------------------------------ */
/* Persisted settings model                                            */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'maii-settings'

interface NotificationPrefs {
  muteAll: boolean
  slaBreach: boolean
  cabinetFollowups: boolean
  securityIncidents: boolean
  dpdpConsent: boolean
  dailyBrief: boolean
  dailyBriefTime: string
  emailDigest: boolean
}

interface SettingsState {
  name: string
  department: string
  density: 'comfortable' | 'compact'
  reduceMotion: boolean
  defaultModel: string
  humanReview: boolean
  classification: SecurityClass
  responseLanguage: string
  confidenceThreshold: number
  notifications: NotificationPrefs
  privacy: {
    usageAnalytics: boolean
    modelImprovement: boolean
  }
}

const DEFAULT_SETTINGS: SettingsState = {
  name: 'Rajesh Mahajan',
  department: 'GAD',
  density: 'comfortable',
  reduceMotion: false,
  defaultModel: MODELS[0].id,
  humanReview: true,
  classification: 'Internal',
  responseLanguage: 'English',
  confidenceThreshold: 75,
  notifications: {
    muteAll: false,
    slaBreach: true,
    cabinetFollowups: true,
    securityIncidents: true,
    dpdpConsent: true,
    dailyBrief: false,
    dailyBriefTime: '08:30',
    emailDigest: true,
  },
  privacy: {
    usageAnalytics: false,
    modelImprovement: false,
  },
}

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<SettingsState>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications ?? {}) },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...(parsed.privacy ?? {}) },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/* ------------------------------------------------------------------ */
/* Small in-file UI primitives                                         */
/* ------------------------------------------------------------------ */

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        checked ? 'border-brand-600 bg-brand-gradient' : 'border-ink-200 bg-ink-100',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={cn('rounded-full bg-white shadow-sm', checked ? 'ml-[22px]' : 'ml-[3px]')}
        style={{ height: 18, width: 18 }}
      />
    </button>
  )
}

function ToggleRow({
  icon: Icon,
  title,
  hint,
  checked,
  onChange,
  disabled,
  children,
}: {
  icon: typeof Bell
  title: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink-100 p-3 transition-opacity',
        disabled && 'opacity-50'
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-ink-800">{title}</div>
          {hint && <div className="text-xs text-ink-500">{hint}</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <Switch checked={checked} onChange={onChange} disabled={disabled} label={title} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const SIDEBAR_GROUPS = [
  'Administrative AI',
  'Administrative Intelligence',
  'Knowledge Brain',
  'Governance & Responsible AI',
  'Security & AI SOC',
  'DPDP & Data Governance',
  'Integrations',
  'Platform Admin',
] as const

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'access', label: 'Role & Access', icon: ShieldCheck },
  { id: 'appearance', label: 'Language & Appearance', icon: Languages },
  { id: 'ai', label: 'AI Preferences', icon: Cpu },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: KeyRound },
  { id: 'privacy', label: 'Data & Privacy', icon: Database },
  { id: 'about', label: 'About', icon: Info },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

interface Session {
  id: string
  device: string
  icon: typeof Monitor
  location: string
  lastActive: string
  current?: boolean
}

const INITIAL_SESSIONS: Session[] = [
  { id: 's1', device: 'Windows 11 · Edge 126', icon: Monitor, location: 'Mantralaya, Mumbai', lastActive: 'Active now', current: true },
  { id: 's2', device: 'iPhone 15 · MAII App', icon: Smartphone, location: 'Mumbai Suburban', lastActive: '2 hours ago' },
  { id: 's3', device: 'Ubuntu 24.04 · Firefox', icon: Laptop, location: 'Pune (NIC VPN)', lastActive: 'Yesterday, 18:42' },
]

const RESPONSE_LANGUAGES = ['English', 'मराठी (Marathi)', 'हिंदी (Hindi)', 'Bilingual — English + मराठी']

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'RM'
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function SettingsPage() {
  const { role, setRole } = useRole()
  const { lang, setLang } = useLanguage()

  const [settings, setSettings] = useState<SettingsState>(loadSettings)
  const [active, setActive] = useState<SectionId>('profile')
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS)

  /* Toast */
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  /* Persist on every change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  /* Density + motion applied to the document */
  useEffect(() => {
    document.documentElement.dataset.density = settings.density
  }, [settings.density])
  useEffect(() => {
    document.documentElement.dataset.motion = settings.reduceMotion ? 'reduced' : 'full'
  }, [settings.reduceMotion])

  const update = (patch: Partial<SettingsState>, msg = 'Saved') => {
    setSettings((s) => ({ ...s, ...patch }))
    showToast(msg)
  }
  const updateNotif = (patch: Partial<NotificationPrefs>) => {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }))
    showToast('Saved')
  }
  const updatePrivacy = (patch: Partial<SettingsState['privacy']>) => {
    setSettings((s) => ({ ...s, privacy: { ...s.privacy, ...patch } }))
    showToast('Saved')
  }

  /* Password form */
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdErrors, setPwdErrors] = useState<{ current?: string; next?: string; confirm?: string }>({})
  const submitPassword = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof pwdErrors = {}
    if (!pwd.current) errs.current = 'Enter your current password.'
    if (pwd.next.length < 8) errs.next = 'New password must be at least 8 characters.'
    if (pwd.confirm !== pwd.next || !pwd.confirm) errs.confirm = 'Passwords do not match.'
    setPwdErrors(errs)
    if (Object.keys(errs).length === 0) {
      setPwd({ current: '', next: '', confirm: '' })
      showToast('Password updated')
    }
  }

  const revokeSession = (id: string) => {
    setSessions((s) => s.filter((x) => x.id !== id))
    showToast('Session revoked')
  }
  const signOutAll = () => {
    setSessions((s) => s.filter((x) => x.current))
    showToast('Signed out of all other sessions')
  }

  const downloadData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      account: { email: 'rajesh.mahajan@gom.gov.in', role },
      language: lang,
      settings,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'maii-my-data.json'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data export downloaded')
  }

  const muted = settings.notifications.muteAll

  return (
    <div>
      <PageHeader
        compact
        title="Settings"
        breadcrumb={['Platform Admin', 'Settings']}
        description="Profile, access, language, AI behaviour, alerts and privacy — per officer."
        icon={<User className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* ---- Section nav ---- */}
        <div>
          {/* Mobile: horizontal chip row */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:hidden">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'chip shrink-0 border',
                  active === s.id
                    ? 'border-brand-200 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-600'
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Desktop: sticky vertical nav */}
          <nav className="sticky top-20 hidden space-y-1 lg:block" aria-label="Settings sections">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-current={active === s.id ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  active === s.id
                    ? 'bg-brand-50 font-medium text-brand-700'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800'
                )}
              >
                <s.icon className={cn('h-4 w-4', active === s.id ? 'text-brand-600' : 'text-ink-400')} />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ---- Content ---- */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: settings.reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: settings.reduceMotion ? 0 : -4 }}
              transition={{ duration: settings.reduceMotion ? 0 : 0.18 }}
              className="space-y-6"
            >
              {/* ============ 1. PROFILE ============ */}
              {active === 'profile' && (
                <Card>
                  <CardHeader
                    title="Profile"
                    subtitle="Officer identity shown across dashboards, drafts and audit logs."
                  />
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-gradient text-2xl font-semibold text-white shadow-md">
                        {initialsOf(settings.name)}
                      </div>
                      <span className="text-[11px] text-ink-500">Auto from name</span>
                    </div>
                    <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="label" htmlFor="set-name">Full name</label>
                        <input
                          id="set-name"
                          className="input mt-1 w-full"
                          value={settings.name}
                          onChange={(e) => update({ name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="set-designation">Designation</label>
                        <input
                          id="set-designation"
                          className="input mt-1 w-full bg-ink-50 text-ink-600"
                          value={role}
                          readOnly
                          aria-readonly="true"
                        />
                        <p className="mt-1 text-[11px] text-ink-500">Follows your active role — change it under Role &amp; Access.</p>
                      </div>
                      <div>
                        <label className="label" htmlFor="set-dept">Department</label>
                        <select
                          id="set-dept"
                          className="input mt-1 w-full"
                          value={settings.department}
                          onChange={(e) => update({ department: e.target.value })}
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label" htmlFor="set-email">Official email</label>
                        <input
                          id="set-email"
                          className="input mt-1 w-full bg-ink-50 text-ink-600"
                          value="rajesh.mahajan@gom.gov.in"
                          readOnly
                          aria-readonly="true"
                        />
                        <p className="mt-1 text-[11px] text-ink-500">Managed by NIC directory — contact IT Admin to change.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* ============ 2. ROLE & ACCESS ============ */}
              {active === 'access' && (
                <>
                  <Card>
                    <CardHeader
                      title="Active role"
                      subtitle="Switching role changes your sidebar and page access instantly (live RBAC)."
                      right={
                        <span className="chip border border-brand-200 bg-brand-50 text-brand-700">
                          <Fingerprint className="h-3 w-3" /> {role}
                        </span>
                      }
                    />
                    <div role="radiogroup" aria-label="Select role" className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {ROLES.map((r) => {
                        const selected = r === role
                        const access = GROUP_ACCESS[r]
                        const scope = access === 'all' ? 'Full platform access' : `${access.length} of ${SIDEBAR_GROUPS.length} modules`
                        return (
                          <button
                            key={r}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => { setRole(r as RoleOption); showToast(`Role switched to ${r}`) }}
                            className={cn(
                              'rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                              selected
                                ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-1 ring-brand-500/30'
                                : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={cn('text-sm font-medium', selected ? 'text-brand-700' : 'text-ink-800')}>{r}</span>
                              <span
                                className={cn(
                                  'grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                                  selected ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
                                )}
                              >
                                {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] text-ink-500">{scope}</div>
                          </button>
                        )
                      })}
                    </div>
                  </Card>

                  <Card>
                    <CardHeader
                      title="Permission matrix"
                      subtitle={<>Module access for <span className="font-medium text-ink-700">{role}</span>, derived from the RBAC policy.</>}
                    />
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {SIDEBAR_GROUPS.map((g) => {
                        const access = GROUP_ACCESS[role]
                        const allowed = access === 'all' || access.includes(g)
                        return (
                          <li
                            key={g}
                            className={cn(
                              'flex items-center justify-between gap-3 rounded-md border p-3',
                              allowed ? 'border-ink-100' : 'border-ink-100 bg-ink-50/50'
                            )}
                          >
                            <span className="text-sm text-ink-700">{g}</span>
                            {allowed ? (
                              <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" /> Allowed
                              </span>
                            ) : (
                              <span className="chip border border-red-200 bg-red-50 text-red-700">
                                <Lock className="h-3 w-3" /> Restricted
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                    <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                      <ScrollText className="h-3.5 w-3.5 text-brand-500" /> Access changes are audit-logged.
                    </p>
                  </Card>
                </>
              )}

              {/* ============ 3. LANGUAGE & APPEARANCE ============ */}
              {active === 'appearance' && (
                <>
                  <Card>
                    <CardHeader
                      title="Interface language"
                      subtitle="Switches the whole application immediately."
                    />
                    <div role="radiogroup" aria-label="Interface language" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {LANGS.map((l) => {
                        const selected = l.code === lang
                        return (
                          <button
                            key={l.code}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => { setLang(l.code); showToast(`Language: ${l.label}`) }}
                            className={cn(
                              'flex items-center justify-between rounded-xl border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                              selected
                                ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30'
                                : 'border-ink-200 bg-white hover:border-brand-300'
                            )}
                          >
                            <div>
                              <div className={cn('text-sm font-medium', selected ? 'text-brand-700' : 'text-ink-800')}>{l.label}</div>
                              <div className="text-[11px] text-ink-500">{l.short}</div>
                            </div>
                            <span
                              className={cn(
                                'grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                                selected ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
                              )}
                            >
                              {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </Card>

                  <Card>
                    <CardHeader title="Appearance" subtitle="Layout density and motion." />
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink-100 p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                            <Monitor className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-ink-800">Density</div>
                            <div className="text-xs text-ink-500">Applies to tables and cards.</div>
                          </div>
                        </div>
                        <div role="radiogroup" aria-label="Density" className="flex rounded-lg border border-ink-200 p-0.5">
                          {(['comfortable', 'compact'] as const).map((d) => (
                            <button
                              key={d}
                              role="radio"
                              aria-checked={settings.density === d}
                              onClick={() => update({ density: d })}
                              className={cn(
                                'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                                settings.density === d ? 'bg-brand-gradient text-white shadow-sm' : 'text-ink-600 hover:text-ink-800'
                              )}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <ToggleRow
                        icon={Activity}
                        title="Reduce motion"
                        hint="Minimises page transitions and animated effects."
                        checked={settings.reduceMotion}
                        onChange={(v) => update({ reduceMotion: v })}
                      />
                    </div>
                  </Card>
                </>
              )}

              {/* ============ 4. AI PREFERENCES ============ */}
              {active === 'ai' && (
                <Card>
                  <CardHeader
                    title="AI preferences"
                    subtitle="Defaults for drafting, summarisation and Maha Copilot."
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="set-model">Default model</label>
                      <select
                        id="set-model"
                        className="input mt-1 w-full"
                        value={settings.defaultModel}
                        onChange={(e) => update({ defaultModel: e.target.value })}
                      >
                        {MODELS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} — {m.hosting}</option>
                        ))}
                      </select>
                      {(() => {
                        const m = MODELS.find((x) => x.id === settings.defaultModel)
                        return m ? (
                          <p className="mt-1 text-[11px] text-ink-500">
                            {m.provider} · v{m.version} · security {m.securityRating} · {m.deploymentMode}
                          </p>
                        ) : null
                      })()}
                    </div>
                    <div>
                      <label className="label" htmlFor="set-resp-lang">Response language</label>
                      <select
                        id="set-resp-lang"
                        className="input mt-1 w-full"
                        value={settings.responseLanguage}
                        onChange={(e) => update({ responseLanguage: e.target.value })}
                      >
                        {RESPONSE_LANGUAGES.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="label">Default classification</span>
                    <div role="radiogroup" aria-label="Default classification" className="mt-2 flex flex-wrap gap-2">
                      {SECURITY_CLASSES.map((c) => {
                        const selected = settings.classification === c
                        return (
                          <button
                            key={c}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update({ classification: c })}
                            className={cn(
                              'chip border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                              selected
                                ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500/30'
                                : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300'
                            )}
                          >
                            <Lock className="h-3 w-3" /> {c}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-1 text-[11px] text-ink-500">New drafts and uploads start at this classification.</p>
                  </div>

                  <div className="mt-5">
                    <ToggleRow
                      icon={ShieldCheck}
                      title="Human review required"
                      hint="AI outputs must be approved by an officer before dispatch."
                      checked={settings.humanReview}
                      onChange={(v) => update({ humanReview: v })}
                    />
                  </div>

                  <div className="mt-5 rounded-md border border-ink-100 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="label" htmlFor="set-confidence">Confidence threshold</label>
                      <span className="chip border border-brand-200 bg-brand-50 font-semibold text-brand-700">
                        {settings.confidenceThreshold}%
                      </span>
                    </div>
                    <input
                      id="set-confidence"
                      type="range"
                      min={60}
                      max={95}
                      step={1}
                      value={settings.confidenceThreshold}
                      onChange={(e) => update({ confidenceThreshold: Number(e.target.value) })}
                      className="mt-3 w-full accent-brand-600"
                      aria-valuetext={`${settings.confidenceThreshold} percent`}
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-ink-500">
                      <span>60% · more answers</span>
                      <span>95% · stricter, escalates to human review</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* ============ 5. NOTIFICATIONS ============ */}
              {active === 'notifications' && (
                <Card>
                  <CardHeader
                    title="Notifications"
                    subtitle="Alerts delivered in-app and to your official email."
                    right={
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-ink-600">Mute all</span>
                        <Switch
                          checked={muted}
                          onChange={(v) => updateNotif({ muteAll: v })}
                          label="Mute all notifications"
                        />
                      </div>
                    }
                  />
                  <div className="space-y-3">
                    {muted && (
                      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        <BellOff className="h-4 w-4 shrink-0" /> All notifications are muted. Critical security incidents are still logged for audit.
                      </div>
                    )}
                    <ToggleRow
                      icon={AlertTriangle}
                      title="SLA breach alerts"
                      hint="When a file or grievance crosses its service deadline."
                      checked={settings.notifications.slaBreach}
                      onChange={(v) => updateNotif({ slaBreach: v })}
                      disabled={muted}
                    />
                    <ToggleRow
                      icon={FileText}
                      title="Cabinet follow-ups"
                      hint="Action items and decisions tracked from Cabinet notes."
                      checked={settings.notifications.cabinetFollowups}
                      onChange={(v) => updateNotif({ cabinetFollowups: v })}
                      disabled={muted}
                    />
                    <ToggleRow
                      icon={Siren}
                      title="Security incidents"
                      hint="AI SOC alerts scoped to your department."
                      checked={settings.notifications.securityIncidents}
                      onChange={(v) => updateNotif({ securityIncidents: v })}
                      disabled={muted}
                    />
                    <ToggleRow
                      icon={ShieldCheck}
                      title="DPDP consent alerts"
                      hint="Consent withdrawals and data-principal requests."
                      checked={settings.notifications.dpdpConsent}
                      onChange={(v) => updateNotif({ dpdpConsent: v })}
                      disabled={muted}
                    />
                    <ToggleRow
                      icon={Clock}
                      title="Daily AI brief"
                      hint="Morning digest of pending files, SLAs and district signals."
                      checked={settings.notifications.dailyBrief}
                      onChange={(v) => updateNotif({ dailyBrief: v })}
                      disabled={muted}
                    >
                      <input
                        type="time"
                        aria-label="Daily brief time"
                        className="input h-8 w-28 px-2 py-1 text-xs"
                        value={settings.notifications.dailyBriefTime}
                        disabled={muted || !settings.notifications.dailyBrief}
                        onChange={(e) => updateNotif({ dailyBriefTime: e.target.value })}
                      />
                    </ToggleRow>
                    <ToggleRow
                      icon={Mail}
                      title="Email digest"
                      hint="Weekly summary to rajesh.mahajan@gom.gov.in."
                      checked={settings.notifications.emailDigest}
                      onChange={(v) => updateNotif({ emailDigest: v })}
                      disabled={muted}
                    />
                  </div>
                </Card>
              )}

              {/* ============ 6. SECURITY ============ */}
              {active === 'security' && (
                <>
                  <Card>
                    <CardHeader
                      title="Multi-factor authentication"
                      right={
                        <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> Enabled · NIC TOTP
                        </span>
                      }
                    />
                    <p className="text-sm text-ink-600">
                      6-digit TOTP via the NIC MFA app is enforced for your role. Fallback via SMS DLT. MFA policy is managed centrally by IT Admin.
                    </p>
                  </Card>

                  <Card>
                    <CardHeader title="Change password" subtitle="Minimum 8 characters. Rotated every 90 days per GoM policy." />
                    <form onSubmit={submitPassword} className="grid max-w-xl grid-cols-1 gap-4" noValidate>
                      <div>
                        <label className="label" htmlFor="pwd-current">Current password</label>
                        <input
                          id="pwd-current"
                          type="password"
                          autoComplete="current-password"
                          className={cn('input mt-1 w-full', pwdErrors.current && 'border-red-400')}
                          value={pwd.current}
                          onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                          aria-invalid={!!pwdErrors.current}
                        />
                        {pwdErrors.current && <p className="mt-1 text-xs text-red-600">{pwdErrors.current}</p>}
                      </div>
                      <div>
                        <label className="label" htmlFor="pwd-next">New password</label>
                        <input
                          id="pwd-next"
                          type="password"
                          autoComplete="new-password"
                          className={cn('input mt-1 w-full', pwdErrors.next && 'border-red-400')}
                          value={pwd.next}
                          onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                          aria-invalid={!!pwdErrors.next}
                        />
                        {pwdErrors.next && <p className="mt-1 text-xs text-red-600">{pwdErrors.next}</p>}
                      </div>
                      <div>
                        <label className="label" htmlFor="pwd-confirm">Confirm new password</label>
                        <input
                          id="pwd-confirm"
                          type="password"
                          autoComplete="new-password"
                          className={cn('input mt-1 w-full', pwdErrors.confirm && 'border-red-400')}
                          value={pwd.confirm}
                          onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                          aria-invalid={!!pwdErrors.confirm}
                        />
                        {pwdErrors.confirm && <p className="mt-1 text-xs text-red-600">{pwdErrors.confirm}</p>}
                      </div>
                      <div>
                        <button type="submit" className="btn-primary">
                          <KeyRound className="h-4 w-4" /> Update password
                        </button>
                      </div>
                    </form>
                  </Card>

                  <Card>
                    <CardHeader
                      title="Active sessions"
                      subtitle={`${sessions.length} device${sessions.length === 1 ? '' : 's'} signed in.`}
                      right={
                        <button className="btn-outline" onClick={signOutAll} disabled={sessions.length <= 1}>
                          <LogOut className="h-4 w-4" /> Sign out all others
                        </button>
                      }
                    />
                    <ul className="space-y-2">
                      <AnimatePresence initial={false}>
                        {sessions.map((s) => (
                          <motion.li
                            key={s.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: settings.reduceMotion ? 0 : -12 }}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink-100 p-3"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-50 text-ink-500">
                                <s.icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink-800">
                                  {s.device}
                                  {s.current && (
                                    <span className="chip border border-emerald-200 bg-emerald-50 text-emerald-700">This device</span>
                                  )}
                                </div>
                                <div className="text-xs text-ink-500">{s.location} · {s.lastActive}</div>
                              </div>
                            </div>
                            {!s.current && (
                              <button className="btn-ghost text-red-600 hover:text-red-700" onClick={() => revokeSession(s.id)}>
                                Revoke
                              </button>
                            )}
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </Card>
                </>
              )}

              {/* ============ 7. DATA & PRIVACY ============ */}
              {active === 'privacy' && (
                <>
                  <Card>
                    <CardHeader
                      title="DPDP consent"
                      subtitle="Optional processing under the Digital Personal Data Protection Act, 2023. Both are off by default."
                    />
                    <div className="space-y-3">
                      <ToggleRow
                        icon={Activity}
                        title="Usage analytics"
                        hint="Anonymous feature-usage telemetry to improve MAII."
                        checked={settings.privacy.usageAnalytics}
                        onChange={(v) => updatePrivacy({ usageAnalytics: v })}
                      />
                      <ToggleRow
                        icon={Cpu}
                        title="Model improvement"
                        hint="Allow redacted prompts to be used for sovereign model fine-tuning."
                        checked={settings.privacy.modelImprovement}
                        onChange={(v) => updatePrivacy({ modelImprovement: v })}
                      />
                    </div>
                  </Card>

                  <Card>
                    <CardHeader title="Your data" />
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="btn-primary" onClick={downloadData}>
                        <Download className="h-4 w-4" /> Download my data
                      </button>
                      <Link to="/dpdp" className="btn-outline">
                        <ShieldCheck className="h-4 w-4" /> DPDP compliance centre
                      </Link>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-500">
                      Retention — personal settings are retained for the duration of your posting; audit logs are retained
                      for 8 years per the GoM record-retention schedule and are immutable. Data never leaves sovereign
                      infrastructure (MeghRaj / State Data Centre).
                    </p>
                  </Card>
                </>
              )}

              {/* ============ 8. ABOUT ============ */}
              {active === 'about' && (
                <Card>
                  <CardHeader
                    title="About MAII"
                    subtitle="Maharashtra Administrative Intelligence Interface"
                    right={
                      <span className="chip border border-brand-200 bg-brand-50 text-brand-700">
                        <Server className="h-3 w-3" /> Sovereign deployment
                      </span>
                    }
                  />
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-ink-100 p-3">
                      <dt className="label">Version</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink-800">MAII 0.1 (preview)</dd>
                    </div>
                    <div className="rounded-md border border-ink-100 p-3">
                      <dt className="label">Build date</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink-800">7 July 2026</dd>
                    </div>
                    <div className="rounded-md border border-ink-100 p-3">
                      <dt className="label">Hosting</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink-800">MeghRaj Cloud · State Data Centre, Mumbai</dd>
                    </div>
                    <div className="rounded-md border border-ink-100 p-3">
                      <dt className="label">Compliance</dt>
                      <dd className="mt-0.5 text-sm font-medium text-ink-800">DPDP 2023 · CERT-In · IT Act 2000</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/ai-policy" className="btn-outline">
                      <FileText className="h-4 w-4" /> AI usage policy
                    </Link>
                    <Link to="/system-health" className="btn-outline">
                      <Activity className="h-4 w-4" /> System health
                    </Link>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ---- Saved toast ---- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
