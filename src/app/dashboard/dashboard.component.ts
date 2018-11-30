import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';

import { WidgetService } from '../core/services/widget.service';
import { SwapService } from '../core/services/swap.service';

import { DchostDirective } from '../core/directives/dchost.directive';
import { DcComponent } from '../core/models/dccomponent.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren(DchostDirective)
  dcHosts: QueryList<DchostDirective>;

  widgetConfig = [];
  colNumber = 6;
  editMode = false;

  constructor(
    private widgetService: WidgetService,
    private cfr: ComponentFactoryResolver,
    private swap: SwapService
  ) {}

  ngOnInit() {
    // #region mock data
    const widgetConfigStr = `
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
            "iconText": "person",
            "title": "managed users",
            "mainText": "{0}",
            "query": "/Person[Manager=/Person[DisplayName='mimadmin']]"
          }
        },
        {
          "name": "Mock 3",
          "type": "ResourceTableComponent",
          "description": "Mock 3",
          "position": "cell3",
          "colSpan": 3,
          "rowSpan": 2,
          "data": {
            "title": "All Users",
            "query": "/Person",
            "pageSize": 5,
            "exportToPDF": true,
            "exportToExcel": true,
            "exportAllPages": true,
            "columns": [
              {
                "field": "DisplayName",
                "title": "Display Name",
                "width": 100,
                "filterable": false,
                "filter": "text",
                "sortable": true,
                "locked": false
              },
              {
                "field": "AccountName",
                "title": "Account Name",
                "width": 100,
                "filterable": false,
                "filter": "text",
                "sortable": true,
                "locked": false
              }
            ]
          }
        }
      ]
    `;
    // #endregion
    this.widgetConfig = this.widgetService.getWidgetConfig(widgetConfigStr);

    this.swap.windowResize.subscribe((size: string) => {
      switch (size) {
        case 'xs':
          this.colNumber = 2;
          break;
        case 'sm':
          this.colNumber = 4;
          break;
        case 'md':
          this.colNumber = 6;
          break;
        case 'lg':
          this.colNumber = 8;
          break;
        default:
          this.colNumber = 6;
          break;
      }
    });
    this.swap.verifyWindowSize();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.widgetConfig.forEach(widget => {
        const componentFactory = this.cfr.resolveComponentFactory(widget.type);
        const host = this.dcHosts.find(h => h.hostName === widget.position);
        if (host) {
          const viewContainerRef = host.viewContainerRef;
          viewContainerRef.clear();
          const componentRef = viewContainerRef.createComponent(componentFactory);
          widget.componentRef = componentRef;
          (<DcComponent>componentRef.instance).data = widget.data;
        }
      });
    }, 0);
  }

  onMoveWidget($event: any, target: any) {
    const sourceConfig = $event.dragData;
    const targetConfig = target;

    const sourceIndex = this.widgetConfig.findIndex(w => w.position === sourceConfig.position);
    const targetIndex = this.widgetConfig.findIndex(w => w.position === targetConfig.position);

    this.widgetConfig[sourceIndex] = targetConfig;
    this.widgetConfig[targetIndex] = sourceConfig;
  }

  onResize($event, config) {
    config.colSpan = $event[0];
    config.rowSpan = $event[1];

    (<DcComponent>config.componentRef.instance).resize($event);
  }

  onDragbarConfigure(config) {
    (<DcComponent>config.componentRef.instance).configure();
  }

  onDragbarDelete(config) {
    const index = this.widgetConfig.findIndex(w => w.position === config.position);
    if (index > -1) {
      this.widgetConfig.splice(index, 1);
    }
  }

  onEditbarEdit() {
    this.editMode = true;
  }

  onEditbarCancel() {
    this.editMode = false;
  }
}
