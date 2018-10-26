import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';

import * as cryptojs from 'crypto-js';
import * as moment from 'moment';

/**
 * Provide global functions
 */
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /** Initialization vector for encryption */
  private iv = '';

  /** Default datetime format */
  private datetimeFormat = 'YYYY-MM-DD';

  /**
   * @ignore
   */
  constructor(private config: ConfigService) {
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

  public buildDataServiceUrl(baseUrl: string, controllerName: string, methodName: string) {
    return baseUrl.endsWith('/')
      ? `${baseUrl}${controllerName}/${methodName}`
      : `${baseUrl}/${controllerName}/${methodName}`;
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

  /**
   * Deep copy an object
   * @param obj object to be copied
   */
  public DeepCopy(obj) {
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' !== typeof obj) {
      return obj;
    }

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.DeepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.DeepCopy(obj[attr]);
        }
      }
      return copy;
    }

    // tslint:disable-next-line:quotemark
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  /**
   * Evaluate text as script
   * @param text text to be executed as script
   */
  public EvalScript(text: string) {
    if (text.startsWith('<') && text.endsWith('>')) {
      const script = text.substring(1, text.length - 1).replace(/ /g, '');
      const scripts = script.split('()');
      switch (scripts[0].toLowerCase()) {
        case 'now':
          const now = moment();
          if (scripts.length === 1) {
            return now.format(this.config.getConfig('datetimeDisplayFormat', this.datetimeFormat));
          } else if (scripts.length === 2) {
            return now
              .add(+scripts[1], 'd')
              .format(this.config.getConfig('datetimeDisplayFormat', this.datetimeFormat));
          } else {
            throw new Error(`cannot evaluate expression: ${script}`);
          }
        default:
          throw new Error(`cannot evaluate expression: ${script}`);
      }
    } else {
      return text;
    }
  }
}
