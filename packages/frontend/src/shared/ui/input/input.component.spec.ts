import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [InputComponent],
  template: `
    <app-input
      [(value)]="value"
      [label]="label()"
      [errorText]="error()"
      [name]="name()"
      [autoComplete]="autoComplete()"
      [required]="required()"
    />
  `,
})
class TestComponent {
  value = signal('initial text');
  label = signal('Test Label');
  error = signal('');
  name = signal('testEmail');
  autoComplete = signal('email');
  required = signal(false);
}

describe('InputComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, InputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    element = fixture.nativeElement as HTMLElement;
    inputElement = element.querySelector('input')!;
    expect(inputElement).not.toBeNull();
  });

  it('should create instance', () => {
    expect(component).toBeTruthy();
  });

  describe('Label', () => {
    it('should render correctly', () => {
      const labelElement = element.querySelector('label');

      expect(labelElement?.textContent.trim()).toContain('Test Label');
    });
  });

  describe('ErrorText', () => {
    it("shouldn't render errorText by default", () => {
      const errorElement = element.querySelector('.input-error-text');

      expect(errorElement).toBeNull();
    });

    it('should render when error is set', () => {
      component.error.set('Required field');
      fixture.detectChanges();

      const errorElement = element.querySelector('.input-error-text')!;

      expect(errorElement.textContent.trim()).toBe('Required field');
    });
  });

  describe('Attributes', () => {
    it('should generate unique input "id" and label "for" attributes', () => {
      const labelElement = element.querySelector('label')!;
      const inputId = inputElement.getAttribute('id');
      const labelFor = labelElement.getAttribute('for');

      expect(inputId).toMatch(/^app-input-\d+$/);
      expect(labelFor).toBe(inputId);
    });

    it('should have correct "name" attribute', () => {
      fixture.detectChanges();

      expect(inputElement.getAttribute('name')).toBe('testEmail');
    });

    it('should have correct "autocomplete" attribute', () => {
      expect(inputElement.getAttribute('autocomplete')).toBe('email');
    });

    it('should have correct "required" attribute', () => {
      expect(inputElement.hasAttribute('required')).toBe(false);

      component.required.set(true);
      fixture.detectChanges();

      expect(inputElement.hasAttribute('required')).toBe(true);
    });
  });

  describe('Model Binding', () => {
    it('should update value when input changes', () => {
      expect(inputElement.value).toBe('initial text');

      inputElement.value = 'new text from user';
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.value()).toBe('new text from user');
    });

    it('should render required asterisk when "required" attribute is true', () => {
      component.required.set(true);
      fixture.detectChanges();

      const asterisk = element.querySelector('.required-asterisk')!;

      expect(asterisk).toBeTruthy();
      expect(asterisk.textContent.trim()).toBe('*');
    });
  });
});
