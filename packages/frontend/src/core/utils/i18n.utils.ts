import { APP_LANGUAGES, DEFAULT_LANGUAGE } from '../constants/i18n.constants';
import type { AppLanguage } from '../constants/i18n.constants';

const getSavedLanguage = () => localStorage.getItem(I18N_STORAGE_KEY) as AppLanguage | null;

const getSystemLanguage = () => navigator.language.split('-')[0] as AppLanguage;

export const I18N_STORAGE_KEY = 'rs-tandem-lang';

export function getInitialLang(): AppLanguage {
  const savedLanguage = getSavedLanguage();
  if (savedLanguage && APP_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = getSystemLanguage();
  if (APP_LANGUAGES.includes(browserLanguage)) {
    return browserLanguage;
  }

  return DEFAULT_LANGUAGE;
}

export function saveLanguage(language: AppLanguage): void {
  localStorage.setItem(I18N_STORAGE_KEY, language);
}
