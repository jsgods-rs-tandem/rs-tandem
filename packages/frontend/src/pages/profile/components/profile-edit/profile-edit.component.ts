import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUser, ProfileFormData } from '../../profile.types';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { DEFAULT_AVATAR_URL } from '@/core/constants';

@Component({
  selector: 'app-profile-edit',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  user = input.required<AuthUser>();
  isSaving = input<boolean>(false);

  cancelClicked = output();
  saveClicked = output<ProfileFormData>();

  readonly avatarUrl = computed(() => this.user().avatarUrl ?? DEFAULT_AVATAR_URL);

  readonly profileForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    githubUsername: ['', [Validators.maxLength(50)]],
    currentPassword: ['', [Validators.minLength(8)]],
    newPassword: ['', [Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      if (this.isSaving()) {
        this.profileForm.disable();
      } else {
        this.profileForm.enable();
      }
    });
  }

  ngOnInit() {
    const currentUser = this.user();
    this.profileForm.patchValue({
      displayName: currentUser.displayName,
      email: currentUser.email,
      githubUsername: currentUser.githubUsername ?? '',
    });
    this.profileForm.valueChanges.subscribe((value) => {
      const currentPassword = this.profileForm.get('currentPassword');
      const newPassword = this.profileForm.get('newPassword');

      if (value.currentPassword || value.newPassword) {
        currentPassword?.setValidators([Validators.required, Validators.minLength(8)]);
        newPassword?.setValidators([Validators.required, Validators.minLength(8)]);
      } else {
        currentPassword?.setValidators([Validators.minLength(8)]);
        newPassword?.setValidators([Validators.minLength(8)]);
      }
      currentPassword?.updateValueAndValidity({ emitEvent: false });
      newPassword?.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSave() {
    if (this.profileForm.valid) {
      this.saveClicked.emit(this.profileForm.getRawValue());
    }
  }

  isInvalid(field: string) {
    const ctrl = this.profileForm.get(field);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getError(field: string) {
    if (this.profileForm.get(field)?.hasError('required')) return 'This field is required';
    if (this.profileForm.get(field)?.hasError('email')) return 'Invalid email address';
    if (this.profileForm.get(field)?.hasError('minlength'))
      return `Minimum length is ${field === 'username' ? '3' : '8'} characters`;
    if (this.profileForm.get(field)?.hasError('maxlength'))
      return `Maximum length is 50 characters`;
    return '';
  }
}
