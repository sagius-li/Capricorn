import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigService } from '../core/services/config.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarItems: Array<any> = [];

  constructor(private config: ConfigService, private router: Router) {}

  ngOnInit() {
    this.sidebarItems = this.config.getConfig('sidebarItems', []);
  }

  isFocusedItem(item: any) {
    const retVal = this.router.url === '/app/' + item.path;
    return retVal;
  }
}
