import { Bell, ChevronDown, Command, Menu, Search, ShieldCheck, LogOut, BadgeCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-100 bg-white/80 px-4 backdrop-blur-lg">
      <button className="btn-ghost !p-2" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search input with focus glow */}
      <div className="relative hidden max-w-xl flex-1 md:block">
        <div
          className={`relative rounded-lg transition-all duration-300 ${
            searchFocused
              ? 'shadow-[0_0_0_3px_rgba(216,27,96,0.12),0_8px_24px_-8px_rgba(74,20,140,0.35)]'
              : ''
          }`}
        >
          {/* Focus gradient border overlay */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-lg transition-opacity duration-300 ${
              searchFocused ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, #D81B60 0%, #4A148C 100%)',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
              searchFocused ? 'text-brand-500' : 'text-ink-400'
            }`}
          />
          <input
            className="input relative bg-white pl-9 pr-16"
            placeholder="Ask MAII AI — search GRs, circulars, files, officers…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <span className="kbd">
              <Command className="h-3 w-3" />K
            </span>
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Encryption/session chip with animated shimmer border */}
        <div className="relative hidden md:block">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{
              padding: '1px',
              backgroundImage:
                'linear-gradient(110deg, rgba(16,185,129,0.6), rgba(16,185,129,0) 25%, rgba(16,185,129,0) 60%, rgba(16,185,129,0.6) 85%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.4s linear infinite',
              WebkitMask:
                'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <div className="relative flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Encryption: AES-256 · Session: MFA
          </div>
        </div>

        {/* Notification bell with pulsing dot */}
        <button className="btn-ghost relative !p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-70"
              animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
          </span>
        </button>

        {/* User chip with verified checkmark */}
        <div className="ml-1 flex items-center gap-2 rounded-full border border-ink-100 bg-white px-2 py-1 shadow-sm transition-shadow hover:shadow-[0_4px_16px_-6px_rgba(216,27,96,0.25)]">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white ring-1 ring-white/40">
            RM
          </div>
          <div className="hidden text-left md:block">
            <div className="flex items-center gap-1">
              <div className="text-xs font-semibold leading-none text-ink-800">Rajesh Mahajan</div>
              <BadgeCheck
                className="h-3.5 w-3.5 text-brand-500"
                aria-label="Verified officer"
              />
            </div>
            <div className="mt-0.5 text-[10px] text-ink-500">Principal Secretary, DIT · GoM</div>
          </div>
          <ChevronDown className="h-4 w-4 text-ink-400" />
        </div>

        <Link to="/login" className="btn-outline !p-2" title="Sign out">
          <LogOut className="h-4 w-4" />
        </Link>
      </div>

      {/* Subtle bottom gradient line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(216,27,96,0) 0%, rgba(216,27,96,0.35) 30%, rgba(74,20,140,0.35) 70%, rgba(74,20,140,0) 100%)',
        }}
      />
    </header>
  )
}
