import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ResourceTableConfig } from './resource-table.component';
import { DcComponent } from '../../models/dccomponent.interface';

@Component({
  selector: 'app-resource-table-config',
  templateUrl: './resource-table-config.component.html',
  styleUrls: ['./resource-table-config.component.css']
})
export class ResourceTableConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('exampleResourceTable')
  exampleResourceTable: DcComponent;

  constructor(
    public dialogRef: MatDialogRef<ResourceTableConfigComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      objectRef: any;
      objectConfig: ResourceTableConfig;
    }
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.data.objectConfig = this.exampleResourceTable.initComponent();
  }
}
