import { Component } from '@angular/core';

import { LayoutComponent } from '@/pages/layout';
import { CategoryCardListComponent } from '@/shared/ui';

import mock from '../../data/categories.json';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryCardListComponent, LayoutComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent {
  readonly categories = mock;
}
