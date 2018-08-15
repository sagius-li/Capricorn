import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';

import { WidgetService } from '../core/services/widget.service';

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
  colNumber = 4;

  constructor(
    private widgetService: WidgetService,
    private cfr: ComponentFactoryResolver
  ) {
    window.onresize = e => {
      if (window.innerWidth < 840) {
        this.colNumber = 2;
      } else if (window.innerWidth >= 840 && window.innerWidth < 1600) {
        this.colNumber = 4;
      } else {
        this.colNumber = 6;
      }
    };
  }

  ngOnInit() {
    // #region mock data
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
          "rowSpan": 2,
          "colSpan": 2,
          "data": {
            "content": "Mock 6",
            "bgColor": "lightgreen"
          }
        },
        {
          "name": "Mock 7",
          "type": "MockComponent",
          "description": "Mock 7",
          "position": "cell7",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 7",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 8",
          "type": "MockComponent",
          "description": "Mock 8",
          "position": "cell8",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 8",
            "bgColor": "lightyellow"
          }
        },
        {
          "name": "Mock 9",
          "type": "MockComponent",
          "description": "Mock 9",
          "position": "cell9",
          "rowSpan": 1,
          "colSpan": 1,
          "data": {
            "content": "Mock 9",
            "bgColor": "lightyellow"
          }
        }
      ]
    `;
    // #endregion
    this.widgetConfig = this.widgetService.getWidgetConfig(configStr);
  }

  ngAfterViewInit() {
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
}
