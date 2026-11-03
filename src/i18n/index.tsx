import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fr, type Dict } from './fr';
import { en } from './en';

export type Lang = 'fr' | 'en';
export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
];

/** Structured, localizable content. French is the source of truth and the fallback. */
export type Localized = { fr: string; en?: string };

const dicts: Record<Lang, Partial<Dict>> = { fr, en };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof Dict) => string;
  L: (value: Localized) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function initialLang(): Lang {
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'fr' || q === 'en') return q;
  try {
    const s = localStorage.getItem('xl-lang');
    if (s === 'fr' || s === 'en') return s;
  } catch {
    /* storage unavailable */
  }
  return 'fr';
}

const META: Record<Lang, { title: string; description: string; locale: string }> = {
  fr: {
    title: 'Modou Lô — Xaragne Lô | The Legend · Concept indépendant',
    description:
      'Concept digital indépendant consacré à Modou Lô (Xaragne Lô), figure de la lutte sénégalaise. Proposition privée de Dalal Technologies — site non officiel.',
    locale: 'fr_SN',
  },
  en: {
    title: 'Modou Lô — Xaragne Lô | The Legend · Independent concept',
    description:
      'An independent digital concept about Modou Lô (Xaragne Lô), a defining figure of Senegalese wrestling. Private proposal by Dalal Technologies — not an official website.',
    locale: 'en_US',
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('xl-lang', l);
    } catch {
      /* ignore */
    }
    // Preserve the current page (hash route) while switching language.
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState(null, '', url.toString());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const m = META[lang];
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', m.locale);
  }, [lang]);

  const value = useMemo<Ctx>(() => {
    const d = dicts[lang];
    return {
      lang,
      setLang,
      t: (key) => (d[key] ?? fr[key]) as string,
      L: (v) => v[lang] ?? v.fr,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error('useI18n must be used inside I18nProvider');
  return c;
}
