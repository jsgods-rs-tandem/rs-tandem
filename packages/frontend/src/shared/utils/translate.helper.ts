import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { TranslationKey } from '@/shared/types/i18n.generated';

export function injectTranslate(): (
  key: TranslationKey,
  parameters?: Record<string, unknown>,
) => string {
  const service = inject(TranslocoService);
  return (key, parameters) => service.translate(key, parameters);
}
