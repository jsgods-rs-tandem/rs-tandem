import { Component, contentChild, input } from '@angular/core';
import { CardFooterDirective } from './card-footer.directive';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  title = input<string>();
  footerExists = contentChild(CardFooterDirective);
  footerPosition = input<'start' | 'end'>('start');
}
