import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSettingsComponent } from './ai-settings.component';
import { provideAppTranslocoTesting } from '@/testing/provide-transloco-testing';

describe('AiSettingsComponent', () => {
  let component: AiSettingsComponent;
  let fixture: ComponentFixture<AiSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSettingsComponent],
      providers: [provideAppTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AiSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
