import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { Observable, Observer, of } from 'rxjs';
import { merge, switchMap, startWith, map, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { DSResourceSet } from '../core/models/resource.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, AfterViewInit {
  // #region members for title
  userName = '';
  // #endregion
  // #region members for general information
  dsVersion = '';
  currentLanguage = '';
  // #endregion
  // #region members for localization
  languages: string[];
  // #endregion
  // #region members for data service
  users: DSResourceSet;
  // #endregion
  // #region members for async lazy loading
  asyncTabTask: Observable<string[]>;
  // #endregion
  // #region members for material table
  displayedColumns = ['DisplayName', 'FirstName', 'LastName', 'AccountName'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // #endregion

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

    // async lazy loading
    this.asyncTabTask = Observable.create((observer: Observer<string[]>) => {
      setTimeout(() => {
        observer.next(['First', 'Second', 'Third']);
      }, 3000);
    });
  }

  ngAfterViewInit() {
    // material table
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.paginator.page
      .pipe(
        merge(this.sort.sortChange),
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          const sortAttribute = `${this.sort.active}:${this.sort.direction}`;
          return this.resource.getResourceByQuery(
            `/Person[starts-with(DisplayName,'%')]`,
            ['DisplayName', 'FirstName', 'LastName', 'AccountName'],
            false,
            this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize,
            127,
            false,
            false,
            [],
            [sortAttribute]
          );
        }),
        map((data: DSResourceSet) => {
          this.isLoadingResults = false;
          this.resultsLength = data.TotalCount;
          return data.Resources;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
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
