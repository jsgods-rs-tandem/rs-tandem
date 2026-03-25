import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import type { ProfileFormData } from '../../models/profile.types';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import { DEFAULT_AVATAR_URL } from '@/core/constants';
import {
  buildProfileForm,
  getProfileFieldError,
  isControlInvalid,
} from '../../utils/profile.utilities';
import { AvatarEditComponent } from '../avatar-edit/avatar-edit.component';
import type { AuthUser } from '@/shared/types';

@Component({
  selector: 'app-profile-edit',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule, AvatarEditComponent],
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
  readonly formAvatar = computed(() => {
    return this.profileForm.controls.avatarUrl.value;
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

  ngOnInit(): void {
    const { displayName, email, avatarUrl, githubUsername } = this.user();
    this.profileForm.patchValue({
      displayName,
      email,
      avatarUrl: avatarUrl ?? DEFAULT_AVATAR_URL,
      githubUsername: githubUsername ?? '',
    });
  }

  onAvatarSelect(url: string): void {
    this.profileForm.patchValue({ avatarUrl: url });
    this.profileForm.markAsDirty();
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
