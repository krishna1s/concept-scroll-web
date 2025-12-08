/**
 * Localization System
 * 
 * This module provides a centralized translation system for ConceptScroll.
 * Strings are organized by feature/screen for easy maintenance.
 */

import { Locale } from '../types';
import { commonStrings } from './common';
import { dashboardStrings } from './dashboard';
import { onboarding } from './onboarding';
import { feed } from './feed';
import { library } from './library';
import { profile } from './profile';
import { auth } from './auth';

// Legacy type for old Dashboard component
export interface Localization {
  en: { [key: string]: string };
  hi: { [key: string]: string };
}

export interface Strings {
  common: typeof commonStrings.en;
  auth: typeof auth.en;
  onboarding: typeof onboarding.en;
  feed: typeof feed.en;
  library: typeof library.en;
  profile: typeof profile.en;
  dashboard: typeof dashboardStrings.en;
}

const strings: Record<Locale, Strings> = {
  en: {
    common: commonStrings.en,
    auth: auth.en,
    onboarding: onboarding.en,
    feed: feed.en,
    library: library.en,
    profile: profile.en,
    dashboard: dashboardStrings.en,
  },
  hi: {
    common: commonStrings.hi,
    auth: auth.hi,
    onboarding: onboarding.hi,
    feed: feed.hi,
    library: library.hi,
    profile: profile.hi,
    dashboard: dashboardStrings.hi,
  },
  ta: {
    common: commonStrings.en, // Fallback to English
    auth: auth.ta,
    onboarding: onboarding.ta,
    feed: feed.ta,
    library: library.ta,
    profile: profile.ta,
    dashboard: dashboardStrings.en, // Fallback to English
  },
  te: {
    common: commonStrings.en, // Fallback to English
    auth: auth.te,
    onboarding: onboarding.te,
    feed: feed.te,
    library: library.te,
    profile: profile.te,
    dashboard: dashboardStrings.en, // Fallback to English
  },
  mr: {
    common: commonStrings.en, // Fallback to English
    auth: auth.mr,
    onboarding: onboarding.mr,
    feed: feed.mr,
    library: library.mr,
    profile: profile.mr,
    dashboard: dashboardStrings.en, // Fallback to English
  },
  bn: {
    common: commonStrings.en, // Fallback to English
    auth: auth.bn,
    onboarding: onboarding.bn,
    feed: feed.bn,
    library: library.bn,
    profile: profile.bn,
    dashboard: dashboardStrings.en, // Fallback to English
  },
};

export function getStrings(locale: Locale): Strings {
  return strings[locale] || strings.en;
}

/**
 * Legacy translation function for backward compatibility
 * Used by old Dashboard component
 * 
 * Usage: t('en', 'loading') or t('en', 'dashboard.hello')
 */
export function t(locale: string, key: string): string {
  const loc = (locale as Locale) || 'en';
  const strs = getStrings(loc);
  
  // Handle nested keys like 'dashboard.hello'
  if (key.includes('.')) {
    const [section, subkey] = key.split('.');
    const sectionData = strs[section as keyof Strings];
    if (sectionData && typeof sectionData === 'object') {
      return (sectionData as any)[subkey] || key;
    }
  }
  
  // Try to find in common strings
  if ((strs.common as any)[key]) {
    return (strs.common as any)[key];
  }
  
  return key;
}

// Export individual string modules for direct access
export { commonStrings as common, auth, onboarding, feed, library, profile, dashboardStrings as dashboard };