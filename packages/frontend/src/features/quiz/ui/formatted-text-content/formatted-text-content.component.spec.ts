import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedTextContentComponent } from './formatted-text-content.component';

describe('FormattedTextContentComponent', () => {
  let component: FormattedTextContentComponent;
  let fixture: ComponentFixture<FormattedTextContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormattedTextContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormattedTextContentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'text');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
