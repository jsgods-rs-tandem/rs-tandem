import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ProfileViewComponent, ProfileEditComponent } from './components';
import { AuthStore } from '@/core/store/auth.store';
import { AuthUser, ProfileFormData, ProfileState } from './profile.types';
import { AuthService } from '@/core/services/auth.service';
import { filter, forkJoin, Observable, switchMap, take, timer } from 'rxjs';
import { UpdateProfileDto, UserProfileDto } from '@rs-tandem/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SpinComponent } from '@/shared/ui';
import { ModalService } from '@/core/services/modal.service';
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import { ProfilesService } from '@/core/services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [ProfileViewComponent, ProfileEditComponent, SpinComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly title = 'Profile';
  readonly loading = signal<boolean>(true);

  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private profilesService = inject(ProfilesService);
  private authStore = inject(AuthStore);
  private modalService = inject(ModalService);

  readonly state = signal<ProfileState>('view');
  readonly isViewing = computed(() => this.state() === 'view');
  readonly isSaving = computed(() => this.state() === 'saving');

  private profileData = signal<UserProfileDto | null>(null);

  readonly user = computed<AuthUser | null>(() => {
    const authUser = this.authStore.user();
    const extraData = this.profileData();

    if (!authUser) return null;

    return {
      ...authUser,
      avatarUrl: extraData?.avatarUrl,
      githubUsername: extraData?.githubUsername ?? '',
      createdAt: authUser.createdAt,
    } as AuthUser;
  });

  constructor() {
    toObservable(this.user)
      .pipe(
        filter((user) => !!user),
        take(1),
        switchMap(() => forkJoin([this.profilesService.getProfile('me'), timer(500)])),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: ([profile]) => {
          this.profileData.set(profile);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  saveProfile(formData: ProfileFormData) {
    this.state.set('saving');

    const profileDto: UpdateProfileDto = {};
    const currentUser = this.user();
    if (!currentUser) return;
    if (formData.displayName && formData.displayName !== currentUser.displayName) {
      profileDto.displayName = formData.displayName;
    }
    if (formData.email && formData.email !== currentUser.email) {
      profileDto.email = formData.email;
    }

    if (
      formData.githubUsername !== undefined &&
      formData.githubUsername !== currentUser.githubUsername
    ) {
      profileDto.githubUsername = formData.githubUsername;
    }

    const requests: {
      delay: Observable<number>;
      profile?: Observable<UserProfileDto>;
      password?: Observable<unknown>;
    } = {
      delay: timer(500),
    };

    if (Object.keys(profileDto).length > 0) {
      requests.profile = this.profilesService.updateProfile(profileDto);
    }

    if (formData.currentPassword && formData.newPassword) {
      requests.password = this.authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
      );
    }

    if (!requests.profile && !requests.password) {
      this.state.set('view');
      return;
    }

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          if (results.profile) {
            this.profileData.set(results.profile);
          }
          this.modalService.open({
            title: 'Success',
            message: 'Profile updated successfully!',
            icon: 'info-outline',
          });
          this.state.set('view');
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = getHttpErrorMessage(error, 'Check your data and try again');
          this.state.set('edit');
          this.modalService.open({
            title: 'Error',
            message: errorMessage,
            icon: 'info-outline',
          });
        },
      });
  }
}
