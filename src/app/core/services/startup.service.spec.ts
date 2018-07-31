import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { LocalizationModule } from '../modules/localization.module';

import { StartupService } from './startup.service';
import { TranslateService } from '@ngx-translate/core';

xdescribe('StartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, LocalizationModule],
      providers: [StartupService, TranslateService]
    });
  });

  it('should be created', inject(
    [StartupService],
    (service: StartupService) => {
      expect(service).toBeTruthy();
    }
  ));

  it(
    'should be started and translate string with windows credential',
    function(done) {
      inject(
        [StartupService, TranslateService],
        (service: StartupService, translate: TranslateService) => {
          service.start().subscribe(
            () => {
              expect(service.isLoaded()).toBe(true);
              // synchronous
              expect(translate.instant('i18n_languageKey')).toEqual('127');
              // asynchronous
              translate.get('i18n_languageKey').subscribe((res: string) => {
                expect(res).toEqual('127');
                done();
              });
            },
            err => {
              done.fail(err);
            }
          );
        }
      )();
    },
    10000
  );

  it(
    'should be started and translate string with basic credential',
    function(done) {
      inject(
        [StartupService, TranslateService],
        (service: StartupService, translate: TranslateService) => {
          service
            .start(
              'domain:contoso;username:mimadmin;password:yJJI/p/lc+WDOoNCR/l/3g=='
            )
            .subscribe(
              () => {
                expect(service.isLoaded()).toBe(true);
                // synchronous
                expect(translate.instant('i18n_languageKey')).toEqual('127');
                // asynchronous
                translate.get('i18n_languageKey').subscribe((res: string) => {
                  expect(res).toEqual('127');
                  done();
                });
              },
              err => {
                done.fail(err);
              }
            );
        }
      )();
    },
    10000
  );
});
