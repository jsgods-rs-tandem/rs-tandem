import { Component } from '@angular/core';
import { AccordionComponent, AccordionItemComponent } from '@/shared/ui/accordion';

@Component({
  selector: 'app-faq',
  imports: [AccordionComponent, AccordionItemComponent],
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
      answer:
        'A: We use gamification. Instead of dryly reading documentation, you solve interactive exercises that simulate real interview tasks, making routine preparation engaging.',
    },
    {
      question: 'Q: How does the learning process work?',
      answer:
        'A: You decide how you want to learn: through interactive quizzes to check your skills or AI-powered chat for deep theoretical exploration. By opting for a quiz, you choose a topic, complete a series of practical tasks, and get a comprehensive summary of your progress and recommendations at the end.',
    },
  ] as const;
}
