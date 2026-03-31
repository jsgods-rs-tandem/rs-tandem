import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '@/shared/ui';
import { DEFAULT_AVATAR_URL } from '@/core/constants';
import type { AuthUser } from '@/shared/types';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { injectActiveLang } from '@/shared/utils/translate.utilities';

@Component({
  selector: 'app-profile-view',
  imports: [ButtonComponent, TypedTranslocoPipe],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent {
  private lang = injectActiveLang();
  user = input.required<AuthUser>();
  editClicked = output();

  readonly userName = computed(() => this.user().displayName);
  readonly userEmail = computed(() => this.user().email);
  readonly avatarUrl = computed(() => this.user().avatarUrl ?? DEFAULT_AVATAR_URL);
  readonly githubUsername = computed(() => this.user().githubUsername);
  readonly githubAriaParams = computed(() => ({ github: this.githubUsername() }));

  readonly linkUrl = computed(() => {
    const github = this.githubUsername();
    return github ? `https://github.com/${github}` : '';
  });

  readonly ariaLabelKey = computed(() => {
    return this.githubUsername()
      ? marker('profile.view.githubAriaLabel')
      : marker('profile.view.githubAriaLabelDefault');
  });

  readonly joinedDateText = computed(() => {
    const activeLang = this.lang();
    const dateString = this.user().createdAt;

    if (!dateString) {
      return { key: marker('profile.view.joinedDateUnknown') };
    }

    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat(activeLang, {
      month: 'long',
      year: 'numeric',
    }).format(date);

    return {
      key: marker('profile.view.joinedDate'),
      params: { formattedDate },
    };
  });
}
