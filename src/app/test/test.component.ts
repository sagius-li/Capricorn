import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';

import { Observable, Observer, of } from 'rxjs';
import {
  merge,
  switchMap,
  startWith,
  map,
  catchError,
  delay
} from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { WidgetService } from '../core/services/widget.service';

import { DSResourceSet } from '../core/models/resource.model';

import { DchostDirective } from '../core/directives/dchost.directive';
import { DcComponent } from '../core/models/dccomponent.interface';
import { DynamicContentService } from './dynamiccontent.service';

import { LoadingspinnerComponent } from './loadingspinner/loadingspinner.component';

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
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  // #endregion
  @ViewChildren(DchostDirective)
  dcHosts: QueryList<DchostDirective>;
  widgetConfig = [];

  constructor(
    private config: ConfigService,
    private resource: ResourceService,
    private translate: TranslateService,
    private cfr: ComponentFactoryResolver,
    private dcontent: DynamicContentService,
    private widget: WidgetService
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

    // dynamic content
    const configStr = `
      [
        {
          "name": "Mock 1",
          "type": "MockComponent",
          "description": "Mock 1",
          "position": "cell1",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 1",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 2",
          "type": "MockComponent",
          "description": "Mock 2",
          "position": "cell2",
          "rowSpan": 2,
          "colSpan": 1,
          "data": {
            "content": "Mock 2",
            "bgColor": "lightblue"
          }
        },
        {
          "name": "Mock 3",
          "type": "MockComponent",
          "description": "Mock 3",
          "position": "cell3",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 3",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 4",
          "type": "MockComponent",
          "description": "Mock 4",
          "position": "cell4",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 4",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 5",
          "type": "MockComponent",
          "description": "Mock 5",
          "position": "cell5",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 5",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 6",
          "type": "MockComponent",
          "description": "Mock 6",
          "position": "cell6",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 6",
            "bgColor": "lightyellow"
          }
        }
      ]
    `;
    this.widgetConfig = this.widget.getWidgetConfig(configStr);
  }

  ngAfterViewInit() {
    // material table
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.paginator.page
      .pipe(
        merge(this.sort.sortChange),
        startWith({}),
        // workaround for "Expression has changed after it was checked" error
        delay(0),
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

    // dynamic content
    setTimeout(() => {
      this.widgetConfig.forEach(widget => {
        const componentFactory = this.cfr.resolveComponentFactory(widget.type);
        const host = this.dcHosts.find(h => h.hostName === widget.position);
        if (host) {
          const viewContainerRef = host.viewContainerRef;
          viewContainerRef.clear();
          const componentRef = viewContainerRef.createComponent(
            componentFactory
          );
          (<DcComponent>componentRef.instance).data = widget.data;
        }
      });
    }, 0);
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

  onLoadWithService() {
    const host = this.dcontent.reveal(
      LoadingspinnerComponent,
      document.querySelector('#spinnerContainer')
    );
    setTimeout(() => {
      this.dcontent.hide(host);
    }, 3000);
  }

  onLoadWithDirective() {
    const componentFactory = this.cfr.resolveComponentFactory(
      LoadingspinnerComponent
    );
    const host = this.dcHosts.find(h => h.hostName === 'host1');
    if (host) {
      const viewContainerRef = host.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      setTimeout(() => {
        viewContainerRef.clear();
      }, 3000);
    }
  }
}
