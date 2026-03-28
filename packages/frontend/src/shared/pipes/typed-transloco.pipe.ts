import { Pipe, PipeTransform, ChangeDetectorRef, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AppTranslationKey } from '../types/translation-keys';

@Pipe({
  name: 'transloco',
  pure: false,
  standalone: true,
})
export class TypedTranslocoPipe extends TranslocoPipe implements PipeTransform {
  constructor() {
    super(inject(TranslocoService), undefined, undefined, inject(ChangeDetectorRef));
  }

  override transform(
    key: AppTranslationKey,
    parameters?: Record<string, unknown>,
    lang?: string,
  ): string {
    return super.transform(key, parameters, lang);
  }
}
