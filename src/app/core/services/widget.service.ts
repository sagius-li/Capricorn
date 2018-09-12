import { Injectable } from '@angular/core';

import { MockComponent } from '../components/mock/mock.component';
import { ChartComponent } from '../components/chart/chart.component';

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
    ChartComponent: ChartComponent
  };

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
