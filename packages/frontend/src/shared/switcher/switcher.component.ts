import { NgClass } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-switcher',
  imports: [NgClass],
  templateUrl: './switcher.component.html',
  styleUrl: './switcher.component.scss',
})
export class SwitcherComponent implements OnInit {
  initialStatus = input<boolean>(false);

  protected isActive = signal(false);
  protected toggledEvent = output<boolean>();

  ngOnInit() {
    this.isActive.set(this.initialStatus());
  }

  protected toggle() {
    this.isActive.set(!this.isActive());
    this.toggledEvent.emit(this.isActive());
  }
}
