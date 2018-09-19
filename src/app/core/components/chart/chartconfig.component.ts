import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ChartConfig } from '../../models/chart.model';

@Component({
  selector: 'app-chartconfig',
  templateUrl: './chartconfig.component.html',
  styleUrls: ['./chartconfig.component.css']
})
export class ChartConfigComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ChartConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChartConfig
  ) {}

  ngOnInit() {}
}
