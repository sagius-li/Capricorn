import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, switchMap, flatMap } from 'rxjs/operators';
import * as moment from 'moment';

import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';
import {
  DSAttribute,
  DSResource,
  DSResourceSet
} from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private utils: UtilsService
  ) {}

  private baseUrl = '';
  private version = 'n.a';
  private encryptionKey = undefined;
  private connection: string = undefined;
  private authenticationMode = '';
  private loginUserAttributes: string[] = [];
  private loginUser: DSResource = undefined;
  private loaded = false;

  private buildUrl(controllerName: string, methodName: string) {
    return `${this.baseUrl}${controllerName}/${methodName}`;
  }

  private nomoralizeUrl(url: string, params: HttpParams) {
    return `${url}?${params.toString().replace(/%25/g, '%')}`;
  }

  private getUserNameFromConnection() {
    if (!this.connection) {
      return undefined;
    }
    const pos1 = this.connection.indexOf('username:');
    const pos2 = this.connection.indexOf(';', pos1);
    if (pos2 < pos1 + 9) {
      return undefined;
    }
    return this.connection.substring(pos1 + 9, pos2);
  }

  public load(conn?: string) {
    // get configuration
    this.baseUrl = this.config.getConfig(
      'dataServiceUrl',
      '//localhost:6867/api/'
    );
    this.loginUserAttributes = this.config.getConfig('loginUserAttributes', [
      'DisplayName'
    ]);

    // set authentication mode
    if (conn) {
      this.connection = conn;
      this.authenticationMode = 'basic';
    } else {
      this.connection = undefined;
      this.authenticationMode = 'windows';
    }

    // get version
    const urlGetVersion = this.buildUrl('generic', 'version');
    return this.http.get(urlGetVersion).pipe(
      tap((version: string) => {
        this.version = version;
      }),
      switchMap(() => {
        // get encryption key
        const urlGetEncryptionKey = this.buildUrl('generic', 'encryptionKey');
        return this.http.get(urlGetEncryptionKey).pipe(
          tap((key: string) => {
            this.encryptionKey = this.utils.Decrypt(key, '');
          })
        );
      }),
      switchMap(() => {
        // get current login user
        if (conn) {
          // using basic authentication
          const urlGetPortalUser = this.buildUrl('resource/admin', 'get/query');
          const accountName = this.getUserNameFromConnection();
          if (!accountName) {
            return throwError(new Error('invalid connection'));
          }
          let param: HttpParams = new HttpParams({
            fromObject: {
              encryptionKey: this.encryptionKey,
              query: `/Person[AccountName='${accountName}']`
            }
          });
          this.loginUserAttributes.forEach(attribute => {
            param = param.append('attributesToGet', attribute);
          });
          return this.http.get(urlGetPortalUser, { params: param }).pipe(
            tap((users: DSResourceSet) => {
              if (users.TotalCount !== 1) {
                throw new Error('Failed to get portal user');
              } else {
                this.loginUser = users.Resources[0];
                this.loaded = true;
              }
            })
          );
        } else {
          // using windows authentication
          const urlGetPortalUser = this.buildUrl(
            'resource/win',
            'get/currentuser'
          );
          let param: HttpParams = new HttpParams();
          this.loginUserAttributes.forEach(attribute => {
            param = param.append('attributesToGet', attribute);
          });
          return this.http
            .get(urlGetPortalUser, { params: param, withCredentials: true })
            .pipe(
              tap((user: DSResource) => {
                this.loginUser = user;
                this.loaded = true;
              })
            );
        }
      })
    );
  }

  public getBaseUrl() {
    return this.baseUrl;
  }

  public getVersion() {
    return this.version;
  }

  public getEncryptionKey() {
    return this.encryptionKey;
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

  public getResourceByID(
    id: string,
    attributesToGet: string[] = null,
    adminMode = false,
    includePermission = false,
    cultureKey: number = 127,
    resolveID = false,
    deepResolve = false,
    attributesToResolve: string[] = null
  ) {
    if (!id) {
      return throwError('id is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        id: id,
        includePermission: String(includePermission),
        cultureKey: String(cultureKey),
        resolveID: String(resolveID),
        deepResolve: String(deepResolve)
      }
    });
    if (attributesToGet !== null) {
      attributesToGet.forEach(attribute => {
        params = params.append('attributesToGet', attribute);
      });
    }
    if (attributesToResolve !== null) {
      attributesToResolve.forEach(attribute => {
        params = params.append('attributesToResolve', attribute);
      });
    }
    let request: Observable<DSResource>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'get/id');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.get<DSResource>(url, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'get/id');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.get<DSResource>(this.nomoralizeUrl(url, params));
    } else {
      url = this.buildUrl('resource/win', 'get/id');
      request = this.http.get<DSResource>(url, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public getResourceByQuery(
    query: string,
    attributesToGet: string[] = null,
    adminMode = false,
    pageSize = 0,
    index = 0,
    cultureKey = 127,
    resolveID = false,
    deepResolve = false,
    attributesToResolve: string[] = null,
    attributesToSort: string[] = null
  ) {
    if (!query) {
      return throwError('query is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        query: query,
        pageSize: String(pageSize),
        index: String(index),
        cultureKey: String(cultureKey),
        resolveID: String(resolveID),
        deepResolve: String(deepResolve)
      }
    });
    if (attributesToGet !== null) {
      attributesToGet.forEach(attribute => {
        params = params.append('attributesToGet', attribute);
      });
    }
    if (attributesToResolve !== null) {
      attributesToResolve.forEach(attribute => {
        params = params.append('attributesToResolve', attribute);
      });
    }
    if (attributesToSort !== null) {
      attributesToSort.forEach(attribute => {
        params = params.append('attributesToSort', attribute);
      });
    }
    let request: Observable<DSResourceSet>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'get/query');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.get<DSResourceSet>(url, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'get/query');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.get<DSResourceSet>(this.nomoralizeUrl(url, params));
    } else {
      url = this.buildUrl('resource/win', 'get/query');
      request = this.http.get<DSResourceSet>(url, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public getResourceCount(query: string, adminMode = false) {
    if (!query) {
      return throwError('query is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        query: query
      }
    });
    let request: Observable<number>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'get/count');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.get<number>(url, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'get/count');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.get<number>(this.nomoralizeUrl(url, params));
    } else {
      url = this.buildUrl('resource/win', 'get/count');
      request = this.http.get<number>(url, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public deleteResource(id: string, adminMode = false) {
    if (!id) {
      return throwError('id is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        id: id
      }
    });
    let request: Observable<any>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'delete');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.delete(url, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'delete');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.delete(this.nomoralizeUrl(url, params));
    } else {
      url = this.buildUrl('resource/win', 'delete');
      request = this.http.delete(url, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public createResource(resource: DSResource, adminMode = false) {
    if (!resource) {
      return throwError('resource is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams();
    let request: Observable<string>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'create');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.post<string>(url, resource, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'create');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.post<string>(
        this.nomoralizeUrl(url, params),
        resource
      );
    } else {
      url = this.buildUrl('resource/win', 'create');
      request = this.http.post<string>(url, resource, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public updateResource(
    resource: DSResource,
    isdelta = true,
    adminMode = false
  ) {
    if (!resource) {
      return throwError('resource is missing');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        isdelta: String(isdelta)
      }
    });
    let request: Observable<string>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'update');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.post<string>(url, resource, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'update');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.post<string>(
        this.nomoralizeUrl(url, params),
        resource
      );
    } else {
      url = this.buildUrl('resource/win', 'update');
      request = this.http.post<string>(url, resource, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public addValues(
    id: string,
    attributeName: string,
    valuesToAdd: string[] = null,
    adminMode = false
  ) {
    if (!id) {
      return throwError('id is missing');
    }
    if (!attributeName) {
      return throwError('attribute name is missing');
    }
    if (valuesToAdd === null) {
      return throwError('no values to add');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        objectID: id,
        attributeName: attributeName
      }
    });
    valuesToAdd.forEach(attribute => {
      params = params.append('valuesToAdd', attribute);
    });
    let request: Observable<string>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'values/add');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.post<string>(url, id, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'values/add');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.post<string>(this.nomoralizeUrl(url, params), id);
    } else {
      url = this.buildUrl('resource/win', 'values/add');
      request = this.http.post<string>(url, id, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }

  public removeValues(
    id: string,
    attributeName: string,
    valuesToRemove: string[] = null,
    adminMode = false
  ) {
    if (!id) {
      return throwError('id is missing');
    }
    if (!attributeName) {
      return throwError('attribute is missing');
    }
    if (valuesToRemove === null) {
      return throwError('no values to remove');
    }

    let url = '';
    let params: HttpParams = new HttpParams({
      fromObject: {
        objectID: id,
        attributeName: attributeName
      }
    });
    valuesToRemove.forEach(attribute => {
      params = params.append('valuesToRemove', attribute);
    });
    let request: Observable<string>;

    if (adminMode === true) {
      url = this.buildUrl('resource/admin', 'values/remove');
      params = params.append('encryptionKey', this.encryptionKey);
      request = this.http.post<string>(url, id, { params: params });
    } else if (this.connection) {
      url = this.buildUrl('resource/basic', 'values/remove');
      params = params.append(
        'connectionInfo',
        encodeURIComponent(this.connection)
      );
      request = this.http.post<string>(this.nomoralizeUrl(url, params), id);
    } else {
      url = this.buildUrl('resource/win', 'values/remove');
      request = this.http.post<string>(url, id, {
        params: params,
        withCredentials: true
      });
    }

    return request;
  }
}
