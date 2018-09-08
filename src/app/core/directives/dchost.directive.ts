import { Directive, ViewContainerRef, Input } from '@angular/core';

/**
 * Placeholder to indicate, that dynamic content can be created
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dcHost]'
})
export class DchostDirective {
  /** Name of the placeholder */
  // tslint:disable-next-line:no-input-rename
  @Input('dcHost')
  hostName: string;

  /** @ignore */
  constructor(public viewContainerRef: ViewContainerRef) {}
}
