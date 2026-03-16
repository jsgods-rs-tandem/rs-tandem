import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinComponent } from './spin.component';

describe('SpinComponent', () => {
  let component: SpinComponent;
  let fixture: ComponentFixture<SpinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default classes and update when inputs change', async () => {
    fixture.detectChanges();

    const element = document.querySelector('[data-testid="spin"]');
    if (!(element instanceof HTMLSpanElement)) {
      throw new Error('Spin root element not found');
    }

    expect(element.getAttribute('role')).toBe('status');
    expect(element.classList.contains('spin_size_medium')).toBe(true);
    expect(element.classList.contains('spin_theme_dark')).toBe(true);
    expect(element.textContent).toContain('Loading');

    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('theme', 'light');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.classList.contains('spin_size_large')).toBe(true);
    expect(element.classList.contains('spin_theme_light')).toBe(true);
  });
});
