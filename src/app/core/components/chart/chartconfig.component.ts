import { Component, OnInit, Inject, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {
  ChartConfig,
  SeriesConfig,
  QueryConfig
} from '../../models/chart.model';

@Component({
  selector: 'app-chartconfig',
  templateUrl: './chartconfig.component.html',
  styleUrls: ['./chartconfig.component.css']
})
export class ChartConfigComponent implements OnInit {
  dummyQuery: QueryConfig = {
    name: 'dummy',
    method: 'resource/win/get/count',
    // tslint:disable-next-line:quotemark
    query: "/*[DisplayName='dummy']"
  };

  dummySerie: SeriesConfig = {
    name: 'dummy',
    categoryField: 'category',
    valueField: 'value'
  };

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

  onAddSeries(seriesName: string) {
    const seriesToCreate = Object.assign({}, this.dummySerie);
    seriesToCreate.name = seriesName;
    seriesToCreate.queryConfig = [Object.assign({}, this.dummyQuery)];
    this.data.objectConfig.seriesConfig.push(seriesToCreate);
  }

  onApplySeries() {
    this.data.objectRef.applyQueries();
  }

  onDeleteSeries(serie: SeriesConfig) {
    const index = this.data.objectConfig.seriesConfig.findIndex(
      s => s.name === serie.name
    );
    if (index > -1) {
      this.data.objectConfig.seriesConfig.splice(index, 1);
    }
  }

  onAddQuery(serie: SeriesConfig) {
    const queryToCreate = Object.assign({}, this.dummyQuery);
    serie.queryConfig.push(queryToCreate);
  }

  onDeleteQuery(serie: SeriesConfig, query: QueryConfig) {
    const index = serie.queryConfig.findIndex(q => q.name === query.name);
    if (index > -1) {
      serie.queryConfig.splice(index, 1);
    }
  }

  trackByFn(index) {
    return index;
  }
}
