import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCardListComponent } from './category-card-list.component';

describe('CategoryCardListComponent', () => {
  let component: CategoryCardListComponent;
  let fixture: ComponentFixture<CategoryCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCardListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', [
      {
        id: 'category-1',
        topic: 'JavaScript',
        description: 'Learn core JS concepts and patterns.',
        topicsCount: 25,
        topicsCompleteCount: 14,
        progress: 0.56,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
