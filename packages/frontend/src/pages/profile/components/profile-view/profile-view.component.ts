import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { AuthUser } from '../../profile.types';

@Component({
  selector: 'app-profile-view',
  imports: [ButtonComponent],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent {
  user = input.required<AuthUser>();

  editClicked = output();

  readonly userName = computed(() => this.user().displayName);
  readonly userEmail = computed(() => this.user().email);
  readonly avatarUrl = computed(
    () => this.user().avatarUrl ?? 'assets/images/user-avatar-placeholder.png',
  );

  readonly joinedDateText = computed(() => {
    const dateString = this.user().createdAt;

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
}
