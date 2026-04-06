import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoryPageComponent } from './category-page.component';
import { ChallengesService } from '../../services';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPageComponent],
      providers: [
        provideRouter([]),
        provideAppTranslocoTesting(),
        {
          provide: ChallengesService,
          useValue: {
            getCategory: () => void 0,
            resetCategory: () => void 0,
            reloadPage: () => void 0,
            category: () => null,
            loading: () => ({
              categories: false,
              category: false,
              codeEditor: false,
              solution: false,
            }),
          } as unknown as ChallengesService,
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
