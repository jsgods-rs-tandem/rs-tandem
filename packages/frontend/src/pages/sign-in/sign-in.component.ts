import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent, ModalComponent } from '@/shared/ui';
import { AuthService } from '@/core/services/auth.service';
import { AuthStore } from '@/core/store/auth.store';
import { switchMap } from 'rxjs';
import { ROUTE_PATHS } from '@/core/constants';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    AuthPageComponent,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    ModalComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private authStore = inject(AuthStore);

  protected isErrorModalOpen = signal(false);

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

    this.authService
      .login({
        email: formValue.email,
        password: formValue.password,
      })
      .pipe(switchMap(() => this.authService.getMe()))
      .subscribe({
        next: (user) => {
          this.authStore.setUser(user);
          void this.router.navigate([ROUTE_PATHS.home]);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.isErrorModalOpen.set(true);
        },
      });
  }

  getErrorText(controlName: string): string {
    const control = this.signInForm.get(controlName);

    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) return `Minimum length is 8 characters`;
    if (control.hasError('email')) return 'Invalid email address';
    return '';
  }
}
