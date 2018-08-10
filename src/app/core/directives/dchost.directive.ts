import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dcHost]'
})
export class DchostDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('dcHost')
  hostName: string;

  constructor(public viewContainerRef: ViewContainerRef) {}
}
