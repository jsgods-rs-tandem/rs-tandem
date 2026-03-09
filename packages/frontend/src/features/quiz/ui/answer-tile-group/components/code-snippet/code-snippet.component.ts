import { AfterViewInit, Component, input } from '@angular/core';
import { highlightAll } from 'prismjs';

import 'prismjs/components/prism-javascript';

@Component({
  selector: 'app-code-snippet',
  imports: [],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  standalone: true,
})
export class CodeSnippetComponent implements AfterViewInit {
  readonly code = input.required<string>();

  ngAfterViewInit() {
    highlightAll();
  }
}
