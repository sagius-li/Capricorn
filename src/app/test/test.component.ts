import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  userName = '';
  dsVersion = '';
  currentLanguage = '';

  constructor(
    private config: ConfigService,
    private resource: ResourceService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userName = this.resource.getLoginUser().DisplayName;
    this.dsVersion = this.resource.getVersion();
    this.currentLanguage = this.translate.currentLang;
  }
}
