import { Injectable } from '@angular/core';

import * as cryptojs from 'crypto-js';

/**
 * Provide global functions
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /** Initialization vector for encryption */
  private iv = '';

  /**
   * @ignore
   */
  constructor() {
    this.iv = cryptojs.enc.Hex.parse('OCGMobileService');
  }

  /**
   * String to hex string converter
   * @param text Text string
   */
  private stringToHexString(text: string) {
    let str = '';
    for (let i = 0; i < text.length; i++) {
      str += text.charCodeAt(i).toString(16);
    }
    return str;
  }

  /**
   * Get hex string of the key
   * @param text Key text
   */
  private getKey(text: string) {
    const hexKey = this.stringToHexString(text);
    const key = cryptojs.enc.Hex.parse(hexKey);
    return key;
  }

  /**
   * Encrypt message
   * @param message Message to encrypt
   * @param key Encryption key
   */
  public Encrypt(message: string, key?: string) {
    if (!key) {
      key = 'OCGDESecurityAES';
    }
    return cryptojs.AES.encrypt(message, this.getKey(key), {
      iv: this.getKey('OCGMobileService')
    }).toString();
  }

  /**
   * Decrypt message
   * @param message Message to decrypt
   * @param key Encryption key
   */
  public Decrypt(message: string, key?: string) {
    if (!key) {
      key = 'OCGDESecurityAES';
    }
    return cryptojs.AES.decrypt(message, this.getKey(key), {
      iv: this.getKey('OCGMobileService')
    }).toString(cryptojs.enc.Utf8);
  }
}
