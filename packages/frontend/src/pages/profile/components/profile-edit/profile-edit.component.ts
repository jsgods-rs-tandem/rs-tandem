import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUser, ProfileFormData } from '../../profile.types';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';

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

  readonly avatarUrl = computed(
    () => this.user().avatarUrl ?? 'assets/images/user-avatar-placeholder.png',
  );

  readonly profileForm = this.fb.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
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
    if (this.profileForm.get(field)?.hasError('required')) return 'Required';
    if (this.profileForm.get(field)?.hasError('email')) return 'Invalid email';
    if (this.profileForm.get(field)?.hasError('minlength')) return 'Must be at least 8 characters';
    return '';
  }
}
