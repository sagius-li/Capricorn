import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SwapService } from './core/services/swap.service';
import { UtilsService } from './core/services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Capricorn';

  constructor(private router: Router, private swap: SwapService, private utils: UtilsService) {
    window.onresize = e => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    const loginUser = localStorage.getItem(this.utils.localStorageLoginUser);
    if (loginUser) {
      const pathName: string = window.location.pathname;
      if (pathName !== '/') {
        this.router.navigate(['/splash'], { queryParams: { path: pathName } });
      } else {
        this.router.navigate(['/splash']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
