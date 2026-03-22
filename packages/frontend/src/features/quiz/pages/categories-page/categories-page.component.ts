import { Component, inject, type OnInit } from '@angular/core';

import { ButtonComponent, EmptyComponent } from '@/shared/ui';
import { LayoutComponent } from '../layout';
import { CategoryCardListComponent } from '../../ui';

import { QuizService } from '../../services';

@Component({
  selector: 'app-categories-page',
  imports: [ButtonComponent, CategoryCardListComponent, EmptyComponent, LayoutComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent implements OnInit {
  readonly quizService = inject(QuizService);

  ngOnInit(): void {
    this.quizService.getCategories();
  }
}
