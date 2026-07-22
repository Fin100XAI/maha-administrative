import { Bell, ChevronDown, Command, Menu, Search, LogOut, BadgeCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher'
import { postInitials } from '@/data/departments'
import { useRole } from '@/lib/rbac'

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { role, officer, signOut } = useRole()

  const askCopilot = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/workspace?q=${encodeURIComponent(q)}` : '/workspace')
    setQuery('')
    setMobileSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-ink-100 bg-white/80 px-3 backdrop-blur-lg sm:gap-3 sm:px-4">
      <button className="btn-ghost !p-2" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu className="h-5 w-5" />
      </button>

      {/* Search input with focus glow */}
      <form onSubmit={askCopilot} className="relative hidden max-w-xl flex-1 md:block">
        <div
          className={`relative rounded-lg transition-all duration-300 ${
            searchFocused
              ? 'shadow-[0_0_0_3px_rgba(11,87,208,0.12),0_8px_24px_-8px_rgba(6,40,104,0.35)]'
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
              background: 'linear-gradient(135deg, #0B57D0 0%, #062868 100%)',
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input relative bg-white pl-9 pr-16"
            placeholder="Ask Maha Copilot — GRs, circulars, files, officers…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            <span className="kbd">
              <Command className="h-3 w-3" />K
            </span>
          </span>
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Mobile search toggle */}
        <button
          className="btn-ghost !p-2 md:hidden"
          aria-label="Search"
          onClick={() => setMobileSearchOpen((v) => !v)}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Language switcher — EN / हिं / मरा */}
        <LanguageSwitcher />

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
        <div className="ml-1 flex items-center gap-2 rounded-full border border-ink-100 bg-white px-2 py-1 shadow-sm transition-shadow hover:shadow-[0_4px_16px_-6px_rgba(11,87,208,0.25)]">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-xs font-semibold text-white ring-1 ring-white/40">
            {postInitials(officer?.designation ?? role)}
          </div>
          <div className="hidden text-left md:block">
            <div className="flex items-center gap-1">
              <div className="text-xs font-semibold leading-none text-ink-800">{officer?.designation ?? role}</div>
              <BadgeCheck
                className="h-3.5 w-3.5 text-brand-500"
                aria-label="Verified officer"
              />
            </div>
            <div className="mt-0.5 text-[10px] text-ink-500">
              {officer?.posting ? `${officer.posting} · GoM` : 'GoM'}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-ink-400" />
        </div>

        <button
          onClick={() => { signOut(); navigate('/login') }}
          className="btn-outline !p-2"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile search row — slides in under the header */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="absolute inset-x-0 top-full border-b border-ink-100 bg-white/95 p-3 shadow-lg backdrop-blur-lg md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <form onSubmit={askCopilot} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input bg-white pl-9"
                placeholder="Ask Maha Copilot — GRs, circulars, files, officers…"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle bottom gradient line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,87,208,0) 0%, rgba(11,87,208,0.35) 30%, rgba(6,40,104,0.35) 70%, rgba(6,40,104,0) 100%)',
        }}
      />
    </header>
  )
}
