import { Component, OnInit, Input } from '@angular/core';

export class InfoBrandConfig {
  displayName?: string;
  initial?: string;
  photo?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  employeeType?: string;
  address?: string;
  email?: string;
  telephone?: string;
}

@Component({
  selector: 'app-info-brand',
  templateUrl: './info-brand.component.html',
  styleUrls: ['./info-brand.component.css']
})
export class InfoBrandComponent implements OnInit {
  @Input()
  data: InfoBrandConfig;

  constructor() {}

  ngOnInit() {}
}
