import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AuthStore } from '@/core/store/auth.store';
import { AuthService } from '@/core/services/auth.service';
import { ProfilesService } from '@/core/services/profile.service';
import { ModalService } from '@/core/services/modal.service';
import { filter, forkJoin, switchMap, take, timer, of, map } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import type { UserProfileDto } from '@rs-tandem/shared';
import { getHttpErrorMessage } from '@/shared/utils/http-error.utilities';
import type { AuthUser, ProfileFormData, ProfileState } from '../models/profile.types';
import { buildUpdateProfileDto } from '../utils/profile.mapper';

const DELAY_MS = 300;

@Injectable()
export class ProfileFacade {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private profilesService = inject(ProfilesService);
  private authStore = inject(AuthStore);
  private modalService = inject(ModalService);

  readonly loading = signal<boolean>(true);
  readonly state = signal<ProfileState>('view');
  private profileData = signal<UserProfileDto | null>(null);

  readonly user = computed<AuthUser | null>(() => {
    const authUser = this.authStore.user();
    const extraData = this.profileData();
    if (!authUser) return null;

    return {
      ...authUser,
      avatarUrl: extraData?.avatarUrl ?? null,
      githubUsername: extraData?.githubUsername ?? null,
      createdAt: authUser.createdAt,
    };
  });

  constructor() {
    toObservable(this.user)
      .pipe(
        filter((user) => Boolean(user)),
        take(1),
        switchMap(() => forkJoin([this.profilesService.getProfile('me'), timer(DELAY_MS)])),
        takeUntilDestroyed(this.destroyRef),
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

  saveProfile(formData: ProfileFormData): void {
    const currentUser = this.user();
    if (!currentUser) return;
    this.state.set('saving');

    const profileDto = buildUpdateProfileDto(formData, currentUser);

    const hasProfile = Object.keys(profileDto).length > 0;
    const hasPassword = Boolean(formData.currentPassword && formData.newPassword);
    if (!hasProfile && !hasPassword) {
      this.state.set('view');
      return;
    }
    const passwordUpdate$ = hasPassword
      ? this.authService.changePassword(formData.currentPassword ?? '', formData.newPassword ?? '')
      : of(null);

    const profileUpdate$ = hasProfile ? this.profilesService.updateProfile(profileDto) : of(null);

    passwordUpdate$
      .pipe(
        switchMap(() => profileUpdate$),
        switchMap((profile) => timer(DELAY_MS).pipe(map(() => profile))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedProfile) => {
          if (updatedProfile) {
            this.profileData.set(updatedProfile);
          }
          this.modalService.open({
            title: 'Success',
            message: 'Profile updated successfully!',
            icon: 'info-outline',
          });
          this.state.set('view');
        },
        error: (error: HttpErrorResponse) => {
          this.state.set('edit');
          this.modalService.open({
            title: 'Update Failed',
            message: getHttpErrorMessage(error, 'Please check your current password or data'),
            icon: 'info-outline',
          });
        },
      });
  }
}
