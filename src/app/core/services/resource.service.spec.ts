import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DSResource } from '../models/resource.model';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ResourceService,
        {
          provide: ConfigService,
          useValue: jasmine.createSpyObj('ConfigService', ['getConfig'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['Decrypt'])
        }
      ]
    });

    configServiceSpy = TestBed.get(ConfigService);
    utilsServiceSpy = TestBed.get(UtilsService);

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
    utilsServiceSpy.Decrypt.and.callFake((message, key) => {
      return 'ContosoDemo';
    });
  });

  it('should be created', inject(
    [ResourceService],
    (service: ResourceService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should be loaded with windows credential', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service.load().subscribe(
        () => {
          expect(service.isLoaded()).toBe(true);
          expect(service.getVersion()).not.toEqual('n.a');
          expect(service.getEncryptionKey()).toEqual('ContosoDemo');
          expect(service.getLoginUser()).toBeDefined();
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });

  it('should be loaded with basic credential', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      const conn =
        'baseaddress://localhost:5725;domain:contoso;username:mimadmin;password:yJJI/p/lc+WDOoNCR/l/3g==';
      service.load(conn).subscribe(
        () => {
          expect(service.isLoaded()).toBe(true);
          expect(service.getVersion()).not.toEqual('n.a');
          expect(service.getEncryptionKey()).toEqual('ContosoDemo');
          expect(service.getLoginUser()).toBeDefined();
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });

  it('should get resource by id', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service.load().subscribe(
        () => {
          service
            .getResourceByID('7fb2b853-24f0-4498-9534-4e10589723c4')
            .subscribe(
              (resource: DSResource) => {
                expect(resource).toBeDefined();
                expect(resource.ObjectID).toEqual(
                  '7fb2b853-24f0-4498-9534-4e10589723c4'
                );
                done();
              },
              err => {
                done.fail(err);
              }
            );
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });
});
