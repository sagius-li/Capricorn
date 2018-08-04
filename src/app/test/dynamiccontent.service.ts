import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector
} from '@angular/core';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DynamicContentService {
  // Reference to our Portal.
  // This is the portal we'll use to attach our LoadingSpinnerComponent.
  private loadingSpinnerPortal: ComponentPortal<any>;

  // Reference to our Portal Host.
  // We use DOMPortalHost as we'll be using document.body as our anchor.
  private portalHost: DomPortalHost;

  // Inject the dependencies needed by the DOMPortalHost constructor
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  reveal(comp: any, outlet: any) {
    // Attach the Portal to the PortalHost.
    const portal = new ComponentPortal(comp);

    // Create a PortalHost with document.body as its anchor element
    const portalHost = new DomPortalHost(
      outlet,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    portalHost.attach(portal);

    return portalHost;
  }

  hide(portalHost: DomPortalHost) {
    // Detach the Portal from the PortalHost
    portalHost.detach();
  }
}
