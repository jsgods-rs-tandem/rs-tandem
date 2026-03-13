import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';

const mockData = [
  {
    title: 'Title 1',
    description: 'Description 1',
  },
  {
    title: 'Title 2',
    description: 'Description 2',
  },
  {
    title: 'Title 3',
    description: 'Description 3',
  },
];

@Component({
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <app-accordion [multi]="isMulti">
      @for (item of data; track item.title; let isFirst = $first) {
        <app-accordion-item
          [title]="item.title"
          [description]="item.description"
          [isOpen]="isFirst"
        />
      }
    </app-accordion>
  `,
})
class TestHostComponent {
  isMulti = false;
  data = mockData;

  @ViewChild(AccordionComponent) accordionComponent!: AccordionComponent;
}

describe('AccordionComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should create the accordion and register content children', () => {
    fixture.detectChanges();
    expect(hostComponent.accordionComponent).toBeTruthy();
    expect(hostComponent.accordionComponent.items().length).toBe(mockData.length);
  });

  it('should close other item when opening a new item when multi = false', () => {
    fixture.detectChanges();
    const items = hostComponent.accordionComponent.items();
    const firstItem = items[0];
    const secondItem = items[1];

    expect(firstItem?.isOpen()).toBe(true);
    expect(secondItem?.isOpen()).toBe(false);

    secondItem?.isOpen.set(true);
    fixture.detectChanges();

    expect(secondItem?.isOpen()).toBe(true);
    expect(firstItem?.isOpen()).toBe(false);
  });

  it('should allow multiple open items when multi = true', () => {
    hostComponent.isMulti = true;
    fixture.detectChanges();

    const items = hostComponent.accordionComponent.items();
    const firstItem = items[0];
    const secondItem = items[1];

    secondItem?.isOpen.set(true);
    fixture.detectChanges();

    expect(firstItem?.isOpen()).toBe(true);
    expect(secondItem?.isOpen()).toBe(true);
  });

  it('should handle the case when all accordion items are closed', () => {
    fixture.detectChanges();

    const items = hostComponent.accordionComponent.items();
    const firstItem = items[0];

    expect(firstItem?.isOpen()).toBe(true);

    firstItem?.isOpen.set(false);
    fixture.detectChanges();

    expect(firstItem?.isOpen()).toBe(false);
  });
});
