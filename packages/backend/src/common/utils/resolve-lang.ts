export function resolveLang(header: string | string[] | undefined): 'en' | 'ru' {
  const value = Array.isArray(header) ? header[0] : header;

  if (!value) return 'en';

  const primary = value.split(',')[0]?.split(';')[0]?.trim() ?? '';
  const lang = primary.split('-')[0]?.toLowerCase() ?? '';

  return lang === 'ru' ? 'ru' : 'en';
}
