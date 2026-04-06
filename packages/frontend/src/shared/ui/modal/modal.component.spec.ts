import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ModalComponent } from './modal.component';
import { IconName } from '../icon/Icon.types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `
    <app-modal
      [title]="title()"
      [message]="message()"
      [buttonText]="buttonText()"
      [icon]="icon()"
      (closed)="onClosed()"
    />
  `,
})
class TestHostComponent {
  title = signal('Test Title');
  message = signal<string | string[]>('Test message');
  buttonText = signal('OK');
  icon = signal<IconName>('info-outline');
  onClosed = vi.fn();
}

describe('ModalComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(element.querySelector('[data-testid="modal"]')).toBeTruthy();
  });

  describe('rendering', () => {
    it('should render title', () => {
      const titleElement = element.querySelector('[data-testid="modal-title"]')!;
      expect(titleElement.textContent.trim()).toBe('Test Title');
    });

    it('should update title when input changes', () => {
      host.title.set('Updated Title');
      fixture.detectChanges();

      const titleElement = element.querySelector('[data-testid="modal-title"]')!;
      expect(titleElement.textContent.trim()).toBe('Updated Title');
    });

    it('should render string message as paragraph', () => {
      const messageElement = element.querySelector('p[data-testid="modal-message"]');
      expect(messageElement).toBeTruthy();
      expect(messageElement!.textContent.trim()).toBe('Test message');
    });

    it('should render array message as list items', () => {
      host.message.set(['Error 1', 'Error 2', 'Error 3']);
      fixture.detectChanges();

      const items = element.querySelectorAll('li[data-testid="modal-message"]');
      expect(items.length).toBe(3);
      expect(items[0]!.textContent.trim()).toBe('Error 1');
      expect(items[1]!.textContent.trim()).toBe('Error 2');
      expect(items[2]!.textContent.trim()).toBe('Error 3');
    });

    it('should not render list when message is a string', () => {
      const list = element.querySelector('.modal__messages');
      expect(list).toBeNull();
    });

    it('should render button with default text "OK"', () => {
      const button = element.querySelector('[data-testid="modal-action-btn"]')!;
      expect(button.textContent.trim()).toContain('OK');
    });

    it('should render button with custom text', () => {
      host.buttonText.set('Got it');
      fixture.detectChanges();

      const button = element.querySelector('[data-testid="modal-action-btn"]')!;
      expect(button.textContent.trim()).toContain('Got it');
    });
  });

  describe('accessibility', () => {
    it('should have role="dialog" and aria-modal="true"', () => {
      const dialog = element.querySelector('[data-testid="modal"]')!;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should link aria-labelledby to the title element', () => {
      const dialog = element.querySelector('[data-testid="modal"]')!;
      const titleElement = element.querySelector('[data-testid="modal-title"]')!;

      const labelledBy = dialog.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      expect(titleElement.id).toBe(labelledBy);
    });

    it('should have aria-hidden on backdrop', () => {
      const backdrop = element.querySelector('[data-testid="modal-backdrop"]')!;
      expect(backdrop.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('close interactions', () => {
    it('should emit closed when action button is clicked', () => {
      const button = element.querySelector<HTMLElement>('[data-testid="modal-action-btn"]')!;
      button.click();

      expect(host.onClosed).toHaveBeenCalled();
    });

    it('should emit closed when close icon button is clicked', () => {
      const closeButton = element.querySelector<HTMLElement>('[data-testid="modal-close-btn"]')!;
      closeButton.click();

      expect(host.onClosed).toHaveBeenCalled();
    });

    it('should emit closed when backdrop is clicked', () => {
      const backdrop = element.querySelector<HTMLElement>('[data-testid="modal-backdrop"]')!;
      backdrop.click();

      expect(host.onClosed).toHaveBeenCalled();
    });

    it('should emit closed on Escape key press', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(host.onClosed).toHaveBeenCalled();
    });
  });

  describe('unique IDs', () => {
    it('should generate unique modal title IDs across instances', () => {
      const directFixture = TestBed.createComponent(ModalComponent);
      directFixture.detectChanges();
      const id1 = directFixture.componentInstance.modalTitleId;

      const directFixture2 = TestBed.createComponent(ModalComponent);
      directFixture2.detectChanges();
      const id2 = directFixture2.componentInstance.modalTitleId;

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^modal-title-\d+$/);
    });
  });
});
