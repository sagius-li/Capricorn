import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '../core/services/config.service';
import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  size = 'expanded';
  icon = 'chevron_left';

  @Output()
  resized = new EventEmitter<string>();

  sidebarItems: Array<any> = [];

  constructor(
    private config: ConfigService,
    private router: Router,
    private swap: SwapService
  ) {
    this.swap.windowResize.subscribe((size: string) => {
      switch (size) {
        case 'xs':
        case 'sm':
          this.size = 'collapsed';
          break;
        case 'md':
        case 'lg':
        default:
          this.size = 'expanded';
          break;
      }
    });
  }

  ngOnInit() {
    this.sidebarItems = this.config.getConfig('sidebarItems', []);
  }

  isFocusedItem(item: any) {
    const retVal = this.router.url === '/app/' + item.path;
    return retVal;
  }

  resize() {
    if (this.size === 'expanded') {
      this.size = 'collapsed';
      this.icon = 'chevron_right';
      this.resized.emit(this.size);
    } else if (this.size === 'collapsed') {
      this.size = 'expanded';
      this.icon = 'chevron_left';
      this.resized.emit(this.size);
    }
  }
}
