import { Languages } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LANGS, useLanguage } from './LanguageContext'

/**
 * Compact segmented language control (EN / हिं / मरा).
 * `data-no-i18n` keeps the native-script labels from being translated.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()
  return (
    <div
      data-no-i18n
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-ink-200 bg-white p-0.5 shadow-sm',
        className
      )}
      role="group"
      aria-label="Language"
    >
      <span className="hidden pl-1.5 pr-0.5 text-ink-400 sm:block">
        <Languages className="h-3.5 w-3.5" />
      </span>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          title={l.label}
          className={cn(
            'rounded-full px-2 py-1 text-[11px] font-semibold leading-none transition-colors',
            lang === l.code
              ? 'bg-brand-gradient text-white shadow-glow'
              : 'text-ink-600 hover:bg-ink-100'
          )}
        >
          {l.short}
        </button>
      ))}
    </div>
  )
}
