import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

import { ThemeService } from '@/core/services/theme.service';

import { CodeEditorPageComponent } from './code-editor-page.component';

describe('CodeEditorPageComponent', () => {
  let component: CodeEditorPageComponent;
  let fixture: ComponentFixture<CodeEditorPageComponent>;
  const themeServiceMock = {
    theme: signal<'light' | 'dark'>('light'),
    toggleTheme: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditorPageComponent],
      providers: [
        provideRouter([]),
        provideMonacoEditor(),
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
