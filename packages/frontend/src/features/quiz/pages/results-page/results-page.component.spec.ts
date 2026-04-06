import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ResultsPageComponent } from './results-page.component';
import { QuizService } from '../../services';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsPageComponent],
      providers: [
        provideRouter([]),
        provideAppTranslocoTesting(),
        {
          provide: QuizService,
          useValue: {
            getResults: () => void 0,
            resetResults: () => void 0,
            results: () => null,
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

    fixture = TestBed.createComponent(ResultsPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'test-category-id');
    fixture.componentRef.setInput('topicId', 'test-topic-id');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
