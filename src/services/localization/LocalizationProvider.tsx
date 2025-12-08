import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale } from '../../types';
import { getStrings, Strings } from '../../strings';

interface LocalizationContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  strings: Strings;
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

const DEFAULT_LOCALE: Locale = 'en';

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('conceptscroll-locale');
    return (stored as Locale) || DEFAULT_LOCALE;
  });

  const [strings, setStrings] = useState<Strings>(() => getStrings(locale));

  useEffect(() => {
    localStorage.setItem('conceptscroll-locale', locale);
    setStrings(getStrings(locale));
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = locale;
  }, [locale]);

  if (!strings.auth) {
    console.warn('LocalizationProvider: strings.auth is missing!', strings);
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, strings }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}
