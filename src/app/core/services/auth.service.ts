import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DSResource } from '../models/resource.model';
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

    switch (mode) {
      case AuthMode.windows:
        const baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
        const getUserUrl = this.utils.buildDataServiceUrl(
          baseUrl,
          'resource/win',
          'get/currentuser'
        );
        const userAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);
        let param: HttpParams = new HttpParams();
        userAttributes.forEach(attribute => {
          param = param.append('attributesToGet', attribute);
        });
        return this.http.get(getUserUrl, { params: param, withCredentials: true }).pipe(
          tap((user: DSResource) => {
            this._loginUser = user;
          })
        );
      case AuthMode.basic:
        break;
      case AuthMode.azure:
        break;
      default:
        break;
    }
  }
}
