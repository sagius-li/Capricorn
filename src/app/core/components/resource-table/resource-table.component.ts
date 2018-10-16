import { Component, OnInit, Input } from '@angular/core';

import { Observable, of } from 'rxjs';
import { skip, take, map } from 'rxjs/operators';

import { State } from '@progress/kendo-data-query';
import {
  GridDataResult,
  DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import { DcComponent } from '../../models/dccomponent.interface';

export class ResourceColumnConfig {
  field: string;
  title: string;
  sortable: boolean;
  filterable: boolean;
  filter: string;
}

export class ResourceTableConfig {
  title?: string;
  pageSize: number;
  sortable: boolean;
  sortMode: string;
  allowUnsort: boolean;
  filterable: boolean;
  filterMode: string;
  selectable: boolean;
  selectMode: string;
  checkboxSelectOnly: boolean;
  resizable: boolean;
  exportToPDF: boolean;
  exportToExcel: boolean;
  exportAllPages: boolean;
  resources?: any[];
  query?: string;
  columns: ResourceColumnConfig[];
}

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.css']
})
export class ResourceTableComponent implements OnInit, DcComponent {
  @Input()
  data: ResourceTableConfig;

  componentConfig: ResourceTableConfig;

  gridState: State;
  gridResources: Observable<GridDataResult>;
  gridLoading: false;
  gridSort: any;
  gridSelect: any;
  gridFilter: any;

  constructor() {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = {
      pageSize: 10,
      sortable: false,
      sortMode: 'single',
      allowUnsort: true,
      filterable: false,
      filterMode: 'menu',
      selectable: false,
      selectMode: 'single',
      checkboxSelectOnly: false,
      resizable: false,
      exportToPDF: false,
      exportToExcel: false,
      exportAllPages: false,
      resources: [{ DisplayName: 'dummy' }],
      columns: [
        {
          field: 'DisplayName',
          title: 'Display Name',
          filterable: false,
          filter: 'string',
          sortable: false
        }
      ]
    };

    this.gridState = {
      take: this.componentConfig.pageSize,
      skip: 0
    };

    this.gridSort = this.componentConfig.sortable
      ? {
          allowUnsort: this.componentConfig.allowUnsort,
          mode: this.componentConfig.sortMode
        }
      : false;

    this.gridSelect = this.componentConfig.selectable
      ? {
          checkboxOnly: this.componentConfig.checkboxSelectOnly,
          mode: this.componentConfig.selectMode
        }
      : false;

    this.gridFilter = this.componentConfig.filterable
      ? this.componentConfig.filterMode
      : false;

    if (this.componentConfig.query) {
    } else if (this.componentConfig.resources) {
      this.gridResources = of(this.componentConfig.resources).pipe(
        skip(this.gridState.skip),
        take(this.gridState.take),
        map(
          ro =>
            <GridDataResult>{
              data: ro,
              total: this.componentConfig.resources.length
            }
        )
      );
    }
  }

  resize(size: number[]) {}

  configure() {}

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;

    if (this.componentConfig.query) {
    } else if (this.componentConfig.resources) {
      this.gridResources = of(this.componentConfig.resources).pipe(
        skip(this.gridState.skip),
        take(this.gridState.take),
        map(
          ro =>
            <GridDataResult>{
              data: ro,
              total: this.componentConfig.resources.length
            }
        )
      );
    }
  }
}
