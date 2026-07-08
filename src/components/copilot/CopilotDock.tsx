import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, X, ShieldCheck, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CopilotChat } from './CopilotChat'

/**
 * Global copilot: floating launcher on every page, slide-over panel with the
 * same chat core as the full AI Workspace. Toggle with the button or ⌘J / Ctrl+J.
 */
export function CopilotDock() {
  // Remember open/closed across navigations within the tab session.
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem('maii-copilot-open') === '1' } catch { return false }
  })
  const location = useLocation()

  // The full workspace already IS the copilot — don't stack the dock on top of it
  const onWorkspace = location.pathname === '/workspace'

  useEffect(() => {
    try { sessionStorage.setItem('maii-copilot-open', open ? '1' : '0') } catch { /* private mode */ }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (onWorkspace) setOpen(false)
  }, [onWorkspace])

  if (onWorkspace) return null

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            title="Maha Copilot (⌘J)"
            className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_36px_-8px_rgba(11,87,208,0.55)] ring-1 ring-white/30 transition-transform hover:scale-105"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-over panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col border-l border-ink-100 bg-white/95 shadow-2xl backdrop-blur-xl sm:bottom-4 sm:right-4 sm:top-auto sm:h-[640px] sm:max-h-[calc(100vh-2rem)] sm:w-[420px] sm:rounded-2xl sm:border"
          >
            {/* Header */}
            <div className="relative flex items-center gap-2.5 overflow-hidden border-b border-ink-100 bg-brand-gradient p-3.5 text-white sm:rounded-t-2xl">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold leading-tight">Maha Copilot</div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/80">
                  <ShieldCheck className="h-3 w-3" /> Sovereign · Audit-logged · DPDP-aligned
                </div>
              </div>
              <Link
                to="/workspace"
                title="Open full workspace"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                title="Close (Esc)"
                className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CopilotChat compact className="min-h-0 flex-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
