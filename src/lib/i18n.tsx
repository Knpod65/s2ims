'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from './types'
import th from '../../messages/th.json'
import en from '../../messages/en.json'

const messages = { th, en }

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextValue>({
  lang: 'th',
  setLang: () => {},
  t: (k) => k,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('th')

  useEffect(() => {
    const saved = localStorage.getItem('s2ims_lang') as Lang | null
    if (saved === 'th' || saved === 'en') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('s2ims_lang', l)
  }

  const t = (key: string): string => {
    const dict = messages[lang] as Record<string, unknown>
    const parts = key.split('.')
    let val: unknown = dict
    for (const p of parts) {
      if (val && typeof val === 'object') val = (val as Record<string, unknown>)[p]
      else return key
    }
    return typeof val === 'string' ? val : key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
