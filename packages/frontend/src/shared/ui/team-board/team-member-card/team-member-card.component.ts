import { Component, input } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import { IconName } from '../../icon/Icon.types';
import { InViewDirective } from '@/shared/directives/in-view.directive';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-team-member-card',
  imports: [ButtonComponent, InViewDirective, TypedTranslocoPipe],
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss',
})
export class TeamMemberCardComponent {
  nameKey = input.required<AppTranslationKey>();
  avatarUrl = input.required<string>();
  isRotate = input<boolean>(false);

  linkText = input<string>();
  linkUrl = input<string>();
  icon = input<IconName>('github');
}
