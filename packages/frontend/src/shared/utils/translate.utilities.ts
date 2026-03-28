import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

export function injectTranslate(): (
  key: AppTranslationKey,
  parameters?: Record<string, unknown>,
) => string {
  const service = inject(TranslocoService);
  return (key, parameters) => service.translate(key, parameters);
}
