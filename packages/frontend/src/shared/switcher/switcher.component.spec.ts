import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitcherComponent } from './switcher.component';

describe('SwitcherComponent', () => {
  let component: SwitcherComponent;
  let fixture: ComponentFixture<SwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitcherComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
