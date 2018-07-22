import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, map, switchMap } from 'rxjs/operators';

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
    const envFilePath = `${this.pathPrefix}/${envFileName}`;
    return this.http.get(envFilePath).pipe(
      tap(env => {
        this.env = env;
      }),
      map(env => `${this.pathPrefix}/config.${this.env['env']}.json`),
      switchMap(path => {
        return this.http.get(path).pipe(
          tap(config => {
            this.config = config;
            this.loaded = true;
          })
        );
      })
    );
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
