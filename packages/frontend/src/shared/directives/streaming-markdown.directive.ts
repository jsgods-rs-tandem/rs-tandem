import { Directive, ElementRef, OnDestroy, inject, input, OnInit, output } from '@angular/core';
import DOMPurify from 'dompurify';
import { ChatResponse } from 'ollama';
import * as smd from 'streaming-markdown';

@Directive({
  selector: '[appStreamingMarkdown]',
})
export class StreamingMarkdownDirective implements OnDestroy, OnInit {
  readonly markdown = input.required<AsyncIterable<ChatResponse> | string>({
    alias: 'appStreamingMarkdown',
  });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = smd.default_renderer(this.el.nativeElement);
  private readonly parser = smd.parser(this.renderer);
  readonly streamingMarkdownErrorEvent = output<unknown>();

  ngOnInit() {
    const markdown = this.markdown();

    if (typeof markdown === 'string') {
      this.write(markdown);
    } else {
      void this.writeStream(markdown);
    }
  }

  ngOnDestroy() {
    this.end();
  }

  private async writeStream(mdStream: AsyncIterable<ChatResponse>) {
    try {
      for await (const part of mdStream) {
        this.write(part.message.content);
      }
    } catch (error) {
      console.error(error);
      this.streamingMarkdownErrorEvent.emit(error);
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
