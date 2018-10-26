import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { tap, switchMap, delay } from 'rxjs/operators';

import { ResourceService } from './resource.service';
import { ConfigService } from './config.service';

/**
 * Bootstrap core services and modules and prepare for the first start
 */
@Injectable({
  providedIn: 'root'
})
export class StartupService {
  /** Property to indicate if the service has been loaded */
  private allLoaded = false;
  get isAllLoaded() {
    return this.allLoaded;
  }

  /** Property to indicate if the data service has been loaded */
  private dataServiceLoaded = false;
  get isDataServiceLoaded() {
    return this.dataServiceLoaded;
  }

  /** Property to indicate if the data service has been loaded */
  private baseItemLoaded = false;
  get isBaseItemLoaded() {
    return this.baseItemLoaded;
  }

  /**
   * Initialize the service
   * @param config ConfigService
   * @param resource ResourceService
   * @param translate TranslateService
   */
  constructor(
    private config: ConfigService,
    private resource: ResourceService,
    private translate: TranslateService
  ) {}

  /**
   * Start the bootstrap process
   * @param conn Connection string includes base address, user name, domain and password
   */
  public start(conn?: string) {
    // init configuration service
    return this.config.load().pipe(
      // init resource service
      switchMap(() => {
        return this.resource.load(conn);
      }),
      // init translation service
      switchMap(() => {
        const supportedLanguages: any[] = this.config.getConfig('supportedLanguages', [
          {
            code: ['en-US', 'en'],
            label: 'English',
            route: 'en'
          }
        ]);
        const languages: string[] = [];
        let currentLanguage = '';
        supportedLanguages.forEach(language => {
          languages.push(language.route);
          if (language.code.indexOf(this.resource.getLanguage()) >= 0) {
            currentLanguage = language.route;
          }
        });
        this.translate.addLangs(languages);
        this.translate.setDefaultLang('en');
        return this.translate.use(currentLanguage).pipe(
          tap(() => {
            this.baseItemLoaded = true;
            this.dataServiceLoaded = true;
            this.allLoaded = true;
          })
        );
      })
    );
  }

  /**
   * Start the bootstrap process without data service
   */
  public startBase() {
    // init configuration service
    return this.config.load().pipe(
      // init translation service
      switchMap(() => {
        const supportedLanguages: any[] = this.config.getConfig('supportedLanguages', [
          {
            code: ['en-US', 'en'],
            label: 'English',
            route: 'en'
          }
        ]);
        const languages: string[] = [];
        const userLang = navigator.language;
        let currentLanguage = '';
        supportedLanguages.forEach(language => {
          languages.push(language.route);
          if (language.code.indexOf(userLang) >= 0) {
            currentLanguage = language.route;
          }
        });
        this.translate.addLangs(languages);
        this.translate.setDefaultLang('en');
        return this.translate.use(currentLanguage).pipe(
          tap(() => {
            this.baseItemLoaded = true;
          })
        );
      })
    );
  }
}
