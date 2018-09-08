import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';
import {
  DSAttribute,
  DSResource,
  DSResourceSet
} from '../models/resource.model';

/**
 * Data layer to communicate with data storage
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  /** Using HttpClient, ConfigService and UtilsService */
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private utils: UtilsService
  ) {}

  /** Property to hold base url */
  private baseUrl = '';
  /** Property to hold version number */
  private version = 'n.a';
  /** Property to hold language key */
  private language: string = undefined;
  /** Property to hold encryption key */
  private encryptionKey: string = undefined;
  /** Property to hold connection string */
  private connection: string = undefined;
  /** Property to hold authentication mode */
  private authenticationMode = '';
  /** Property to hold login user attributes, which should be loaded */
  private loginUserAttributes: string[] = [];
  /** Property to hold user resource object */
  private loginUser: DSResource = undefined;
  /** Property to hold indicator, if the service has been loaded */
  private loaded = false;

  /**
   * Build url using controller name and method name
   * @param controllerName Web API controller name
   * @param methodName Web API method name
   */
  private buildUrl(controllerName: string, methodName: string) {
    return `${this.baseUrl}${controllerName}/${methodName}`;
  }

  /**
   * Nomoralize http parameters in the url
   * @param url Base address
   * @param params Http parameters
   */
  private nomoralizeUrl(url: string, params: HttpParams) {
    return `${url}?${params.toString().replace(/%25/g, '%')}`;
  }

  /**
   * Get user account name out of the connection string
   * @returns Account name
   */
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

  /**
   * Initialize the service, get version number, encryption key, language and login user
   * @example
   * Call with windows credential
   * load()
   * Call with basic credential
   * load(\'baseaddress://localhost:5725;domain:contoso;username:mimadmin;password:yJJI/p/lc+WDOoNCR/l/3g==\')
   * @param conn Connection string contains base address,domain, user name and password to access the data
   * @returns No return value, settings are hold in private properties
   */
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
        if (!version) {
          return throwError(new Error('could not get data service version'));
        }
        this.version = version;
      }),
      // get encryption key
      switchMap(() => {
        const urlGetEncryptionKey = this.buildUrl('generic', 'encryptionKey');
        return this.http.get(urlGetEncryptionKey).pipe(
          tap((key: string) => {
            if (!key) {
              return throwError(new Error('could not get encryption key'));
            }
            this.encryptionKey = this.utils.Decrypt(key, '');
          })
        );
      }),
      // get language
      switchMap(() => {
        const urlGetLanguage = this.buildUrl('generic', 'language');
        return this.http.get(urlGetLanguage).pipe(
          tap((lang: string) => {
            if (!lang) {
              return throwError(new Error('could not get browser language'));
            }
            this.language = lang;
          })
        );
      }),
      // get current login user
      switchMap(() => {
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

  /** Get base url, like //localhost:6867/api/ */
  public getBaseUrl() {
    return this.baseUrl;
  }

  /** Get service version */
  public getVersion() {
    return this.version;
  }

  /** Get language */
  public getLanguage() {
    return this.language;
  }

  /** Get encryption key */
  public getEncryptionKey() {
    return this.encryptionKey;
  }

  /** Get authentication mode (windows / basic) */
  public getAuthenticationMode() {
    return this.authenticationMode;
  }

  /** Get login user as portal resource */
  public getLoginUser() {
    return this.loginUser;
  }

  /** Indicate if the service has been initialized */
  public isLoaded() {
    return this.loaded;
  }

  /**
   * Get resource object by ID
   * @example
   * Get MIM Poral install user with attributes DisplayName and Manager and resolve Manager as resource
   * getResourceByID(\'7fb2b853-24f0-4498-9534-4e10589723c4\',
   * [\'DisplayName\', \'Manager\'], true, true, 127, true, false, [\'DisplayName\'])
   * @param id The GUID
   * @param attributesToGet An array of attributes which should be returned
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   * @param includePermission Whether permission info should be append to ever returned attributes
   * @param cultureKey In which language the values should be returned
   * @param resolveID If set to true, reference attributes are interpreted as resource instead of a GUID
   * @param deepResolve Whether reference resolution should be done recusivly
   * @param attributesToResolve An array of attributes which should be returned by resolving references
   */
  public getResourceByID(
    id: string,
    attributesToGet: string[] = null,
    adminMode: boolean = false,
    includePermission: boolean = false,
    cultureKey: number = 127,
    resolveID: boolean = false,
    deepResolve: boolean = false,
    attributesToResolve: string[] = null
  ): Observable<DSResource> {
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

  /**
   * Get resource object by query
   * @example
   * getResourceByQuery(\'/Person\', [\'DisplayName\', \'AccountName\'],
   * false, 20, 0, 127, false, false, null, [\'DisplayName:asc\', \'AccountName:dsc\'])
   * @param query Query to fetch resource
   * @param attributesToGet An array of attributes which should be returned
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   * @param pageSize How many resources will be returned in one request. If set to 0, all resources will be returned
   * @param index The begin position from where the request should begin to fetch and return resources
   * @param cultureKey In which language the values should be returned
   * @param resolveID If set to true, reference attributes are interpreted as resource instead of a GUID
   * @param deepResolve Whether reference resolution should be done recusivly
   * @param attributesToResolve An array of attributes which should be returned by resolving references
   * @param attributesToSort An array of attributes and sort options
   */
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
  ): Observable<DSResourceSet> {
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

  /**
   * Get the count of found resources by query
   * @param query Query to fetch resource
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public getResourceCount(
    query: string,
    adminMode = false
  ): Observable<number> {
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

  /**
   *
   * @param id The GUID
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public deleteResource(id: string, adminMode = false): Observable<any> {
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

  /**
   * Create resource
   * @param resource Resource to create
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public createResource(
    resource: DSResource,
    adminMode = false
  ): Observable<string> {
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

  /**
   *
   * @param resource Resource to update
   * @param isdelta If set to true, only attributes with dirty mark will be updated, otherwise all attributes will be updated
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public updateResource(
    resource: DSResource,
    isdelta = true,
    adminMode = false
  ): Observable<string> {
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

  /**
   * Add values to a multivalue-attribute
   * @param id The GUID of the target resource
   * @param attributeName Name of the multivalue-attribute
   * @param valuesToAdd Values, which will be added to the multivalue-attribute
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public addValues(
    id: string,
    attributeName: string,
    valuesToAdd: string[] = null,
    adminMode = false
  ): Observable<string> {
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

  /**
   * Remove values from a multivalue-attribute
   * @param id The GUID of the target resource
   * @param attributeName Name of the multivalue-attribute
   * @param valuesToRemove Values, which will be removed from the multivalue-attribute
   * @param adminMode Whether admin mode should be used. In admin mode all resources are accessible
   */
  public removeValues(
    id: string,
    attributeName: string,
    valuesToRemove: string[] = null,
    adminMode = false
  ): Observable<string> {
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
