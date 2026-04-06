import { Component, effect, inject, input, type OnInit } from '@angular/core';

import { ButtonComponent, EmptyComponent, ProgressComponent } from '@/shared/ui';
import { LayoutComponent } from '@/pages/layout';
import { TopicCardListComponent } from '../../ui';

import { QuizService } from '../../services';

@Component({
  selector: 'app-category-page',
  imports: [
    ButtonComponent,
    EmptyComponent,
    LayoutComponent,
    ProgressComponent,
    TopicCardListComponent,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly quizService = inject(QuizService);
  readonly categoryId = input.required<string>();

  constructor() {
    effect((onCleanup) => {
      onCleanup(() => {
        this.quizService.resetCategory();
      });
    });
  }

  ngOnInit(): void {
    if (!this.quizService.category()) {
      const categoryId = this.categoryId();

      this.quizService.getCategory(categoryId);
    }
  }
}
