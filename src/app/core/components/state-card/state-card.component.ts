import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';

export class StateCardConfig {
  iconText: string;
  iconColor: string;
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
  title = 'capacity';
  @Input()
  mainText = '150 GB';
  @Input()
  query = '';

  componentConfig: StateCardConfig;

  constructor() {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.componentConfig = {
      iconText: this.iconText,
      iconColor: this.iconColor,
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
}
