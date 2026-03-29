import { AbstractControl } from '@angular/forms';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

export function getValidationErrorKey(control: AbstractControl | null): AppTranslationKey | null {
  if (!control) {
    return null;
  }

  if (control.hasError('required')) {
    return marker('auth.validation.required');
  }

  if (control.hasError('minlength')) {
    return marker('auth.validation.minLength');
  }

  if (control.hasError('email')) {
    return marker('auth.validation.email');
  }

  return null;
}
