import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { AppTranslationKey } from '@/shared/types/translation-keys';
import { toSignal } from '@angular/core/rxjs-interop';

export function injectTranslate(): (
  key: AppTranslationKey,
  parameters?: Record<string, unknown>,
) => string {
  const service = inject(TranslocoService);
  return (key, parameters) => service.translate(key, parameters);
}

export function injectActiveLang() {
  const service = inject(TranslocoService);

  return toSignal(service.langChanges$, {
    initialValue: service.getActiveLang(),
  });
}
