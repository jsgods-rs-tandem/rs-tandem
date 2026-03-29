import { NgClass } from '@angular/common';
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-switcher',
  imports: [NgClass],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent {
  protected isActive = signal(false);
  toggledEvent = output<boolean>();

  protected toggle() {
    this.isActive.set(!this.isActive());
    this.toggledEvent.emit(this.isActive());
  }
}
