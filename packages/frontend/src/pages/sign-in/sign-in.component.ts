import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { AuthPageComponent } from '@/shared/ui/auth-page/auth-page.component';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [AuthPageComponent, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    // console.log(this.signInForm.value);
  }

  getErrorText(controlName: string): string {
    const control = this.signInForm.get(controlName);

    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) return `Minimum length is 6 characters`;
    if (control.hasError('email')) return 'Invalid email address';
    return '';
  }
}
