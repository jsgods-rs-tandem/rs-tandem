import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ShufflePipe } from '@/core/pipes';

import { ButtonComponent } from '@/shared/ui';
import { LayoutComponent } from '../layout';
import {
  AnswerTileGroupComponent,
  CountdownTimerComponent,
  ANSWER_STATUS,
  type AnswerStatus,
} from '../../ui';

import { computeSubmitButtonText, getRandomArrayIndex } from './quiz-page.utilities';

import { successAnswers, errorAnswers } from './quiz-page.constants';

import quiz from '../../data/basic-js-functions-quiz.json';

@Component({
  selector: 'app-quiz-page',
  imports: [
    AnswerTileGroupComponent,
    ButtonComponent,
    CountdownTimerComponent,
    DecimalPipe,
    LayoutComponent,
    ReactiveFormsModule,
    ShufflePipe,
  ],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss',
  standalone: true,
})
export class QuizPageComponent {
  quizForm = new FormGroup({
    answer: new FormControl('', [(control) => Validators.required(control)]),
  });

  readonly name = quiz.name;
  readonly questionCount = signal(0);
  readonly questionsCount = quiz.questionsCount;
  readonly question = computed(() => quiz.questions.at(this.questionCount()));
  readonly comment = signal('');
  readonly isAnswerSubmitted = signal(false);
  readonly isQuizComplete = signal(false);

  error = '';
  answerResult = signal<AnswerStatus | undefined>(undefined);

  readonly submitButtonText = computed(() =>
    computeSubmitButtonText(this.isAnswerSubmitted(), this.isQuizComplete()),
  );
  readonly resultsLink = computed<string | undefined>(() =>
    this.isQuizComplete() ? 'results' : undefined,
  );

  onTimeExpired() {
    this.quizForm.markAllAsTouched();
    this.error = errorAnswers.timeExpired;
    this.isAnswerSubmitted.set(true);
    this.quizForm.controls.answer.disable();
    this._checkQuizCompletion();
  }

  onSubmit() {
    if (this.isAnswerSubmitted()) {
      this._onNextQuestionSubmit();
    } else {
      this._onAnswerSubmit();
    }
  }

  private _checkQuizCompletion() {
    const isLastQuestion = this.questionCount() === this.questionsCount - 1;

    if (isLastQuestion && this.isAnswerSubmitted()) {
      this.isQuizComplete.set(true);
    }
  }

  private _onAnswerSubmit() {
    this.quizForm.markAllAsTouched();

    if (this.quizForm.invalid) {
      this.error = errorAnswers.required;
      return;
    }

    this.error = '';
    this.isAnswerSubmitted.set(true);

    if (this.quizForm.value.answer === this.question()?.correctAnswerId) {
      this.comment.set(successAnswers[getRandomArrayIndex(successAnswers)] ?? 'Great Job!');
      this.answerResult.set(ANSWER_STATUS.success);
    } else {
      this.comment.set(this.question()?.explanation ?? '');
      this.answerResult.set(ANSWER_STATUS.error);
    }

    this.quizForm.controls.answer.disable();
    this._checkQuizCompletion();
  }

  private _onNextQuestionSubmit() {
    this.questionCount.update((value) => value + 1);
    this.error = '';
    this.quizForm.reset();
    this.isAnswerSubmitted.set(false);
    this.comment.set('');
    this.answerResult.set(undefined);
    this.quizForm.controls.answer.enable();
  }
}
