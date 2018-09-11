import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';
import {
  ChartLegend,
  ChartConfig,
  SeriesConfig,
  Position,
  TooltipConfig,
  LabelConfig
} from '../../models/chart.model';

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

  constructor() {}

  ngOnInit() {
    this.chartConfig = {
      chartTitle: this.chartTitle,
      legend: this.legend,
      seriesType: this.seriesType,
      seriesConfig: this.seriesConfig,
      seriesData: this.seriesData,
      tooltipConfig: this.tooltipConfig,
      labelConfig: this.labelConfig
    };

    if (this.chartConfig && this.chartConfig.seriesConfig) {
      const colors = this.chartConfig.seriesConfig
        .filter(c => c.color)
        .map(a => a.color);
      this.chartConfig.seriesColors =
        colors && colors.length > 0 ? colors : undefined;
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
