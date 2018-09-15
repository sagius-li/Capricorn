import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from './core/modules/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TestComponent } from './test/test.component';
import { LoadingspinnerComponent } from './test/loadingspinner/loadingspinner.component';

import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';

import { LayoutModule } from '@progress/kendo-angular-layout';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    HomeComponent,
    DashboardComponent,
    TestComponent,
    SidebarComponent,
    LoadingspinnerComponent
  ],
  imports: [
    BrowserModule,

    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    DndModule.forRoot(),
    FlexLayoutModule,

    CoreModule,
    AppRoutingModule,

    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatGridListModule,

    LayoutModule
  ],
  entryComponents: [LoadingspinnerComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
