import { Component, ElementRef, computed, input, output, signal } from '@angular/core';

import { IconComponent } from '@/shared/ui';

import { computePlaceholder } from './select.utilities';

import type { Option } from './select.types';

@Component({
  selector: 'app-select',
  host: {
    '(document:click)': '_onDocumentClick($event)',
    '(document:keydown.escape)': '_onEscapePressed()',
  },
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  standalone: true,
})
export class SelectComponent {
  readonly label = input<string>();
  readonly placeholder = input<string>();
  readonly options = input<Option[]>([]);
  readonly selectedOptionValues = input<Option['value'][]>([]);

  readonly selectedOptionValuesChange = output<Option['value'][]>();

  readonly isOpen = signal(false);

  protected readonly _labelId = crypto.randomUUID();
  protected readonly _listboxId = crypto.randomUUID();
  protected _isOptionSelected = computed(
    () => (value: Option['value']) => this.selectedOptionValues().includes(value),
  );

  private readonly _elementRef: ElementRef<HTMLDivElement>;

  computedPlaceholder = computed(() =>
    computePlaceholder(this.options(), this.selectedOptionValues(), this.placeholder()),
  );

  constructor(element: ElementRef<HTMLDivElement>) {
    this._elementRef = element;
  }

  protected _onOptionChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const selectedOptionValues = this.selectedOptionValues();
    const { value, checked } = event.target;

    const nextSelectedOptionValues = checked
      ? [...selectedOptionValues, value]
      : selectedOptionValues.filter((v) => v !== value);
    this.selectedOptionValuesChange.emit(nextSelectedOptionValues);
  }

  protected _onClick() {
    this._onOpenChange();
  }

  protected _onKeydown(event: KeyboardEvent) {
    if (event.code !== 'Space') {
      return;
    }

    event.preventDefault();
    this._onOpenChange();
  }

  protected _onDocumentClick({ target }: MouseEvent) {
    if (!(target instanceof HTMLElement || target instanceof SVGElement)) {
      return;
    }

    const isClickedInside = this._elementRef.nativeElement.contains(target);
    if (isClickedInside) {
      return;
    }

    this.isOpen.set(false);
  }

  protected _onEscapePressed() {
    this.isOpen.set(false);
  }

  private _onOpenChange() {
    this.isOpen.update((previousState) => !previousState);
  }
}
