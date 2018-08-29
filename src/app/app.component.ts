import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SwapService } from './core/services/swap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Capricorn';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private swap: SwapService
  ) {
    window.onresize = e => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    const pathName: string = window.location.pathname;
    if (pathName !== '/') {
      this.router.navigate([''], { queryParams: { path: pathName } });
    }
  }
}
