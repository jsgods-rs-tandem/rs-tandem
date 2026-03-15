import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { AuthService } from '@/core/services/auth.service';
import { AuthStore } from '@/core/store/auth.store';

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
  private authStore = inject(AuthStore);

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

    this.authService
      .register({
        displayName: formValue.username,
        email: formValue.email,
        password: formValue.password,
      })
      .subscribe({
        next: (user) => {
          this.authStore.setUser(user);
          void this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Registration failed', error);
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
