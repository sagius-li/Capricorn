import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from './utils.service';

xdescribe('UtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilsService]
    });
  });

  it('should be created', inject([UtilsService], (service: UtilsService) => {
    expect(service).toBeTruthy();
  }));

  it('should encrypt message', inject(
    [UtilsService],
    (service: UtilsService) => {
      const clearText = 'PA$$w0rd';
      const encryptedText = service.Encrypt(clearText);

      expect(encryptedText).toBeDefined();
      expect(encryptedText).not.toEqual('');
      expect(encryptedText).not.toEqual(clearText);
    }
  ));

  it('should decrypt message', inject(
    [UtilsService],
    (service: UtilsService) => {
      const encryptedText = 'E5AkXRT0VoCo3JSc0oc81A==';
      const decryptedText = service.Decrypt(encryptedText, '');
      expect(decryptedText).toEqual('PA$$w0rd');
    }
  ));

  it('should consistent between encryption and decryption', inject(
    [UtilsService],
    (service: UtilsService) => {
      const clearText = 'PA$$w0rd';
      const encryptedText = service.Encrypt(clearText);
      const depryptedText = service.Decrypt(encryptedText);

      expect(encryptedText).toBeDefined();
      expect(depryptedText).toBeDefined();
      expect(depryptedText).toEqual(clearText);
    }
  ));
});
