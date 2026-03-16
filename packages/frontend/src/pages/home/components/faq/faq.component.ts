import { Component } from '@angular/core';
import { AccordionComponent, AccordionItemComponent } from '@/shared/ui/accordion';
import { FAQ_DATA } from './faq.config';

@Component({
  selector: 'app-faq',
  imports: [AccordionComponent, AccordionItemComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  readonly title = 'FAQ';
  protected readonly faqData = FAQ_DATA;
}
