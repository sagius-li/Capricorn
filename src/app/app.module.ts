import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LocalizationModule } from './core/modules/localization.module';
import { CoreModule } from './core/modules/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestComponent } from './test/test.component';

import { MatTabsModule } from '@angular/material/tabs';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    HomeComponent,
    DashboardComponent,
    TestComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,

    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    FlexLayoutModule,
    LocalizationModule,

    CoreModule,
    AppRoutingModule,

    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
