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
  titleLevel = input<2 | 3>(3);
  footerExists = contentChild(CardFooterDirective);
  footerPosition = input<'start' | 'end'>('start');
}
