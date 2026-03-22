import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from './profile.validators';
import { MAX_INPUT_LENGTH, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME } from '@/core/constants';

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

export function getProfileFieldError(control: AbstractControl | null, fieldName: string): string {
  if (!control?.errors) {
    return '';
  }

  if (control.hasError('required')) {
    return 'This field is required';
  }

  if (control.hasError('email')) {
    return 'Invalid email address';
  }

  if (control.hasError('minlength')) {
    const minLength = fieldName === 'displayName' ? MIN_LENGTH_USERNAME : MIN_LENGTH_PASSWORD;
    return `Minimum length is ${minLength.toString()} characters`;
  }

  if (control.hasError('maxlength')) {
    return `Maximum length is ${MAX_INPUT_LENGTH.toString()} characters`;
  }

  return '';
}
