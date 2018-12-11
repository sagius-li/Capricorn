import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { WidgetService } from '../../services/widget.service';

@Component({
  selector: 'app-widget-creator',
  templateUrl: './widget-creator.component.html',
  styleUrls: ['./widget-creator.component.css']
})
export class WidgetCreatorComponent implements OnInit {
  widgetComponents: Array<any>;

  selectedValue: string;
  selectedItem: any;

  constructor(
    private svcWidget: WidgetService,
    public dialogRef: MatDialogRef<WidgetCreatorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.widgetComponents = this.svcWidget.widgetDefaultConfig.filter(w => w.type === 'Widget');
  }

  onChange() {
    const test = '';
    const item = this.svcWidget.widgetDefaultConfig.find(w => w.name === this.selectedValue);
    if (item) {
      this.selectedItem = item.defaultConfig;
    }
  }
}
