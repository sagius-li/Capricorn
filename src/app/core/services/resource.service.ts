import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';

import { ConfigService } from './config.service';
import { DSAttribute, DSResource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  private baseUrl = '';
  private version = 'n.a';
  private connection: string = undefined;
  private authenticationMode = '';
  private loginUserAttributes: string[] = [];
  private loginUser: DSResource = undefined;
  private loaded = false;

  private buildUrl(controllerName: string, methodName: string) {
    return `${this.baseUrl}${controllerName}/${methodName}`;
  }

  public load(conn?: string) {
    return new Observable(observer => {
      // get configuration
      this.baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
      this.loginUserAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);
      // authentication mode
      if (conn) {
        this.connection = conn;
        this.authenticationMode = 'basic';
      } else {
        this.connection = undefined;
        this.authenticationMode = 'windows';
      }
      // get version
      const urlGetVersion = this.buildUrl('generic', 'version');
      this.http.get(urlGetVersion).subscribe(
        versionResponse => {
          this.version = versionResponse as string;
          // get current login user
          if (conn) {
            // using basic authentication
            const urlGetBasicUser = this.buildUrl('resource/basic', 'get/query');
            observer.error('not implemented');
          } else {
            // using windows authentication
            const urlGetWindowsUser = this.buildUrl('resource/win', 'get/currentuser');
            let param: HttpParams = new HttpParams();
            this.loginUserAttributes.forEach(attribute => {
              param = param.append('attributesToGet', attribute);
            });
            this.http.get(urlGetWindowsUser, { params: param, withCredentials: true }).subscribe(
              (windowsUser: DSResource) => {
                this.loginUser = windowsUser;
                this.loaded = true;
                observer.next();
                observer.complete();
              },
              getWindowsUserError => {
                observer.error(getWindowsUserError);
              }
            );
          }
        },
        versionError => {
          observer.error(versionError);
        }
      );
      // unsubscribe
      return { unsubscribe() { } };
    });
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getVersion() {
    return this.version;
  }

  public getAuthenticationMode() {
    return this.authenticationMode;
  }

  public getLoginUser() {
    return this.loginUser;
  }

  public isLoaded() {
    return this.loaded;
  }
}
