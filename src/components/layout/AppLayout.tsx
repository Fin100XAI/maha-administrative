import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="relative min-h-screen bg-ink-50">
      {/* Ambient background — subtle brand mesh + fine grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -right-40 top-60 h-[520px] w-[520px] rounded-full bg-brand-900/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
        }} />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar collapsed={collapsed} />
        <div className="min-w-0 flex-1">
          <Topbar onToggleSidebar={() => setCollapsed((v) => !v)} />
          <main className="mx-auto max-w-[1600px] p-6">
            <Outlet />
          </main>
          <footer className="border-t border-ink-100 bg-white/50 px-6 py-4 text-center text-[11px] text-ink-500 backdrop-blur">
            MAII · Maha Administrative Intelligence Infrastructure · Government of Maharashtra · Sovereign AI Platform · Demo build 0.1
          </footer>
        </div>
      </div>
    </div>
  )
}
