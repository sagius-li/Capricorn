import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { EditorTextConfig } from './editor-text.component';

@Component({
  selector: 'app-editor-text-config',
  templateUrl: './editor-text-config.component.html',
  styleUrls: ['./editor-text-config.component.css']
})
export class EditorTextConfigComponent implements OnInit {
  bindToDisplayName: boolean;
  bindToDescription: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditorTextConfigComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      objectRef: any;
      objectConfig: EditorTextConfig;
    }
  ) {}

  ngOnInit() {
    this.bindToDisplayName = this.data.objectConfig.displayName ? false : true;
    this.bindToDescription = this.data.objectConfig.description ? false : true;
  }

  onAttributeBinding() {
    if (this.bindToDisplayName) {
      this.data.objectConfig.displayName = '';
    }
    if (this.bindToDescription) {
      this.data.objectConfig.description = '';
    }
  }
}
