import { Injectable } from '@angular/core';

import * as cryptojs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public Encrypt(message: string, key?: string) {
    if (!key) {
      key = 'Sycqtok2!Rygsec0';
    }
    return cryptojs.AES.encrypt(
      message,
      cryptojs.enc.Base64.parse(key),
      {
        iv: cryptojs.enc.Base64.parse('OCGMobileService')
      }
    ).toString();
  }

  public Decrypt(message: string, key?: string) {
    if (!key) {
      key = 'Sycqtok2!Rygsec0';
    }
    return cryptojs.AES.decrypt(
      message,
      cryptojs.enc.Base64.parse(key),
      {
        iv: cryptojs.enc.Base64.parse('OCGMobileService')
      }
    ).toString(cryptojs.enc.Utf8);
  }
}
