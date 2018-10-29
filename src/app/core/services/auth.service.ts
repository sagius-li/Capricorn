import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { throwError } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

import { DSResource, DSResourceSet } from '../models/resource.model';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';

export enum AuthMode {
  basic = 'basic',
  windows = 'windows',
  azure = 'azure'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _authMode: AuthMode;
  get authMode() {
    return this._authMode;
  }

  _loginUser: DSResource;
  get loginUser() {
    return this._loginUser;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private utils: UtilsService
  ) {}

  public login(mode: AuthMode, userName?: string, pwd?: string) {
    if (!this.config.isLoaded) {
      return throwError(new Error('config service is not yet ready'));
    }

    const baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
    const userAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);

    switch (mode) {
      case AuthMode.windows:
        const urlGetWindowsUser = this.utils.buildDataServiceUrl(
          baseUrl,
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
              this._loginUser = user;

              localStorage.clear();
              localStorage.setItem(this.utils.localStorageLoginMode, mode);
              localStorage.setItem(
                this.utils.localStorageLoginUser,
                JSON.stringify(this._loginUser)
              );
            })
          );
      case AuthMode.basic:
        const urlGetEncryptionKey = this.utils.buildDataServiceUrl(
          baseUrl,
          'generic',
          'encryptionKey'
        );
        return this.http.get(urlGetEncryptionKey).pipe(
          switchMap((key: string) => {
            const domain = this.config.getConfig('domain', '');
            const keyDecrypted = this.utils.Decrypt(key, '');
            const basicToken = `baseaddress:${baseUrl};domain:${domain};username:${userName};password:${this.utils.Encrypt(
              pwd,
              keyDecrypted
            )}`;
            const urlGetBasicUser = this.utils.buildDataServiceUrl(
              baseUrl,
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
                  this._loginUser = users.Resources[0];

                  localStorage.clear();
                  localStorage.setItem(this.utils.localStorageLoginMode, mode);
                  localStorage.setItem(this.utils.localStorageLoginToken, basicToken);
                  localStorage.setItem(
                    this.utils.localStorageLoginUser,
                    JSON.stringify(this._loginUser)
                  );

                  return users.Resources[0];
                }
              })
            );
          })
        );
      case AuthMode.azure:
        break;
      default:
        break;
    }
  }
}
