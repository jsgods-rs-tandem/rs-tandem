import { AppTranslationKey } from '@/shared/types/translation-keys';
import { marker } from '@jsverse/transloco-keys-manager/marker';

export interface FaqItem {
  question: AppTranslationKey;
  answer: AppTranslationKey;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: marker('faq.questions.audience.q'),
    answer: marker('faq.questions.audience.a'),
  },
  {
    question: marker('faq.questions.feature.q'),
    answer: marker('faq.questions.feature.a'),
  },
  {
    question: marker('faq.questions.process.q'),
    answer: marker('faq.questions.process.a'),
  },
  {
    question: marker('faq.questions.free.q'),
    answer: marker('faq.questions.free.a'),
  },
];
