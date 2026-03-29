import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBreakComponent } from './line-break.component';

describe('LineBreakComponent', () => {
  let component: LineBreakComponent;
  let fixture: ComponentFixture<LineBreakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineBreakComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineBreakComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
