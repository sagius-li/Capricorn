import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';

import { ResourceService } from '../../services/resource.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private svcResource: ResourceService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.initComponent();
    this.applyQuery();
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
  }

  resize(size: number[]) {}

  configure() {}

  applyQuery() {
    if (this.componentConfig.query) {
      setTimeout(() => {
        this.spinner.show();
      }, 0);

      setTimeout(() => {
        this.svcResource
          .getResourceCount(this.componentConfig.query)
          .subscribe(result => {
            this.componentConfig.mainText = this.componentConfig.mainText.replace(
              /\{0\}/g,
              result.toString()
            );
            setTimeout(() => {
              this.spinner.hide();
            }, 0);
          });
      }, 500);
    }
  }

  onUpdateNow() {
    this.applyQuery();
  }
}
