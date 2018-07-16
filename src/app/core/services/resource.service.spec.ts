import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientModule,
  HttpClient,
  HttpHandler
} from '@angular/common/http';

import { DSResource, DSResourceSet } from '../models/resource.model';
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

  xit('should get resource by id with win auth', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service.load().subscribe(
        () => {
          service
            .getResourceByID('7fb2b853-24f0-4498-9534-4e10589723c4', [
              'DisplayName',
              'AccountName'
            ])
            .subscribe(
              (resource: DSResource) => {
                expect(resource).toBeDefined();
                expect(resource.ObjectID).toEqual(
                  '7fb2b853-24f0-4498-9534-4e10589723c4'
                );
                expect(resource.Attributes['AccountName'].Value).toBeDefined();
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

  xit('should get resource by id with basic auth', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service
        .load(
          'domain:contoso;username:mimadmin;password:yJJI/p/lc+WDOoNCR/l/3g=='
        )
        .subscribe(
          () => {
            service
              .getResourceByID('7fb2b853-24f0-4498-9534-4e10589723c4', [
                'DisplayName',
                'AccountName'
              ])
              .subscribe(
                (resource: DSResource) => {
                  expect(resource).toBeDefined();
                  expect(resource.ObjectID).toEqual(
                    '7fb2b853-24f0-4498-9534-4e10589723c4'
                  );
                  expect(
                    resource.Attributes['AccountName'].Value
                  ).toBeDefined();
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

  xit('should get resource by query', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service.load().subscribe(
        () => {
          service
            .getResourceByQuery(
              `/Person[starts-with(AccountName,'%')]`,
              ['DisplayName', 'AccountName'],
              false,
              10,
              0
            )
            .subscribe(
              (resources: DSResourceSet) => {
                expect(resources).toBeDefined();
                expect(resources.TotalCount).toBeGreaterThan(0);
                expect(resources.Resources.length).toBe(10);
                expect(
                  resources.Resources[0].Attributes['AccountName'].Value
                ).toBeDefined();
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

  xit('should get resource count', function(done) {
    inject([ResourceService], (service: ResourceService) => {
      service.load().subscribe(
        () => {
          service
            .getResourceCount(`/Person[starts-with(AccountName,'%')]`)
            .subscribe(
              (count: number) => {
                expect(count).toBeDefined();
                expect(count).toBeGreaterThan(0);
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

  xit(
    'should delete resource',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service.load().subscribe(
          () => {
            service
              .deleteResource('06b7b767-ff5e-4c4e-9d94-4153df346418')
              .subscribe(
                () => {
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
    },
    10000
  );

  xit(
    'should delete resource with basic auth',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service
          .load(
            'domain:contoso;username:administrator;password:yJJI/p/lc+WDOoNCR/l/3g=='
          )
          .subscribe(
            () => {
              service
                .deleteResource('ccdbf561-65de-4dfb-86f2-445abc0fc9f3')
                .subscribe(
                  () => {
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
    },
    10000
  );

  xit(
    'should create resource',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service.load().subscribe(
          () => {
            const resource: DSResource = {
              ObjectID: '',
              ObjectType: 'Person',
              DisplayName: 'Test User 1',
              Attributes: {}
            };
            resource.Attributes['AccountName'] = {
              SystemName: 'AccountName',
              Value: 'testuser1'
            };
            resource.Attributes['DisplayName'] = {
              SystemName: 'DisplayName',
              Value: 'Test User 1'
            };

            service.createResource(resource).subscribe(
              (id: string) => {
                expect(id).toBeDefined();
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
    },
    10000
  );

  xit(
    'should create resource with basic auth',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service
          .load(
            'domain:contoso;username:administrator;password:yJJI/p/lc+WDOoNCR/l/3g=='
          )
          .subscribe(
            () => {
              const resource: DSResource = {
                ObjectID: '',
                ObjectType: 'Person',
                DisplayName: 'Test User 1',
                Attributes: {}
              };
              resource.Attributes['AccountName'] = {
                SystemName: 'AccountName',
                Value: 'testuser1'
              };
              resource.Attributes['DisplayName'] = {
                SystemName: 'DisplayName',
                Value: 'Test User 1'
              };

              service.createResource(resource).subscribe(
                (id: string) => {
                  expect(id).toBeDefined();
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
    },
    10000
  );

  xit(
    'should update resource',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service.load().subscribe(
          () => {
            const resource: DSResource = {
              ObjectID: '7fb2b853-24f0-4498-9534-4e10589723c4',
              ObjectType: 'Person',
              DisplayName: 'mimadmin',
              Attributes: {}
            };
            resource.Attributes['MiddleName'] = {
              SystemName: 'MiddleName',
              Value: 'UpdateTest',
              IsDirty: true
            };

            service.updateResource(resource).subscribe(
              (id: string) => {
                expect(id).toBeDefined();
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
    },
    10000
  );

  xit(
    'should add values to resource',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service.load().subscribe(
          () => {
            const valuesToAdd = ['test1', 'test2', 'test3'];

            service
              .addValues(
                '7fb2b853-24f0-4498-9534-4e10589723c4',
                'ProxyAddressCollection',
                valuesToAdd
              )
              .subscribe(
                (id: string) => {
                  expect(id).toBeDefined();
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
    },
    10000
  );

  xit(
    'should remove values from resource',
    function(done) {
      inject([ResourceService], (service: ResourceService) => {
        service.load().subscribe(
          () => {
            const valuesToRemove = ['test2', 'test3'];

            service
              .removeValues(
                '7fb2b853-24f0-4498-9534-4e10589723c4',
                'ProxyAddressCollection',
                valuesToRemove
              )
              .subscribe(
                (id: string) => {
                  expect(id).toBeDefined();
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
    },
    10000
  );
});
