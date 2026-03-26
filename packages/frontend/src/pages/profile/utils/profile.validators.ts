import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const currentPassword = group.get('currentPassword');
  const newPassword = group.get('newPassword');
  const hasCurrent = !!currentPassword?.value;
  const hasNew = !!newPassword?.value;
  if ((hasCurrent && !hasNew) || (!hasCurrent && hasNew)) {
    return {
      incompletePasswordChange: true,
    };
  }

  return null;
};
