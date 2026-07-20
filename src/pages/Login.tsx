import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  ClipboardList,
  Server,
  KeyRound,
  ArrowRight,
  Building2,
  BadgeCheck,
  Cpu,
  AlertTriangle,
  UserRound,
} from 'lucide-react'
import { OFFICER_PROFILES, ROLE_TIERS, tierOf } from '@/data/departments'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'
import { GROUP_ACCESS, useRole } from '@/lib/rbac'

export function Login() {
  const nav = useNavigate()
  const [profileId, setProfileId] = useState('off-ps')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useRole()

  const DEMO_PASSWORD = 'MahaDev@2026'
  const profile = OFFICER_PROFILES.find((p) => p.id === profileId) ?? OFFICER_PROFILES[0]
  const access = GROUP_ACCESS[profile.designation]
  const accessScope = access === 'all' ? 'Full platform access' : `${access.length} module groups`

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        {/* Left — brand pane */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-center"
          style={{ backgroundColor: 'rgb(23 99 224 / 98%)' }}
        >
          {/* Center content */}
          <div className="relative space-y-7">
            <div>
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight">
                India's Sovereign AI
                <br />
                <span className="bg-gradient-to-r from-white via-brand-100 to-brand-200 bg-clip-text text-transparent">
                  Administrative Intelligence.
                </span>
              </h1>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/85">
              A secure administrative operating layer for officers, departments and districts.
              Built for on-prem deployment, DPDP compliance, and Zero Trust security.
              Boardroom-ready by design.
            </p>

            <div className="grid max-w-md grid-cols-2 gap-2.5 text-xs">
              {[
                { icon: ShieldCheck, label: 'Zero Trust MFA' },
                { icon: Lock, label: 'AES-256 HSM ready' },
                { icon: Server, label: 'On-Prem Air-gapped' },
                { icon: ClipboardList, label: 'Immutable Audit Logs' },
                { icon: Fingerprint, label: 'RBAC Least Privilege' },
                { icon: Building2, label: 'MeghRaj SDC ready' },
              ].map(({ icon: I, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.35 }}
                  className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur transition-colors hover:bg-white/15"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-white/15 ring-1 ring-white/20">
                    <I className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium text-white/95">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* Signing in as — position only */}
            <div className="max-w-md rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
              <div className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
                <UserRound className="h-3 w-3" /> Signing in as
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">{profile.designation}</div>
                  <div className="truncate text-[11px] text-white/70">{tierOf(profile.designation)}</div>
                </div>
              </div>
            </div>

            {/* Trust badge row */}
            <div className="pt-2">
              {/* Google multi-color arc — subtle "Google-adjacent" accent */}
              <div
                aria-hidden
                className="mb-3 h-[2px] w-40 rounded-full bg-google-arc opacity-80"
              />
              <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/60">
                Credentials & Alignment
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: 'ISO 27001 ready', icon: BadgeCheck },
                  { label: 'SOC 2 aligned', icon: ShieldCheck },
                  { label: 'MeitY empanelled', icon: Cpu },
                  { label: 'DPDP compliant', icon: Lock },
                ].map(({ label, icon: I }) => (
                  <div
                    key={label}
                    className="relative inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-gradient-to-b from-white/20 to-white/5 px-2.5 py-1.5 text-[10.5px] font-medium text-white/95 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur"
                  >
                    <I className="h-3.5 w-3.5 text-white" />
                    <span className="tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/15 pt-4 text-[10.5px] uppercase tracking-[0.25em] text-white/70">
              Directorate of Information Technology
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <div className="flex items-center justify-center p-4 py-8 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-md"
          >
            {/* Language switcher */}
            <div className="mb-3 flex justify-end">
              <LanguageSwitcher />
            </div>

            {/* System status */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                System status: All systems operational
              </div>
              <div className="text-[10.5px] uppercase tracking-widest text-ink-400">
                Secure TLS 1.3
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-brand-500">
                Secure Officer Access
              </div>
              <h2 className="mt-1.5 text-3xl font-semibold leading-tight tracking-tight text-ink-900">
                Sign in to{' '}
                <span className="bg-gradient-to-r from-[#0B57D0] to-[#062868] bg-clip-text text-transparent">
                  MAII
                </span>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                Select your officer profile to sign in. Every session is authenticated,
                attested and logged under Zero Trust policy.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (password !== DEMO_PASSWORD) {
                  setError('Incorrect password. Please try again.')
                  return
                }
                setError('')
                signIn(profile.designation)
                nav('/')
              }}
              className="card space-y-4 p-6"
            >
              <div>
                <label className="label">Officer profile</label>
                <div className="relative mt-1">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <select
                    className="input pl-9"
                    value={profileId}
                    onChange={(e) => { setProfileId(e.target.value); setError('') }}
                    aria-label="Select officer profile"
                  >
                    {ROLE_TIERS.map((t) => {
                      const inTier = OFFICER_PROFILES.filter((p) => t.roles.includes(p.designation))
                      if (inTier.length === 0) return null
                      return (
                        <optgroup key={t.tier} label={t.tier}>
                          {inTier.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.designation}
                            </option>
                          ))}
                        </optgroup>
                      )
                    })}
                  </select>
                </div>

                {/* Selected profile preview — position only */}
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink-100 bg-gradient-to-br from-brand-50/60 to-white p-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{profile.designation}</div>
                    <div className="truncate text-[11px] text-ink-500">{profile.posting.replace(/\s*—\s*/g, ' ')}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                      {tierOf(profile.designation)}
                    </div>
                    <div className="mt-1 text-[10px] font-medium text-ink-400">{accessScope}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input mt-1"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter password"
                  autoComplete="off"
                />
                {error && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5" /> {error}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/40 p-3 text-[11px] text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> This session will run under Zero Trust policy.
                </div>
                <div className="mt-1 text-emerald-700">
                  Device posture check, geo-anomaly detection, audit logging and DPDP
                  redaction are active.
                </div>
              </div>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:shadow-[0_18px_50px_-12px_rgba(11,87,208,0.55)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative inline-flex w-full items-center justify-center gap-2">
                  <KeyRound className="h-4 w-4" /> Sign in securely{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>

              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                {['RBAC', 'Audit', 'AES-256', 'On-Prem'].map((t) => (
                  <div
                    key={t}
                    className="rounded-md border border-ink-100 bg-gradient-to-b from-white to-ink-50 py-1 text-[10px] font-semibold tracking-wide text-ink-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </form>

            <div className="mt-4 text-center text-xs text-ink-500">
              By signing in you agree to the{' '}
              <Link to="/ai-policy" className="text-brand-600 hover:underline">
                AI Acceptable-Use Policy
              </Link>{' '}
              and DPDP compliance obligations.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
