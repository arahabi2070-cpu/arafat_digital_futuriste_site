'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { dictionaries, type Locale, fr } from '@/lib/i18n'

type LanguageContextValue = {
  locale: Locale
  t: typeof fr
  setLocale: (l: Locale) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr')

  useEffect(() => {
    const saved = window.localStorage.getItem('adf-locale') as Locale | null
    if (saved === 'fr' || saved === 'en') {
      setLocaleState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    window.localStorage.setItem('adf-locale', l)
    document.documentElement.lang = l
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === 'fr' ? 'en' : 'fr'
      window.localStorage.setItem('adf-locale', next)
      document.documentElement.lang = next
      return next
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, t: dictionaries[locale], setLocale, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
