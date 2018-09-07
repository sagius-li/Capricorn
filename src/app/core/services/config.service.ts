import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, map, switchMap } from 'rxjs/operators';

/**
 * Configuration servie to fetch data from environment and configuration files
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /**
   * Constructor using HttpClient
   *
   * @param http Using HttpClient to load environment and configuration files
   */
  constructor(private http: HttpClient) {}
  /**
   * Environment file path
   */
  private pathEnv = 'assets';
  /**
   * Configuration file path
   */
  private pathConfig = 'assets/config';

  /**
   * Enviroment cache
   */
  private env: object = null;
  /**
   * Configuration cache
   */
  private config: object = null;
  /**
   * Loaded indicator
   */
  private loaded = false;

  /**
   * Load the configuration in cache, according to the given environment setting
   *
   * @param envFileName Name of the environment file
   * @returns No return value, the configuration is hold in the local property
   */
  public load(envFileName = 'env.json') {
    const envFilePath = `${this.pathEnv}/${envFileName}`;
    // get environment file
    return this.http.get(envFilePath).pipe(
      tap(env => {
        this.env = env;
      }),
      map(env => `${this.pathConfig}/config.${this.env['env']}.json`),
      // get configuration file
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

  /**
   * Indicate if the configuration is loaded
   * @returns Boolean to indicate if the configuration is loaded
   */
  public isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Get the environment entry defined by the key
   *
   * @param key The key of the environment entry
   * @param fallback Fallback value if the key doesn't exist
   * @returns The value of the environment entry
   */
  public getEnv(key: string = 'env', fallback?: any) {
    if (this.env[key]) {
      return this.env[key];
    } else {
      return fallback ? fallback : undefined;
    }
  }

  /**
   * Get the configuration entry defined by the key
   *
   * @param key The key of the configuration entry
   * @param fallback Fallback value if the key doesn't exit
   * @returns The value of the configuration entry
   */
  public getConfig(key: string, fallback?: any) {
    if (this.config[key]) {
      return this.config[key];
    } else {
      return fallback ? fallback : undefined;
    }
  }
}
