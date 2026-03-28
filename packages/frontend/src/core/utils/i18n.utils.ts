import { APP_LANGUAGES, DEFAULT_LANGUAGE } from '../constants/i18n.constants';
import type { AppLanguage } from '../constants/i18n.constants';

export const I18N_STORAGE_KEY = 'rs-tandem-lang';

export function getInitialLang(): AppLanguage {
  // 1. Check localStorage
  const savedLang = localStorage.getItem(I18N_STORAGE_KEY) as AppLanguage | null;
  if (savedLang && APP_LANGUAGES.includes(savedLang)) {
    return savedLang;
  }

  // 2. Check navigator.language
  const browserLang = navigator.language.split('-')[0] as AppLanguage;
  if (APP_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }

  // 3. Default
  return DEFAULT_LANGUAGE;
}

export function saveLang(lang: AppLanguage): void {
  localStorage.setItem(I18N_STORAGE_KEY, lang);
}
