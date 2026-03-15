import { Component, inject, input, type OnInit } from '@angular/core';

import { LayoutComponent } from '../layout';
import { ProgressComponent, TopicCardListComponent } from '../../ui';

import { QuizService } from '../../services';

@Component({
  selector: 'app-category-page',
  imports: [LayoutComponent, ProgressComponent, TopicCardListComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly quizService = inject(QuizService);
  readonly categoryId = input.required<string>();

  ngOnInit(): void {
    this.quizService.getCategory(this.categoryId());
  }
}
