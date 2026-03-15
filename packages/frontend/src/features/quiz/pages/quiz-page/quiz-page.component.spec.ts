import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { QuizPageComponent } from './quiz-page.component';
import { QuizService } from '../../services';

describe('QuizPageComponent', () => {
  let component: QuizPageComponent;
  let fixture: ComponentFixture<QuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: QuizService,
          useValue: {
            getTopic: () => void 0,
            startTopic: () => void 0,
            answerQuestion: () => void 0,
            setNextStep: () => void 0,
            topic: () => null,
            currentQuestion: () => null,
            step: () => 0,
            answer: () => null,
            loading: () => ({
              categories: false,
              category: false,
              topic: false,
              step: false,
              answer: false,
              results: false,
            }),
          } as unknown as QuizService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'test-category-id');
    fixture.componentRef.setInput('topicId', 'test-topic-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
