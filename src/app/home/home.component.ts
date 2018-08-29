import { Component, OnInit } from '@angular/core';

import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sidebarSize = 260;

  constructor(private swap: SwapService) {}

  ngOnInit() {
    this.swap.windowResize.subscribe((size: string) => {
      switch (size) {
        case 'xs':
        case 'sm':
          this.sidebarSize = 60;
          break;
        case 'md':
        case 'lg':
        default:
          this.sidebarSize = 260;
          break;
      }
    });
  }

  onSidebarResize($event) {
    if ($event === 'expanded') {
      this.sidebarSize = 260;
    } else if ($event === 'collapsed') {
      this.sidebarSize = 60;
    }
  }
}
