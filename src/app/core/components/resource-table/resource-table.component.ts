import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { Observable, of } from 'rxjs';
import { skip, take, map } from 'rxjs/operators';

import { MatDialog } from '@angular/material';
import { State } from '@progress/kendo-data-query';
import {
  GridDataResult,
  DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import { DcComponent } from '../../models/dccomponent.interface';
import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';
import { DSResourceSet } from '../../models/resource.model';
import { TranslateService } from '@ngx-translate/core';
import { ResourceTableConfigComponent } from './resource-table-config.component';

export class ResourceColumnConfig {
  field: string;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  filter?: string;
  locked?: boolean;
}

export class ResourceTableConfig {
  title?: string;
  fontSize?: number;
  cellPadding?: number;
  pageSize?: number;
  pageCountNumber?: number;
  pageInfo?: boolean;
  pageType?: string;
  pageButton?: boolean;
  sortable?: boolean;
  sortMode?: string;
  allowUnsort?: boolean;
  filterable?: boolean;
  filterMode?: string;
  selectable?: boolean;
  selectBoxWidth?: number;
  selectMode?: string;
  checkboxSelectOnly?: boolean;
  resizable?: boolean;
  exportToPDF?: boolean;
  exportToExcel?: boolean;
  exportAllPages?: boolean;
  resources?: any[];
  query?: string;
  columns?: ResourceColumnConfig[];
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
  gridLoading = false;
  gridSelect: any;

  constructor(
    private resource: ResourceService,
    private utils: UtilsService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = {
      fontSize: 14,
      pageSize: 10,
      cellPadding: 10,
      pageCountNumber: 5,
      pageInfo: true,
      pageType: 'numeric',
      pageButton: true,
      sortMode: 'single',
      allowUnsort: true,
      filterMode: 'menu',
      selectable: false,
      selectBoxWidth: 10,
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
          width: 100,
          filterable: false,
          filter: 'text',
          sortable: false,
          locked: false
        }
      ]
    };

    this.utils.CopyInto(this.data, this.componentConfig);

    this.gridState = {
      take: this.componentConfig.pageSize,
      skip: 0
    };

    this.gridSelect = this.componentConfig.selectable
      ? {
          checkboxOnly: this.componentConfig.checkboxSelectOnly,
          mode: this.componentConfig.selectMode
        }
      : false;

    if (this.componentConfig.query) {
      const attributesToLoad = this.componentConfig.columns.map(c => c.field);
      this.gridResources = this.resource
        .getResourceByQuery(
          this.componentConfig.query,
          attributesToLoad,
          false,
          this.componentConfig.pageSize
        )
        .pipe(
          map(
            ro => <GridDataResult>{ data: ro.Resources, total: ro.TotalCount }
          )
        );
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

    return this.componentConfig;
  }

  updateDataSource() {}

  resize(size: number[]) {
    console.log(this.el.nativeElement);
  }

  configure() {
    const dialogRef = this.dialog.open(ResourceTableConfigComponent, {
      minWidth: '500px',
      data: {
        objectRef: this,
        objectConfig: this.utils.DeepCopy(this.componentConfig)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        this.data = result;
        this.initComponent();
      }
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;

    if (this.componentConfig.query) {
      this.gridLoading = true;
      let sortString: string[];
      if (state.sort) {
        sortString = state.sort
          .filter(element => element.dir !== undefined)
          .map(
            item =>
              `${item.field.replace('Attributes.', '').replace('.Value', '')}:${
                item.dir
              }`
          );
      }
      if (sortString.length === 0) {
        sortString = undefined;
      }

      const attributesToLoad = this.componentConfig.columns.map(c => c.field);
      this.resource
        .getResourceByQuery(
          this.componentConfig.query,
          attributesToLoad,
          false,
          this.gridState.take,
          this.gridState.skip,
          Number[this.translate.instant('key_languageKey')],
          true,
          false,
          undefined,
          sortString
        )
        .subscribe((result: DSResourceSet) => {
          this.gridResources = of({
            data: result.Resources,
            total: result.TotalCount
          } as GridDataResult);
          this.gridLoading = false;
        });
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
