import { Component, input } from '@angular/core';
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
  isRotate = input<boolean>(false);

  linkText = input<string>();
  linkUrl = input<string>();
  icon = input<IconName>('github');
}
