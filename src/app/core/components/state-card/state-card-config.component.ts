import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StateCardConfig } from './state-card.component';

@Component({
  selector: 'app-state-card-config',
  templateUrl: './state-card-config.component.html',
  styleUrls: ['./state-card-config.component.css']
})
export class StateCardConfigComponent implements OnInit, AfterViewInit {
  @ViewChild('exampleStateCard')
  exampleStateCard: any;

  constructor(
    public dialogRef: MatDialogRef<StateCardConfigComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      objectRef: any;
      objectConfig: StateCardConfig;
    }
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.data.objectConfig = this.exampleStateCard.initComponent();
  }
}
