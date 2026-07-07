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
  Sparkles,
  BadgeCheck,
  Cpu,
  Radio,
} from 'lucide-react'
import { ROLES } from '@/data/departments'
import { DEPARTMENTS } from '@/data/departments'

export function Login() {
  const nav = useNavigate()
  const [officerId, setOfficerId] = useState('IAS-2011-MH-0182')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [dept, setDept] = useState('DIT')
  const [role, setRole] = useState<string>('Principal Secretary')

  return (
    <div className="min-h-screen bg-mesh">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
        {/* Left — brand pane */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col"
        >
          {/* Animated radial mesh */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 40% at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 60%), radial-gradient(50% 40% at 80% 30%, rgba(66,133,244,0.22) 0%, transparent 60%), radial-gradient(60% 50% at 60% 90%, rgba(11,87,208,0.22) 0%, transparent 60%)',
            }}
            animate={{ opacity: [0.65, 0.9, 0.65] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Dotted grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
            }}
          />

          {/* Decorative network SVG */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.22]"
            viewBox="0 0 600 800"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <linearGradient id="netLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
              </linearGradient>
              <radialGradient id="netNode" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[
              [80, 120, 260, 220],
              [260, 220, 480, 140],
              [260, 220, 220, 430],
              [220, 430, 420, 500],
              [420, 500, 520, 340],
              [420, 500, 300, 700],
              [300, 700, 100, 640],
              [100, 640, 80, 120],
              [480, 140, 520, 340],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#netLine)"
                strokeWidth="1"
              />
            ))}
            {[
              [80, 120],
              [260, 220],
              [480, 140],
              [220, 430],
              [420, 500],
              [520, 340],
              [300, 700],
              [100, 640],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="14" fill="url(#netNode)" />
                <circle cx={cx} cy={cy} r="3" fill="#fff" opacity="0.9" />
              </g>
            ))}
          </svg>

          {/* Floating orbs */}
          <motion.div
            className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-white/20 blur-3xl"
            animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-24 -left-8 h-80 w-80 rounded-full bg-google-blue-500/25 blur-3xl"
            animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute right-24 top-1/3 h-40 w-40 rounded-full bg-brand-200/30 blur-2xl"
            animate={{ y: [0, 22, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Header brand */}
          <div className="relative flex items-center gap-3">
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]">
              <span className="text-xl font-bold tracking-tight">M</span>
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 ring-2 ring-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/80">
                Government of Maharashtra
              </div>
              <div className="text-lg font-semibold leading-tight">
                MAII · Sovereign AI Infrastructure
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-white/90 backdrop-blur">
                <Sparkles className="h-3 w-3" /> v0.1 · Sovereign Build
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="relative mt-auto space-y-7">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                <Radio className="h-3 w-3" /> Live · Officer Command Layer
              </div>
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
              Built for on-prem deployment, DPDP compliance, and Zero Trust security —
              boardroom-ready for the Government of Maharashtra.
            </p>

            <div className="grid max-w-md grid-cols-2 gap-2.5 text-xs">
              {[
                { icon: ShieldCheck, label: 'Zero Trust · MFA' },
                { icon: Lock, label: 'AES-256 · HSM ready' },
                { icon: Server, label: 'On-Prem · Air-gapped' },
                { icon: ClipboardList, label: 'Immutable Audit Logs' },
                { icon: Fingerprint, label: 'RBAC · Least Privilege' },
                { icon: Building2, label: 'MeghRaj / SDC ready' },
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

            <div className="flex items-center justify-between border-t border-white/15 pt-4 text-[10.5px] uppercase tracking-[0.25em] text-white/70">
              <span>Directorate of Information Technology</span>
              <span className="text-white/60">GoM · MAII</span>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <div className="relative flex items-center justify-center p-8">
          {/* Soft ambient glow behind card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(50% 40% at 50% 30%, rgba(11,87,208,0.08) 0%, transparent 70%), radial-gradient(40% 40% at 60% 90%, rgba(6,40,104,0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-md"
          >
            {/* System status */}
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                System status: All systems operational
              </div>
              <div className="text-[10.5px] uppercase tracking-widest text-ink-400">
                Secure · TLS 1.3
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
                Use your government-issued Officer ID. Every session is authenticated,
                attested and logged under Zero Trust policy.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                nav('/')
              }}
              className="card space-y-4 bg-white/85 p-6 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(6,40,104,0.25)]"
            >
              <div>
                <label className="label">Officer ID</label>
                <input
                  className="input mt-1"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="IAS-YEAR-STATE-CODE"
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="label">MFA Code</label>
                <input
                  className="input mt-1 tracking-[0.35em]"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                />
                <div className="mt-1 text-[11px] text-ink-500">
                  Sent to your registered device via NIC MFA.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Department</label>
                  <select
                    className="input mt-1"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.code} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    className="input mt-1"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
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
