import { Directive, ElementRef, OnDestroy } from '@angular/core';
import DOMPurify from 'dompurify';
import * as smd from 'streaming-markdown';

@Directive({
  selector: '[appStreamingMarkdown]',
  exportAs: 'streamMd',
})
export class StreamingMarkdownDirective implements OnDestroy {
  private renderer: smd.Default_Renderer;
  private parser: smd.Parser;
  private el: ElementRef<HTMLElement>;

  constructor(element: ElementRef<HTMLElement>) {
    this.el = element;
    this.renderer = smd.default_renderer(this.el.nativeElement);
    this.parser = smd.parser(this.renderer);
  }

  write(chunk: string) {
    const sanitized = DOMPurify.sanitize(chunk);

    if (DOMPurify.removed.length) {
      this.end();
      return;
    }

    smd.parser_write(this.parser, sanitized);
  }

  end() {
    smd.parser_end(this.parser);
  }

  ngOnDestroy() {
    this.end();
  }
}
