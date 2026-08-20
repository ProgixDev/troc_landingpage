"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DICTIONARIES, type Dict } from "@/lib/i18n";
import { LOCALES, type LocaleCode } from "@/lib/site";

type LocaleContextValue = {
  locale: LocaleCode;
  dir: "ltr" | "rtl";
  setLocale: (next: LocaleCode) => void;
  t: (key: keyof Dict) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "troc-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("fr");

  // Restore the visitor's last choice after hydration, so the server-rendered
  // markup (always FR) and the first client paint agree.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES.some((l) => l.code === stored)) {
      setLocaleState(stored as LocaleCode);
    }
  }, []);

  // `dir` and `lang` live on <html>, so RTL flips the whole layout for free.
  useEffect(() => {
    const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = DICTIONARIES[locale];
    return {
      locale,
      dir: LOCALES.find((l) => l.code === locale)?.dir ?? "ltr",
      setLocale,
      t: (key) => dict[key],
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
