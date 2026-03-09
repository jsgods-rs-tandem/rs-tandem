import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ShufflePipe } from '@/core/pipes';

import { ButtonComponent } from '@/shared/ui';
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

  error = '';
  isAnswerSubmitted = false;
  answerResult = signal<AnswerStatus | undefined>(undefined);

  readonly submitButtonText = signal(computeSubmitButtonText(this.isAnswerSubmitted));

  onTimeExpired() {
    this.quizForm.markAllAsTouched();
    this.error = errorAnswers.timeExpired;
    this.isAnswerSubmitted = true;
    this.quizForm.controls.answer.disable();
    this.submitButtonText.set(computeSubmitButtonText(this.isAnswerSubmitted));
  }

  onSubmit() {
    if (this.isAnswerSubmitted) {
      this._onNextQuestionSubmit();
    } else {
      this._onAnswerSubmit();
    }
  }

  private _onAnswerSubmit() {
    this.quizForm.markAllAsTouched();

    if (this.quizForm.invalid) {
      this.error = errorAnswers.required;
      return;
    }

    this.error = '';
    this.isAnswerSubmitted = true;

    if (this.quizForm.value.answer === this.question()?.correctAnswerId) {
      this.comment.set(successAnswers[getRandomArrayIndex(successAnswers)] ?? 'Great Job!');
      this.answerResult.set(ANSWER_STATUS.success);
    } else {
      this.comment.set(this.question()?.explanation ?? '');
      this.answerResult.set(ANSWER_STATUS.error);
    }

    this.quizForm.controls.answer.disable();
    this.submitButtonText.set(computeSubmitButtonText(this.isAnswerSubmitted));
  }

  private _onNextQuestionSubmit() {
    this.questionCount.update((value) => value + 1);
    this.error = '';
    this.quizForm.reset();
    this.isAnswerSubmitted = false;
    this.submitButtonText.set(computeSubmitButtonText(this.isAnswerSubmitted));
    this.comment.set('');
    this.answerResult.set(undefined);
    this.quizForm.controls.answer.enable();
  }
}
