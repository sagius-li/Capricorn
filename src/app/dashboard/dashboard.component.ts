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

import { MatDialog, MatDialogRef } from '@angular/material';

import { DchostDirective } from '../core/directives/dchost.directive';
import { DcComponent } from '../core/models/dccomponent.interface';
import { WidgetCreatorComponent } from '../core/components/widget-creator/widget-creator.component';

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
    private swap: SwapService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // #region mock data
    const widgetConfigStr = `
      [
        {
          "name": "Request Overview",
          "type": "ChartComponent",
          "description": "Request Overview",
          "position": "cell1",
          "colSpan": 2,
          "rowSpan": 2,
          "data": {
            "chartTitle": "Request Overview",
            "labelConfig": {
              "color": "black",
              "format": "{1}",
              "visible": "true"
            },
            "legend": {
              "position": "right",
              "visible": "true"
            },
            "tooltipConfig": {
              "format": "{0}: {1}",
              "visible": "true"
            },
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
                    "name": "failed",
                    "method": "resource/win/get/count",
                    "query": "/Request[RequestStatus!='completed' and RequestStatus!='authorizing']"
                  }
                ]
              }
            ]
          }
        },
        {
          "name": "Managed Users",
          "type": "StateCardComponent",
          "description": "Managed Users",
          "position": "cell2",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
            "iconText": "person",
            "title": "managed users",
            "mainText": "{0}",
            "query": "/Person[Manager='[//loginUser]']"
          }
        },
        {
          "name": "Managed Groups",
          "type": "StateCardComponent",
          "description": "Managed Groups",
          "position": "cell3",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
            "iconText": "group",
            "iconColor": "rgb(240,172,63)",
            "title": "managed groups",
            "mainText": "{0}",
            "query": "/Group[Owner='[//loginUser]']"
          }
        },
        {
          "name": "Managed Roles",
          "type": "StateCardComponent",
          "description": "Managed Roles",
          "position": "cell4",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
            "iconText": "apps",
            "iconColor": "rgb(63,142,240)",
            "title": "managed roles",
            "mainText": "{0}",
            "query": "/ocgRole[Manager='[//loginUser]']"
          }
        },
        {
          "name": "Managed Permissions",
          "type": "StateCardComponent",
          "description": "Managed Permissions",
          "position": "cell5",
          "colSpan": 2,
          "rowSpan": 1,
          "data": {
            "iconText": "extension",
            "iconColor": "rgb(236,162,235)",
            "title": "managed permissions",
            "mainText": "{0}",
            "query": "/ocgPermission[Manager='[//loginUser]']"
          }
        },
        {
          "name": "All Users",
          "type": "ResourceTableComponent",
          "description": "All Users",
          "position": "cell6",
          "colSpan": 4,
          "rowSpan": 2,
          "data": {
            "title": "All Users",
            "query": "/Person",
            "pageSize": 5,
            "exportToPDF": true,
            "exportToExcel": false,
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

  onEditbarAdd() {
    const dialogRef: MatDialogRef<any> = this.dialog.open(WidgetCreatorComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        result.position = 'cell' + this.widgetConfig.length + 1;
        result.colSpan = 2;
        result.rowSpan = 2;
        this.widgetConfig.push(result);

        setTimeout(() => {
          const componentFactory = this.cfr.resolveComponentFactory(result.type);
          const host = this.dcHosts.find(h => h.hostName === result.position);
          if (host) {
            const viewContainerRef = host.viewContainerRef;
            viewContainerRef.clear();
            const componentRef = viewContainerRef.createComponent(componentFactory);
            result.componentRef = componentRef;
            (<DcComponent>componentRef.instance).data = result.data;
          }
        }, 0);
      }
    });
  }
}
