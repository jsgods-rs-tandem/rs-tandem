import { Component, effect, inject, input, type OnInit } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent, ProgressComponent } from '@/shared/ui';
import { ChallengePreviewCardComponent } from '../../ui';

import { ChallengesService } from '../../services';

@Component({
  selector: 'app-category-page',
  imports: [
    ButtonComponent,
    ChallengePreviewCardComponent,
    EmptyComponent,
    LayoutComponent,
    ProgressComponent,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);
  readonly categoryId = input.required<string>();

  constructor() {
    effect((onCleanup) => {
      onCleanup(() => {
        this.challengesService.resetCategory();
      });
    });
  }

  ngOnInit(): void {
    if (!this.challengesService.category()) {
      const categoryId = this.categoryId();

      this.challengesService.getCategory(categoryId);
    }
  }
}
