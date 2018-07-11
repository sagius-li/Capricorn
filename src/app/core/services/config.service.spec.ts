import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from './config.service';

xdescribe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ConfigService]
    });
  });

  it('should be created', inject([ConfigService], (service: ConfigService) => {
    expect(service).toBeTruthy();
  }));

  it('should be loaded', function(done) {
    inject([ConfigService], (service: ConfigService) => {
      service.load().subscribe(
        () => {
          expect(service.isLoaded()).toBe(true);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });

  it('should throw error if file not found', function(done) {
    inject([ConfigService], (service: ConfigService) => {
      service.load('test.json').subscribe(
        () => {
          done.fail('it should throw error');
        },
        err => {
          expect(err.status).toBe(404);
          done();
        }
      );
    })();
  });

  it('should point to dev environment', function(done) {
    inject([ConfigService], (service: ConfigService) => {
      service.load().subscribe(
        () => {
          expect(service.getEnv()).toEqual('dev');
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });

  it('should load portal admin GUID from config file', function(done) {
    inject([ConfigService], (service: ConfigService) => {
      service.load().subscribe(
        () => {
          expect(service.getConfig('portalAdminGuid')).toEqual(
            '7fb2b853-24f0-4498-9534-4e10589723c4'
          );
          done();
        },
        err => {
          done.fail(err);
        }
      );
    })();
  });
});
