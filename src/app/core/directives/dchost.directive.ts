import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dcHost]'
})
export class DchostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
