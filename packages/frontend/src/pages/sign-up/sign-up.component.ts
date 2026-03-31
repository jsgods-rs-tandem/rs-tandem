import { Component, computed, inject, Signal, signal } from '@angular/core';
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
import { getValidationErrorKey } from '@/shared/utils/form-validation.utilities';
import { toSignal } from '@angular/core/rxjs-interop';

interface PasswordRule {
  key: AppTranslationKey;
  valid: boolean;
}

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
  protected isSubmitted = signal(false);

  readonly ROUTE_PATHS = ROUTE_PATHS;

  signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/),
    ]),
  });

  onSubmit() {
    this.isSubmitted.set(true);

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
          this.modalService.open({
            title: this.t(marker('auth.signUp.modals.success.title')),
            message: this.t(marker('auth.signUp.modals.success.message')),
            icon: 'info-outline',
            onClose: () => {
              void this.router.navigate([ROUTE_PATHS.signIn]);
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);

          const errorMessage = getHttpErrorMessage(error, 'errors.auth.email_exists');
          const translateKey = (message: string) => this.t(marker(message as AppTranslationKey));
          const translatedMessage = Array.isArray(errorMessage)
            ? errorMessage.map(translateKey)
            : translateKey(errorMessage);

          this.modalService.open({
            title: this.t(marker('auth.errorMessages.registrationTitle')),
            message: translatedMessage,
            icon: 'info-outline',
          });
        },
      });
  }

  getValidationErrorKey(controlName: string): AppTranslationKey | null {
    return getValidationErrorKey(this.signUpForm.get(controlName));
  }

  private passwordValue = toSignal(this.signUpForm.controls.password.valueChanges, {
    initialValue: this.signUpForm.controls.password.value ?? '',
  });

  protected readonly passwordRules: Signal<PasswordRule[]> = computed(() => {
    const value = this.passwordValue() ?? '';

    return [
      {
        key: marker('auth.validation.progressive.minLength'),
        valid: value.length >= 8,
      },
      {
        key: marker('auth.validation.progressive.uppercase'),
        valid: /[A-Z]/.test(value),
      },
      {
        key: marker('auth.validation.progressive.number'),
        valid: /\d/.test(value),
      },
      {
        key: marker('auth.validation.progressive.specialChar'),
        valid: /[^A-Za-z0-9]/.test(value),
      },
    ];
  });
}
