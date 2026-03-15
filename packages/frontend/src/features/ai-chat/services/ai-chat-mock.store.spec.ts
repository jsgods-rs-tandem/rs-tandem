import { TestBed } from '@angular/core/testing';

import { AiChatMockStore } from './ai-chat-mock.store';

describe('AiChatMockStore', () => {
  let store: AiChatMockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiChatMockStore],
    });
    store = TestBed.inject(AiChatMockStore);
    Object.defineProperty(store, 'llm', { value: { sendPrompt: vi.fn() } });
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should add a user message and update status to pending', () => {
    const text = 'Hello, AI!';
    store.sendPrompt(text);

    expect(store.messages()).toEqual([{ role: 'user', content: text }]);
    expect(store.status()).toBe('pending');
  });
});
