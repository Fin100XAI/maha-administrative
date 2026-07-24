import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AlertTriangle, ExternalLink, Loader2, Maximize2, Minimize2, RefreshCw, ServerCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Maha Copilot — embeds the standalone GR-intelligence app that lives in the
 * `maha-copilot/` folder (FastAPI backend + vanilla-JS frontend). That app runs
 * as its own server on a separate origin, so we surface it in an <iframe>. A small
 * floating control cluster (top-right) drives Full screen / Reload / Open-in-new-tab
 * without adding a heavy banner over the app.
 *
 * Start it with `cd maha-copilot && ./run.sh` (default http://127.0.0.1:8000).
 * Point the embed elsewhere by setting VITE_MAHA_COPILOT_URL before `vite`.
 */
/**
 * Resolve the backend base URL, most-specific first:
 *   1. window.__MAHA_COPILOT_URL__  — runtime config (public/maha-config.js); editable on the
 *      server after building, no rebuild required.
 *   2. VITE_MAHA_COPILOT_URL        — baked in at build time.
 *   3. http://127.0.0.1:8000        — local-dev default.
 * On an HTTPS page a remote http:// backend is blocked as mixed content, so upgrade it.
 */
function resolveCopilotUrl(): string {
  const runtime = (typeof window !== 'undefined' && window.__MAHA_COPILOT_URL__?.trim()) || ''
  const built = import.meta.env.VITE_MAHA_COPILOT_URL?.trim() || ''
  let url = (runtime || built || 'http://127.0.0.1:8000').replace(/\/+$/, '')
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://')
  ) {
    const host = url.slice('http://'.length)
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(host)
    if (!isLocal) url = `https://${host}`
  }
  return url
}
const COPILOT_URL = resolveCopilotUrl()

type Status = 'checking' | 'up' | 'down'

/* Fullscreen helpers — standard API with a webkit (Safari) fallback. */
function requestFs(el: HTMLElement): Promise<void> | void {
  const fn = el.requestFullscreen ?? (el as any).webkitRequestFullscreen
  return fn ? fn.call(el) : undefined
}
function exitFs(): Promise<void> | void {
  const fn = document.exitFullscreen ?? (document as any).webkitExitFullscreen
  return fn ? fn.call(document) : undefined
}
function currentFsElement(): Element | null {
  return document.fullscreenElement ?? (document as any).webkitFullscreenElement ?? null
}

export function MahaCopilotEmbed() {
  const [status, setStatus] = useState<Status>('checking')
  const [frameLoaded, setFrameLoaded] = useState(false)
  const [reloadKey, setReloadKey] = useState(0) // bump to re-probe + remount the iframe
  const [cacheBust] = useState(() => Date.now()) // per-load nonce so a reopened embed never serves a stale cached page

  const frameWrapRef = useRef<HTMLDivElement>(null)
  const [maximized, setMaximized] = useState(false) // CSS fallback: cover the browser window
  const [nativeFs, setNativeFs] = useState(false) // true OS-level fullscreen is active
  const isFull = maximized || nativeFs

  // Reachability probe. A no-cors request can't read a cross-origin body, but it still
  // resolves when the server answers and rejects when nothing is listening — exactly the
  // up/down signal we need to show an actionable card instead of the browser's raw
  // "can't connect" page. Aborts after a few seconds so a dead host still falls through.
  const probe = useCallback(async () => {
    setStatus('checking')
    setFrameLoaded(false)
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    try {
      await fetch(`${COPILOT_URL}/api/health`, { mode: 'no-cors', signal: ctrl.signal })
      setStatus('up')
    } catch {
      setStatus('down')
    } finally {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    probe()
  }, [probe, reloadKey])

  // Keep our state in sync with the browser (covers pressing Esc to leave native fullscreen).
  useEffect(() => {
    const sync = () => setNativeFs(Boolean(currentFsElement()))
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])

  // Esc leaves the CSS-fallback maximised mode (native fullscreen handles Esc itself).
  useEffect(() => {
    if (!maximized) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMaximized(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maximized])

  const reload = () => setReloadKey((k) => k + 1)

  const enterFull = useCallback(() => {
    const el = frameWrapRef.current
    if (!el) return
    try {
      const p = requestFs(el)
      if (p && typeof p.then === 'function') p.then(undefined, () => setMaximized(true))
      else if (!currentFsElement()) setMaximized(true) // API absent → window-fill fallback
    } catch {
      setMaximized(true)
    }
  }, [])

  const exitFull = useCallback(() => {
    if (currentFsElement()) {
      const p = exitFs()
      if (p && typeof p.then === 'function') p.then(undefined, () => {})
    }
    setMaximized(false)
  }, [])

  return (
    <div>
      <div
        ref={frameWrapRef}
        className={cn(
          'card relative flex flex-col overflow-hidden bg-white p-0',
          isFull ? 'h-screen w-screen rounded-none border-0' : 'h-[calc(100vh-9rem)] min-h-[560px]',
          maximized && 'fixed inset-0 z-[60]',
        )}
      >
        {status === 'down' ? (
          <ServerDownCard url={COPILOT_URL} onRetry={reload} />
        ) : (
          <>
            {(status === 'checking' || !frameLoaded) && (
              <div className="absolute inset-0 z-10 grid place-items-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                  <div className="text-sm font-medium text-ink-700">
                    {status === 'checking' ? 'Connecting to Maha Copilot…' : 'Loading workspace…'}
                  </div>
                  <div className="text-xs text-ink-400">{COPILOT_URL}</div>
                </div>
              </div>
            )}
            {status === 'up' && (
              <iframe
                key={reloadKey}
                src={`${COPILOT_URL}/?_cb=${cacheBust}-${reloadKey}`}
                title="Maha Copilot — GR Intelligence"
                className="h-full w-full border-0"
                onLoad={() => setFrameLoaded(true)}
                allow="clipboard-write; clipboard-read; fullscreen"
              />
            )}

            {/* Compact floating controls — replaces the old page banner. */}
            {status === 'up' && (
              <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-xl border border-ink-100 bg-white/90 p-1 shadow-lg backdrop-blur">
                {isFull ? (
                  <CtrlButton onClick={exitFull} title="Exit full screen (Esc)">
                    <Minimize2 className="h-4 w-4" />
                  </CtrlButton>
                ) : (
                  <CtrlButton onClick={enterFull} title="Full screen">
                    <Maximize2 className="h-4 w-4" />
                  </CtrlButton>
                )}
                <CtrlButton onClick={reload} title="Reload">
                  <RefreshCw className="h-4 w-4" />
                </CtrlButton>
                <a
                  href={COPILOT_URL}
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CtrlButton({
  onClick, title, children,
}: {
  onClick: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="grid h-8 w-8 place-items-center rounded-lg text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
    >
      {children}
    </button>
  )
}

function ServerDownCard({ url, onRetry }: { url: string; onRetry: () => void }) {
  const isLocal = /(localhost|127\.0\.0\.1|\[::1\])/i.test(url)
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-500 ring-1 ring-amber-100">
          <ServerCog className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-ink-900">Maha Copilot server isn&rsquo;t reachable</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          The app at <span className="font-medium text-ink-700">{url}</span> didn&rsquo;t respond.
          {isLocal ? ' Start it, then retry.' : ' Check the deployment, then retry.'}
        </p>

        <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/70 p-3 text-left">
          {isLocal ? (
            <>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                <AlertTriangle className="h-3 w-3" /> Start the server
              </div>
              <pre className="overflow-x-auto text-[12.5px] leading-relaxed text-ink-800"><code>cd maha-copilot &amp;&amp; ./run.sh</code></pre>
              <p className="mt-1 text-[11px] text-ink-400">Serves the dashboard on {url}.</p>
            </>
          ) : (
            <>
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                <AlertTriangle className="h-3 w-3" /> Deployment checklist
              </div>
              <ul className="space-y-1 text-[12px] leading-relaxed text-ink-700">
                <li>• The maha-copilot service is deployed and running at that URL.</li>
                <li>• It is served over <span className="font-medium">HTTPS</span> (an HTTP backend is blocked on a secure page).</li>
                <li>• No proxy sends <code className="rounded bg-ink-100 px-1">X-Frame-Options</code> / <code className="rounded bg-ink-100 px-1">frame-ancestors</code> blocking this site.</li>
                <li>• <code className="rounded bg-ink-100 px-1">maha-config.js</code> (or <code className="rounded bg-ink-100 px-1">VITE_MAHA_COPILOT_URL</code>) points here.</li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button onClick={onRetry} className="btn-primary">
            <RefreshCw className="h-4 w-4" /> Retry connection
          </button>
          <a href={url} target="_blank" rel="noreferrer" className="btn-outline">
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
        </div>
      </div>
    </div>
  )
}
