import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

import { ThemeService } from '@/core/services/theme.service';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

import { CodeEditorPageComponent } from './code-editor-page.component';
import { ChallengesService } from '../../services';

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
        provideAppTranslocoTesting(),
        { provide: ThemeService, useValue: themeServiceMock },
        {
          provide: ChallengesService,
          useValue: {
            codeEditor: () => null,
            loading: () => ({
              categories: false,
              category: false,
              codeEditor: false,
              solution: false,
            }),
            reloadPage: () => void 0,
            postTopicStatus: () => void 0,
          } as unknown as ChallengesService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditorPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categoryId', 'test-category-id');
    fixture.componentRef.setInput('topicId', 'test-topic-id');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
