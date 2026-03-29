import { Component, computed, effect, inject, input, OnInit, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import type { ProfileFormData } from '../../models/profile.types';
import { InputComponent } from '@/shared/ui/input/input.component';
import { ButtonComponent } from '@/shared/ui';
import {
  DEFAULT_AVATAR_URL,
  MAX_INPUT_LENGTH,
  MIN_LENGTH_PASSWORD,
  MIN_LENGTH_USERNAME,
} from '@/core/constants';
import {
  buildProfileForm,
  getProfileFieldError,
  isControlInvalid,
} from '../../utils/profile.utilities';
import { AvatarEditComponent } from '../avatar-edit/avatar-edit.component';
import type { AuthUser } from '@/shared/types';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-profile-edit',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    AvatarEditComponent,
    TypedTranslocoPipe,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit {
  protected readonly MIN_LENGTH_USERNAME = MIN_LENGTH_USERNAME;
  protected readonly MIN_LENGTH_PASSWORD = MIN_LENGTH_PASSWORD;
  protected readonly MAX_INPUT_LENGTH = MAX_INPUT_LENGTH;
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

  getValidationKey(field: string): AppTranslationKey | null {
    return getProfileFieldError(this.profileForm.get(field));
  }
}
