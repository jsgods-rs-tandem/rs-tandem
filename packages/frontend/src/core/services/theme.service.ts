import { effect, Injectable, signal } from '@angular/core';
import { Theme, isTheme } from '@/shared/types';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'user-theme';
  public readonly theme = signal<Theme>(this.getInitialTheme());
  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      this.syncTheme(currentTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update((theme) => (theme === 'light' ? 'dark' : 'light'));
  }

  private syncTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('color-scheme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    if (isTheme(savedTheme)) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
