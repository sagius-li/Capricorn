import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from 'ngx-color-picker';

import { LocalizationModule } from '../modules/localization.module';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

import { NgxSpinnerModule } from 'ngx-spinner';

import { ChartsModule } from '@progress/kendo-angular-charts';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule, PDFModule } from '@progress/kendo-angular-grid';

import { AuthService } from '../services/auth.service';
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
import { ChartConfigComponent } from '../components/chart/chartconfig.component';
import { PopupComponent } from '../components/popup/popup.component';
import { StateCardComponent } from '../components/state-card/state-card.component';
import { StateCardConfigComponent } from '../components/state-card/state-card-config.component';
import { ResourceTableComponent } from '../components/resource-table/resource-table.component';

/** @ignore */
export function startup(startupService: StartupService) {
  return (conn?: string) => startupService.start(conn);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DndModule,
    DragulaModule,
    ColorPickerModule,
    LocalizationModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MatDividerModule,
    NgxSpinnerModule,
    ChartsModule,
    DialogsModule,
    GridModule,
    PDFModule
  ],
  declarations: [
    DchostDirective,
    DragComponent,
    EditbarComponent,
    MockComponent,
    ChartComponent,
    ChartConfigComponent,
    PopupComponent,
    StateCardComponent,
    StateCardConfigComponent,
    ResourceTableComponent
  ],
  entryComponents: [
    MockComponent,
    PopupComponent,
    ChartComponent,
    ChartConfigComponent,
    StateCardComponent,
    StateCardConfigComponent,
    ResourceTableComponent
  ],
  providers: [
    AuthService,
    ConfigService,
    ResourceService,
    StartupService,
    WidgetService,
    SwapService
  ],
  exports: [
    FormsModule,

    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,

    LocalizationModule,
    DndModule,
    NgxSpinnerModule,
    ChartsModule,
    GridModule,
    PDFModule,

    DchostDirective,

    DragComponent,
    EditbarComponent,
    MockComponent,
    ChartComponent,
    StateCardComponent,
    ResourceTableComponent
  ]
})
export class CoreModule {}
