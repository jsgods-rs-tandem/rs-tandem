import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export function injectTranslate(): (key: string, parameters?: Record<string, unknown>) => string {
  const service = inject(TranslocoService);
  return (key, parameters) => service.translate(key, parameters);
}
