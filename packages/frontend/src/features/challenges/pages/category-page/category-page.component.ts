import { Component, inject, input, type OnInit } from '@angular/core';

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

  ngOnInit(): void {
    const categoryId = this.categoryId();

    if (this.challengesService.category()?.id !== categoryId) {
      this.challengesService.getCategory(categoryId);
    }
  }
}
