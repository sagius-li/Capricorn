import { Component, OnInit } from '@angular/core';

import { ConfigService } from '../core/services/config.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarItems: Array<any> = [];

  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.sidebarItems = this.config.getConfig('sidebarItems', []);
  }
}
