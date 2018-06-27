import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  private connection: string = null;
  private loginUserAttributes: string[] = [];
  private loginUser: DSResource = undefined;
  private loaded = false;

  private buildUrl(controllerName: string, methodName: string) {
    return `${this.baseUrl}${controllerName}/${methodName}`;
  }

  public load(conn: string = null) {
    return new Observable(observer => {
      this.baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
      if (conn) {
        this.connection = conn;
      }
      this.loginUserAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);

      const urlGetVersion = this.buildUrl('generic', 'version');
      this.http.get(urlGetVersion).subscribe(
        versionResponse => {
          this.version = versionResponse as string;
          observer.next();
          observer.complete();
        },
        versionError => {
          observer.error(versionError);
        }
      );

      return { unsubscribe() { } };
    });
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getVersion() {
    return this.version;
  }
}
