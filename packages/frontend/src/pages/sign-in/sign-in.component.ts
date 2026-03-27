import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { AuthService } from '@/core/services/auth.service';
import { AuthStore } from '@/core/store/auth.store';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ROUTE_PATHS } from '@/core/constants';
import { ModalService } from '@/core/services/modal.service';
import { getHttpErrorMessageTKey } from '@/shared/utils/http-error.utilities';
import { AUTH_ERROR_MESSAGES } from '@/shared/utils/auth-error-messages.constants';
import { injectTranslate } from '@/shared/utils/translate.helper';
import { TRANSLOCO_SCOPE, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    AuthPageComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    TranslocoDirective,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'auth' }],
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private modalService = inject(ModalService);
  private t = injectTranslate();

  protected isLoading = signal(false);

  readonly ROUTE_PATHS = ROUTE_PATHS;

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    const formValue = this.signInForm.value;

    if (!formValue.email || !formValue.password) {
      throw new Error('[SignInComponent] Unexpected missing required fields in a valid form.');
    }

    this.isLoading.set(true);

    this.authService
      .login({
        email: formValue.email,
        password: formValue.password,
      })
      .pipe(switchMap(() => this.authService.getMe()))
      .subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this.authStore.setUser(user);
          void this.router.navigate([ROUTE_PATHS.home]);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          const messageKey = getHttpErrorMessageTKey(
            error,
            'auth.errorMessages.defaultLogin',
            AUTH_ERROR_MESSAGES,
          );

          this.modalService.open({
            title: this.t('auth.errorMessages.loginTitle'),
            message: Array.isArray(messageKey)
              ? messageKey.map((key) => this.t(key))
              : this.t(messageKey),
            icon: 'info-outline',
          });
        },
      });
  }

  getValidationErrorKey(controlName: string): string | null {
    const control = this.signInForm.get(controlName);

    if (!control) return null;
    if (control.hasError('required')) return 'required';
    if (control.hasError('minlength')) return 'minLength';
    if (control.hasError('email')) return 'email';
    return null;
  }
}
