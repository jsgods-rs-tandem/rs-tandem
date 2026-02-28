import { Component, input, model, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { InputType } from './input.types';

let nextUniqueId = 0;

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  value = model<string>('');

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
}
