import { Directive } from '@angular/core';

@Directive({
  selector: '[appCardFooter]',
})
export class CardFooterDirective {
  readonly isMarker = true;
}
