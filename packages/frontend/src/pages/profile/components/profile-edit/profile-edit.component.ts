import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthUser, ProfileFormData } from '../../models/profile.types';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { DEFAULT_AVATAR_URL } from '@/core/constants';
import {
  buildProfileForm,
  getProfileFieldError,
  isControlInvalid,
} from '../../utils/profile.utilities';

@Component({
  selector: 'app-profile-edit',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit {
  user = input.required<AuthUser>();
  isSaving = input<boolean>(false);

  cancelClicked = output();
  saveClicked = output<ProfileFormData>();

  readonly avatarUrl = computed(() => this.user().avatarUrl ?? DEFAULT_AVATAR_URL);

  readonly profileForm = buildProfileForm(inject(NonNullableFormBuilder));

  constructor() {
    effect(() => {
      if (this.isSaving()) {
        this.profileForm.disable();
      } else {
        this.profileForm.enable();
      }
    });
  }

  ngOnInit(): void {
    const { displayName, email, githubUsername } = this.user();
    this.profileForm.patchValue({
      displayName,
      email,
      githubUsername: githubUsername ?? '',
    });
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.saveClicked.emit(this.profileForm.getRawValue());
    }
  }

  isInvalid(field: string): boolean {
    return isControlInvalid(this.profileForm.get(field));
  }

  getError(field: string): string {
    return getProfileFieldError(this.profileForm.get(field), field);
  }
}
