import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdalService } from 'adal-angular4';

import { SwapService } from './core/services/swap.service';
import { UtilsService } from './core/services/utils.service';
import { AuthService, AuthMode } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Capricorn';

  private adalConfig = {
    tenant: 'selectedat.onmicrosoft.com',
    clientId: '705c2d51-0345-4fff-a483-0bdf39bcc673',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    endpoints: {
      'https://idcloudeditionservice2.azurewebsites.net': '426bafb3-9244-4000-bb89-461908fe0a35'
    }
  };

  constructor(
    private router: Router,
    private swap: SwapService,
    private utils: UtilsService,
    private adal: AdalService
  ) {
    this.adal.init(this.adalConfig);

    window.onresize = e => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    this.adal.handleWindowCallback();

    const loginMode = localStorage.getItem(this.utils.localStorageLoginMode);
    const loginUser = localStorage.getItem(this.utils.localStorageLoginUser);

    if (loginMode === AuthMode.azure) {
      if (!this.adal.userInfo.authenticated) {
        this.adal.login();
      }
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
