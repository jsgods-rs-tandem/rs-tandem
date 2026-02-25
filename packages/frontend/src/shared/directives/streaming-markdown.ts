import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import DOMPurify from 'dompurify';
import * as smd from 'streaming-markdown';

@Directive({
  selector: '[appStreamingMarkdown]',
  exportAs: 'streamMd',
})
export class StreamingMarkdownDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = smd.default_renderer(this.el.nativeElement);
  private readonly parser = smd.parser(this.renderer);

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
