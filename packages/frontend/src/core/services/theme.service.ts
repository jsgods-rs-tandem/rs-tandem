import { effect, inject, Injectable, signal } from '@angular/core';
import { Theme } from '@/shared/types';
import { isTheme } from '../guards/is-theme';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storage = inject(LocalStorageService);
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
    this.storage.setItem(this.STORAGE_KEY, theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = this.storage.getItem(this.STORAGE_KEY);
    if (isTheme(savedTheme)) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
