import { Injectable } from '@angular/core';

import { MockComponent } from '../components/mock/mock.component';
import { ChartComponent } from '../components/chart/chart.component';
import { StateCardComponent } from '../components/state-card/state-card.component';
import { ResourceTableComponent } from '../components/resource-table/resource-table.component';

import { EditorTextComponent } from '../components/editor-text/editor-text.component';

/**
 * Service for dynamic component creation
 */
@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  /**
   * A dictionary of available components, which can be created dynamically
   */
  widgetIndex = {
    MockComponent: MockComponent,
    ChartComponent: ChartComponent,
    StateCardComponent: StateCardComponent,
    ResourceTableComponent: ResourceTableComponent,

    EditorTextComponent: EditorTextComponent
  };

  /** Used to configure components with their default settings */
  widgetDefaultConfig: Array<any> = [
    {
      name: 'ChartComponent',
      displayName: 'Chart Widget',
      type: 'Widget',
      icon: 'pie_chart',
      description: '',
      defaultConfig: {
        name: '',
        type: ChartComponent,
        description: '',
        data: {
          chartTitle: '',
          labelConfig: {
            color: 'black',
            format: '{1}',
            visible: false
          },
          legend: {
            position: 'bottom',
            visible: false
          },
          tooltipConfig: {
            format: '{0}: {1}',
            visible: false
          }
        }
      }
    },
    {
      name: 'StateCardComponent',
      displayName: 'Card Widget',
      type: 'Widget',
      icon: 'assignment',
      description: '',
      defaultConfig: {
        name: '',
        type: StateCardComponent,
        description: '',
        data: {
          iconText: 'settings',
          title: 'dummy',
          mainText: '{0}',
          query: `/Person[DisplayName='dummy']`
        }
      }
    },
    {
      name: 'ResourceTableComponent',
      displayName: 'Resource Table',
      type: 'Widget',
      icon: 'today',
      description: '',
      defaultConfig: {
        name: '',
        type: ResourceTableComponent,
        description: '',
        data: {
          title: '',
          query: `/Person[DisplayName='dummy']`
        }
      }
    },
    {
      name: 'EditorTextComponent',
      displayName: 'Text Editor',
      type: 'AttributeEditor',
      description: '',
      defaultConfig: {
        name: '',
        type: EditorTextComponent,
        attributeName: '',
        data: {
          instanceName: ''
        }
      }
    }
  ];

  /** @ignore */
  constructor() {}

  /**
   * Convert widget configuration information into an object
   * @param config Widget configuration in string format
   */
  public getWidgetConfig(config: string) {
    const obj = JSON.parse(config, (key, value) => {
      if (key === 'type') {
        return this.widgetIndex[value];
      } else {
        return value;
      }
    });

    // const obj = JSON.parse(config);

    return obj;
  }
}
