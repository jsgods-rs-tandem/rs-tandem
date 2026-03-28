import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { AuthService } from '@/core/services/auth.service';
import { ROUTE_PATHS } from '@/core/constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalService } from '@/core/services/modal.service';
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.utilities';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { AppTranslationKey } from '@/shared/types/translation-keys';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { AUTH_ERROR_MESSAGES } from '@/shared/constants/auth-error-messages.constants';
import { getValidationErrorKey } from '@/shared/utils/form-validation.utilities';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    AuthPageComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private t = injectTranslate();

  protected isLoading = signal(false);

  readonly ROUTE_PATHS = ROUTE_PATHS;

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const formValue = this.signUpForm.value;

    if (!formValue.email || !formValue.password || !formValue.username) {
      throw new Error('[SignUpComponent] Unexpected missing required fields in a valid form.');
    }

    this.isLoading.set(true);

    this.authService
      .register({
        displayName: formValue.username,
        email: formValue.email,
        password: formValue.password,
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          void this.router.navigate([ROUTE_PATHS.signIn]);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);

          this.modalService.open({
            title: this.t(marker('auth.errorMessages.registrationTitle')),
            message: getHttpErrorMessage(
              error,
              'Failed to create an account. Please try again later or use a different email.',
              AUTH_ERROR_MESSAGES,
            ),
            icon: 'info-outline',
          });
        },
      });
  }

  getValidationErrorKey(controlName: string): AppTranslationKey | null {
    return getValidationErrorKey(this.signUpForm.get(controlName));
  }
}
