import { Injectable } from '@angular/core';

import { MockComponent } from '../components/mock/mock.component';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  widgetIndex = {
    MockComponent: MockComponent
  };

  constructor() {}

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
