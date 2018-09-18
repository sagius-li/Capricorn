import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export enum PopupType {
  info = 'info',
  confirm = 'confirm',
  error = 'error',
  progress = 'progress'
}

export interface PopupData {
  type: PopupType;
  title: string;
  content: string;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  barColor: string;
  iconName: string;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupData
  ) {}

  ngOnInit() {
    switch (this.data.type) {
      case PopupType.confirm:
        this.barColor = 'cornflowerblue';
        this.iconName = 'question_answer';
        break;
      case PopupType.error:
        this.barColor = 'coral';
        this.iconName = 'error';
        break;
      case PopupType.info:
        this.barColor = 'darkseagreen';
        this.iconName = 'info';
        break;
      default:
        break;
    }
  }
}
