import { Component, input } from '@angular/core';

import { ButtonComponent } from '@/shared/ui';
import { ProgressComponent } from '../progress/progress.component';

@Component({
  selector: 'app-category-card',
  imports: [ButtonComponent, ProgressComponent],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  standalone: true,
})
export class CategoryCardComponent {
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly topicsCount = input.required<number>();
  readonly topicsCompleteCount = input.required<number>();
  readonly topicsProgress = input.required<number>();
}
