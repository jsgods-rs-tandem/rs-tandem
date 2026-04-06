import { Component, input } from '@angular/core';

import { ButtonComponent } from '../../../button/button.component';
import { ProgressComponent } from '../../../progress/progress.component';

import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-category-card',
  imports: [ButtonComponent, ProgressComponent, TypedTranslocoPipe],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  standalone: true,
})
export class CategoryCardComponent {
  readonly id = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
  readonly topicsCount = input.required<number>();
  readonly topicsCompleteCount = input.required<number>();
  readonly topicsProgress = input.required<number>();
}
