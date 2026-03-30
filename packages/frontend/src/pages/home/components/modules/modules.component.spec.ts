import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesComponent } from './modules.component';
import { provideRouter } from '@angular/router';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('ModulesComponent', () => {
  let component: ModulesComponent;
  let fixture: ComponentFixture<ModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulesComponent],
      providers: [provideRouter([]), provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
