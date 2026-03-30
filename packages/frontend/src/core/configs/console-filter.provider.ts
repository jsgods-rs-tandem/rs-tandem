import { provideAppInitializer } from '@angular/core';

/**
 * Prevents 'AbortError' logging in the console when skipping transitions
 * during fragment navigation or within the quiz section.
 */
export const provideConsoleFilter = () => {
  return provideAppInitializer(() => {
    const originalError = console.error;

    console.error = (...errors: unknown[]) => {
      const firstError = errors[0];

      if (firstError instanceof Error) {
        const message = firstError.message;
        const name = firstError.name;

        const isAbortError =
          (name.includes('AbortError') || message.includes('AbortError')) &&
          message.includes('skipped');
        if (isAbortError) {
          return;
        }
      }

      originalError.apply(console, errors);
    };
  });
};
