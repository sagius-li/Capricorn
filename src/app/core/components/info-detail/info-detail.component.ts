import { Component, OnInit } from '@angular/core';

import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.css']
})
export class InfoDetailComponent implements OnInit {
  attributeConfig = [];

  attributeConfigStr = `
    [
      {
        "name": "txtDisplayName",
        "type": "EditorTextComponent",
        "attributeName": "DisplayName",
        "data": {
          "instanceName": "txtDisplayName"
        }
      },
      {
        "name": "txtFirstName",
        "type": "EditorTextComponent",
        "attributeName": "FirstName",
        "data": {
          "instanceName": "txtFirstName"
        }
      },
      {
        "name": "txtLastName",
        "type": "EditorTextComponent",
        "attributeName": "LastName",
        "data": {
          "instanceName": "txtLastName"
        }
      }
    ]
    `;

  constructor(private widget: WidgetService) {}

  ngOnInit() {
    this.attributeConfig = this.widget.getWidgetConfig(this.attributeConfigStr);
  }
}
