import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { DcComponent } from '../../models/dccomponent.interface';
import { ResourceService } from '../../services/resource.service';
import { StateCardConfigComponent } from './state-card-config.component';
import { UtilsService } from '../../services/utils.service';

export class StateCardConfig {
  iconText: string;
  iconColor: string;
  backgroundColor: string;
  textColor: string;
  mainTextColor: string;
  title: string;
  mainText: string;
  query: string;
}

@Component({
  selector: 'app-state-card',
  templateUrl: './state-card.component.html',
  styleUrls: ['./state-card.component.css']
})
export class StateCardComponent implements OnInit, DcComponent {
  @Input()
  data: StateCardConfig;

  @Input()
  iconText = 'public';
  @Input()
  iconColor = 'darkseagreen';
  @Input()
  backgroundColor = 'white';
  @Input()
  textColor = 'darkgray';
  @Input()
  mainTextColor = 'black';
  @Input()
  title = 'capacity';
  @Input()
  mainText = '150 GB';
  @Input()
  query: string = undefined;

  componentConfig: StateCardConfig;
  mainTextValue: string;

  constructor(
    private svcResource: ResourceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = {
      iconText: this.iconText,
      iconColor: this.iconColor,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      mainTextColor: this.mainTextColor,
      title: this.title,
      mainText: this.mainText,
      query: this.query
    };

    if (this.data) {
      if (this.data.iconText) {
        this.componentConfig.iconText = this.data.iconText;
      }
      if (this.data.iconColor) {
        this.componentConfig.iconColor = this.data.iconColor;
      }
      if (this.data.backgroundColor) {
        this.componentConfig.backgroundColor = this.data.backgroundColor;
      }
      if (this.data.textColor) {
        this.componentConfig.textColor = this.data.textColor;
      }
      if (this.data.mainTextColor) {
        this.componentConfig.mainTextColor = this.data.mainTextColor;
      }
      if (this.data.title) {
        this.componentConfig.title = this.data.title;
      }
      if (this.data.mainText) {
        this.componentConfig.mainText = this.data.mainText;
      }
      if (this.data.query) {
        this.componentConfig.query = this.data.query;
      }
    }

    this.updateDataSource();

    return this.componentConfig;
  }

  resize(size: number[]) {}

  configure() {
    const dialogRef = this.dialog.open(StateCardConfigComponent, {
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

  updateDataSource() {
    if (this.componentConfig.query) {
      setTimeout(() => {
        this.spinner.show();
      }, 0);

      setTimeout(() => {
        this.svcResource.getResourceCount(this.componentConfig.query).subscribe(
          result => {
            this.mainTextValue = this.componentConfig.mainText.replace(/\{0\}/g, result.toString());
            setTimeout(() => {
              this.spinner.hide();
            }, 0);
          },
          err => {
            setTimeout(() => {
              this.spinner.hide();
            }, 0);
          }
        );
      }, 500);
    } else {
      this.mainTextValue = this.componentConfig.mainText;
    }
  }

  onUpdateNow() {
    this.updateDataSource();
  }
}
