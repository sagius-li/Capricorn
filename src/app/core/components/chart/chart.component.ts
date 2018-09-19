import { Component, OnInit, Input } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { forkJoin } from 'rxjs';

import {
  ChartLegend,
  ChartConfig,
  SeriesConfig,
  Position,
  TooltipConfig,
  LabelConfig,
  QueryConfig
} from '../../models/chart.model';

import { MatDialog } from '@angular/material';

import { DcComponent } from '../../models/dccomponent.interface';
import { ResourceService } from '../../services/resource.service';
import { ChartConfigComponent } from '../chart/chartconfig.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, DcComponent {
  @Input()
  data: ChartConfig;

  @Input()
  seriesType = 'pie';
  @Input()
  chartTitle: string;
  @Input()
  seriesColor = [
    '#3f51b5',
    '#2196f3',
    '#43a047',
    '#ffc107',
    '#ff5722',
    '#e91E63'
  ];
  @Input()
  legend: ChartLegend = { position: Position.bottom, visible: false };
  @Input()
  seriesConfig: SeriesConfig[] = [
    {
      name: 'dummy',
      categoryField: 'category',
      valueField: 'value',
      data: [{ category: 'dummy', value: 1 }]
    }
  ];
  @Input()
  queryConfig: QueryConfig[] = undefined;
  @Input()
  tooltipConfig: TooltipConfig = { format: '{0}: {1}', visible: false };
  @Input()
  labelConfig: LabelConfig = { format: '{1}', visible: false, color: 'black' };

  chartConfig: ChartConfig;

  constructor(
    private svcResource: ResourceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // init chartConfig using @input values
    this.chartConfig = {
      chartTitle: this.chartTitle,
      legend: this.legend,
      seriesType: this.seriesType,
      seriesColor: this.seriesColor,
      seriesConfig: this.seriesConfig,
      tooltipConfig: this.tooltipConfig,
      labelConfig: this.labelConfig
    };

    // overwrite chartConfig with data
    if (this.data) {
      if (this.data.chartTitle) {
        this.chartConfig.chartTitle = this.data.chartTitle;
      }
      if (this.data.legend) {
        this.chartConfig.legend = this.data.legend;
      }
      if (this.data.seriesType) {
        this.chartConfig.seriesType = this.data.seriesType;
      }
      if (this.data.seriesColor) {
        this.chartConfig.seriesColor = this.data.seriesColor;
      }
      if (this.data.seriesConfig) {
        this.chartConfig.seriesConfig = this.data.seriesConfig;
      }
      if (this.data.tooltipConfig) {
        this.chartConfig.tooltipConfig = this.data.tooltipConfig;
      }
      if (this.data.labelConfig) {
        this.chartConfig.labelConfig = this.data.labelConfig;
      }
    }

    // overwrite series data with query fetching results
    this.chartConfig.seriesConfig.forEach(seriesConfig => {
      if (seriesConfig.queryConfig) {
        this.spinner.show();

        setTimeout(() => {
          const observableBatch = [];
          const names = [];
          seriesConfig.queryConfig.forEach(config => {
            if (config.name && config.method && config.query) {
              names.push(config.name);
              observableBatch.push(
                this.svcResource.callMethod('', config.method, 'get', {
                  query: config.query
                })
              );
            }
          });
          if (observableBatch.length === seriesConfig.queryConfig.length) {
            forkJoin(observableBatch).subscribe(result => {
              const chartData = [];
              result.forEach((item, index) => {
                const data = {};
                data[seriesConfig.categoryField] = names[index];
                data[seriesConfig.valueField] = item;
                chartData.push(data);
              });
              seriesConfig.data = chartData;

              this.spinner.hide();
            });
          }
        }, 1000);
      }
    });
  }

  resize(size: number[]) {}

  configure() {
    const dialogRef = this.dialog.open(ChartConfigComponent, {
      minWidth: '500px',
      data: this.chartConfig
    });

    return null;
  }

  public labelContent = (e: any) => {
    if (this.labelConfig && this.labelConfig.visible) {
      return this.labelConfig.format
        .replace(/\{0\}/g, e.category)
        .replace(/\{1\}/g, e.value);
    }
    return undefined;
    // tslint:disable-next-line:semicolon
  };

  tooltipContent(category: string, value: string): string {
    if (this.tooltipConfig && this.tooltipConfig.visible) {
      return this.tooltipConfig.format
        .replace(/\{0\}/g, category)
        .replace(/\{1\}/g, value);
    }

    return undefined;
  }
}
