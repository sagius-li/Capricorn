import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { faCompress, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import { DcComponent } from '../../models/dccomponent.interface';
import { ResourceTableConfig, ResourceColumnConfig } from './resource-table.component';

@Component({
  selector: 'app-resource-table-config',
  templateUrl: './resource-table-config.component.html',
  styleUrls: ['./resource-table-config.component.css']
})
export class ResourceTableConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('exampleResourceTable')
  exampleResourceTable: DcComponent;

  faCollapseAll = faCompress;
  faExpendAll = faExpandArrowsAlt;

  tmpPageSize: number;

  constructor(
    public dialogRef: MatDialogRef<ResourceTableConfigComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      objectRef: any;
      objectConfig: ResourceTableConfig;
    }
  ) {}

  ngOnInit() {
    this.tmpPageSize = this.data.objectConfig.pageSize;
  }

  ngAfterViewInit() {
    this.data.objectConfig = this.exampleResourceTable.initComponent();
  }

  onApplyQuery() {
    this.exampleResourceTable.updateDataSource();
  }

  onApplyPageSize() {
    this.data.objectConfig.pageSize = this.tmpPageSize;
    this.exampleResourceTable.updateDataSource();
  }

  onToggleColumnDisplay(column: ResourceColumnConfig) {
    if (column.display) {
      column.display = !column.display;
    } else {
      column.display = true;
    }
  }

  onDeleteColumn(column: ResourceColumnConfig) {
    const index = this.data.objectConfig.columns.findIndex(c => c.field === column.field);
    if (index > -1) {
      this.data.objectConfig.columns.splice(index, 1);
    }
  }

  onApplyColumns() {
    this.exampleResourceTable.updateDataSource();
  }

  onAddColumn() {
    this.data.objectConfig.columns.push({
      field: 'DisplayName',
      title: 'Display Name',
      width: 100,
      filterable: false,
      filter: 'text',
      sortable: false,
      locked: false
    });
  }

  onExpendAll() {
    this.data.objectConfig.columns.map(c => (c.display = true));
  }

  onCollapseAll() {
    this.data.objectConfig.columns.map(c => (c.display = false));
  }
}
