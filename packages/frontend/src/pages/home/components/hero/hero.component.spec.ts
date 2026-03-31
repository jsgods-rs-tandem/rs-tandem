import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroComponent } from './hero.component';
import { provideRouter } from '@angular/router';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideRouter([]), provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
