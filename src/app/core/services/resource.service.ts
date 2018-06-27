import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';

import { ConfigService } from './config.service';
import { DSAttribute, DSResource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  private baseUrl = '';
  private connection = '';
  private loginUserAttributes: string[] = [];
  private loginUser: DSResource = undefined;
  private loaded = false;
}
