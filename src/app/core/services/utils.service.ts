import { Injectable } from '@angular/core';

import * as cryptojs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private iv = '';

  constructor() {
    this.iv = cryptojs.enc.Hex.parse('OCGMobileService');
  }

  private stringToHexString(text: string) {
    let str = '';
    for (let i = 0; i < text.length; i++) {
      str += text.charCodeAt(i).toString(16);
    }
    return str;
  }

  private getKey(text: string) {
    const hexKey = this.stringToHexString(text);
    const key = cryptojs.enc.Hex.parse(hexKey);
    return key;
  }

  public Encrypt(message: string, key?: string) {
    if (!key) {
      key = 'Sycqtok2!Rygsec0';
    }
    return cryptojs.AES.encrypt(message,
      this.getKey(key), { iv: this.getKey('OCGMobileService') }).toString();
  }

  public Decrypt(message: string, key?: string) {
    if (!key) {
      key = 'Sycqtok2!Rygsec0';
    }
    return cryptojs.AES.decrypt(message, this.getKey(key),
      { iv: this.getKey('OCGMobileService') }).toString(cryptojs.enc.Utf8);
  }
}
