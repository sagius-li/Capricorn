/** enum type for position */
export enum Position {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}

/** Data model for chart legend */
export class ChartLegend {
  visible: boolean;
  position: Position;
}

export class QueryConfig {
  method: string;
  query: string;
}

/** Data model for series config */
export class SeriesConfig {
  name: string;
  categoryField: string;
  valueField: string;
  queryConfg?: QueryConfig;
  color?: string;
}

/** Data model for tooltip config */
export class TooltipConfig {
  format: string;
  visible: boolean;
}

/** Data model for label config */
export class LabelConfig {
  format: string;
  visible: boolean;
  color?: string;
}

/** Data model for chart config */
export class ChartConfig {
  seriesType: string;
  chartTitle?: string;
  legend?: ChartLegend;
  seriesData: any[];
  seriesColors?: string[];
  seriesConfig: SeriesConfig[];
  tooltipConfig?: TooltipConfig;
  labelConfig?: LabelConfig;
}
