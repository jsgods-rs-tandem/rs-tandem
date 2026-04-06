import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ChallengePreviewCardComponent } from './challenge-preview-card.component';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('ChallengePreviewCardComponent', () => {
  let component: ChallengePreviewCardComponent;
  let fixture: ComponentFixture<ChallengePreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengePreviewCardComponent],
      providers: [provideRouter([]), provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengePreviewCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'core_001_map');
    fixture.componentRef.setInput('heading', 'Array.prototype.map');
    fixture.componentRef.setInput(
      'description',
      'Transform arrays manually. Recreate .map() to project data into a new array without mutating the original',
    );
    fixture.componentRef.setInput('difficulty', 'easy');
    fixture.componentRef.setInput('inProgress', true);
    fixture.componentRef.setInput('isComplete', false);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
