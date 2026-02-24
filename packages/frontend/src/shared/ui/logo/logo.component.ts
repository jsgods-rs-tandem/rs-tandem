import { Component, computed, input } from '@angular/core';
import { LogoSize } from './logo.types';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  prefix = '>_';
  text = 'RS Tandem';
  size = input<LogoSize>('m');

  showPrefix = input<boolean>(true);
  showText = input<boolean>(true);

  displayPrefix = computed<boolean>(() => this.showPrefix() || !this.showText());
  displayText = computed<boolean>(() => this.showText() || !this.showText());
}
