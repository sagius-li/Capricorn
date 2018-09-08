import { Component, OnInit, Input } from '@angular/core';

import { DcComponent } from '../../models/dccomponent.interface';

/**
 * Mock component only show images for test purpose
 */
@Component({
  selector: 'app-mock',
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.css']
})
export class MockComponent implements OnInit, DcComponent {
  /** Input data */
  @Input()
  data: any;

  /** Component size in string format (ex. '31' means [3, 1], colSpan=3, rowSpan=1) */
  componentSize: string;

  /** @ignore */
  constructor() {}

  /** @ignore */
  ngOnInit() {}

  /**
   * Set componentSize property to decide which image should be loaded
   * @param size Component size (ex. [3, 1], colSpan=, rowSpan=1)
   */
  resize(size: number[]) {
    this.componentSize = `${size[0]}${size[1]}`;
  }
}
