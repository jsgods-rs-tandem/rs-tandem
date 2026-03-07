import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [AuthPageComponent, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    // console.log(this.signUpForm.value);
  }

  getErrorText(controlName: string): string {
    const control = this.signUpForm.get(controlName);

    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Minimum length is ${controlName === 'username' ? '3' : '6'} characters`;
    if (control.hasError('email')) return 'Invalid email address';
    return '';
  }
}
