import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError, empty } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { AdalService } from 'adal-angular4';

import { DSResource, DSResourceSet } from '../models/resource.model';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';

export enum AuthMode {
  basic = 'basic',
  windows = 'windows',
  azure = 'azure'
}

export class LoginUser {
  DisplayName?: string;
  ObjectID?: string;
  AccountName?: string;
  Token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _authMode: AuthMode;
  get authMode() {
    return this._authMode;
  }

  _loginUser: LoginUser;
  get loginUser() {
    return this._loginUser;
  }

  private adalConfig = {
    tenant: 'selectedat.onmicrosoft.com',
    clientId: '705c2d51-0345-4fff-a483-0bdf39bcc673',
    redirectUri: 'http://localhost:4200',
    // postLogoutRedirectUri: 'http://localhost:4200/login',
    endpoints: {
      'https://idcloudeditionservice2.azurewebsites.net': '426bafb3-9244-4000-bb89-461908fe0a35'
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private config: ConfigService,
    private utils: UtilsService,
    private adal: AdalService
  ) {
    // if (this.config.isLoaded) {
    //   this.adalConfig = JSON.parse(this.config.getConfig('adalConfig', ''));
    // }
    this.adal.init(this.adalConfig);
  }

  public init() {
    this.adal.handleWindowCallback();

    if (localStorage.getItem(this.utils.localStorageLoginMode)) {
      this._authMode = AuthMode[localStorage.getItem(this.utils.localStorageLoginMode)];
    }
    if (localStorage.getItem(this.utils.localStorageLoginUser)) {
      this._loginUser = JSON.parse(localStorage.getItem(this.utils.localStorageLoginUser));
    }
  }

  public login(mode: AuthMode, userName?: string, pwd?: string) {
    switch (mode) {
      case AuthMode.windows:
        if (this._loginUser) {
          return empty();
        }
        if (!this.config.isLoaded) {
          return throwError(new Error('config service is not yet ready'));
        }
        const urlWindowsUser = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
        const urlGetWindowsUser = this.utils.buildDataServiceUrl(
          urlWindowsUser,
          'resource/win',
          'get/currentuser'
        );
        let paramWindowsUser: HttpParams = new HttpParams();
        paramWindowsUser = paramWindowsUser.append('attributesToGet', 'DisplayName');
        paramWindowsUser = paramWindowsUser.append('attributesToGet', 'AccountName');
        return this.http
          .get(urlGetWindowsUser, { params: paramWindowsUser, withCredentials: true })
          .pipe(
            tap((user: DSResource) => {
              this._loginUser = {
                DisplayName: user.DisplayName,
                ObjectID: user.ObjectID,
                AccountName: user.Attributes['AccountName'].Value
              };
              this._authMode = AuthMode[mode];

              localStorage.clear();
              localStorage.setItem(this.utils.localStorageLoginMode, mode);
              localStorage.setItem(
                this.utils.localStorageLoginUser,
                JSON.stringify(this._loginUser)
              );

              this.router.navigate(['/splash']);
            })
          );
      case AuthMode.basic:
        if (this._loginUser) {
          return empty();
        }
        if (!this.config.isLoaded) {
          return throwError(new Error('config service is not yet ready'));
        }
        const urlBasicUser = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
        const urlGetEncryptionKey = this.utils.buildDataServiceUrl(
          urlBasicUser,
          'generic',
          'encryptionKey'
        );
        return this.http.get(urlGetEncryptionKey).pipe(
          switchMap((key: string) => {
            const domain = this.config.getConfig('domain', '');
            const keyDecrypted = this.utils.Decrypt(key, '');
            const basicToken = `baseaddress:${urlBasicUser};domain:${domain};username:${userName};password:${this.utils.Encrypt(
              pwd,
              keyDecrypted
            )}`;
            const urlGetBasicUser = this.utils.buildDataServiceUrl(
              urlBasicUser,
              'resource/basic',
              'get/query'
            );
            let paramBasicUser: HttpParams = new HttpParams({
              fromObject: {
                connectionInfo: basicToken,
                query: `/Person[AccountName='${userName}']`
              }
            });
            paramBasicUser = paramBasicUser.append('attributesToGet', 'DisplayName');
            paramBasicUser = paramBasicUser.append('attributesToGet', 'AccountName');
            return this.http.get(urlGetBasicUser, { params: paramBasicUser }).pipe(
              map((users: DSResourceSet) => {
                if (users.TotalCount !== 1) {
                  throw new Error('failed to get portal user');
                } else {
                  this._loginUser = {
                    DisplayName: users.Resources[0].DisplayName,
                    ObjectID: users.Resources[0].ObjectID,
                    AccountName: users.Resources[0].Attributes['AccountName'].Value,
                    Token: basicToken
                  };
                  this._authMode = AuthMode[mode];

                  localStorage.clear();
                  localStorage.setItem(this.utils.localStorageLoginMode, mode);
                  localStorage.setItem(
                    this.utils.localStorageLoginUser,
                    JSON.stringify(this._loginUser)
                  );

                  this.router.navigate(['/splash']);

                  return users.Resources[0];
                }
              })
            );
          })
        );
      case AuthMode.azure:
        this._authMode = AuthMode[mode];
        localStorage.clear();
        localStorage.setItem(this.utils.localStorageLoginMode, mode);
        if (!this.adal.userInfo.authenticated) {
          this.adal.login();
        }
        return empty();
      default:
        return empty();
    }
  }

  public logout() {
    localStorage.clear();
    this._authMode = undefined;
    this._loginUser = undefined;

    if (this.adal.userInfo.authenticated) {
      this.adal.logOut();
    }
    this.router.navigate(['/login']);
  }

  public setAzureLoginUser() {
    this._loginUser = {
      DisplayName: this.adal.userInfo.userName,
      AccountName: this.adal.userInfo.userName,
      Token: this.adal.userInfo.token
    };
    localStorage.setItem(this.utils.localStorageLoginUser, JSON.stringify(this._loginUser));
    return this._loginUser;
  }
}
