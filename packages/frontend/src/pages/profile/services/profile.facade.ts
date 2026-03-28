import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AuthStore } from '@/core/store/auth.store';
import { AuthService } from '@/core/services/auth.service';
import { ProfilesService } from '@/core/services/profile.service';
import { ModalService } from '@/core/services/modal.service';
import { forkJoin, switchMap, take, timer, of, map, EMPTY, filter } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import type { UserProfileDto } from '@rs-tandem/shared';
import { getHttpErrorMessageTKey } from '@/shared/utils/http-error.utilities';
import { injectTranslate } from '@/shared/utils/translate.helper';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import type { ProfileFormData, ProfileState } from '../models/profile.types';
import { buildUpdateProfileDto } from '../utils/profile.mapper';
import type { AuthUser } from '@/shared/types';
import type { AppTranslationKey } from '@/shared/types/translation-keys';

const DELAY_MS = 300;

@Injectable()
export class ProfileFacade {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private profilesService = inject(ProfilesService);
  private authStore = inject(AuthStore);
  private modalService = inject(ModalService);
  private t = injectTranslate();

  readonly loading = signal<boolean>(true);
  readonly state = signal<ProfileState>('view');
  private profileData = signal<UserProfileDto | null>(null);

  readonly user = computed<AuthUser | null>(() => {
    const authUser = this.authStore.user();
    const extraData = this.profileData();
    if (!authUser) return null;

    return {
      ...authUser,
      avatarUrl: extraData?.avatarUrl ?? authUser.avatarUrl ?? null,
      githubUsername: extraData?.githubUsername ?? authUser.githubUsername ?? null,
      createdAt: authUser.createdAt,
    };
  });

  constructor() {
    toObservable(this.user)
      .pipe(
        filter((user): user is AuthUser => !!user),
        take(1),
        switchMap(() => {
          if (this.profileData()) {
            this.loading.set(false);
            return EMPTY;
          }
          const authUser = this.authStore.user();
          const isProfileNotLoaded =
            authUser?.githubUsername === undefined || authUser.avatarUrl === undefined;

          if (!isProfileNotLoaded) {
            this.loading.set(false);
            return EMPTY;
          }

          this.loading.set(true);
          return forkJoin([this.profilesService.getProfile('me'), timer(DELAY_MS)]).pipe(
            map(([profile]) => profile),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (profile) => {
          this.profileData.set(profile);
          this.authStore.updateUser(profile);
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
            this.authStore.updateUser(updatedProfile);
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

          const messageKey = getHttpErrorMessageTKey(
            error,
            marker('errors.checkPasswordOrData') as AppTranslationKey,
          );

          this.modalService.open({
            title: 'Update Failed',
            message: Array.isArray(messageKey)
              ? messageKey.map((key) => this.t(key))
              : this.t(messageKey),
            icon: 'info-outline',
          });
        },
      });
  }
}
