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
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.utilities';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { AppTranslationKey } from '@/shared/types/translation-keys';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { AUTH_ERROR_MESSAGES } from '@/shared/constants/auth-error-messages.constants';
import { getValidationErrorKey } from '@/shared/utils/form-validation.utilities';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    AuthPageComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
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

          this.modalService.open({
            title: this.t(marker('auth.errorMessages.loginTitle')),
            message: getHttpErrorMessage(error, 'Invalid email or password.', AUTH_ERROR_MESSAGES),
            icon: 'info-outline',
          });
        },
      });
  }

  getValidationErrorKey(controlName: string): AppTranslationKey | null {
    return getValidationErrorKey(this.signInForm.get(controlName));
  }
}
