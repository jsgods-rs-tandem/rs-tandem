import { Component, computed, effect, inject, input, signal, type OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ShufflePipe } from '@/shared/pipes';

import { ButtonComponent } from '@/shared/ui';
import { LayoutComponent } from '../layout';
import {
  AnswerTileGroupComponent,
  CountdownTimerComponent,
  ANSWER_STATUS,
  type AnswerStatus,
} from '../../ui';

import { QuizService } from '../../services';

import { computeSubmitButtonText, getRandomArrayIndex } from './quiz-page.utilities';

import { successAnswers, errorAnswers } from './quiz-page.constants';

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
export class QuizPageComponent implements OnInit {
  readonly quizService = inject(QuizService);
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

  readonly submitButtonText = computed(() =>
    computeSubmitButtonText(this.isAnswerSubmitted(), this.isQuizComplete()),
  );
  readonly resultsLink = computed<string | undefined>(() =>
    this.isQuizComplete() ? 'results' : undefined,
  );

  constructor() {
    effect(() => {
      const answer = this.quizService.answer();

      if (!answer) {
        return;
      }

      if (answer.isCorrect) {
        this.comment.set(successAnswers[getRandomArrayIndex(successAnswers)] ?? 'Great Job!');
        this.answerResult.set(ANSWER_STATUS.success);
      } else {
        this.comment.set(answer.explanation ?? '');
        this.answerResult.set(ANSWER_STATUS.error);
      }

      this.quizForm.controls.answer.disable();
      this._checkQuizCompletion();
    });
  }

  ngOnInit(): void {
    const topicId = this.topicId();

    this.quizService.getTopic(topicId);
    this.quizService.startTopic(topicId);
  }

  onTimeExpired() {
    const questionId = this.quizService.currentQuestion()?.id;

    if (!questionId) {
      this.error = errorAnswers.requiredQuestionId;
      return;
    }

    this.quizForm.markAllAsTouched();
    this.error = errorAnswers.timeExpired;
    this.isAnswerSubmitted.set(true);
    this.quizService.answerQuestion(this.topicId(), questionId, {
      answerId: '',
      isTimeUp: true,
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
      this.error = errorAnswers.required;
      return;
    }

    const questionId = this.quizService.currentQuestion()?.id;

    if (!questionId) {
      this.error = errorAnswers.requiredQuestionId;
      return;
    }

    this.error = '';
    this.isAnswerSubmitted.set(true);

    this.quizService.answerQuestion(this.topicId(), questionId, {
      answerId: this.quizForm.controls.answer.value ?? '',
      isTimeUp: false,
    });
  }

  private _onNextQuestionSubmit() {
    this.quizService.setNextStep();
    this.error = '';
    this.quizForm.reset();
    this.isAnswerSubmitted.set(false);
    this.comment.set('');
    this.answerResult.set(undefined);
    this.quizForm.controls.answer.enable();
  }
}
