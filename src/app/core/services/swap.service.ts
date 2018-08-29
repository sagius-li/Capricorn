import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwapService {
  @Output()
  windowResize: EventEmitter<string> = new EventEmitter();

  constructor() {}

  resizeWindow(size: string) {
    this.windowResize.emit(size);
  }

  verifyWindowSize() {
    if (window.innerWidth < 600) {
      this.resizeWindow('xs');
    } else if (window.innerWidth <= 960 && window.innerWidth >= 600) {
      this.resizeWindow('sm');
    } else if (window.innerWidth >= 960 && window.innerWidth < 1600) {
      this.resizeWindow('md');
    } else {
      this.resizeWindow('lg');
    }
  }
}
