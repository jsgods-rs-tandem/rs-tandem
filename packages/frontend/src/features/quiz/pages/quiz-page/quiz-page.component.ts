import { Component, computed, effect, inject, input, signal, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { marker } from '@jsverse/transloco-keys-manager/marker';

import { ShufflePipe } from '@/shared/pipes';
import { TypedTranslocoPipe } from '@/shared/pipes/typed-transloco.pipe';
import { injectTranslate } from '@/shared/utils/translate.utilities';

import { LayoutComponent } from '@/pages/layout';
import { ButtonComponent, EmptyComponent } from '@/shared/ui';
import {
  AnswerTileGroupComponent,
  CountdownTimerComponent,
  ANSWER_STATUS,
  type AnswerStatus,
} from '../../ui';

import { QuizService } from '../../services';

import { computeSubmitButtonText, getRandomArrayIndex } from './quiz-page.utilities';

import { ROUTES } from '@/core/constants';
import { successAnswers, errorAnswers } from './quiz-page.constants';

import type { AppTranslationKey } from '@/shared/types/translation-keys';

@Component({
  selector: 'app-quiz-page',
  imports: [
    AnswerTileGroupComponent,
    ButtonComponent,
    CountdownTimerComponent,
    DecimalPipe,
    EmptyComponent,
    LayoutComponent,
    ReactiveFormsModule,
    ShufflePipe,
    TypedTranslocoPipe,
  ],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss',
  standalone: true,
})
export class QuizPageComponent implements OnInit {
  readonly quizService = inject(QuizService);
  private readonly _t = injectTranslate();
  readonly categoryId = input.required<string>();
  readonly topicId = input.required<string>();

  quizForm = new FormGroup({
    answer: new FormControl('', [(control) => Validators.required(control)]),
  });

  readonly comment = signal('');
  readonly isAnswerSubmitted = signal(false);
  readonly isQuizComplete = signal(false);

  error = '';
  answerResult = signal<AnswerStatus | undefined>(undefined);

  readonly submitButtonTextKey = computed<AppTranslationKey>(() =>
    computeSubmitButtonText(this.isAnswerSubmitted(), this.isQuizComplete()),
  );
  readonly resultsLink = computed<string | undefined>(() =>
    this.isQuizComplete() ? ROUTES.quizResults : undefined,
  );

  private readonly _isTimeExpired = signal(false);

  constructor() {
    effect(() => {
      const answer = this.quizService.answer();

      if (!answer) {
        return;
      }

      this.isAnswerSubmitted.set(true);

      if (answer.isCorrect) {
        const successKey = successAnswers[getRandomArrayIndex(successAnswers)];
        this.comment.set(
          this._translateKey(successKey ?? 'quiz.quizPage.comments.success.greatJob'),
        );
        this.answerResult.set(ANSWER_STATUS.success);
      } else {
        this.comment.set(answer.explanation ?? '');
        this.answerResult.set(ANSWER_STATUS.error);
      }

      this.quizForm.controls.answer.disable();
      this._checkQuizCompletion();
    });

    effect((onCleanup) => {
      onCleanup(() => {
        this.quizService.resetTopic();
      });
    });
  }

  ngOnInit(): void {
    const topicId = this.topicId();

    if (this.quizService.topic()?.id !== topicId) {
      this.quizService.getTopic(topicId);
    }

    this.quizService.startTopic(topicId);
  }

  onTimeExpired() {
    const questionId = this.quizService.currentQuestion()?.id;

    if (!questionId) {
      this.error = this._translateKey(errorAnswers.requiredQuestionId);
      return;
    }

    this._isTimeExpired.set(true);

    this.quizForm.markAllAsTouched();
    this.error = this._translateKey(errorAnswers.timeExpired);
    this.quizService.answerQuestion(this.topicId(), questionId, {
      answerId: '',
      isTimeUp: this._isTimeExpired(),
    });
  }

  onSubmit() {
    if (this.isAnswerSubmitted()) {
      this._onNextQuestionSubmit();
    } else {
      this._onAnswerSubmit();
    }
  }

  private _checkQuizCompletion() {
    const topic = this.quizService.topic();

    if (!topic) {
      return;
    }

    const isLastQuestion = this.quizService.step() === topic.questionsCount - 1;

    if (isLastQuestion && this.isAnswerSubmitted()) {
      this.isQuizComplete.set(true);
    }
  }

  private _onAnswerSubmit() {
    this.quizForm.markAllAsTouched();

    if (this.quizForm.invalid) {
      this.error = this._translateKey(errorAnswers.required);
      return;
    }

    const questionId = this.quizService.currentQuestion()?.id;

    if (!questionId) {
      this.error = this._translateKey(errorAnswers.requiredQuestionId);
      return;
    }

    this.error = '';

    this.quizService.answerQuestion(this.topicId(), questionId, {
      answerId: this.quizForm.controls.answer.value ?? '',
      isTimeUp: this._isTimeExpired(),
    });
  }

  private _onNextQuestionSubmit() {
    this.quizService.setNextStep();
    this.error = '';
    this.quizForm.reset();
    this._isTimeExpired.set(false);
    this.isAnswerSubmitted.set(false);
    this.comment.set('');
    this.answerResult.set(undefined);
    this.quizForm.controls.answer.enable();
  }

  private _translateKey(key: AppTranslationKey): string {
    return this._t(marker(key));
  }
}
