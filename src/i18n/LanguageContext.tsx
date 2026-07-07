import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Lang, setLanguage } from './translator'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'हिं' },
  { code: 'mr', label: 'मराठी', short: 'मरा' },
]

const STORAGE_KEY = 'maii-lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'hi' || saved === 'mr' ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    // Run after React commits so the freshly rendered DOM gets translated
    const id = requestAnimationFrame(() => setLanguage(lang))
    return () => cancelAnimationFrame(id)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
