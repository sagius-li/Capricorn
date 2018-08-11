import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';

import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { StartupService } from '../services/startup.service';
import { WidgetService } from '../services/widget.service';

import { DchostDirective } from '../directives/dchost.directive';

import { MockComponent } from '../components/mock/mock.component';

export function startup(startupService: StartupService) {
  return (conn?: string) => startupService.start(conn);
}

@NgModule({
  imports: [CommonModule, HttpClientModule, FlexLayoutModule],
  declarations: [DchostDirective, MockComponent],
  entryComponents: [MockComponent],
  providers: [ConfigService, ResourceService, StartupService, WidgetService],
  exports: [DchostDirective, MockComponent]
})
export class CoreModule {}
