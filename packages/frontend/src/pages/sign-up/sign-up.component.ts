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
import { getHttpErrorMessageTKey } from '@/shared/utils/http-error.utilities';
import { AUTH_ERROR_MESSAGES } from '@/shared/utils/auth-error-messages.constants';
import { injectTranslate } from '@/shared/utils/translate.helper';
import { TRANSLOCO_SCOPE, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    AuthPageComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    TranslocoDirective,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'auth' }],
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

          const messageKey = getHttpErrorMessageTKey(
            error,
            'auth.errorMessages.defaultRegistration',
            AUTH_ERROR_MESSAGES,
          );

          this.modalService.open({
            title: this.t('auth.errorMessages.registrationTitle'),
            message: Array.isArray(messageKey)
              ? messageKey.map((key) => this.t(key))
              : this.t(messageKey),
            icon: 'info-outline',
          });
        },
      });
  }

  getValidationErrorKey(controlName: string): string | null {
    const control = this.signUpForm.get(controlName);

    if (!control) return null;
    if (control.hasError('required')) return 'required';
    if (control.hasError('minlength')) return 'minLength';
    if (control.hasError('email')) return 'email';
    return null;
  }
}
