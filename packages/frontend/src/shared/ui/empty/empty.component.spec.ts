import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyComponent } from './empty.component';

describe('EmptyComponent', () => {
  let component: EmptyComponent;
  let fixture: ComponentFixture<EmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyComponent);
    fixture.componentRef.setInput('heading', 'Heading');
    fixture.componentRef.setInput('description', 'Description');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
