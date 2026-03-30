import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from './profile.validators';
import { MAX_INPUT_LENGTH, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME } from '@/core/constants';
import { AppTranslationKey } from '@/shared/types/translation-keys';

export function buildProfileForm(fb: NonNullableFormBuilder) {
  return fb.group(
    {
      displayName: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_LENGTH_USERNAME),
          Validators.maxLength(MAX_INPUT_LENGTH),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: [''],
      githubUsername: ['', [Validators.maxLength(MAX_INPUT_LENGTH)]],
      currentPassword: ['', [Validators.minLength(MIN_LENGTH_PASSWORD)]],
      newPassword: ['', [Validators.minLength(MIN_LENGTH_PASSWORD)]],
    },
    { validators: passwordMatchValidator },
  );
}

export function isControlInvalid(control: AbstractControl | null): boolean {
  return Boolean(control && control.invalid && (control.dirty || control.touched));
}

export function getProfileFieldError(control: AbstractControl | null): AppTranslationKey | null {
  if (!control?.errors) {
    return null;
  }

  if (control.hasError('required')) {
    return 'auth.validation.required';
  }

  if (control.hasError('email')) {
    return 'auth.validation.email';
  }

  if (control.hasError('minlength')) {
    return 'auth.validation.minLength';
  }

  if (control.hasError('maxlength')) {
    return 'auth.validation.maxLength';
  }

  return null;
}
