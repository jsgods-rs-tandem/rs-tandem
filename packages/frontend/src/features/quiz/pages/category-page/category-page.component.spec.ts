import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoryPageComponent } from './category-page.component';
import { QuizService } from '../../services';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: QuizService,
          useValue: {
            getCategory: () => void 0,
            resetCategory: () => void 0,
            category: () => null,
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

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'test-category-id');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
