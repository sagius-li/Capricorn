import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { DSResourceSet } from '../core/models/resource.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  userName = '';
  dsVersion = '';
  currentLanguage = '';
  languages: string[];
  users: DSResourceSet;

  constructor(
    private config: ConfigService,
    private resource: ResourceService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userName = this.resource.getLoginUser().DisplayName;
    this.dsVersion = this.resource.getVersion();
    this.currentLanguage = this.translate.currentLang;
    this.languages = this.config.getConfig('supportedLanguages');
  }

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }

  onFetchUsers() {
    this.resource
      .getResourceByQuery(
        `/Person[starts-with(DisplayName,'%')]`,
        ['DisplayName', 'AccountName', 'Description', 'CreatedTime'],
        false,
        10,
        0
      )
      .subscribe((resources: DSResourceSet) => {
        this.users = resources;
      });
  }
}
