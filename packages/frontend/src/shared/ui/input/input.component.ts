import { Component, input, computed, forwardRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import type { InputType } from './input.types';

let nextUniqueId = 0;

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  imports: [NgClass],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  value = '';

  name = input<string>();
  autoComplete = input<string>('on');
  inputId = input<string>(`app-input-${String(nextUniqueId++)}`);
  targetType = input<InputType>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  label = input<string>('');
  errorText = input<string>('');
  hasError = input<boolean>(false);

  computedName = computed(() => this.name() ?? this.inputId());

  dataTestId = input<string>('');

  onChange: (value: string) => void = () => {
    /* noop */
  };
  onTouched: () => void = () => {
    /* noop */
  };

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(function_: (value: string) => void): void {
    this.onChange = function_;
  }

  registerOnTouched(function_: () => void): void {
    this.onTouched = function_;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
