import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Settings } from 'lucide-react'
import { NAV, Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CopilotDock } from '@/components/copilot/CopilotDock'
import { canAccessPath, useRole } from '@/lib/rbac'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { role } = useRole()
  const allowed = canAccessPath(role, location.pathname, NAV)

  // Close the mobile drawer on navigation and lock body scroll while it is open
  useEffect(() => setMobileOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleToggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setCollapsed((v) => !v)
    } else {
      setMobileOpen((v) => !v)
    }
  }

  return (
    <div className="relative min-h-screen bg-ink-50">
      {/* Ambient background — subtle brand mesh + fine grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -right-40 top-60 h-[520px] w-[520px] rounded-full bg-brand-900/10 blur-3xl" />
        <div className="absolute -right-20 bottom-40 h-[380px] w-[380px] rounded-full bg-google-yellow-500/[0.06] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
        }} />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} />
        </div>

        {/* Mobile / tablet off-canvas drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="overlay"
                className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                key="drawer"
                className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
              >
                <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <Topbar onToggleSidebar={handleToggleSidebar} />
          <main className="mx-auto max-w-[1600px] p-4 sm:p-5 lg:p-6">
            {allowed ? <Outlet /> : <AccessDenied role={role} />}
          </main>
          <footer className="border-t border-ink-100 bg-white/50 px-4 py-4 text-center text-[11px] text-ink-500 backdrop-blur sm:px-6">
            MAII · Maha Administrative Intelligence Infrastructure · Government of Maharashtra · Sovereign AI Platform · Demo build 0.1
          </footer>
        </div>
      </div>

      {/* Global copilot — floating on every page (⌘J) */}
      <CopilotDock />
    </div>
  )
}

function AccessDenied({ role }: { role: string }) {
  return (
    <div className="card mx-auto max-w-xl p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100">
        <Lock className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-ink-900">Access restricted</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        Your current role — <span className="font-semibold text-ink-800">{role}</span> — does not have
        permission to open this module. Access is enforced per RBAC policy and this attempt has been audit-logged.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link to="/" className="btn-outline">Back to dashboard</Link>
        <Link to="/settings" className="btn-primary"><Settings className="h-4 w-4" /> Switch role in Settings</Link>
      </div>
    </div>
  )
}
