import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';

@Component({
  selector: 'app-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.css']
})
export class MockComponent implements OnInit, DcComponent {
  @Input()
  data: any;

  componentSize: string;

  constructor() {}

  ngOnInit() {}

  resize(size: number[]) {
    this.componentSize = `${size[0]}${size[1]}`;
  }
}
