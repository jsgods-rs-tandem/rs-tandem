import { Component, inject, type OnInit } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { CategoryCardListComponent } from '@/shared/ui';

import { ChallengesService } from '../../services';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryCardListComponent, LayoutComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent implements OnInit {
  readonly challengesService = inject(ChallengesService);

  ngOnInit(): void {
    this.challengesService.getCategories();
  }
}
