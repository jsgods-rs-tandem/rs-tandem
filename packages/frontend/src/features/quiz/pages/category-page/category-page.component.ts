import { Component, input } from '@angular/core';

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
  readonly heading = input.required<string>();
  // mocks
  readonly topics = list.topics;
  readonly topicsCount = list.topicsCount;
  readonly topicsCompleteCount = list.topicsCompleteCount;
}
