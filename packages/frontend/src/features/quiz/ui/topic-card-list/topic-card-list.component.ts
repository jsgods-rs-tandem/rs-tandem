import { Component, input } from '@angular/core';

import { TopicCardComponent } from './components';

import type { TopicCardListItem } from './topic-card-list.types';

@Component({
  selector: 'app-topic-card-list',
  imports: [TopicCardComponent],
  templateUrl: './topic-card-list.component.html',
  styleUrl: './topic-card-list.component.scss',
  standalone: true,
})
export class TopicCardListComponent {
  readonly topics = input.required<TopicCardListItem[]>();
}
