import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverComponent } from './popover.component';

describe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', 'popover-1');
    fixture.componentRef.setInput('anchorId', 'anchor-1');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
