import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ModalService } from './modal.service';
import { Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ModalService', () => {
  let service: ModalService;
  let routerEvents$: Subject<NavigationEnd | NavigationStart>;

  beforeEach(() => {
    routerEvents$ = new Subject();

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
      ],
    });

    service = TestBed.inject(ModalService);
  });

  it('should be created with no active modal', () => {
    expect(service).toBeTruthy();
    expect(service.activeModal()).toBeNull();
  });

  describe('open', () => {
    it('should set modal config', () => {
      service.open({ title: 'Title', message: 'Message' });
      expect(service.activeModal()?.title).toBe('Title');
      expect(service.activeModal()?.message).toBe('Message');
    });

    it('should accept string message', () => {
      service.open({ title: 'T', message: 'Single' });
      expect(service.activeModal()?.message).toBe('Single');
    });

    it('should accept array message', () => {
      service.open({ title: 'T', message: ['A', 'B'] });
      expect(service.activeModal()?.message).toEqual(['A', 'B']);
    });

    it('should accept optional buttonText and icon', () => {
      service.open({
        title: 'T',
        message: 'M',
        buttonText: 'Close',
        icon: 'moon',
      });

      expect(service.activeModal()?.buttonText).toBe('Close');
      expect(service.activeModal()?.icon).toBe('moon');
    });

    it('should replace previous modal when opened again', () => {
      service.open({ title: 'First', message: 'M1' });
      service.open({ title: 'Second', message: 'M2' });

      expect(service.activeModal()?.title).toBe('Second');
    });
  });

  describe('close', () => {
    it('should clear modal and invoke onClose callback', () => {
      const onClose = vi.fn();
      service.open({ title: 'T', message: 'M', onClose });

      service.close();

      expect(service.activeModal()).toBeNull();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('should clear modal safely when no onClose provided', () => {
      service.open({ title: 'T', message: 'M' });
      service.close();

      expect(service.activeModal()).toBeNull();
    });

    it('should be safe to call when no modal is open', () => {
      expect(() => {
        service.close();
      }).not.toThrow();
      expect(service.activeModal()).toBeNull();
    });
  });

  describe('dismiss', () => {
    it('should clear modal without invoking onClose', () => {
      const onClose = vi.fn();
      service.open({ title: 'T', message: 'M', onClose });

      service.dismiss();

      expect(service.activeModal()).toBeNull();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('auto-dismiss on navigation', () => {
    it('should dismiss on NavigationEnd', () => {
      service.open({ title: 'T', message: 'M' });

      routerEvents$.next(new NavigationEnd(1, '/', '/'));

      expect(service.activeModal()).toBeNull();
    });

    it('should not dismiss on NavigationStart', () => {
      service.open({ title: 'T', message: 'M' });

      routerEvents$.next(new NavigationStart(1, '/next'));

      expect(service.activeModal()).not.toBeNull();
    });

    it('should not invoke onClose on navigation dismiss', () => {
      const onClose = vi.fn();
      service.open({ title: 'T', message: 'M', onClose });

      routerEvents$.next(new NavigationEnd(1, '/', '/'));

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
