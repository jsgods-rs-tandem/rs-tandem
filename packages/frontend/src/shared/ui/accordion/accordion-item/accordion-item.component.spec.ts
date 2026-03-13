import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionItemComponent } from './accordion-item.component';
import { By } from '@angular/platform-browser';

const mockData = [
  {
    title: 'Title 1',
    description: 'Description 1',
  },
];

describe('AccordionItemComponent', () => {
  let component: AccordionItemComponent;
  let fixture: ComponentFixture<AccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', mockData[0]?.title);
    fixture.componentRef.setInput('description', mockData[0]?.description);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the isOpen state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);

    component.toggle();
    expect(component.isOpen()).toBe(true);

    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle the isOpen state when the header button is clicked', () => {
    expect(component.isOpen()).toBe(false);
    const headerButton = fixture.debugElement.query(By.css('.accordion-item__header'));

    headerButton.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    headerButton.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.isOpen()).toBe(false);
  });
});
