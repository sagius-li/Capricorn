import { TestBed, inject } from '@angular/core/testing';

import { WidgetService } from './widget.service';

xdescribe('WidgetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WidgetService]
    });
  });

  it('should be created', inject([WidgetService], (service: WidgetService) => {
    expect(service).toBeTruthy();
  }));

  it('should return widget config from json', inject(
    [WidgetService],
    (service: WidgetService) => {
      const jsonStr = `
        [
          {
            "name": "Mock 1",
            "type": "MockComponent",
            "description": "Mock 1",
            "position": "1",
            "rowSpan": 1,
            "colSpan": 1,
            "data": {
              "content": "Mock 1",
              "bgColor": "lightblue"
            }
          },
          {
            "name": "Mock 2",
            "type": "MockComponent",
            "description": "Mock 2",
            "position": "2",
            "rowSpan": 1,
            "colSpan": 1,
            "data": {
              "content": "Mock 2",
              "bgColor": "lightyellow"
            }
          }
        ]
      `;

      const obj = service.getWidgetConfig(jsonStr);

      expect(obj).toBeDefined();
    }
  ));
});
