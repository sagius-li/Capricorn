import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LocalizationModule } from './core/modules/localization.module';
import { CoreModule } from './core/modules/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new MultiTranslateHttpLoader(httpClient, [
    { prefix: '/assets/translate/core/', suffix: '.json' },
    { prefix: './assets/translate/shared/', suffix: '.json' }
  ]);
}

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    DragulaModule.forRoot(),
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    CoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
