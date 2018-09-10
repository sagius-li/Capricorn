import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';

import { LocalizationModule } from '../modules/localization.module';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChartsModule } from '@progress/kendo-angular-charts';

import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { StartupService } from '../services/startup.service';
import { WidgetService } from '../services/widget.service';
import { SwapService } from '../services/swap.service';

import { DchostDirective } from '../directives/dchost.directive';

import { DragComponent } from '../components/drag/drag.component';
import { EditbarComponent } from '../components/editbar/editbar.component';
import { MockComponent } from '../components/mock/mock.component';
import { ChartComponent } from '../components/chart/chart.component';

/** @ignore */
export function startup(startupService: StartupService) {
  return (conn?: string) => startupService.start(conn);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    DndModule,
    LocalizationModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    ChartsModule
  ],
  declarations: [
    DchostDirective,
    DragComponent,
    EditbarComponent,
    MockComponent,
    ChartComponent
  ],
  entryComponents: [MockComponent],
  providers: [
    ConfigService,
    ResourceService,
    StartupService,
    WidgetService,
    SwapService
  ],
  exports: [
    LocalizationModule,
    DndModule,
    MatIconModule,
    ChartsModule,

    DchostDirective,

    DragComponent,
    EditbarComponent,
    MockComponent,
    ChartComponent
  ]
})
export class CoreModule {}
