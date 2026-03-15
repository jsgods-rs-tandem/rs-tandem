import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { highlightElement } from 'prismjs';

import 'prismjs/components/prism-javascript';

@Component({
  selector: 'app-code-snippet',
  imports: [],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  standalone: true,
})
export class CodeSnippetComponent {
  readonly code = input.required<string>();

  private readonly injector = inject(Injector);

  private readonly codeEl = viewChild.required<ElementRef<HTMLElement>>('codeEl');

  private lastHighlightedCode?: string;

  constructor() {
    effect(
      () => {
        const currentCode = this.code();
        if (!currentCode || currentCode === this.lastHighlightedCode) {
          return;
        }

        afterNextRender(
          () => {
            const latestCode = this.code();
            if (!latestCode || latestCode === this.lastHighlightedCode) {
              return;
            }

            const element = this.codeEl().nativeElement;
            element.textContent = latestCode;
            highlightElement(element);
            this.lastHighlightedCode = latestCode;
          },
          { injector: this.injector },
        );
      },
      { injector: this.injector },
    );
  }
}
