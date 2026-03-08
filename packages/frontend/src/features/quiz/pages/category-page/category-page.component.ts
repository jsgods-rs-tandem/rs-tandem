import { Component } from '@angular/core';

import { ProgressComponent, TopicCardListComponent } from '../../ui';

import list from '../../data/topics.json';

@Component({
  selector: 'app-category-page',
  imports: [ProgressComponent, TopicCardListComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent {
  // mocks
  readonly heading = list.category;
  readonly topics = list.topics;
  readonly topicsCount = list.topicsCount;
  readonly topicsCompleteCount = list.topicsCompleteCount;
  readonly topicsProgress = list.progress;
}
