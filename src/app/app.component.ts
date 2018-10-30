import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SwapService } from './core/services/swap.service';
import { UtilsService } from './core/services/utils.service';
import { AuthService, AuthMode } from './core/services/auth.service';
import { AdalService } from 'adal-angular4';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Capricorn';

  constructor(
    private router: Router,
    private swap: SwapService,
    private utils: UtilsService,
    private auth: AuthService
  ) {
    window.onresize = e => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    this.auth.init();

    const loginMode = localStorage.getItem(this.utils.localStorageLoginMode);
    let loginUser = localStorage.getItem(this.utils.localStorageLoginUser);

    this.auth.login(AuthMode[loginMode]);

    if (loginMode === AuthMode.azure && !loginUser) {
      this.auth.setAzureLoginUser();
      loginUser = localStorage.getItem(this.utils.localStorageLoginUser);
    }

    if (loginMode === AuthMode.azure || loginUser) {
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
