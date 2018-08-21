import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ng2-dnd';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { StartupService } from '../services/startup.service';
import { WidgetService } from '../services/widget.service';

import { DchostDirective } from '../directives/dchost.directive';

import { DragComponent } from '../components/drag/drag.component';
import { MockComponent } from '../components/mock/mock.component';

export function startup(startupService: StartupService) {
  return (conn?: string) => startupService.start(conn);
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    DndModule,
    MatMenuModule,
    MatIconModule
  ],
  declarations: [DchostDirective, DragComponent, MockComponent],
  entryComponents: [MockComponent],
  providers: [ConfigService, ResourceService, StartupService, WidgetService],
  exports: [DndModule, DchostDirective, DragComponent, MockComponent]
})
export class CoreModule {}
