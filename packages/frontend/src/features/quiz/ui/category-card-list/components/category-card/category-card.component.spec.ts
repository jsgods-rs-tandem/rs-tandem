import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  let component: CategoryCardComponent;
  let fixture: ComponentFixture<CategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'category-1');
    fixture.componentRef.setInput('heading', 'JavaScript');
    fixture.componentRef.setInput('description', 'Learn core JS concepts and patterns.');
    fixture.componentRef.setInput('topicsCount', 25);
    fixture.componentRef.setInput('topicsCompleteCount', 14);
    fixture.componentRef.setInput('topicsProgress', 0.56);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
