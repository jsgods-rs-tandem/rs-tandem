import { Component } from '@angular/core';
import { AccordionComponent, AccordionItemComponent } from '@/shared/ui/accordion';
import { FAQ_DATA } from './faq.config';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';

@Component({
  selector: 'app-faq',
  imports: [AccordionComponent, AccordionItemComponent, TypedTranslocoPipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  readonly titleKey = marker('faq.title');
  protected readonly faqData = FAQ_DATA;
}
