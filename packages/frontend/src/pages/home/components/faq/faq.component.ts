import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  readonly title = 'FAQ';
  readonly faq = [
    {
      question: 'Q: Who is RS-Tandem for?',
      answer:
        'A: The platform is suitable for both beginner developers building their foundation and experienced professionals looking to brush up on complex concepts and algorithms before technical interviews.',
    },
    {
      question: 'Q: What is the main feature of the platform?',
      answer: 'A: TBC',
    },
    {
      question: 'Q: TBC',
      answer: 'A: TBC',
    },
  ] as const;
}
