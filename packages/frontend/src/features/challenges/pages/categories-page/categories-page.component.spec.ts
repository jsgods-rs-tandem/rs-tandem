import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoriesPageComponent } from './categories-page.component';
import { ChallengesService } from '../../services';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('CategoriesPageComponent', () => {
  let component: CategoriesPageComponent;
  let fixture: ComponentFixture<CategoriesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPageComponent],
      providers: [
        provideRouter([]),
        provideAppTranslocoTesting(),
        {
          provide: ChallengesService,
          useValue: {
            getCategories: () => void 0,
            resetCategories: () => void 0,
            categories: () => [],
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

    fixture = TestBed.createComponent(CategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
