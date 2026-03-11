import { Component } from '@angular/core';

import { LayoutComponent } from '../layout';
import { CategoryCardListComponent } from '../../ui';

import list from '../../data/categories.json';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryCardListComponent, LayoutComponent],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.scss',
  standalone: true,
})
export class CategoriesPageComponent {
  readonly categories = list.categories;
}
