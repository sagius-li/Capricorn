import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { StartupService } from '../services/startup.service';

import { DchostDirective } from '../directives/dchost.directive';

export function startup(startupService: StartupService) {
  return (conn?: string) => startupService.start(conn);
}

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [DchostDirective],
  providers: [ConfigService, ResourceService, StartupService],
  exports: [DchostDirective]
})
export class CoreModule {}
