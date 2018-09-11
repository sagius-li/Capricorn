import { Component, OnInit, Input } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';

import { DcComponent } from '../../models/dccomponent.interface';
import {
  ChartLegend,
  ChartConfig,
  SeriesConfig,
  Position,
  TooltipConfig,
  LabelConfig
} from '../../models/chart.model';
import { ResourceService } from '../../services/resource.service';

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
  legend: ChartLegend = { position: Position.bottom, visible: false };
  @Input()
  seriesData: any[] = [{ category: 'dummy', value: 1 }];
  @Input()
  seriesConfig: SeriesConfig[] = [
    { name: 'dummy', categoryField: 'category', valueField: 'value' }
  ];
  @Input()
  tooltipConfig: TooltipConfig = { format: '{0}: {1}', visible: false };
  @Input()
  labelConfig: LabelConfig = { format: '{1}', visible: false };

  chartConfig: ChartConfig;

  constructor(private svcResource: ResourceService) {}

  ngOnInit() {
    // init chartConfig using @input values
    this.chartConfig = {
      chartTitle: this.chartTitle,
      legend: this.legend,
      seriesType: this.seriesType,
      seriesConfig: this.seriesConfig,
      seriesData: this.seriesData,
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
      if (this.data.seriesConfig) {
        this.chartConfig.seriesConfig = this.data.seriesConfig;
      }
      if (this.data.tooltipConfig) {
        this.chartConfig.tooltipConfig = this.data.tooltipConfig;
      }
      if (this.data.labelConfig) {
        this.chartConfig.labelConfig = this.data.labelConfig;
      }
      if (this.data.seriesData) {
        this.chartConfig.seriesData = this.data.seriesData;
      }
    }

    // extract series colors
    if (this.chartConfig && this.chartConfig.seriesConfig) {
      const colors = this.chartConfig.seriesConfig
        .filter(c => c.color)
        .map(a => a.color);
      this.chartConfig.seriesColors =
        colors && colors.length > 0 ? colors : undefined;
    }

    const seriesConfigWithQuery = this.chartConfig.seriesConfig.filter(
      s => s.queryConfg
    );
    if (seriesConfigWithQuery.length === this.chartConfig.seriesConfig.length) {
      const observableBatch = [];
      this.chartConfig.seriesConfig.forEach(config => {
        if (config.queryConfg.method && config.queryConfg.query) {
          observableBatch.push(
            this.svcResource.callMethod('', config.queryConfg.method, 'get', {
              query: config.queryConfg.query
            })
          );
        }
      });
      if (observableBatch.length === this.chartConfig.seriesConfig.length) {
        forkJoin(observableBatch).subscribe(
          result => {
            const chartData = [];
            result.forEach((item, index) => {
              const data = {};
              data[
                this.chartConfig.seriesConfig[index].categoryField
              ] = this.chartConfig.seriesConfig[index].name;
              data[this.chartConfig.seriesConfig[index].valueField] = item;
              chartData.push(data);
            });
            this.chartConfig.seriesData = chartData;
          },
          err => {}
        );
      }
    }
  }

  resize(size: number[]) {}

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
