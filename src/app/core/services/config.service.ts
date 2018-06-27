import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  private pathPrefix = 'assets';

  private env: object = null;
  private config: object = null;
  private loaded = false;

  public load(envFileName = 'env.json') {
    return new Observable(observer => {
      const envFilePath = `${this.pathPrefix}/${envFileName}`;
      this.http.get(envFilePath).subscribe(
        responseEnv => {
          this.env = responseEnv;
          const configFilePath = `${this.pathPrefix}/config.${
            this.env['env']
          }.json`;
          this.http.get(configFilePath).subscribe(
            data => {
              this.config = data;
              this.loaded = true;
              observer.next();
              observer.complete();
            },
            err => {
              observer.error(err);
            }
          );
        },
        errorEnv => {
          observer.error(errorEnv);
        }
      );
      return { unsubscribe() {} };
    });
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  public getEnv(key: string = 'env', fallback?: any) {
    if (this.env[key]) {
      return this.env[key];
    } else {
      return fallback ? fallback : undefined;
    }
  }

  public getConfig(key: string, fallback?: any) {
    if (this.config[key]) {
      return this.config[key];
    } else {
      return fallback ? fallback : undefined;
    }
  }
}
