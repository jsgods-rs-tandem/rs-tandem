import { Component, computed, input } from '@angular/core';

import { CodeComponent } from '@/shared/ui';

import { formatTextWithCode } from './formatted-text-content.utilities';

@Component({
  selector: 'app-formatted-text-content',
  imports: [CodeComponent],
  templateUrl: './formatted-text-content.component.html',
  styleUrl: './formatted-text-content.component.scss',
  standalone: true,
})
export class FormattedTextContentComponent {
  readonly text = input.required<string>();
  readonly codeColor = input<ReturnType<CodeComponent['color']>>('primary');

  protected readonly _formattedText = computed(() => formatTextWithCode(this.text()));
}
