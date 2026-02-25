import { Component, input } from '@angular/core';
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
}
