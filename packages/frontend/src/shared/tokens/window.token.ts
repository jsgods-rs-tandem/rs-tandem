import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window & typeof globalThis>('Global window object', {
  factory: () => {
    if (typeof globalThis.window === 'undefined') throw new Error('Window is not available');
    return globalThis.window;
  },
});
