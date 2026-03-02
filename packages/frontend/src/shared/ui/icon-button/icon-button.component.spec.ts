import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconButtonComponent);
    fixture.componentRef.setInput('icon', 'test-icon');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
