import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { QuizPageComponent } from './quiz-page.component';

describe('QuizPageComponent', () => {
  let component: QuizPageComponent;
  let fixture: ComponentFixture<QuizPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
