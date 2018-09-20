import { Component, OnInit, Inject, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ChartConfig } from '../../models/chart.model';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-chartconfig',
  templateUrl: './chartconfig.component.html',
  styleUrls: ['./chartconfig.component.css']
})
export class ChartConfigComponent implements OnInit {
  advancedMode = false;

  constructor(
    public dialogRef: MatDialogRef<ChartConfigComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      objectRef: any;
      objectConfig: ChartConfig;
    }
  ) {}

  ngOnInit() {}

  onCPClosed() {
    this.data.objectConfig.tooltipConfig.visible = !this.data.objectConfig
      .tooltipConfig.visible;
    setTimeout(() => {
      this.data.objectConfig.tooltipConfig.visible = !this.data.objectConfig
        .tooltipConfig.visible;
    }, 0);
  }

  onApplySeries() {
    this.data.objectRef.applyQueries();
  }

  trackByFn(index) {
    return index;
  }
}
