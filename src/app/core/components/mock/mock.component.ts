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

  constructor() {}

  ngOnInit() {}
}
