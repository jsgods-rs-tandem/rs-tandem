import { Component } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { ProgressComponent } from '@/shared/ui';
import { ChallengePreviewCardComponent } from '../../ui';

import mock from '../../data/topics-js-core.json';

@Component({
  selector: 'app-category-page',
  imports: [ChallengePreviewCardComponent, LayoutComponent, ProgressComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent {
  readonly category = mock;
}
