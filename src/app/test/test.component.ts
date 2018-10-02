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

import * as moment from 'moment';

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

import {
  SeriesConfig,
  QueryConfig,
  ChartConfig,
  Position
} from '../core/models/chart.model';

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
  // #region members for dynamic content and d&d
  @ViewChildren(DchostDirective)
  dcHosts: QueryList<DchostDirective>;
  widgetConfig = [];
  dragEditMode = false;
  // #endregion
  // #region members for charts
  passwordData = [
    {
      date: moment()
        .subtract(4, 'days')
        .toDate(),
      reset: 5,
      register: 12
    },
    {
      date: moment()
        .subtract(3, 'days')
        .toDate(),
      reset: 8,
      register: 10
    },
    {
      date: moment()
        .subtract(2, 'days')
        .toDate(),
      reset: 3,
      register: 16
    },
    {
      date: moment()
        .subtract(1, 'days')
        .toDate(),
      reset: 2,
      register: 18
    },
    {
      date: moment().toDate(),
      reset: 6,
      register: 8
    }
  ];
  requestData = [
    {
      type: 'Completed',
      value: 52
    },
    {
      type: 'Authorizing',
      value: 6
    },
    {
      type: 'Failed',
      value: 2
    },
    {
      type: 'Pending',
      value: 12
    },
    {
      type: 'Processing',
      value: 2
    },
    {
      type: 'PP Error',
      value: 10
    }
  ];
  // #endregion
  // #region members for chart component
  chartSeriesConfig: SeriesConfig[] = [
    {
      name: 'dummy',
      categoryField: 'category',
      valueField: 'value',
      queryConfig: [
        {
          name: 'completed',
          method: 'resource/win/get/count',
          // tslint:disable-next-line:quotemark
          query: "/Request[RequestStatus='completed']"
        },
        {
          name: 'pending',
          method: 'resource/win/get/count',
          // tslint:disable-next-line:quotemark
          query: "/Request[RequestStatus='pending']"
        },
        {
          name: 'failed',
          method: 'resource/win/get/count',
          query:
            // tslint:disable-next-line:quotemark
            "/Request[RequestStatus!='completed' and RequestStatus!='pending']"
        }
      ]
    }
  ];
  chartData: ChartConfig = {
    chartTitle: 'Requests',
    seriesType: 'donut',
    seriesConfig: this.chartSeriesConfig,
    legend: { position: Position.bottom, visible: true },
    labelConfig: { format: '{1}', visible: true, color: 'white' }
  };
  //#endregion

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
          "type": "ChartComponent",
          "description": "Mock 1",
          "position": "cell1",
          "colSpan": 1,
          "rowSpan": 1,
          "data": {
            "seriesConfig": [
              {
                "name": "request",
                "categoryField": "category",
                "valueField": "value",
                "queryConfig": [
                  {
                    "name": "completed",
                    "method": "resource/win/get/count",
                    "query": "/Request[RequestStatus='completed']"
                  },
                  {
                    "name": "pending",
                    "method": "resource/win/get/count",
                    "query": "/Request[RequestStatus='pending']"
                  },
                  {
                    "name": "failed",
                    "method": "resource/win/get/count",
                    "query": "/Request[RequestStatus!='completed' and RequestStatus!='pending']"
                  }
                ]
              }
            ]
          }
        },
        {
          "name": "Mock 2",
          "type": "StateCardComponent",
          "description": "Mock 2",
          "position": "cell2",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
          }
        },
        {
          "name": "Mock 3",
          "type": "MockComponent",
          "description": "Mock 3",
          "position": "cell3",
          "colSpan": 3,
          "rowSpan": 3,
          "data": {
            "content": "Mock 3",
            "bgColor": "lightyellow",
            "image_1_1": "assets/img/mock/22myrequest.PNG"
          }
        },
        {
          "name": "Mock 4",
          "type": "MockComponent",
          "description": "Mock 4",
          "position": "cell4",
          "colSpan": 1,
          "rowSpan": 1,
          "data": {
            "content": "Mock 4",
            "bgColor": "lightyellow",
            "image_1_1": "assets/img/mock/11syncstatus.PNG"
          }
        },
        {
          "name": "Mock 5",
          "type": "MockComponent",
          "description": "Mock 5",
          "position": "cell5",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
            "content": "Mock 5",
            "bgColor": "lightyellow",
            "image_1_1": "assets/img/mock/21groups.PNG"
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
          widget.componentRef = componentRef;
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

  onMoveWidget($event: any, target: any) {
    const sourceConfig = $event.dragData;
    const targetConfig = target;

    const sourceIndex = this.widgetConfig.findIndex(
      w => w.position === sourceConfig.position
    );
    const targetIndex = this.widgetConfig.findIndex(
      w => w.position === targetConfig.position
    );

    this.widgetConfig[sourceIndex] = targetConfig;
    this.widgetConfig[targetIndex] = sourceConfig;
  }

  onResize($event, config) {
    config.colSpan = $event[0];
    config.rowSpan = $event[1];

    (<DcComponent>config.componentRef.instance).resize($event);
  }

  onConfigure(config) {
    (<DcComponent>config.componentRef.instance).configure();
  }

  onDelete(config) {
    const index = this.widgetConfig.findIndex(
      w => w.position === config.position
    );
    if (index > -1) {
      this.widgetConfig.splice(index, 1);
    }
  }

  onEditbarEdit() {
    this.dragEditMode = true;
  }

  onEditbarCancel() {
    this.dragEditMode = false;
  }

  labelContent(e: any): string {
    return e.category;
  }
}
