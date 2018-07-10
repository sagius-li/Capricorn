import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from './config.service';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let configServiceSpy: jasmine.SpyObj<ConfigService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ConfigService', ['getConfig']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ResourceService, { provide: ConfigService, useValue: spy }]
    });

    configServiceSpy = TestBed.get(ConfigService);
  });

  it('should be created', inject(
    [ResourceService],
    (service: ResourceService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should be loaded with windows credential', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      // mock object
      configServiceSpy.getConfig.and.callFake(configKey => {
        switch (configKey) {
          case 'dataServiceUrl':
            return '//localhost:6867/api/';
          case 'loginUserAttributes':
            return ['DisplayName'];
          default:
            return null;
        }
      });

      service.load().subscribe(
        () => {
          expect(service.isLoaded()).toBe(true);
          expect(service.getVersion()).not.toEqual('n.a');
          expect(service.getEncryptionKey()).toBeDefined();
          expect(service.getLoginUser()).toBeDefined();
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });
});
