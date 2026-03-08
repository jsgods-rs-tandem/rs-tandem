import { Component } from '@angular/core';

import { ProgressComponent, TopicCardListComponent } from '../../ui';

import category from '../../data/category.json';

@Component({
  selector: 'app-category-page',
  imports: [ProgressComponent, TopicCardListComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent {
  // mocks
  readonly heading = category.category;
  readonly topics = category.topics;
  readonly topicsCount = category.topicsCount;
  readonly topicsCompleteCount = category.topicsCompleteCount;
  readonly topicsProgress = category.progress;
}
