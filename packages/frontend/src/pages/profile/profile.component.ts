import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ProfileViewComponent, ProfileEditComponent } from './components';
import { AuthStore } from '@/core/store/auth.store';
import { ApiErrorResponse, AuthUser, ProfileFormData, ProfileState } from './profile.types';
import { AuthService } from '@/core/services/auth.service';
import { forkJoin, Observable, of } from 'rxjs';
import { UserDto } from '@rs-tandem/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [ProfileViewComponent, ProfileEditComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly title = 'Profile';

  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);

  readonly user = computed<AuthUser | null>(() => this.authStore.user());

  readonly state = signal<ProfileState>('view');
  readonly isViewing = computed(() => this.state() === 'view');
  readonly isSaving = computed(() => this.state() === 'saving');

  saveProfile(formData: ProfileFormData) {
    this.state.set('saving');

    const profileDto: Partial<UserDto> = {
      displayName: formData.displayName ?? '',
      email: formData.email ?? '',
    };

    const profileUpdate$ = this.authService.updateProfile(profileDto);

    let passwordUpdate$: Observable<unknown> = of(null);

    if (formData.currentPassword && formData.newPassword) {
      passwordUpdate$ = this.authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
      );
    }

    forkJoin({
      profile: profileUpdate$,
      password: passwordUpdate$,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          alert('Profile and password updated successfully!'); // CHANGE TO MODAL WINDOW WITH SUCCESS MESSAGE
          this.state.set('view');
        },
        error: (error: unknown) => {
          console.error('Update failed:', error);

          let errorMessage = 'Check your data and try again';

          if (error instanceof HttpErrorResponse) {
            const body = error.error as ApiErrorResponse;
            const serverMessage = body.message;

            if (Array.isArray(serverMessage)) {
              errorMessage = serverMessage.join('. ');
            } else if (typeof serverMessage === 'string') {
              errorMessage = serverMessage;
            } else {
              errorMessage = error.message;
            }
          }

          alert(`Error: ${errorMessage}`); // CHANGE TO MODAL WINDOW WITH ERROR MESSAGE
          this.state.set('edit');
        },
      });
  }
}
