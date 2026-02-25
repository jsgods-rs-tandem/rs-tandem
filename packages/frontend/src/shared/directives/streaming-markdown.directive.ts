import { Directive, ElementRef, OnDestroy, inject, input, OnInit } from '@angular/core';
import DOMPurify from 'dompurify';
import { ChatResponse } from 'ollama';
import * as smd from 'streaming-markdown';

@Directive({
  selector: '[appStreamingMarkdown]',
  standalone: true,
})
export class StreamingMarkdownDirective implements OnDestroy, OnInit {
  readonly stream = input.required<AsyncIterable<ChatResponse>>();
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = smd.default_renderer(this.el.nativeElement);
  private readonly parser = smd.parser(this.renderer);

  ngOnInit() {
    void this.writeStream();
  }

  ngOnDestroy() {
    this.end();
  }

  private async writeStream() {
    const mdStream = this.stream();

    for await (const part of mdStream) {
      this.write(part.message.content);
    }
  }

  private write(chunk: string) {
    const sanitized = DOMPurify.sanitize(chunk);

    if (DOMPurify.removed.length) {
      this.end();
      return;
    }

    smd.parser_write(this.parser, sanitized);
  }

  private end() {
    smd.parser_end(this.parser);
  }
}
