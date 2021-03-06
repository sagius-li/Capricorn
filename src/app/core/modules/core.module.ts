import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DndModule } from 'ng2-dnd';
import { DragulaModule } from 'ng2-dragula';
import { ColorPickerModule } from 'ngx-color-picker';
import { LocalizationModule } from '../modules/localization.module';
import { AdalService, AdalGuard } from 'adal-angular4';

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
import { MatRadioModule } from '@angular/material/radio';

import { NgxSpinnerModule } from 'ngx-spinner';

import { ChartsModule } from '@progress/kendo-angular-charts';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { StartupService } from '../services/startup.service';
import { WidgetService } from '../services/widget.service';
import { SwapService } from '../services/swap.service';

import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

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
import { ResourceTableConfigComponent } from '../components/resource-table/resource-table-config.component';
import { SigninComponent } from '../components/signin/signin.component';
import { SearchComponent } from '../components/search/search.component';
import { InfoBrandComponent } from '../components/info-brand/info-brand.component';
import { InfoDetailComponent } from '../components/info-detail/info-detail.component';
import { ProfileComponent } from '../components/profile/profile.component';

import { WidgetCreatorComponent } from '../components/widget-creator/widget-creator.component';
import { EditorCreatorComponent } from '../components/editor-creator/editor-creator.component';
import { EditorTextComponent } from '../components/editor-text/editor-text.component';
import { EditorTextConfigComponent } from '../components/editor-text/editor-text-config.component';

/** @ignore */
export function startup(startupService: StartupService) {
  return () => startupService.start();
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    FontAwesomeModule,
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
    MatRadioModule,
    NgxSpinnerModule,
    ChartsModule,
    DialogsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    PopupModule,
    DropDownsModule
  ],
  declarations: [
    DchostDirective,
    DragComponent,
    EditbarComponent,
    MockComponent,
    SigninComponent,
    ChartComponent,
    ChartConfigComponent,
    PopupComponent,
    StateCardComponent,
    StateCardConfigComponent,
    ResourceTableComponent,
    ResourceTableConfigComponent,
    SearchComponent,
    InfoBrandComponent,
    InfoDetailComponent,
    ProfileComponent,

    SafeHtmlPipe,

    WidgetCreatorComponent,
    EditorCreatorComponent,
    EditorTextComponent,
    EditorTextConfigComponent
  ],
  entryComponents: [
    MockComponent,
    PopupComponent,
    ChartComponent,
    ChartConfigComponent,
    StateCardComponent,
    StateCardConfigComponent,
    ResourceTableComponent,
    ResourceTableConfigComponent,

    WidgetCreatorComponent,
    EditorCreatorComponent,
    EditorTextComponent,
    EditorTextConfigComponent
  ],
  providers: [
    AuthService,
    ConfigService,
    ResourceService,
    StartupService,
    WidgetService,
    SwapService,
    AdalService,
    AdalGuard
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AdalInterceptor,
    //   multi: true
    // }
  ],
  exports: [
    FormsModule,

    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,

    LocalizationModule,
    DndModule,
    FlexLayoutModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    ChartsModule,
    GridModule,
    PDFModule,
    ExcelModule,

    DchostDirective,

    SafeHtmlPipe,

    DragComponent,
    EditbarComponent,
    SigninComponent,
    MockComponent,
    ChartComponent,
    StateCardComponent,
    ResourceTableComponent,
    SearchComponent,
    InfoBrandComponent,
    InfoDetailComponent,
    ProfileComponent,

    EditorTextComponent
  ]
})
export class CoreModule {}
