import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSnippetComponent } from './code-snippet.component';

describe('CodeSnippetComponent', () => {
  let component: CodeSnippetComponent;
  let fixture: ComponentFixture<CodeSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeSnippetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeSnippetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('code', 'const sum = (a, b) => a + b;');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
