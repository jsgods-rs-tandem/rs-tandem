import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export function initializeI18n() {
  const document = inject(DOCUMENT);
  const translocoService = inject(TranslocoService);

  translocoService.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
    document.documentElement.lang = lang;
  });
}
