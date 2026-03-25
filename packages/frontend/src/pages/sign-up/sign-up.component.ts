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
import { AUTH_ERROR_MESSAGES } from '@/shared/utils/auth-error-messages.constants';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [AuthPageComponent, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);

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
            title: 'Registration Error',
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

  getErrorText(controlName: string): string {
    const control = this.signUpForm.get(controlName);

    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Minimum length is ${controlName === 'username' ? '3' : '8'} characters`;
    if (control.hasError('email')) return 'Invalid email address';
    return '';
  }
}
