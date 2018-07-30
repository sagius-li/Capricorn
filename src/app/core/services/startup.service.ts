import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ResourceService } from './resource.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private loaded = false;

  constructor(
    private config: ConfigService,
    private resource: ResourceService,
    private translate: TranslateService
  ) {}

  public start(conn?: string) {
    // init configuration service
    return this.config.load().pipe(
      // init resource service
      switchMap(() => {
        return this.resource.load(conn);
      }),
      // init translation service
      switchMap(() => {
        const supportedLanguages: any[] = this.config.getConfig(
          'supportedLanguages',
          [
            {
              code: ['en-US', 'en'],
              label: 'English',
              route: 'en'
            }
          ]
        );
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
            this.loaded = true;
          })
        );
      })
    );
  }

  public isLoaded() {
    return this.loaded;
  }
}
