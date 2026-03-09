import { Component, computed, input } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconName } from '../icon/Icon.types';

@Component({
  selector: 'app-team-member-card',
  imports: [ButtonComponent],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss',
})
export class TeamMemberCardComponent {
  name = input.required<string>();
  avatarUrl = input.required<string>();

  githubLogin = input<string>();
  externalLink = input<string>();
  linkText = input<string>();

  displayHref = computed(() => {
    const external = this.externalLink();
    if (external) return external;
    const github = this.githubLogin();
    return github ? `https://github.com/${github}` : '';
  });

  iconName = computed<IconName>(() => (this.githubLogin() ? 'github' : 'github'));
  isRotate = input<boolean>(false);
}
