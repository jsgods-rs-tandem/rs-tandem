import { Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { AuthStore } from '@/core/store/auth.store';
import { UserDto } from '@rs-tandem/shared';

export interface AuthUser extends UserDto {
  avatarUrl?: string;
  githubUsername?: string;
}

@Component({
  selector: 'app-profile',
  imports: [ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authStore = inject(AuthStore);

  readonly user = computed<AuthUser | null>(() => this.authStore.user());

  readonly title = 'Profile';

  readonly userName = computed(() => this.user()?.displayName ?? 'Guest');
  readonly userEmail = computed(() => this.user()?.email ?? 'guest@example.com');

  readonly joinedDateText = computed(() => {
    const dateString = this.user()?.updatedAt;

    if (!dateString) {
      return 'Joined date unknown';
    }

    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);

    return `Joined ${formattedDate}`;
  });

  readonly avatarUrl = computed(
    () => this.user()?.avatarUrl ?? 'https://avatars.githubusercontent.com/u/127693483?v=4',
  );

  readonly githubUsername = computed(() => this.user()?.githubUsername ?? 'your-github');

  readonly linkUrl = computed(() => {
    const github = this.githubUsername();
    return github ? `https://github.com/${github}` : '';
  });

  readonly ariaLabel = computed(() => `Link for ${this.userName()} github`);
}
